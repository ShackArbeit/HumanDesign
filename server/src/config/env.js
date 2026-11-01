import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(8080),
    WEB_BASE_URL: z.string().url().default('http://localhost:5173'),
    TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
    GMAIL_USER: z.string().optional(),
    GMAIL_APP_PASSWORD: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV !== 'production') return;
    for (const key of ['GMAIL_USER', 'GMAIL_APP_PASSWORD']) {
      if (!value[key]) {
        ctx.addIssue({ code: 'custom', path: [key], message: 'required in production' });
      }
    }
  });

export const loadEnv = (source = process.env) => {
  const result = schema.safeParse(source);
  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`Invalid environment variables: ${fields}`);
  }
  return result.data;
};
