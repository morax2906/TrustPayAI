import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import type { AnalyzeRequest, AnalyzeResponse } from "./schema";

/** Short excerpt for history. Runs of 4+ digits are masked so OTPs and card numbers are not stored. */
export function makeExcerpt(content: string): string {
  return content.replace(/\d{4,}/g, (m) => "•".repeat(m.length)).slice(0, 80);
}

/** Stores a hash plus a short excerpt, never the full content. */
export async function saveScan(userId: string, req: AnalyzeRequest, res: AnalyzeResponse): Promise<void> {
  await db.scanHistory.create({
    data: {
      userId,
      type: req.type,
      contentHash: createHash("sha256").update(req.content).digest("hex"),
      excerpt: makeExcerpt(req.content),
      score: res.score,
      level: res.level,
      model: res.model,
      result: res,
    },
  });
}
