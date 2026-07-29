import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const userLoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Task title is required when provided').optional(),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
});
