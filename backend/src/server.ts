import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, isDevelopment } from './config/environment';
import ogRoutes from "./routes/og.routes";
import { initializeRedis, closeRedis, isRedisConnected } from './config/redis';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

// Initialize Express app
const app = express();
const PORT = env.PORT || 3001;

/**
 * Middleware setup
 */
// Mount OG route for social crawlers
app.use("/og", ogRoutes);

// Security headers
app.use(helmet());

// CORS configuration
// In development allow incoming requests from any origin to avoid port mismatches during local testing.
// In production restrict to configured FRONTEND_URL and known localhost dev ports.
app.use(
  cors({
    origin: isDevelopment()
      ? true
      : [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/api/health', async (_req: Request, res: Response) => {
  const redisConnected = await isRedisConnected();
  const githubConfigured = !!env.GITHUB_TOKEN;
  const claudeConfigured = !!env.ANTHROPIC_API_KEY;

  // The server is healthy as long as it can accept requests.
  // Redis and GitHub are optional/additive — their absence is degraded, not down.
  res.status(200).json({
    status: claudeConfigured ? 'healthy' : 'degraded',
    services: {
      redis: redisConnected ? 'connected' : 'memory-cache',
      github: githubConfigured,
      claude: claudeConfigured,
      brevo: !!env.BREVO_API_KEY,
    },
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Root endpoint
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Stack Index Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      analyze: '/api/analyze',
      tools: '/api/tools',
      categories: '/api/tools/categories',
      search: '/api/search',
    },
  });
});

/**
 * API Routes
 */
import analysisRoutes from './routes/analysis.routes';
import mcpRoutes from './routes/mcp.routes';
import catalogRoutes from './routes/catalog.routes';
import contactRoutes from './routes/contact.routes';
import newsletterRoutes from './routes/newsletter.routes';
import { generalRateLimiter } from './middleware/rateLimiter';

// Apply general rate limiting to all API routes
app.use('/api', generalRateLimiter);

// Analysis routes
app.use('/api', analysisRoutes);

// MCP registry routes (org registration + verification)
app.use('/api', mcpRoutes);

// Catalog, scoring, and search routes
app.use('/api', catalogRoutes);

// Contact form route
app.use('/api', contactRoutes);

// Newsletter subscription route
app.use('/api', newsletterRoutes);

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Keep-alive ping — prevents Render free tier from sleeping.
 * Pings own health endpoint every 10 minutes in production.
 */
const startKeepAlive = () => {
  if (env.NODE_ENV !== 'production') return;
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (!RENDER_URL) return;

  const pingUrl = `${RENDER_URL}/api/health`;
  const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

  setInterval(async () => {
    try {
      const res = await fetch(pingUrl);
      console.log(`[KeepAlive] Pinged ${pingUrl} → ${res.status}`);
    } catch (err: any) {
      console.warn(`[KeepAlive] Ping failed: ${err.message}`);
    }
  }, INTERVAL_MS);

  console.log(`[KeepAlive] Started — pinging every 10 min`);
};

/**
 * Server startup
 */
const startServer = async () => {
  try {
    // Initialize Redis
    console.log('[Server] Initializing Redis connection...');
    initializeRedis();

    // Start server
    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] Frontend URL: ${env.FRONTEND_URL}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
      startKeepAlive();
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
const gracefulShutdown = async () => {
  console.log('\n[Server] Shutting down gracefully...');

  try {
    await closeRedis();
    console.log('[Server] Closed all connections');
    process.exit(0);
  } catch (error) {
    console.error('[Server] Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

// Start the server
startServer();

export default app;
