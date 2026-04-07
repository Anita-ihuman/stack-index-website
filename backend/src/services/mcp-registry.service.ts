import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration for a single verified MCP server entry.
 * Organizations register these so Stack Index can pull live docs.
 */
export interface MCPServerConfig {
  /** Normalized tool slug (lowercase, e.g. "prisma", "next.js") */
  toolSlug: string;
  /** The org's public MCP server base URL (e.g. "https://mcp.prisma.io") */
  mcpServerUrl: string;
  /** Human-readable org/project name shown in the Verified badge */
  orgName: string;
  /** Optional link to org homepage */
  orgWebsite?: string;
  /** ISO timestamp when this registration was accepted */
  verifiedAt: string;
  /** HTTP is the only currently supported transport (SSE over HTTP) */
  transportType: 'http';
  /**
   * MCP protocol version the server targets.
   * Defaults to the current stable spec revision.
   */
  apiVersion?: string;
  /** Optional bearer token for private/authenticated MCP servers */
  authToken?: string;
}

/** Shape of the JSON file used to persist registrations */
interface RegistryStore {
  version: number;
  registrations: Record<string, MCPServerConfig>;
}

const REGISTRY_FILE = path.resolve(
  process.cwd(),
  'data',
  'mcp-registry.json'
);

/**
 * Seed data — well-known open-source projects that run public MCP servers.
 * Remove or extend this list as needed.
 */
const SEED_REGISTRY: Record<string, MCPServerConfig> = {
  prisma: {
    toolSlug: 'prisma',
    mcpServerUrl: 'https://mcp.prisma.io',
    orgName: 'Prisma',
    orgWebsite: 'https://prisma.io',
    verifiedAt: '2025-01-01T00:00:00Z',
    transportType: 'http',
    apiVersion: '2024-11-05',
  },
};

/**
 * MCPRegistryService
 *
 * Single source of truth for which tools have registered MCP Documentation
 * Servers. Supports runtime registration (via org API key) and persists
 * registrations to a JSON file so they survive restarts.
 */
export class MCPRegistryService {
  private store: Record<string, MCPServerConfig> = {};

  constructor() {
    this.load();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Look up a tool by slug. Returns null if no MCP server is registered.
   */
  get(toolSlug: string): MCPServerConfig | null {
    const normalized = this.normalize(toolSlug);
    return this.store[normalized] ?? null;
  }

  /** Returns true when the tool has a registered MCP server. */
  has(toolSlug: string): boolean {
    return this.get(toolSlug) !== null;
  }

  /** Return all registered entries (for admin/listing endpoints). */
  list(): MCPServerConfig[] {
    return Object.values(this.store);
  }

  /**
   * Register (or update) an MCP server for a tool.
   * Called via the POST /api/mcp/register endpoint.
   */
  register(config: Omit<MCPServerConfig, 'verifiedAt'>): MCPServerConfig {
    const slug = this.normalize(config.toolSlug);
    const entry: MCPServerConfig = {
      ...config,
      toolSlug: slug,
      transportType: 'http',
      verifiedAt: new Date().toISOString(),
    };

    this.store[slug] = entry;
    this.persist();

    console.log(`[MCP Registry] Registered MCP server for "${slug}": ${config.mcpServerUrl}`);
    return entry;
  }

  /**
   * Remove a registration. Called via DELETE /api/mcp/:slug.
   */
  unregister(toolSlug: string): boolean {
    const slug = this.normalize(toolSlug);
    if (!this.store[slug]) return false;

    delete this.store[slug];
    this.persist();

    console.log(`[MCP Registry] Unregistered "${slug}"`);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private normalize(slug: string): string {
    return slug.toLowerCase().trim();
  }

  /**
   * Load persisted registry from disk (or fall back to seed data).
   */
  private load(): void {
    try {
      if (fs.existsSync(REGISTRY_FILE)) {
        const raw = fs.readFileSync(REGISTRY_FILE, 'utf-8');
        const parsed: RegistryStore = JSON.parse(raw);
        this.store = parsed.registrations ?? {};
        console.log(
          `[MCP Registry] Loaded ${Object.keys(this.store).length} registrations from disk`
        );
      } else {
        console.log('[MCP Registry] No persisted registry found — using seed data');
        this.store = { ...SEED_REGISTRY };
        this.persist(); // write seed to disk on first run
      }
    } catch (err) {
      console.error('[MCP Registry] Error loading registry, using seed data:', err);
      this.store = { ...SEED_REGISTRY };
    }
  }

  /**
   * Persist current registry to disk.
   */
  private persist(): void {
    try {
      const dir = path.dirname(REGISTRY_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Strip authTokens before writing to disk — they are kept in memory only
      const safeRegistrations: Record<string, MCPServerConfig> = {};
      for (const [slug, config] of Object.entries(this.store)) {
        const { authToken: _omit, ...rest } = config;
        safeRegistrations[slug] = rest as MCPServerConfig;
      }

      const store: RegistryStore = {
        version: 1,
        registrations: safeRegistrations,
      };
      fs.writeFileSync(REGISTRY_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.error('[MCP Registry] Error persisting registry:', err);
    }
  }
}

// Singleton instance
export const mcpRegistry = new MCPRegistryService();
