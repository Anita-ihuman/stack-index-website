import { Request, Response, NextFunction } from 'express';
import { mcpRegistry } from '../services/mcp-registry.service';
import { mcpClient } from '../services/mcp-client.service';

/**
 * MCP Controller
 *
 * Exposes endpoints so organizations can:
 *  POST /api/mcp/register      — register an MCP server for their tool
 *  GET  /api/mcp/servers       — list all verified registrations
 *  GET  /api/mcp/verify/:slug  — check if a tool has a verified MCP server
 *  DELETE /api/mcp/:slug       — remove a registration (requires admin key)
 */
export class MCPController {
  /**
   * POST /api/mcp/register
   * Body: { toolSlug, mcpServerUrl, orgName, orgWebsite?, authToken? }
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { toolSlug, mcpServerUrl, orgName, orgWebsite, authToken } = req.body;

      if (!toolSlug || !mcpServerUrl || !orgName) {
        res.status(400).json({
          error: 'Missing required fields: toolSlug, mcpServerUrl, orgName',
        });
        return;
      }

      // Basic URL validation
      try {
        new URL(mcpServerUrl);
      } catch {
        res.status(400).json({ error: 'mcpServerUrl must be a valid URL' });
        return;
      }

      const entry = mcpRegistry.register({
        toolSlug,
        mcpServerUrl,
        orgName,
        orgWebsite,
        authToken,
        transportType: 'http',
      });

      // Strip auth token from response
      const { authToken: _removed, ...safeEntry } = entry;

      res.status(201).json({
        message: `MCP server registered for "${entry.toolSlug}"`,
        registration: safeEntry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mcp/servers
   * Returns all registered MCP servers (sans auth tokens).
   */
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const servers = mcpRegistry.list().map(({ authToken: _removed, ...s }) => s);
      res.json({ servers, count: servers.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mcp/verify/:slug
   * Returns verification status for a tool. Also tests connectivity.
   */
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const config = mcpRegistry.get(slug);

      if (!config) {
        res.json({
          verified: false,
          toolSlug: slug,
          message: 'No MCP server registered for this tool',
        });
        return;
      }

      // Optionally ping the server to confirm it's reachable
      const ping = req.query.ping === 'true';
      let reachable: boolean | undefined;

      if (ping) {
        const docs = await mcpClient.fetchDocumentation(slug, config);
        reachable = docs !== null;
      }

      const { authToken: _removed, ...safeConfig } = config;

      res.json({
        verified: true,
        toolSlug: slug,
        orgName: config.orgName,
        mcpServerUrl: config.mcpServerUrl,
        verifiedAt: config.verifiedAt,
        reachable,
        config: safeConfig,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/mcp/:slug
   * Remove an MCP registration. Protected by admin key in production.
   */
  async unregister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Simple admin guard — extend to proper auth as needed
      const adminKey = req.headers['x-admin-key'];
      if (process.env.NODE_ENV === 'production' && adminKey !== process.env.MCP_ADMIN_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { slug } = req.params;
      const removed = mcpRegistry.unregister(slug);

      if (!removed) {
        res.status(404).json({ error: `No registration found for "${slug}"` });
        return;
      }

      res.json({ message: `MCP server registration removed for "${slug}"` });
    } catch (error) {
      next(error);
    }
  }
}

export const mcpController = new MCPController();
