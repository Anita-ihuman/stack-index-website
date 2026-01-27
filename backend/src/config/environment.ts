import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variable schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  FRONTEND_URL: z.string().default('http://localhost:8080'),

  // Required API keys
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  GITHUB_TOKEN: z.string().optional(),

  // Optional API keys
  STACKOVERFLOW_KEY: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional(),

  // Cache configuration
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  CACHE_ENABLED: z.string().default('true'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('20'),

  // Logging
  LOG_LEVEL: z.string().default('info'),
  ENABLE_METRICS: z.string().default('true'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\n` +
        `Please check your .env file. See .env.example for reference.`
      );
    }
    throw error;
  }
};

// Export validated environment variables
export const env = parseEnv();

// Helper to check if Redis is enabled
export const isRedisEnabled = (): boolean => {
  return env.CACHE_ENABLED === 'true' && !!env.REDIS_URL;
};

// Helper to check if running in production
export const isProduction = (): boolean => {
  return env.NODE_ENV === 'production';
};

// Helper to check if running in development
export const isDevelopment = (): boolean => {
  return env.NODE_ENV === 'development';
};
