import { db } from "@/lib/db";

export const SCAN_DAILY_LIMIT = 30;

/** Calendar day in Vietnam time, as a UTC-midnight Date for the @db.Date column. */
function today(): Date {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  return new Date(`${ymd}T00:00:00Z`);
}

/** Atomically counts one scan for the user. Returns false when the daily limit is exceeded. */
export async function consumeScan(userId: string): Promise<boolean> {
  const row = await db.apiUsage.upsert({
    where: { userId_day_kind: { userId, day: today(), kind: "scan" } },
    create: { userId, day: today(), kind: "scan", count: 1 },
    update: { count: { increment: 1 } },
    select: { count: true },
  });
  return row.count <= SCAN_DAILY_LIMIT;
}
