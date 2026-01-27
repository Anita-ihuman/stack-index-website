import axios, { AxiosInstance } from 'axios';
import { cacheService, CacheService, CACHE_TTLS } from './cache.service';
import { env } from '../config/environment';

/**
 * Stack Overflow data
 */
export interface StackOverflowData {
  tagStats: {
    questionCount: number;
    answerCount: number;
    watchCount: number;
  };
  topQuestions: Array<{
    title: string;
    score: number;
    viewCount: number;
    link: string;
  }>;
}

/**
 * Reddit data
 */
export interface RedditData {
  subredditStats: {
    subscribers: number;
    activeUsers: number;
    exists: boolean;
  };
  topDiscussions: Array<{
    title: string;
    score: number;
    numComments: number;
    url: string;
  }>;
}

/**
 * npm package data
 */
export interface NpmData {
  downloads: {
    lastWeek: number;
    lastMonth: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  versions: {
    latest: string;
    total: number;
  };
  dependencies: {
    count: number;
    dependents: number;
  };
}

/**
 * Combined community data
 */
export interface CommunityData {
  stackoverflow?: StackOverflowData;
  reddit?: RedditData;
  npm?: NpmData;
}

/**
 * Community Service for fetching data from Stack Overflow, Reddit, npm
 */
export class CommunityService {
  private stackOverflowClient: AxiosInstance;
  private redditClient: AxiosInstance;
  private npmClient: AxiosInstance;

  constructor() {
    // Stack Overflow API client
    this.stackOverflowClient = axios.create({
      baseURL: 'https://api.stackexchange.com/2.3',
      timeout: 10000,
      params: {
        site: 'stackoverflow',
        ...(env.STACKOVERFLOW_KEY && { key: env.STACKOVERFLOW_KEY }),
      },
    });

    // Reddit API client (JSON API, no auth needed for read-only)
    this.redditClient = axios.create({
      baseURL: 'https://www.reddit.com',
      timeout: 10000,
      headers: {
        'User-Agent': 'StackIndexBot/1.0',
      },
    });

    // npm Registry API client
    this.npmClient = axios.create({
      baseURL: 'https://registry.npmjs.org',
      timeout: 10000,
    });
  }

  /**
   * Fetch all community data for a tool
   */
  async fetchData(toolName: string): Promise<CommunityData> {
    const normalized = toolName.toLowerCase().trim();

    // Fetch all sources in parallel
    const [stackoverflow, reddit, npm] = await Promise.allSettled([
      this.fetchStackOverflow(normalized),
      this.fetchReddit(normalized),
      this.fetchNpm(normalized),
    ]);

    return {
      stackoverflow: stackoverflow.status === 'fulfilled' ? (stackoverflow.value || undefined) : undefined,
      reddit: reddit.status === 'fulfilled' ? (reddit.value || undefined) : undefined,
      npm: npm.status === 'fulfilled' ? (npm.value || undefined) : undefined,
    };
  }

  /**
   * Fetch Stack Overflow data
   */
  private async fetchStackOverflow(toolName: string): Promise<StackOverflowData | null> {
    try {
      const cacheKey = CacheService.communityKey(toolName, 'stackoverflow');
      const cached = await cacheService.get<StackOverflowData>(cacheKey);
      if (cached) {
        console.log(`[StackOverflow] Cache hit for ${toolName}`);
        return cached;
      }

      // Normalize tag name (remove .js, spaces, etc.)
      const tag = this.normalizeTag(toolName);

      // Fetch tag info
      const [tagInfo, questions] = await Promise.all([
        this.stackOverflowClient.get('/tags/info', { params: { tags: tag } }),
        this.stackOverflowClient.get('/search', {
          params: {
            tagged: tag,
            sort: 'votes',
            order: 'desc',
            pagesize: 5,
          },
        }),
      ]);

      const tagData = tagInfo.data.items[0];
      if (!tagData) {
        console.log(`[StackOverflow] Tag not found for "${toolName}"`);
        return null;
      }

      const data: StackOverflowData = {
        tagStats: {
          questionCount: tagData.count || 0,
          answerCount: 0, // Not directly available
          watchCount: tagData.watch_count || 0,
        },
        topQuestions: questions.data.items.slice(0, 5).map((q: any) => ({
          title: q.title,
          score: q.score,
          viewCount: q.view_count,
          link: q.link,
        })),
      };

      await cacheService.set(cacheKey, data, CACHE_TTLS.community.stackoverflow);
      return data;
    } catch (error) {
      console.error(`[StackOverflow] Error fetching data for "${toolName}":`, error);
      return null;
    }
  }

  /**
   * Fetch Reddit data
   */
  private async fetchReddit(toolName: string): Promise<RedditData | null> {
    try {
      const cacheKey = CacheService.communityKey(toolName, 'reddit');
      const cached = await cacheService.get<RedditData>(cacheKey);
      if (cached) {
        console.log(`[Reddit] Cache hit for ${toolName}`);
        return cached;
      }

      // Try to find subreddit (r/toolname, r/toolnamejs, etc.)
      const subredditVariations = [
        toolName.toLowerCase().replace(/\./g, '').replace(/\s+/g, ''),
        `${toolName.toLowerCase().replace(/\./g, '')}js`,
        toolName.toLowerCase().replace(/\./g, '').replace(/\s+/g, '') + 'dev',
      ];

      let subredditData = null;
      let topPosts = null;

      for (const subreddit of subredditVariations) {
        try {
          const [about, hot] = await Promise.all([
            this.redditClient.get(`/r/${subreddit}/about.json`),
            this.redditClient.get(`/r/${subreddit}/hot.json`, { params: { limit: 10 } }),
          ]);

          subredditData = about.data.data;
          topPosts = hot.data.data.children;
          break; // Found valid subreddit
        } catch {
          continue; // Try next variation
        }
      }

      if (!subredditData) {
        console.log(`[Reddit] No subreddit found for "${toolName}"`);
        return null;
      }

      const data: RedditData = {
        subredditStats: {
          subscribers: subredditData.subscribers || 0,
          activeUsers: subredditData.active_user_count || 0,
          exists: true,
        },
        topDiscussions: topPosts
          ? topPosts.slice(0, 5).map((post: any) => ({
              title: post.data.title,
              score: post.data.score,
              numComments: post.data.num_comments,
              url: `https://reddit.com${post.data.permalink}`,
            }))
          : [],
      };

      await cacheService.set(cacheKey, data, CACHE_TTLS.community.reddit);
      return data;
    } catch (error) {
      console.error(`[Reddit] Error fetching data for "${toolName}":`, error);
      return null;
    }
  }

  /**
   * Fetch npm package data
   */
  private async fetchNpm(toolName: string): Promise<NpmData | null> {
    try {
      const cacheKey = CacheService.communityKey(toolName, 'npm');
      const cached = await cacheService.get<NpmData>(cacheKey);
      if (cached) {
        console.log(`[npm] Cache hit for ${toolName}`);
        return cached;
      }

      // Normalize package name
      const packageName = this.normalizePackageName(toolName);

      // Fetch package info
      const packageInfo = await this.npmClient.get(`/${packageName}`);
      const packageData = packageInfo.data;

      // Fetch download stats
      const downloadsUrl = `https://api.npmjs.org/downloads/point/last-week/${packageName}`;
      const downloadsResponse = await axios.get(downloadsUrl);
      const lastWeekDownloads = downloadsResponse.data.downloads || 0;

      // Fetch monthly downloads
      const monthlyUrl = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
      const monthlyResponse = await axios.get(monthlyUrl);
      const lastMonthDownloads = monthlyResponse.data.downloads || 0;

      const data: NpmData = {
        downloads: {
          lastWeek: lastWeekDownloads,
          lastMonth: lastMonthDownloads,
          trend: 'stable', // Simplified - could calculate trend from historical data
        },
        versions: {
          latest: packageData['dist-tags']?.latest || '0.0.0',
          total: Object.keys(packageData.versions || {}).length,
        },
        dependencies: {
          count: Object.keys(packageData.versions?.[packageData['dist-tags']?.latest]?.dependencies || {})
            .length,
          dependents: 0, // Not easily available without additional API calls
        },
      };

      await cacheService.set(cacheKey, data, CACHE_TTLS.community.npm);
      return data;
    } catch (error) {
      console.log(`[npm] Package not found or error for "${toolName}"`);
      return null;
    }
  }

  /**
   * Normalize tag name for Stack Overflow
   */
  private normalizeTag(toolName: string): string {
    return toolName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\.js$/i, '.js') // Keep .js for accuracy
      .replace(/\./g, ''); // Remove other dots
  }

  /**
   * Normalize package name for npm
   */
  private normalizePackageName(toolName: string): string {
    const normalized = toolName.toLowerCase().trim();

    // Common npm package name mappings
    const packageMap: Record<string, string> = {
      'react': 'react',
      'vue': 'vue',
      'vue.js': 'vue',
      'angular': '@angular/core',
      'next.js': 'next',
      'nextjs': 'next',
      'next': 'next',
      'svelte': 'svelte',
      'express': 'express',
      'express.js': 'express',
      'fastify': 'fastify',
      'typescript': 'typescript',
      'tailwind': 'tailwindcss',
      'tailwindcss': 'tailwindcss',
      'tailwind css': 'tailwindcss',
      'vite': 'vite',
      'webpack': 'webpack',
      'prisma': 'prisma',
      'nest': '@nestjs/core',
      'nest.js': '@nestjs/core',
      'nestjs': '@nestjs/core',
    };

    return packageMap[normalized] || normalized;
  }
}

// Export singleton instance
export const communityService = new CommunityService();
