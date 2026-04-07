import { Request, Response } from 'express';
import { toolCatalogService } from '../services/tool-catalog.service';
import { scoringService } from '../services/scoring.service';
import { searchService } from '../services/search.service';
import { ToolCategory, SearchRequest } from '../types/catalog.types';

export const catalogController = {
  /**
   * GET /api/tools
   * Returns all tools, optionally filtered by category
   */
  async listTools(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.query as { category?: string };
      const tools = category
        ? toolCatalogService.getByCategory(category as ToolCategory)
        : toolCatalogService.getAll();

      res.json({ tools, count: tools.length });
    } catch (err) {
      console.error('[CatalogController] listTools error:', err);
      res.status(500).json({ error: 'Failed to load tool catalog' });
    }
  },

  /**
   * GET /api/tools/categories
   * Returns all categories with tool counts
   */
  async listCategories(_req: Request, res: Response): Promise<void> {
    try {
      const summary = toolCatalogService.getCategorySummary();
      res.json({ categories: summary });
    } catch (err) {
      console.error('[CatalogController] listCategories error:', err);
      res.status(500).json({ error: 'Failed to load categories' });
    }
  },

  /**
   * GET /api/tools/:slug
   * Returns a single tool, optionally with live score (?score=true)
   */
  async getTool(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const withScore = req.query.score === 'true';

      const tool = toolCatalogService.getBySlug(slug);
      if (!tool) {
        res.status(404).json({ error: `Tool "${slug}" not found in catalog` });
        return;
      }

      if (withScore) {
        try {
          const score = await scoringService.computeScore(tool);
          res.json({ tool, score });
        } catch (scoreErr) {
          console.error('[CatalogController] scoring error:', scoreErr);
          res.json({ tool, score: null });
        }
        return;
      }

      res.json({ tool });
    } catch (err) {
      console.error('[CatalogController] getTool error:', err);
      res.status(500).json({ error: 'Failed to load tool' });
    }
  },

  /**
   * GET /api/tools/:slug/score
   * Returns live score for a tool
   */
  async getToolScore(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const tool = toolCatalogService.getBySlug(slug);
      if (!tool) {
        res.status(404).json({ error: `Tool "${slug}" not found in catalog` });
        return;
      }

      const score = await scoringService.computeScore(tool);
      res.json({ slug, score });
    } catch (err) {
      console.error('[CatalogController] getToolScore error:', err);
      res.status(500).json({ error: 'Failed to compute score' });
    }
  },

  /**
   * POST /api/search
   * Claude-powered semantic search
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit, category } = req.body as SearchRequest;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(400).json({ error: 'query is required' });
        return;
      }

      const result = await searchService.search({
        query: query.trim(),
        limit: typeof limit === 'number' ? limit : 5,
        category,
      });

      res.json(result);
    } catch (err) {
      console.error('[CatalogController] search error:', err);
      res.status(500).json({ error: 'Search failed' });
    }
  },
};
