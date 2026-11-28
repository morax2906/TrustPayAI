export type TxType = "income" | "expense";

export type CategoryInfo = {
  slug: string;
  name: string;
};

export type TransactionItem = {
  id: string;
  date: string;
  amount: number;
  type: TxType;
  description: string;
  category: CategoryInfo | null;
};

export type TransactionListResponse = {
  items: TransactionItem[];
  total: number;
  page: number;
  limit: number;
};

export type ImportSummaryResponse = {
  totalRows: number;
  imported: number;
  duplicates: number;
  errors: Array<{ line: number; reason: string }>;
  errorCount: number;
};

export type CategorizeResponse = {
  examined: number;
  categorized: number;
  stillUncategorized: number;
};

export type CategoryBreakdownItem = {
  slug: string;
  name: string;
  amount: number;
  percentage: number;
};

export type DashboardSummary = {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
  expenseByCategory: CategoryBreakdownItem[];
};

export type CsvPreview = {
  headers: string[];
  rows: string[][];
};

export function buildSampleCsv(): string {
  return [
    "\uFEFFNgày,Số tiền,Nội dung",
    "2026-11-25,-45000,Cà phê Highlands",
    "2026-11-26,-125000,GrabFood bữa trưa",
    "2026-11-27,5000000,Thưởng dự án tháng 11",
  ].join("\n");
}

export function isCsvFile(file: Pick<File, "name">): boolean {
  return file.name.toLowerCase().endsWith(".csv");
}

export function formatDateVi(isoDate: string): string {
  const datePart = isoDate.slice(0, 10);
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

export function extractUniqueCategories(items: TransactionItem[]): CategoryInfo[] {
  const map = new Map<string, string>();
  for (const item of items) {
    if (item.category) {
      map.set(item.category.slug, item.category.name);
    }
  }
  return Array.from(map.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export function filterTransactionsByCategory(
  items: TransactionItem[],
  categorySlug: string
): TransactionItem[] {
  if (!categorySlug || categorySlug === "all") return items;
  if (categorySlug === "uncategorized") {
    return items.filter((item) => item.category === null);
  }
  return items.filter((item) => item.category?.slug === categorySlug);
}

function detectDelimiter(headerLine: string): "," | ";" | "\t" {
  const counts: Array<{ d: "," | ";" | "\t"; c: number }> = [
    { d: ";", c: (headerLine.match(/;/g) ?? []).length },
    { d: "\t", c: (headerLine.match(/\t/g) ?? []).length },
    { d: ",", c: (headerLine.match(/,/g) ?? []).length },
  ];
  counts.sort((a, b) => b.c - a.c);
  return counts[0].c > 0 ? counts[0].d : ",";
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

export function parseCsvPreview(rawText: string, maxDataRows = 8): CsvPreview {
  const clean = rawText.replace(/^\uFEFF/, "");
  const lines = clean
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return { headers: [], rows: [] };
  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter);
  const rows = lines
    .slice(1, 1 + maxDataRows)
    .map((line) => splitCsvLine(line, delimiter));
  return { headers, rows };
}

export function summarizeTransactions(items: TransactionItem[]): DashboardSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = new Map<string, { slug: string; name: string; amount: number }>();

  for (const item of items) {
    if (item.type === "income") {
      totalIncome += item.amount;
      continue;
    }
    totalExpense += item.amount;
    const slug = item.category?.slug ?? "uncategorized";
    const name = item.category?.name ?? "Chưa phân loại";
    const existing = categoryTotals.get(slug);
    if (existing) {
      existing.amount += item.amount;
    } else {
      categoryTotals.set(slug, { slug, name, amount: item.amount });
    }
  }

  const expenseByCategory = Array.from(categoryTotals.values())
    .sort((a, b) => b.amount - a.amount)
    .map((entry) => ({
      ...entry,
      percentage: totalExpense > 0 ? Math.round((entry.amount / totalExpense) * 100) : 0,
    }));

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    transactionCount: items.length,
    expenseByCategory,
  };
}

/** Fetches every page of GET /api/transactions until the API total is reached. */
export async function fetchAllTransactionsForDashboard(): Promise<TransactionItem[]> {
  const all: TransactionItem[] = [];
  const limit = 100;
  let page = 1;
  let total = Number.POSITIVE_INFINITY;

  while (all.length < total) {
    const res = await fetch(`/api/transactions?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (res.status === 401) {
      throw new Error("unauthorized");
    }
    if (!res.ok) {
      throw new Error("fetch_failed");
    }
    const data = (await res.json()) as TransactionListResponse;
    all.push(...data.items);
    total = data.total;
    if (all.length >= data.total || data.items.length === 0) break;
    page++;
  }
  return all;
}
