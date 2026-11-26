import { createHash } from "node:crypto";
import { descriptionKey } from "./normalize";

export type HashInput = {
  date: Date;
  type: "income" | "expense";
  amount: number;
  description: string;
};

/**
 * Returns one hash per row. Identical rows within the same batch get an occurrence index,
 * so two legitimate identical transactions are kept, while re-importing the same file
 * produces the same hashes and is skipped.
 */
export function buildDedupHashes(rows: HashInput[]): string[] {
  const seen = new Map<string, number>();
  return rows.map((r) => {
    const key = [
      r.date.toISOString().slice(0, 10),
      r.type,
      r.amount,
      descriptionKey(r.description),
    ].join("|");
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    return createHash("sha256").update(`${key}|${n}`).digest("hex");
  });
}
