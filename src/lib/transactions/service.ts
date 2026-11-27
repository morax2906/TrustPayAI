import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { categorizeByRules } from "./categorize";
import { buildDedupHashes } from "./dedup";
import { parseTransactionsCsv, type RowError } from "./import-csv";
import { MAX_AMOUNT_VND, cleanDescription } from "./normalize";

export const createTransactionSchema = z.object({
  date: z.iso.date().transform((s) => new Date(`${s}T00:00:00Z`)),
  type: z.enum(["income", "expense"]),
  amount: z.number().int().positive().max(MAX_AMOUNT_VND),
  description: z.string().transform(cleanDescription).pipe(z.string().min(1)),
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(["income", "expense"]).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

const select = {
  id: true,
  date: true,
  amount: true,
  type: true,
  description: true,
  category: { select: { slug: true, name: true } },
} satisfies Prisma.TransactionSelect;

export async function listTransactions(userId: string, q: ListQuery) {
  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(q.type ? { type: q.type } : {}),
    ...(q.from || q.to
      ? {
          date: {
            ...(q.from ? { gte: new Date(`${q.from}T00:00:00Z`) } : {}),
            ...(q.to ? { lte: new Date(`${q.to}T00:00:00Z`) } : {}),
          },
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    db.transaction.findMany({
      where,
      select,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    }),
    db.transaction.count({ where }),
  ]);
  return { items, total, page: q.page, limit: q.limit };
}

export type CreateResult =
  | { ok: true; id: string }
  | { ok: false; reason: "duplicate" };

/** Map of category slug to id. */
async function loadCategoryIds(): Promise<Map<string, string>> {
  const rows = await db.category.findMany({ select: { id: true, slug: true } });
  return new Map(rows.map((r) => [r.slug, r.id]));
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput
): Promise<CreateResult> {
  const [dedupHash] = buildDedupHashes([input]);
  const slug = categorizeByRules(input.description, input.type);
  const categoryId = slug ? (await loadCategoryIds()).get(slug) : undefined;
  try {
    const tx = await db.transaction.create({
      data: { userId, ...input, dedupHash, categoryId },
      select: { id: true },
    });
    return { ok: true, id: tx.id };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, reason: "duplicate" };
    }
    throw e;
  }
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  const res = await db.transaction.deleteMany({ where: { id, userId } });
  return res.count > 0;
}

export type ImportSummary = {
  totalRows: number;
  imported: number;
  duplicates: number;
  errors: RowError[];
  errorCount: number;
};

/** Parses CSV text, dedups against existing rows, and inserts the new ones. Throws ImportFormatError on bad format. */
export async function importCsv(userId: string, text: string): Promise<ImportSummary> {
  const { rows, errors, totalRows } = parseTransactionsCsv(text);
  const hashes = buildDedupHashes(rows);
  let imported = 0;
  if (rows.length > 0) {
    const categoryIds = await loadCategoryIds();
    const res = await db.transaction.createMany({
      data: rows.map((r, i) => ({
        userId,
        date: r.date,
        type: r.type,
        amount: r.amount,
        description: r.description,
        dedupHash: hashes[i],
        categoryId: categoryIds.get(categorizeByRules(r.description, r.type) ?? ""),
      })),
      skipDuplicates: true,
    });
    imported = res.count;
  }
  return {
    totalRows,
    imported,
    duplicates: rows.length - imported,
    errors: errors.slice(0, 20),
    errorCount: errors.length,
  };
}

export type CategorizeSummary = { examined: number; categorized: number; stillUncategorized: number };

/** Applies keyword rules to the user's uncategorized transactions (capped per call). Safe to repeat. */
export async function categorizeUncategorized(userId: string): Promise<CategorizeSummary> {
  const LIMIT = 2000;
  const [rows, categoryIds] = await Promise.all([
    db.transaction.findMany({
      where: { userId, categoryId: null },
      select: { id: true, type: true, description: true },
      take: LIMIT,
    }),
    loadCategoryIds(),
  ]);
  const bySlug = new Map<string, string[]>();
  for (const r of rows) {
    const slug = categorizeByRules(r.description, r.type);
    if (!slug) continue;
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), r.id]);
  }
  let categorized = 0;
  for (const [slug, ids] of Array.from(bySlug)) {
    const categoryId = categoryIds.get(slug);
    if (!categoryId) continue;
    const res = await db.transaction.updateMany({
      where: { userId, id: { in: ids }, categoryId: null },
      data: { categoryId },
    });
    categorized += res.count;
  }
  return { examined: rows.length, categorized, stillUncategorized: rows.length - categorized };
}
