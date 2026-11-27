import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url().optional(),
  AWS_REGION: z.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  BEDROCK_MODEL_ID: z.string().min(1).optional(),
  SAFE_BROWSING_API_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
  // Max Haiku calls per day across all users. Beyond it the engine stays on heuristics.
  HAIKU_DAILY_CAP: z.coerce.number().int().positive().optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Validates env lazily on first use. Throws a message listing only variable names. */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const names = Array.from(
      new Set(parsed.error.issues.map((i) => i.path.join(".")))
    ).join(", ");
    throw new Error(`Invalid or missing environment variables: ${names}`);
  }
  cached = parsed.data;
  return cached;
}

/** True when Bedrock is fully configured. Otherwise the risk engine uses heuristics. */
export function isBedrockConfigured(): boolean {
  const e = process.env;
  return Boolean(
    e.AWS_REGION && e.AWS_ACCESS_KEY_ID && e.AWS_SECRET_ACCESS_KEY && e.BEDROCK_MODEL_ID
  );
}
