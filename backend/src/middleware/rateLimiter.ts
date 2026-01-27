import rateLimit from 'express-rate-limit';
import { env } from '../config/environment';

/**
 * Rate limiter for analysis endpoint
 */
export const analysisRateLimiter = rateLimit({
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS), // 15 minutes by default
  max: parseInt(env.RATE_LIMIT_MAX), // 20 requests per window by default
  message: {
    error: 'Too many analysis requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for successful cached responses (optional)
  skip: (_req, res) => {
    return res.statusCode === 200 && res.getHeader('X-Cache-Hit') === 'true';
  },
});

/**
 * General API rate limiter (more lenient)
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests from this IP, please slow down.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
