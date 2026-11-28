import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSampleCsv,
  fetchAllTransactionsForDashboard,
  filterTransactionsByCategory,
  isCsvFile,
  parseCsvPreview,
  summarizeTransactions,
  type TransactionItem,
} from "./client";
import { parseTransactionsCsv } from "./import-csv";

const SAMPLE_ITEMS: TransactionItem[] = [
  {
    id: "1",
    date: "2026-11-25T00:00:00.000Z",
    amount: 18000000,
    type: "income",
    description: "Lương tháng",
    category: { slug: "income", name: "Thu nhập" },
  },
  {
    id: "2",
    date: "2026-11-26T00:00:00.000Z",
    amount: 120000,
    type: "expense",
    description: "GrabFood",
    category: { slug: "food", name: "Ăn uống" },
  },
  {
    id: "3",
    date: "2026-11-27T00:00:00.000Z",
    amount: 80000,
    type: "expense",
    description: "Cà phê",
    category: { slug: "food", name: "Ăn uống" },
  },
  {
    id: "4",
    date: "2026-11-27T00:00:00.000Z",
    amount: 300000,
    type: "expense",
    description: "Khoản chưa rõ",
    category: null,
  },
];

test("filterTransactionsByCategory filters all, uncategorized and specific slug", () => {
  assert.equal(filterTransactionsByCategory(SAMPLE_ITEMS, "all").length, 4);
  assert.equal(filterTransactionsByCategory(SAMPLE_ITEMS, "uncategorized").length, 1);
  assert.equal(filterTransactionsByCategory(SAMPLE_ITEMS, "food").length, 2);
});

test("parseCsvPreview handles UTF-8 BOM, semicolon delimiter, quoted cells and row cap", () => {
  const csv = "\uFEFFNgày;\"Nội dung\";Số tiền\n25/11/2026;\"Cà phê; sáng\";45000\n26/11/2026;Ăn trưa;55000\n27/11/2026;Xăng xe;100000";
  const preview = parseCsvPreview(csv, 2);
  assert.deepEqual(preview.headers, ["Ngày", "Nội dung", "Số tiền"]);
  assert.equal(preview.rows.length, 2);
  assert.deepEqual(preview.rows[0], ["25/11/2026", "Cà phê; sáng", "45000"]);
});

test("parseCsvPreview handles tab-delimited rows", () => {
  const tsv = "date\tdescription\tamount\n2026-11-25\tLuong\t1000000";
  const preview = parseCsvPreview(tsv, 5);
  assert.deepEqual(preview.headers, ["date", "description", "amount"]);
  assert.deepEqual(preview.rows[0], ["2026-11-25", "Luong", "1000000"]);
});

test("CSV sample classifies expenses and income by signed amount", () => {
  const parsed = parseTransactionsCsv(buildSampleCsv());
  assert.deepEqual(
    parsed.rows.map(({ type, amount }) => ({ type, amount })),
    [
      { type: "expense", amount: 45_000 },
      { type: "expense", amount: 125_000 },
      { type: "income", amount: 5_000_000 },
    ]
  );
  assert.equal(parsed.errors.length, 0);
});

test("isCsvFile accepts CSV extensions case-insensitively", () => {
  assert.equal(isCsvFile({ name: "statement.csv" }), true);
  assert.equal(isCsvFile({ name: "statement.CSV" }), true);
  assert.equal(isCsvFile({ name: "statement.xlsx" }), false);
});

test("summarizeTransactions computes income, expense, net and category breakdown", () => {
  const summary = summarizeTransactions(SAMPLE_ITEMS);
  assert.equal(summary.totalIncome, 18000000);
  assert.equal(summary.totalExpense, 500000);
  assert.equal(summary.netBalance, 17500000);
  assert.equal(summary.transactionCount, 4);
  assert.equal(summary.expenseByCategory.length, 2);
  assert.equal(summary.expenseByCategory[0].slug, "uncategorized");
  assert.equal(summary.expenseByCategory[0].amount, 300000);
  assert.equal(summary.expenseByCategory[1].slug, "food");
  assert.equal(summary.expenseByCategory[1].amount, 200000);
});

test("fetchAllTransactionsForDashboard fetches every page when there are more than 1,000 transactions", async () => {
  const originalFetch = globalThis.fetch;
  const requestedPages: number[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input), "http://localhost");
    const page = Number(url.searchParams.get("page"));
    requestedPages.push(page);

    const items: TransactionItem[] = Array.from({ length: 100 }, (_, index) => ({
      id: `${page}-${index}`,
      date: "2026-11-28T00:00:00.000Z",
      amount: 1,
      type: "expense",
      description: "Giao dịch kiểm tra phân trang",
      category: null,
    }));

    return new Response(JSON.stringify({ items, total: 1_100, page, limit: 100 }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const items = await fetchAllTransactionsForDashboard();
    assert.equal(items.length, 1_100);
    assert.equal(requestedPages.length, 11);
    assert.equal(requestedPages.at(-1), 11);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
