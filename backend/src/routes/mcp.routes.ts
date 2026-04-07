import { Router } from 'express';
import { mcpController } from '../controllers/mcp.controller';

const router = Router();

/**
 * POST /api/mcp/register
 * Org registers their Documentation MCP Server with Stack Index.
 */
router.post('/mcp/register', (req, res, next) =>
  mcpController.register(req, res, next)
);

/**
 * GET /api/mcp/servers
 * List all verified MCP server registrations.
 */
router.get('/mcp/servers', (req, res, next) =>
  mcpController.list(req, res, next)
);

/**
 * GET /api/mcp/verify/:slug
 * Check verification status for a tool slug.
 * Append ?ping=true to also test server reachability.
 */
router.get('/mcp/verify/:slug', (req, res, next) =>
  mcpController.verify(req, res, next)
);

/**
 * DELETE /api/mcp/:slug
 * Remove an MCP registration (admin only in production).
 */
router.delete('/mcp/:slug', (req, res, next) =>
  mcpController.unregister(req, res, next)
);

export default router;
