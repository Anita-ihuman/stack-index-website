import axios, { AxiosInstance } from 'axios';
import { env } from '../config/environment';
import { cacheService, CacheService, CACHE_TTLS } from './cache.service';
import {
  GitHubRepository,
  GitHubReadme,
  GitHubContributor,
  GitHubRelease,
  GitHubData,
  ToolRepoMap,
} from '../types/github.types';
import { ExternalAPIError } from '../utils/errorHandler';

/**
 * Hardcoded mapping of tool names to GitHub repositories
 */
const TOOL_REPO_MAP: ToolRepoMap = {
  // JavaScript/TypeScript Frameworks
  react: 'facebook/react',
  vue: 'vuejs/core',
  'vue.js': 'vuejs/core',
  angular: 'angular/angular',
  svelte: 'sveltejs/svelte',
  solid: 'solidjs/solid',
  'solid.js': 'solidjs/solid',
  preact: 'preactjs/preact',

  // Meta Frameworks
  'next.js': 'vercel/next.js',
  nextjs: 'vercel/next.js',
  next: 'vercel/next.js',
  nuxt: 'nuxt/nuxt',
  'nuxt.js': 'nuxt/nuxt',
  remix: 'remix-run/remix',
  astro: 'withastro/astro',
  gatsby: 'gatsbyjs/gatsby',

  // Build Tools
  vite: 'vitejs/vite',
  webpack: 'webpack/webpack',
  rollup: 'rollup/rollup',
  parcel: 'parcel-bundler/parcel',
  esbuild: 'evanw/esbuild',
  turbopack: 'vercel/turbo',

  // State Management
  redux: 'reduxjs/redux',
  mobx: 'mobxjs/mobx',
  zustand: 'pmndrs/zustand',
  jotai: 'pmndrs/jotai',
  recoil: 'facebookexperimental/Recoil',

  // Backend Frameworks
  express: 'expressjs/express',
  'express.js': 'expressjs/express',
  fastify: 'fastify/fastify',
  nest: 'nestjs/nest',
  'nest.js': 'nestjs/nest',
  nestjs: 'nestjs/nest',
  koa: 'koajs/koa',
  hapi: 'hapijs/hapi',

  // Databases & ORMs
  prisma: 'prisma/prisma',
  drizzle: 'drizzle-team/drizzle-orm',
  'drizzle-orm': 'drizzle-team/drizzle-orm',
  typeorm: 'typeorm/typeorm',
  mongoose: 'Automattic/mongoose',
  sequelize: 'sequelize/sequelize',

  // Testing
  jest: 'jestjs/jest',
  vitest: 'vitest-dev/vitest',
  playwright: 'microsoft/playwright',
  cypress: 'cypress-io/cypress',

  // DevOps & Infrastructure
  docker: 'docker/docker-ce',
  kubernetes: 'kubernetes/kubernetes',
  terraform: 'hashicorp/terraform',
  ansible: 'ansible/ansible',

  // Other Popular Tools
  typescript: 'microsoft/TypeScript',
  tailwind: 'tailwindlabs/tailwindcss',
  'tailwind css': 'tailwindlabs/tailwindcss',
  tailwindcss: 'tailwindlabs/tailwindcss',
};

/**
 * GitHub Service for fetching repository data
 */
export class GitHubService {
  private client: AxiosInstance;
  private requestCount: number = 0;
  private rateLimitRemaining: number = 5000;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(env.GITHUB_TOKEN && { Authorization: `Bearer ${env.GITHUB_TOKEN}` }),
      },
      timeout: 10000,
    });

    // Add response interceptor to track rate limits
    this.client.interceptors.response.use(
      (response) => {
        const remaining = response.headers['x-ratelimit-remaining'];
        if (remaining) {
          this.rateLimitRemaining = parseInt(remaining, 10);
        }
        this.requestCount++;
        return response;
      },
      (error) => {
        if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
          const resetTime = error.response.headers['x-ratelimit-reset'];
          throw new ExternalAPIError(
            'GitHub',
            `Rate limit exceeded. Resets at ${new Date(parseInt(resetTime, 10) * 1000).toISOString()}`
          );
        }
        throw error;
      }
    );
  }

  /**
   * Detect GitHub repository for a tool name
   */
  detectRepository(toolName: string): string | null {
    const normalized = toolName.toLowerCase().trim();

    // Check hardcoded map first
    if (TOOL_REPO_MAP[normalized]) {
      return TOOL_REPO_MAP[normalized];
    }

    // Try variations
    const variations = [
      normalized,
      normalized.replace(/\s+/g, ''),
      normalized.replace(/\./g, ''),
      normalized.replace(/\.js$/i, ''),
    ];

    for (const variation of variations) {
      if (TOOL_REPO_MAP[variation]) {
        return TOOL_REPO_MAP[variation];
      }
    }

    return null;
  }

  /**
   * Search GitHub for a repository
   */
  async searchRepository(toolName: string): Promise<string | null> {
    try {
      const response = await this.client.get('/search/repositories', {
        params: {
          q: toolName,
          sort: 'stars',
          order: 'desc',
          per_page: 5,
        },
      });

      const repos = response.data.items;
      if (repos && repos.length > 0) {
        // Return the most starred repository
        return repos[0].full_name;
      }

      return null;
    } catch (error) {
      console.error(`[GitHub] Error searching for "${toolName}":`, error);
      return null;
    }
  }

  /**
   * Fetch complete GitHub data for a tool
   */
  async fetchData(toolName: string): Promise<GitHubData | null> {
    try {
      // Detect repository
      let repoFullName = this.detectRepository(toolName);

      if (!repoFullName) {
        console.log(`[GitHub] Repository not found in map for "${toolName}", searching...`);
        repoFullName = await this.searchRepository(toolName);
      }

      if (!repoFullName) {
        console.log(`[GitHub] No repository found for "${toolName}"`);
        return null;
      }

      console.log(`[GitHub] Fetching data for ${repoFullName}`);

      // Check cache first
      const cacheKey = CacheService.githubKey(repoFullName, 'metrics');
      const cached = await cacheService.get<GitHubData>(cacheKey);
      if (cached) {
        console.log(`[GitHub] Cache hit for ${repoFullName}`);
        return cached;
      }

      // Fetch all data in parallel
      const [repository, readme, contributors, releases] = await Promise.allSettled([
        this.fetchRepository(repoFullName),
        this.fetchReadme(repoFullName),
        this.fetchContributors(repoFullName),
        this.fetchReleases(repoFullName),
      ]);

      // Process results
      const repoData = repository.status === 'fulfilled' ? repository.value : null;
      if (!repoData) {
        throw new Error(`Repository ${repoFullName} not found`);
      }

      const readmeData = readme.status === 'fulfilled' ? readme.value : null;
      const contributorCount = contributors.status === 'fulfilled' ? contributors.value.length : 0;
      const releasesData = releases.status === 'fulfilled' ? releases.value : [];

      // Get recent commit count (approximation using pushed_at)
      const recentCommits = await this.getRecentCommitCount(repoFullName);

      const githubData: GitHubData = {
        repository: {
          fullName: repoData.full_name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          watchers: repoData.watchers_count,
          openIssues: repoData.open_issues_count,
          language: repoData.language,
          license: repoData.license?.name || null,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at,
          pushedAt: repoData.pushed_at,
          url: repoData.html_url,
          homepage: repoData.homepage,
          topics: repoData.topics || [],
        },
        readme: readmeData
          ? {
              content: readmeData,
              size: readmeData.length,
            }
          : null,
        activity: {
          recentCommits,
          contributors: contributorCount,
          releases: releasesData.slice(0, 5).map((release) => ({
            tagName: release.tag_name,
            publishedAt: release.published_at,
            url: release.html_url,
          })),
        },
      };

      // Cache the result
      await cacheService.set(cacheKey, githubData, CACHE_TTLS.github.metrics);

      return githubData;
    } catch (error) {
      console.error(`[GitHub] Error fetching data for "${toolName}":`, error);

      // Try to return cached data even if stale
      const repoFullName = this.detectRepository(toolName);
      if (repoFullName) {
        const cacheKey = CacheService.githubKey(repoFullName, 'metrics');
        const stale = await cacheService.get<GitHubData>(cacheKey);
        if (stale) {
          console.log(`[GitHub] Returning stale cache for ${repoFullName}`);
          return stale;
        }
      }

      return null;
    }
  }

  /**
   * Fetch repository information
   */
  private async fetchRepository(fullName: string): Promise<GitHubRepository> {
    const response = await this.client.get<GitHubRepository>(`/repos/${fullName}`);
    return response.data;
  }

  /**
   * Fetch README content
   */
  private async fetchReadme(fullName: string): Promise<string | null> {
    try {
      const response = await this.client.get<GitHubReadme>(`/repos/${fullName}/readme`);
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return content;
    } catch (error) {
      console.log(`[GitHub] No README found for ${fullName}`);
      return null;
    }
  }

  /**
   * Fetch contributors
   */
  private async fetchContributors(fullName: string): Promise<GitHubContributor[]> {
    try {
      const response = await this.client.get<GitHubContributor[]>(`/repos/${fullName}/contributors`, {
        params: { per_page: 100 },
      });
      return response.data;
    } catch (error) {
      console.error(`[GitHub] Error fetching contributors for ${fullName}:`, error);
      return [];
    }
  }

  /**
   * Fetch releases
   */
  private async fetchReleases(fullName: string): Promise<GitHubRelease[]> {
    try {
      const response = await this.client.get<GitHubRelease[]>(`/repos/${fullName}/releases`, {
        params: { per_page: 10 },
      });
      return response.data;
    } catch (error) {
      console.error(`[GitHub] Error fetching releases for ${fullName}:`, error);
      return [];
    }
  }

  /**
   * Get recent commit count (last 30 days)
   */
  private async getRecentCommitCount(fullName: string): Promise<number> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const response = await this.client.get(`/repos/${fullName}/commits`, {
        params: {
          since: since.toISOString(),
          per_page: 100,
        },
      });

      // GitHub returns up to 100 commits per page
      // If we get 100, there might be more, but we'll cap at 100 for simplicity
      return response.data.length;
    } catch (error) {
      console.error(`[GitHub] Error fetching recent commits for ${fullName}:`, error);
      return 0;
    }
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      requestCount: this.requestCount,
    };
  }
}

// Export singleton instance
export const githubService = new GitHubService();
