import type { UsageKind } from "@prisma/client";
import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const SCAN_DAILY_LIMIT = 30;
/** Max Haiku categorization batches per user per day. */
export const CATEGORIZE_DAILY_BATCHES = 10;

/** Calendar day in Vietnam time, as a UTC-midnight Date for the @db.Date column. */
function today(): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  return new Date(`${ymd}T00:00:00Z`);
}

/** Atomically counts `amount` units for the user. Returns false when the daily limit is exceeded. */
export async function consumeUsage(
  userId: string,
  kind: UsageKind,
  limit: number,
  amount = 1
): Promise<boolean> {
  const row = await db.apiUsage.upsert({
    where: { userId_day_kind: { userId, day: today(), kind } },
    create: { userId, day: today(), kind, count: amount },
    update: { count: { increment: amount } },
    select: { count: true },
  });
  return row.count <= limit;
}

/** Counts one scan for the user. Returns false when the daily limit is exceeded. */
export function consumeScan(userId: string): Promise<boolean> {
  return consumeUsage(userId, "scan", SCAN_DAILY_LIMIT);
}

const DEFAULT_HAIKU_DAILY_CAP = 300;

/**
 * Global cost guard. Registration is open, so the per-user limit alone does not bound Bedrock spend.
 * Counts today's Haiku scans (Vietnam time) plus categorization batches, and compares with HAIKU_DAILY_CAP.
 */
export async function haikuAllowed(): Promise<boolean> {
  const cap = getEnv().HAIKU_DAILY_CAP ?? DEFAULT_HAIKU_DAILY_CAP;
  const day = today();
  const since = new Date(`${day.toISOString().slice(0, 10)}T00:00:00+07:00`);
  const [scans, batches] = await Promise.all([
    db.scanHistory.count({ where: { model: "haiku", createdAt: { gte: since } } }),
    db.apiUsage.aggregate({ where: { day, kind: "categorize" }, _sum: { count: true } }),
  ]);
  return scans + (batches._sum.count ?? 0) < cap;
}
