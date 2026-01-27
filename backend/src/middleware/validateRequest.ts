import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errorHandler';

/**
 * Validation schemas
 */
export const analyzeRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(200, 'Input too long'),
  type: z.enum(['comparison', 'deepdive']),
  options: z
    .object({
      skipCache: z.boolean().optional(),
      includeMetrics: z.boolean().optional(),
    })
    .optional(),
});

/**
 * Generic request validator middleware
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
        next(new ValidationError(messages.join(', ')));
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate analysis request
 */
export const validateAnalyzeRequest = validateRequest(analyzeRequestSchema);
