import * as fs from 'fs';
import * as path from 'path';
import { ToolCatalogEntry, ToolCategory } from '../types/catalog.types';

/**
 * Loads and indexes the static tool catalog from data/tool-catalog.json
 */
export class ToolCatalogService {
  private catalog: Map<string, ToolCatalogEntry> = new Map();
  private loaded = false;

  private load(): void {
    if (this.loaded) return;
    const filePath = path.resolve(__dirname, '../../data/tool-catalog.json');
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const entries: ToolCatalogEntry[] = JSON.parse(raw);
      for (const entry of entries) {
        this.catalog.set(entry.slug, entry);
      }
      this.loaded = true;
      console.log(`[ToolCatalog] Loaded ${this.catalog.size} tools`);
    } catch (err) {
      console.error('[ToolCatalog] Failed to load catalog:', err);
    }
  }

  getAll(): ToolCatalogEntry[] {
    this.load();
    return Array.from(this.catalog.values());
  }

  getBySlug(slug: string): ToolCatalogEntry | null {
    this.load();
    return this.catalog.get(slug) ?? null;
  }

  getByCategory(category: ToolCategory): ToolCatalogEntry[] {
    this.load();
    return Array.from(this.catalog.values()).filter((t) => t.category === category);
  }

  getCategories(): ToolCategory[] {
    this.load();
    const cats = new Set<ToolCategory>();
    for (const t of this.catalog.values()) cats.add(t.category);
    return Array.from(cats);
  }

  getCategorySummary(): Array<{ category: ToolCategory; count: number; tools: string[] }> {
    this.load();
    const map = new Map<ToolCategory, string[]>();
    for (const t of this.catalog.values()) {
      const list = map.get(t.category) ?? [];
      list.push(t.name);
      map.set(t.category, list);
    }
    return Array.from(map.entries()).map(([category, tools]) => ({
      category,
      count: tools.length,
      tools,
    }));
  }

  /**
   * Simple keyword text search fallback (used when Claude search is unavailable)
   */
  search(query: string): ToolCatalogEntry[] {
    this.load();
    const q = query.toLowerCase();
    return Array.from(this.catalog.values()).filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.category.includes(q) ||
        t.primaryUseCases.some((u) => u.toLowerCase().includes(q))
      );
    });
  }

  /**
   * Build compact catalog summary for Claude context (slug, name, category, tags only)
   */
  buildCatalogSummary(): string {
    this.load();
    const lines: string[] = [];
    for (const t of this.catalog.values()) {
      lines.push(
        `${t.slug} | ${t.name} | ${t.category} | ${t.tags.join(', ')} | ${t.description.slice(0, 80)}`
      );
    }
    return lines.join('\n');
  }

  getSlugs(): Set<string> {
    this.load();
    return new Set(this.catalog.keys());
  }
}

export const toolCatalogService = new ToolCatalogService();
