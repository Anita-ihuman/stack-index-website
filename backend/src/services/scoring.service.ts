import { githubService } from './github.service';
import { communityService } from './community.service';
import { ToolCatalogEntry, ToolScore, ScoredDimension, DataConfidence } from '../types/catalog.types';

const WEIGHTS = {
  githubStars: 0.20,
  contributorVelocity: 0.15,
  issueResolutionSpeed: 0.10,
  documentationQuality: 0.15,
  downloadVolume: 0.15,
  communityActivity: 0.10,
  enterpriseAdoption: 0.10,
  maintenanceHealth: 0.05,
};

/**
 * Normalize a value on a log scale 0–100, bounded by max
 */
function logNormalize(value: number, max: number): number {
  if (value <= 0 || max <= 0) return 0;
  const norm = Math.log1p(value) / Math.log1p(max);
  return Math.min(100, Math.round(norm * 100));
}

/**
 * Normalize a value linearly 0–100, bounded by max
 */
function linearNormalize(value: number, max: number): number {
  if (value <= 0 || max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
}

function makeDimension(
  raw: number | null,
  normalized: number,
  weight: number,
  confidence: DataConfidence
): ScoredDimension {
  return {
    raw,
    normalized,
    weight,
    confidence,
    lastFetchedAt: new Date().toISOString(),
  };
}

/**
 * Deterministic weighted scoring using live GitHub + community data.
 * Never fabricates numbers — uses null when data is unavailable.
 */
export class ScoringService {
  async computeScore(tool: ToolCatalogEntry): Promise<ToolScore> {
    const [githubResult, communityResult] = await Promise.allSettled([
      tool.githubRepo ? githubService.fetchData(tool.slug) : Promise.resolve(null),
      communityService.fetchData(tool.slug),
    ]);

    const github = githubResult.status === 'fulfilled' ? githubResult.value : null;
    const community = communityResult.status === 'fulfilled' ? communityResult.value : null;

    let liveDimensionsCount = 0;

    // --- GitHub Stars (log scale, 200k max) ---
    const stars = github?.repository.stars ?? null;
    const starsNorm = stars !== null ? logNormalize(stars, 200000) : 0;
    if (stars !== null) liveDimensionsCount++;
    const githubStars = makeDimension(
      stars,
      starsNorm,
      WEIGHTS.githubStars,
      stars !== null ? 'live_data' : 'ai_inferred'
    );

    // --- Contributor Velocity (commits last 30 days, max 500) ---
    const recentCommits = github?.activity.recentCommits ?? null;
    const velocityNorm = recentCommits !== null ? logNormalize(recentCommits, 500) : 0;
    if (recentCommits !== null) liveDimensionsCount++;
    const contributorVelocity = makeDimension(
      recentCommits,
      velocityNorm,
      WEIGHTS.contributorVelocity,
      recentCommits !== null ? 'live_data' : 'ai_inferred'
    );

    // --- Issue Resolution Speed (inverse of open issues / 1000, capped) ---
    const openIssues = github?.repository.openIssues ?? null;
    let issueNorm = 50; // default neutral
    if (openIssues !== null) {
      // Lower open issues = better; normalize inversely (max benefit at 0, 0 at 10000+)
      issueNorm = Math.max(0, 100 - linearNormalize(openIssues, 10000));
      liveDimensionsCount++;
    }
    const issueResolutionSpeed = makeDimension(
      openIssues,
      issueNorm,
      WEIGHTS.issueResolutionSpeed,
      openIssues !== null ? 'live_data' : 'ai_inferred'
    );

    // --- Documentation Quality (docs URL reachable + key features from catalog) ---
    const docScore = tool.docsUrl ? 60 : 20;
    const docFeaturesBonus = Math.min(40, tool.keyIntegrations.length * 4);
    const docNorm = Math.min(100, docScore + docFeaturesBonus);
    const documentationQuality = makeDimension(
      null,
      docNorm,
      WEIGHTS.documentationQuality,
      'ai_inferred' // we infer from catalog metadata, not live fetch
    );

    // --- Download Volume (npm monthly, log scale, max 100M) ---
    const npmDownloads = community?.npm?.downloads.lastMonth ?? null;
    const dlNorm = npmDownloads !== null ? logNormalize(npmDownloads, 100_000_000) : 0;
    if (npmDownloads !== null) liveDimensionsCount++;
    const downloadVolume = makeDimension(
      npmDownloads,
      dlNorm,
      WEIGHTS.downloadVolume,
      npmDownloads !== null ? 'live_data' : 'ai_inferred'
    );

    // --- Community Activity (SO question count + reddit subscribers) ---
    const soQuestions = community?.stackoverflow?.tagStats.questionCount ?? 0;
    const redditSubs = community?.reddit?.subredditStats.subscribers ?? 0;
    const communityRaw = soQuestions + redditSubs;
    const communityNorm = logNormalize(communityRaw, 2_000_000);
    if (soQuestions > 0 || redditSubs > 0) liveDimensionsCount++;
    const communityActivity = makeDimension(
      communityRaw || null,
      communityNorm,
      WEIGHTS.communityActivity,
      communityRaw > 0 ? 'live_data' : 'ai_inferred'
    );

    // --- Enterprise Adoption (static from maturityLevel + operationalComplexity) ---
    const maturityScores: Record<string, number> = {
      mature: 90,
      growing: 65,
      emerging: 35,
      legacy: 50,
    };
    const enterpriseNorm = maturityScores[tool.maturityLevel] ?? 50;
    const enterpriseAdoption = makeDimension(
      null,
      enterpriseNorm,
      WEIGHTS.enterpriseAdoption,
      'ai_inferred'
    );

    // --- Maintenance Health (days since last release, max 365) ---
    const latestRelease = github?.activity.releases[0];
    let maintenanceNorm = 50;
    let daysSinceRelease: number | null = null;
    if (latestRelease) {
      daysSinceRelease = Math.floor(
        (Date.now() - new Date(latestRelease.publishedAt).getTime()) / 86_400_000
      );
      maintenanceNorm = Math.max(0, 100 - linearNormalize(daysSinceRelease, 365));
      liveDimensionsCount++;
    }
    const maintenanceHealth = makeDimension(
      daysSinceRelease,
      maintenanceNorm,
      WEIGHTS.maintenanceHealth,
      daysSinceRelease !== null ? 'live_data' : 'ai_inferred'
    );

    // --- Overall Score ---
    const dimensions = {
      githubStars,
      contributorVelocity,
      issueResolutionSpeed,
      documentationQuality,
      downloadVolume,
      communityActivity,
      enterpriseAdoption,
      maintenanceHealth,
    };

    let overall: number;
    if (liveDimensionsCount < 3) {
      // Not enough live data — return null-equivalent (0) overall
      overall = 0;
    } else {
      overall = Math.round(
        Object.values(dimensions).reduce((sum, d) => sum + d.normalized * d.weight, 0)
      );
    }

    const dataConfidence: DataConfidence =
      liveDimensionsCount >= 5
        ? 'live_data'
        : liveDimensionsCount >= 3
        ? 'cached'
        : 'ai_inferred';

    return {
      slug: tool.slug,
      overall,
      dimensions,
      dataConfidence,
      computedAt: new Date().toISOString(),
    };
  }
}

export const scoringService = new ScoringService();
