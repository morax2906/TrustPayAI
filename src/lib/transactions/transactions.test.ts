import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDedupHashes } from "./dedup";
import { parseTransactionsCsv } from "./import-csv";
import { parseAmount, parseDate } from "./normalize";

test("parseAmount handles VN formats", () => {
  assert.equal(parseAmount("1.234.567"), 1234567);
  assert.equal(parseAmount("1,234,567"), 1234567);
  assert.equal(parseAmount("-50.000"), -50000);
  assert.equal(parseAmount("(50.000)"), -50000);
  assert.equal(parseAmount("50.000 đ"), 50000);
  assert.equal(parseAmount("1.234.567,5"), 1234568);
  assert.equal(parseAmount("abc"), null);
  assert.equal(parseAmount(""), null);
});

test("parseDate handles common formats and rejects invalid", () => {
  assert.equal(parseDate("2025-03-01")?.toISOString(), "2025-03-01T00:00:00.000Z");
  assert.equal(parseDate("01/03/2025")?.toISOString(), "2025-03-01T00:00:00.000Z");
  assert.equal(parseDate("31/02/2025"), null);
  assert.equal(parseDate("hello"), null);
});

test("single amount column with BOM and semicolons", () => {
  const csv = "\uFEFFNgày;Nội dung;Số tiền\n01/03/2025;Cà phê;-45.000\n02/03/2025;Lương;15.000.000\n";
  const r = parseTransactionsCsv(csv);
  assert.equal(r.errors.length, 0);
  assert.deepEqual(
    r.rows.map((x) => [x.type, x.amount]),
    [["expense", 45000], ["income", 15000000]]
  );
});

test("debit/credit columns, quoted cells, bad rows reported", () => {
  const csv = [
    "Ngày giao dịch,Diễn giải,Ghi nợ,Ghi có",
    '01/03/2025,"Chuyển, tiền ăn",100.000,',
    "02/03/2025,Hoàn tiền,,20.000",
    "xx,Lỗi ngày,1,",
  ].join("\n");
  const r = parseTransactionsCsv(csv);
  assert.equal(r.rows.length, 2);
  assert.equal(r.rows[0].description, "Chuyển, tiền ăn");
  assert.equal(r.rows[1].type, "income");
  assert.equal(r.errors.length, 1);
});

test("unknown header throws", () => {
  assert.throws(() => parseTransactionsCsv("a,b,c\n1,2,3"));
});

test("dedup: identical rows in one batch get distinct hashes, re-run is stable", () => {
  const row = { date: new Date("2025-03-01T00:00:00Z"), type: "expense" as const, amount: 45000, description: "Cà phê" };
  const a = buildDedupHashes([row, row]);
  const b = buildDedupHashes([row, row]);
  assert.notEqual(a[0], a[1]);
  assert.deepEqual(a, b);
});
