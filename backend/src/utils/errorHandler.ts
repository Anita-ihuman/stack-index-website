/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} API error: ${message}`, 502, 'EXTERNAL_API_ERROR');
    this.name = 'ExternalAPIError';
  }
}

export class CacheError extends AppError {
  constructor(message: string) {
    super(`Cache error: ${message}`, 500, 'CACHE_ERROR');
    this.name = 'CacheError';
  }
}

/**
 * Check if error is an instance of AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Format error for client response
 */
export const formatErrorResponse = (error: unknown) => {
  if (isAppError(error)) {
    return {
      error: error.message,
      code: error.code || 'INTERNAL_ERROR',
      statusCode: error.statusCode,
    };
  }

  // Handle unknown errors
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
};
