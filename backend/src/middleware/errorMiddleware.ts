import { Request, Response, NextFunction } from 'express';
import { formatErrorResponse } from '../utils/errorHandler';
import { isDevelopment } from '../config/environment';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error details
  console.error('[Error]', {
    url: req.url,
    method: req.method,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: isDevelopment() && error instanceof Error ? error.stack : undefined,
  });

  // Format error response
  const errorResponse = formatErrorResponse(error);

  // Send response
  res.status(errorResponse.statusCode).json({
    error: errorResponse.error,
    code: errorResponse.code,
    ...(isDevelopment() && error instanceof Error && { stack: error.stack }),
  });
};

/**
 * Async error handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.url}`,
    code: 'NOT_FOUND',
  });
};
