import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, isDevelopment } from './config/environment';
import { initializeRedis, closeRedis, isRedisConnected } from './config/redis';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

// Initialize Express app
const app = express();
const PORT = env.PORT || 3001;

/**
 * Middleware setup
 */

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

  const allServicesHealthy = redisConnected && githubConfigured && claudeConfigured;

  res.status(allServicesHealthy ? 200 : 503).json({
    status: allServicesHealthy ? 'healthy' : 'degraded',
    services: {
      redis: redisConnected,
      github: githubConfigured,
      claude: claudeConfigured,
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
    },
  });
});

/**
 * API Routes
 */
import analysisRoutes from './routes/analysis.routes';
import { generalRateLimiter } from './middleware/rateLimiter';

// Apply general rate limiting to all API routes
app.use('/api', generalRateLimiter);

// Analysis routes
app.use('/api', analysisRoutes);

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

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
