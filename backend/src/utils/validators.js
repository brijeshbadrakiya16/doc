const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email({ message: 'Valid email address is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' })
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email address is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }).max(50),
  description: z.string().max(200).optional()
});

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional()
});

const documentQuerySchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? Math.min(parseInt(val, 10), 100) : 10)),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  sortField: z.enum(['uploadDate', 'originalName', 'size']).optional().default('uploadDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

module.exports = {
  signupSchema,
  loginSchema,
  categorySchema,
  categoryUpdateSchema,
  documentQuerySchema
};
