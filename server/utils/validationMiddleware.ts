import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      // In Zod 4, ZodError is used and error.message contains the JSON errors
      if (error instanceof ZodError) {
        // error.message is a string containing JSON of validation errors
        try {
          const errorData = JSON.parse(error.message);
          const errorMessages = Array.isArray(errorData)
            ? errorData.map((err) => err.message || JSON.stringify(err))
            : [error.message];

          return res.status(400).json({
            error: 'Validation failed',
            message: errorMessages.join(', '),
          });
        } catch (_parseError) {
          // Fallback if parsing fails
          return res.status(400).json({
            error: 'Validation failed',
            message: error.message,
          });
        }
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
