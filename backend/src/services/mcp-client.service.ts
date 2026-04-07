import axios, { AxiosInstance } from 'axios';
import { MCPServerConfig } from './mcp-registry.service';
import { DocumentationData } from './documentation.service';

// ---------------------------------------------------------------------------
// MCP JSON-RPC types (MCP Protocol 2024-11-05)
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}

interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface MCPResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

interface MCPResourcesListResult {
  resources: MCPResource[];
}

interface MCPResourcesReadResult {
  contents: MCPResourceContent[];
}

interface MCPToolsListResult {
  tools: Array<{
    name: string;
    description?: string;
    inputSchema?: Record<string, unknown>;
  }>;
}

interface MCPToolCallResult {
  content: Array<{ type: string; text?: string }>;
  isError?: boolean;
}

// Priority order for documentation resource URIs.
// The client tries each pattern and returns the first that yields content.
const DOC_URI_PATTERNS = [
  'docs://overview',
  'docs://introduction',
  'docs://getting-started',
  'docs://readme',
  'docs://index',
  'docs://home',
];

/**
 * MCPClientService
 *
 * A lightweight HTTP-based MCP client that speaks JSON-RPC 2.0 to any
 * compliant MCP server exposed over HTTP (SSE transport).
 *
 * Flow:
 *  1. `initialize` — perform MCP handshake with the server
 *  2. `listResources` — discover available documentation resources
 *  3. `readResource` — fetch the most relevant doc resource
 *  4. Wrap result in DocumentationData with `verified: true`
 *
 * If the server is unreachable or returns an error the client returns null
 * and the orchestrator falls through to the regular scraping pipeline.
 */
export class MCPClientService {
  private requestId = 0;
  private readonly timeoutMs = 12000; // 12 s — tight budget for real-time analysis

  /**
   * Fetch documentation from an org's MCP server.
   * Returns null on any failure so the caller can fall back gracefully.
   */
  async fetchDocumentation(
    toolName: string,
    config: MCPServerConfig
  ): Promise<(DocumentationData & { mcpVerified: true; orgName: string }) | null> {
    const client = this.buildClient(config);

    console.log(`[MCP Client] Connecting to ${config.orgName} MCP server for "${toolName}"`);

    try {
      // 1. Handshake
      await this.initialize(client, config.mcpServerUrl);

      // 2. Try searching via tool first (richer results)
      const toolResult = await this.trySearchTool(client, toolName);
      if (toolResult) {
        return this.buildDocData(toolResult, config);
      }

      // 3. Fall back to resource enumeration
      const resources = await this.listResources(client);
      if (!resources.length) {
        console.log(`[MCP Client] No resources found for "${toolName}" on ${config.orgName}`);
        return null;
      }

      // 4. Read most relevant resource
      const content = await this.readBestResource(client, resources, toolName);
      if (!content) return null;

      return this.buildDocData(content, config);
    } catch (err) {
      console.error(`[MCP Client] Error fetching from ${config.orgName} MCP server:`, err);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // MCP Protocol Methods
  // ---------------------------------------------------------------------------

  /**
   * MCP initialize handshake — required before any other call.
   */
  private async initialize(client: AxiosInstance, serverUrl: string): Promise<void> {
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          resources: { subscribe: false },
          tools: {},
        },
        clientInfo: {
          name: 'StackIndex',
          version: '1.0.0',
        },
      },
    };

    const res = await client.post<JsonRpcResponse>(serverUrl, req);
    this.assertNoError(res.data, 'initialize');

    // Send initialized notification
    await client.post(serverUrl, {
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    }).catch(() => {
      // Notification send failures are non-fatal
    });
  }

  /**
   * List all resources available on the server.
   */
  private async listResources(client: AxiosInstance): Promise<MCPResource[]> {
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'resources/list',
      params: {},
    };

    const res = await client.post<JsonRpcResponse<MCPResourcesListResult>>(
      '/',
      req
    );
    this.assertNoError(res.data, 'resources/list');

    return res.data.result?.resources ?? [];
  }

  /**
   * Read a specific resource by URI.
   */
  private async readResource(
    client: AxiosInstance,
    uri: string
  ): Promise<string | null> {
    const req: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: this.nextId(),
      method: 'resources/read',
      params: { uri },
    };

    const res = await client.post<JsonRpcResponse<MCPResourcesReadResult>>(
      '/',
      req
    );

    if (res.data.error) return null; // resource not found — non-fatal

    const contents = res.data.result?.contents ?? [];
    const textContent = contents.find((c) => c.text && c.text.length > 50);
    return textContent?.text ?? null;
  }

  /**
   * Attempt to call a `search` or `query` tool on the server for richer context.
   */
  private async trySearchTool(
    client: AxiosInstance,
    toolName: string
  ): Promise<string | null> {
    try {
      // Discover tools
      const listReq: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: this.nextId(),
        method: 'tools/list',
        params: {},
      };
      const listRes = await client.post<JsonRpcResponse<MCPToolsListResult>>(
        '/',
        listReq
      );
      if (listRes.data.error) return null;

      const tools = listRes.data.result?.tools ?? [];
      const searchTool = tools.find((t) =>
        ['search', 'query', 'get_docs', 'get_documentation'].includes(t.name)
      );
      if (!searchTool) return null;

      // Call the search tool
      const callReq: JsonRpcRequest = {
        jsonrpc: '2.0',
        id: this.nextId(),
        method: 'tools/call',
        params: {
          name: searchTool.name,
          arguments: { query: toolName, topic: 'overview' },
        },
      };
      const callRes = await client.post<JsonRpcResponse<MCPToolCallResult>>(
        '/',
        callReq
      );
      if (callRes.data.error || callRes.data.result?.isError) return null;

      const text = callRes.data.result?.content
        .filter((c) => c.type === 'text' && c.text)
        .map((c) => c.text!)
        .join('\n\n');

      return text && text.length > 50 ? text : null;
    } catch {
      return null;
    }
  }

  /**
   * From a list of resources, read the best one for documentation context.
   * Priority: known URI patterns → first available text resource.
   */
  private async readBestResource(
    client: AxiosInstance,
    resources: MCPResource[],
    toolName: string
  ): Promise<string | null> {
    // Try known doc URI patterns first
    for (const pattern of DOC_URI_PATTERNS) {
      const match = resources.find((r) => r.uri === pattern);
      if (match) {
        const content = await this.readResource(client, match.uri);
        if (content) return content;
      }
    }

    // Try resources whose name/description mentions the tool or "doc"
    const docLike = resources.filter(
      (r) =>
        r.name.toLowerCase().includes('doc') ||
        r.name.toLowerCase().includes('intro') ||
        r.description?.toLowerCase().includes('documentation') ||
        r.uri.includes(toolName.toLowerCase())
    );

    for (const resource of docLike) {
      const content = await this.readResource(client, resource.uri);
      if (content) return content;
    }

    // Last resort — read first available resource
    if (resources.length > 0) {
      return this.readResource(client, resources[0].uri);
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private buildClient(config: MCPServerConfig): AxiosInstance {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    };

    if (config.authToken) {
      headers['Authorization'] = `Bearer ${config.authToken}`;
    }

    return axios.create({
      baseURL: config.mcpServerUrl,
      timeout: this.timeoutMs,
      headers,
    });
  }

  /**
   * Convert raw MCP text content into the DocumentationData shape
   * used by the rest of the pipeline (claude.service, orchestrator).
   */
  private buildDocData(
    rawText: string,
    config: MCPServerConfig
  ): DocumentationData & { mcpVerified: true; orgName: string } {
    // Extract first 2000 characters as introduction
    const introduction = rawText
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000);

    // Naively extract bullet/feature lines for keyFeatures
    const featureLines = rawText
      .split('\n')
      .filter((l) => /^[-*•]\s+.+/.test(l.trim()))
      .slice(0, 10)
      .map((l) => l.replace(/^[-*•]\s+/, '').trim());

    return {
      introduction,
      keyFeatures: featureLines,
      url: config.mcpServerUrl,
      scrapedAt: new Date().toISOString(),
      mcpVerified: true,
      orgName: config.orgName,
    };
  }

  private assertNoError(
    response: JsonRpcResponse,
    method: string
  ): void {
    if (response.error) {
      throw new Error(
        `[MCP] ${method} error ${response.error.code}: ${response.error.message}`
      );
    }
  }

  private nextId(): number {
    return ++this.requestId;
  }
}

// Singleton instance
export const mcpClient = new MCPClientService();
