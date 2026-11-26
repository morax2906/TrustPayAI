import { parseCsvText } from "./csv";
import {
  MAX_AMOUNT_VND,
  cleanDescription,
  normalizeHeader,
  parseAmount,
  parseDate,
} from "./normalize";

export const MAX_IMPORT_BYTES = 1_000_000;
export const MAX_IMPORT_ROWS = 2000;

export type ParsedRow = {
  line: number;
  date: Date;
  type: "income" | "expense";
  amount: number;
  description: string;
};
export type RowError = { line: number; reason: string };
export type ParseResult = { rows: ParsedRow[]; errors: RowError[]; totalRows: number };

export class ImportFormatError extends Error {}

const ALIASES = {
  date: ["date", "ngay", "ngay giao dich", "ngay gd", "transaction date"],
  description: ["description", "noi dung", "noi dung giao dich", "dien giai", "mo ta", "details"],
  amount: ["amount", "so tien", "so tien giao dich"],
  debit: ["debit", "ghi no", "no", "rut ra", "chi", "so tien ghi no"],
  credit: ["credit", "ghi co", "co", "gui vao", "thu", "so tien ghi co"],
} as const;

type ColumnMap = { date: number; description: number; amount?: number; debit?: number; credit?: number };

function findColumn(headers: string[], names: readonly string[]): number | undefined {
  const i = headers.findIndex((h) => names.includes(h));
  return i === -1 ? undefined : i;
}

function mapHeader(cells: string[]): ColumnMap | null {
  const headers = cells.map(normalizeHeader);
  const date = findColumn(headers, ALIASES.date);
  const description = findColumn(headers, ALIASES.description);
  const amount = findColumn(headers, ALIASES.amount);
  const debit = findColumn(headers, ALIASES.debit);
  const credit = findColumn(headers, ALIASES.credit);
  if (date === undefined || description === undefined) return null;
  if (amount === undefined && (debit === undefined || credit === undefined)) return null;
  return { date, description, amount, debit, credit };
}

export function parseTransactionsCsv(text: string): ParseResult {
  const table = parseCsvText(text);

  // Some banks put a few lines of preamble before the header.
  let headerIndex = -1;
  let map: ColumnMap | null = null;
  for (let i = 0; i < Math.min(table.length, 10); i++) {
    map = mapHeader(table[i]);
    if (map) {
      headerIndex = i;
      break;
    }
  }
  if (!map) {
    throw new ImportFormatError(
      "Không nhận diện được cột. Cần các cột: ngày, nội dung, và số tiền (hoặc ghi nợ/ghi có)."
    );
  }

  const cols: ColumnMap = map;
  const dataRows = table.slice(headerIndex + 1);
  if (dataRows.length > MAX_IMPORT_ROWS) {
    throw new ImportFormatError(`Tệp có quá ${MAX_IMPORT_ROWS} dòng.`);
  }

  const rows: ParsedRow[] = [];
  const errors: RowError[] = [];

  dataRows.forEach((cells, idx) => {
    const line = headerIndex + idx + 2; // 1-based line number in the file (approximate for multi-line cells)
    const date = parseDate(cells[cols.date] ?? "");
    if (!date) return void errors.push({ line, reason: "Ngày không hợp lệ" });

    const description = cleanDescription(cells[cols.description] ?? "");
    if (!description) return void errors.push({ line, reason: "Thiếu nội dung" });

    let signed: number | null = null;
    if (cols.amount !== undefined) {
      const raw = (cells[cols.amount] ?? "").trim();
      signed = parseAmount(raw);
      if (signed === null) return void errors.push({ line, reason: "Số tiền không hợp lệ" });
    } else {
      const d = (cells[cols.debit as number] ?? "").trim();
      const c = (cells[cols.credit as number] ?? "").trim();
      const debit = d ? parseAmount(d) : 0;
      const credit = c ? parseAmount(c) : 0;
      if (debit === null || credit === null) {
        return void errors.push({ line, reason: "Số tiền không hợp lệ" });
      }
      if (Math.abs(debit) > 0 && Math.abs(credit) > 0) {
        return void errors.push({ line, reason: "Cả ghi nợ và ghi có đều có giá trị" });
      }
      signed = Math.abs(credit) > 0 ? Math.abs(credit) : -Math.abs(debit);
    }

    if (signed === 0) return void errors.push({ line, reason: "Số tiền bằng 0" });
    if (Math.abs(signed) > MAX_AMOUNT_VND) {
      return void errors.push({ line, reason: "Số tiền vượt quá giới hạn" });
    }

    rows.push({
      line,
      date,
      type: signed > 0 ? "income" : "expense",
      amount: Math.abs(signed),
      description,
    });
  });

  return { rows, errors, totalRows: dataRows.length };
}
