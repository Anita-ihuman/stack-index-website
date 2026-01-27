# Stack Index Backend API

Backend service for the Stack Index AI Analyzer with real-time data fetching from GitHub, documentation sites, and community platforms.

## Features

- **Real-Time Data Fetching**: Fetches live data from multiple sources
  - GitHub API: Repository metrics, README, activity stats
  - Official Documentation: Scraped and parsed documentation
  - Community Data: Stack Overflow, Reddit, npm statistics

- **AI-Powered Analysis**: Uses Claude 3.5 Sonnet for intelligent analysis

- **Multi-Tier Caching**: Redis primary + in-memory fallback

- **Rate Limiting**: Protects API from abuse (20 requests per 15 minutes)

- **Graceful Degradation**: Falls back to cached data when services are unavailable

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Required environment variables:

```bash
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:8080

# Required API Keys
ANTHROPIC_API_KEY=sk-ant-...           # Get from https://console.anthropic.com
GITHUB_TOKEN=ghp_...                    # Get from GitHub Settings → Developer Settings

# Optional
REDIS_URL=redis://localhost:6379       # Optional: Redis for caching
CACHE_ENABLED=false                     # Set to true if Redis is available
```

### 3. Build

```bash
npm run build
```

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Health Check

```bash
GET /api/health
```

Returns service status and configuration.

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "redis": true,
    "github": true,
    "claude": true
  },
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

### Analyze Tools

```bash
POST /api/analyze
Content-Type: application/json

{
  "input": "React vs Vue",
  "type": "comparison",
  "options": {
    "skipCache": false,
    "includeMetrics": true
  }
}
```

**Parameters:**
- `input` (string, required): Tool name(s) to analyze
- `type` (string, optional): `"comparison"` or `"deepdive"` (auto-detected if not provided)
- `options` (object, optional):
  - `skipCache` (boolean): Force fresh data fetch
  - `includeMetrics` (boolean): Include detailed metrics

**Response:**
```json
{
  "analysis": {
    "tools": [...],
    "comparisonSummary": "...",
    "recommendation": "..."
  },
  "metadata": {
    "sources": {
      "github": true,
      "documentation": true,
      "community": true
    },
    "fetchedAt": "2026-01-21T12:00:00.000Z",
    "tokensUsed": 8500,
    "dataAge": {
      "github": "just now",
      "docs": "15 minutes ago",
      "community": "just now"
    }
  }
}
```

## Architecture

### Services

```
orchestrator.service.ts
├── github.service.ts         # Fetches GitHub repo data
├── documentation.service.ts  # Scrapes official docs
├── community.service.ts      # Fetches Stack Overflow, Reddit, npm data
├── claude.service.ts         # AI analysis with enhanced prompts
└── cache.service.ts          # Multi-tier caching
```

### Data Flow

```
1. User Request → Controller
2. Orchestrator coordinates parallel data fetching:
   - GitHub Service (stars, forks, README, activity)
   - Documentation Service (official docs or README fallback)
   - Community Service (Stack Overflow, Reddit, npm)
3. Data aggregation and token optimization
4. Claude Service analyzes with real-time context
5. Cache result (6-hour TTL)
6. Return enriched analysis + metadata
```

### Caching Strategy

- **GitHub Metrics**: 15 minutes
- **GitHub README**: 1 hour
- **Documentation**: 24 hours
- **Community Data**: 1 hour
- **Complete Analysis**: 6 hours

### Rate Limiting

- **Analysis Endpoint**: 20 requests per 15 minutes per IP
- **General API**: 100 requests per minute per IP

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Deployment

### Docker

```bash
docker build -t stack-index-backend .
docker run -p 3001:3001 --env-file .env stack-index-backend
```

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...
REDIS_URL=redis://your-redis-url:6379
CACHE_ENABLED=true
```

## Monitoring

Monitor these key metrics:

- Request latency (target: <10s)
- Cache hit rate (target: >60%)
- Error rate (target: <0.5%)
- GitHub API quota usage
- Claude API token consumption

## Troubleshooting

### Redis Connection Failed

The system will automatically fall back to in-memory caching. No action required.

### GitHub Rate Limit Exceeded

- Make sure `GITHUB_TOKEN` is configured
- With token: 5,000 requests/hour
- Without token: 60 requests/hour
- Aggressive caching mitigates this issue

### Claude API Errors

- Check `ANTHROPIC_API_KEY` is valid
- Monitor token usage (cost implications)
- Consider increasing cache TTLs if budget-constrained

## Cost Estimates

**Claude API (3.5 Sonnet):**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens
- Per request: ~$0.08 (with real-time data)
- Monthly (1,000 requests): ~$85

**Mitigation:**
- 6-hour cache on complete analyses
- 60%+ cache hit rate reduces costs significantly

## License

ISC
