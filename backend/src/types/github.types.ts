/**
 * GitHub API response types
 */

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
}

export interface GitHubReadme {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string; // Base64 encoded
  encoding: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  contributions: number;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

/**
 * Processed GitHub data for analysis
 */

export interface GitHubData {
  repository: {
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    language: string | null;
    license: string | null;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    url: string;
    homepage: string | null;
    topics: string[];
  };
  readme: {
    content: string; // Decoded markdown
    size: number;
  } | null;
  activity: {
    recentCommits: number;
    contributors: number;
    releases: Array<{
      tagName: string;
      publishedAt: string;
      url: string;
    }>;
  };
}

/**
 * Tool to repository mapping
 */
export interface ToolRepoMap {
  [tool: string]: string; // tool name -> owner/repo
}
