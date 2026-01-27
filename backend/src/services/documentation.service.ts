import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { cacheService, CacheService, CACHE_TTLS } from './cache.service';

/**
 * Documentation source configuration
 */
interface DocSource {
  url: string;
  selectors: {
    introduction?: string;
    features?: string;
    gettingStarted?: string;
    architecture?: string;
  };
  fallbackToReadme?: boolean;
}

/**
 * Documentation registry for popular tools
 */
const DOC_SOURCES: Record<string, DocSource> = {
  react: {
    url: 'https://react.dev/learn',
    selectors: {
      introduction: 'article',
    },
  },
  vue: {
    url: 'https://vuejs.org/guide/introduction.html',
    selectors: {
      introduction: '.content',
    },
  },
  'vue.js': {
    url: 'https://vuejs.org/guide/introduction.html',
    selectors: {
      introduction: '.content',
    },
  },
  angular: {
    url: 'https://angular.dev/overview',
    selectors: {
      introduction: 'article',
    },
  },
  'next.js': {
    url: 'https://nextjs.org/docs',
    selectors: {
      introduction: 'article',
    },
  },
  nextjs: {
    url: 'https://nextjs.org/docs',
    selectors: {
      introduction: 'article',
    },
  },
  svelte: {
    url: 'https://svelte.dev/docs/introduction',
    selectors: {
      introduction: 'article',
    },
  },
  typescript: {
    url: 'https://www.typescriptlang.org/docs/',
    selectors: {
      introduction: 'article',
    },
  },
  tailwindcss: {
    url: 'https://tailwindcss.com/docs',
    selectors: {
      introduction: 'article',
    },
  },
  express: {
    url: 'https://expressjs.com/en/starter/installing.html',
    selectors: {
      introduction: '#content',
    },
  },
  fastify: {
    url: 'https://fastify.dev/docs/latest/',
    selectors: {
      introduction: 'article',
    },
  },
};

/**
 * Processed documentation data
 */
export interface DocumentationData {
  introduction: string;
  keyFeatures: string[];
  architecture?: string;
  url: string;
  scrapedAt: string;
}

/**
 * Documentation Service for scraping official docs
 */
export class DocumentationService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; StackIndexBot/1.0; +https://stackindex.com)',
      },
    });
  }

  /**
   * Fetch documentation for a tool
   */
  async fetchData(toolName: string, githubReadme?: string): Promise<DocumentationData | null> {
    const normalized = toolName.toLowerCase().trim();

    try {
      // Check cache first
      const cacheKey = CacheService.docsKey(normalized, 'content');
      const cached = await cacheService.get<DocumentationData>(cacheKey);
      if (cached) {
        console.log(`[Docs] Cache hit for ${toolName}`);
        return cached;
      }

      // Check if we have a doc source configured
      const docSource = DOC_SOURCES[normalized];
      if (!docSource) {
        console.log(`[Docs] No doc source configured for "${toolName}"`);
        // Fall back to GitHub README if available
        if (githubReadme) {
          return this.extractFromReadme(githubReadme, toolName);
        }
        return null;
      }

      console.log(`[Docs] Fetching documentation for ${toolName} from ${docSource.url}`);

      // Fetch and parse documentation
      const docData = await this.scrapeDocumentation(docSource, toolName);

      if (docData) {
        // Cache the result
        await cacheService.set(cacheKey, docData, CACHE_TTLS.documentation.content);
        return docData;
      }

      // Fallback to README if scraping failed
      if (githubReadme) {
        return this.extractFromReadme(githubReadme, toolName);
      }

      return null;
    } catch (error) {
      console.error(`[Docs] Error fetching docs for "${toolName}":`, error);

      // Try to return stale cache
      const cacheKey = CacheService.docsKey(normalized, 'content');
      const stale = await cacheService.get<DocumentationData>(cacheKey);
      if (stale) {
        console.log(`[Docs] Returning stale cache for ${toolName}`);
        return stale;
      }

      // Last resort: use GitHub README
      if (githubReadme) {
        return this.extractFromReadme(githubReadme, toolName);
      }

      return null;
    }
  }

  /**
   * Scrape documentation from configured source
   */
  private async scrapeDocumentation(
    source: DocSource,
    _toolName: string
  ): Promise<DocumentationData | null> {
    try {
      const response = await this.client.get(source.url);
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract introduction
      let introduction = '';
      if (source.selectors.introduction) {
        const introElement = $(source.selectors.introduction);
        // Get text and clean it
        introduction = introElement
          .text()
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 2000); // Limit to 2000 characters
      }

      // Extract key features (look for lists in intro section)
      const keyFeatures: string[] = [];
      if (source.selectors.introduction) {
        $(source.selectors.introduction)
          .find('ul li, ol li')
          .each((i, elem) => {
            if (i < 10) {
              // Limit to 10 features
              const feature = $(elem).text().replace(/\s+/g, ' ').trim();
              if (feature && feature.length > 10 && feature.length < 200) {
                keyFeatures.push(feature);
              }
            }
          });
      }

      // If no features found, try to extract from headings
      if (keyFeatures.length === 0) {
        $('h2, h3').each((i, elem) => {
          if (i < 5) {
            const heading = $(elem).text().replace(/\s+/g, ' ').trim();
            if (heading && !heading.toLowerCase().includes('table of contents')) {
              keyFeatures.push(heading);
            }
          }
        });
      }

      if (!introduction || introduction.length < 50) {
        console.log(`[Docs] Insufficient content scraped from ${source.url}`);
        return null;
      }

      return {
        introduction,
        keyFeatures,
        url: source.url,
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`[Docs] Error scraping ${source.url}:`, error);
      return null;
    }
  }

  /**
   * Extract documentation from GitHub README
   */
  private extractFromReadme(readme: string, toolName: string): DocumentationData {
    // Parse markdown and extract key information
    const lines = readme.split('\n');
    let introduction = '';
    const keyFeatures: string[] = [];

    // Find introduction (usually after main heading, before first subheading)
    let inIntro = false;
    let foundFirstHeading = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) continue;

      // Detect headings
      if (trimmed.startsWith('#')) {
        if (!foundFirstHeading) {
          foundFirstHeading = true;
          inIntro = true;
          continue;
        } else if (inIntro) {
          // Hit second heading, stop intro
          inIntro = false;
        }

        // Extract feature from heading
        const heading = trimmed.replace(/^#+\s*/, '').trim();
        if (
          heading.length > 5 &&
          heading.length < 100 &&
          !heading.toLowerCase().includes('table of contents')
        ) {
          keyFeatures.push(heading);
        }
      } else if (inIntro) {
        // Add to introduction
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          // List item - add to features
          const feature = trimmed.replace(/^[-*]\s*/, '').trim();
          if (feature.length > 10 && feature.length < 200) {
            keyFeatures.push(feature);
          }
        } else {
          // Regular text - add to introduction
          introduction += (introduction ? ' ' : '') + trimmed;
        }
      }

      // Stop if we have enough content
      if (introduction.length > 1000 && keyFeatures.length > 5) {
        break;
      }
    }

    // Truncate introduction
    if (introduction.length > 2000) {
      introduction = introduction.substring(0, 2000) + '...';
    }

    return {
      introduction: introduction || `${toolName} is a developer tool. See GitHub README for details.`,
      keyFeatures: keyFeatures.slice(0, 10), // Limit to 10
      url: 'GitHub README',
      scrapedAt: new Date().toISOString(),
    };
  }

  /**
   * Extract summary from full documentation
   */
  extractSummary(fullDoc: string, maxLength = 500): string {
    // Take first N characters of meaningful content
    const cleaned = fullDoc
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, maxLength);

    return cleaned.length < fullDoc.length ? cleaned + '...' : cleaned;
  }
}

// Export singleton instance
export const documentationService = new DocumentationService();
