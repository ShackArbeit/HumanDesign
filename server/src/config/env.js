import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  WEB_BASE_URL: z.string().url().default('http://localhost:5173'),
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
});

export function loadEnv(source = process.env) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const names = result.error.issues.map((issue) => issue.path.join('.'));
    throw new Error(`Invalid environment variables: ${names.join(', ')}`);
  }

  const env = result.data;

  if (env.NODE_ENV === 'production') {
    const missing = [];
    if (!env.GMAIL_USER) missing.push('GMAIL_USER');
    if (!env.GMAIL_APP_PASSWORD) missing.push('GMAIL_APP_PASSWORD');

    if (missing.length > 0) {
      throw new Error(`Invalid environment variables: ${missing.join(', ')}`);
    }
  }

  return env;
}
