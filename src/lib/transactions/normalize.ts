/** Pure helpers to normalize CSV cells. No I/O. */

export const MAX_AMOUNT_VND = 2_000_000_000; // Postgres Int is 32-bit.

export function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function normalizeHeader(s: string): string {
  return stripDiacritics(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function cleanDescription(s: string): string {
  return s.replace(/\s+/g, " ").trim().slice(0, 500);
}

/** Key used for dedup: case-insensitive, whitespace-insensitive. */
export function descriptionKey(s: string): string {
  return cleanDescription(s).toLowerCase();
}

/**
 * Parses VND amounts such as "1.234.567", "1,234,567", "-50000", "(50.000)", "50.000 đ".
 * A trailing group of exactly 3 digits is a thousands separator; 1-2 digits is a decimal part.
 * Returns a signed rounded integer, or null when the value cannot be parsed.
 */
export function parseAmount(raw: string): number | null {
  let s = raw.toLowerCase().replace(/[\s\u00a0]/g, "");
  if (!s) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  s = s.replace(/(vnd|vnđ|đ|₫)$/, "");
  if (s.startsWith("-")) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }
  if (!/^\d[\d.,]*$/.test(s)) return null;

  const last = Math.max(s.lastIndexOf("."), s.lastIndexOf(","));
  let value: number;
  if (last === -1) {
    value = Number(s);
  } else {
    const tail = s.slice(last + 1);
    if (tail.length === 3) {
      value = Number(s.replace(/[.,]/g, ""));
    } else if (tail.length >= 1 && tail.length <= 2) {
      value = Number(`${s.slice(0, last).replace(/[.,]/g, "")}.${tail}`);
    } else {
      return null;
    }
  }
  if (!Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  return negative ? -rounded : rounded;
}

/** Parses yyyy-MM-dd or dd/MM/yyyy (also "-" and "." separators). Time part is ignored. UTC midnight. */
export function parseDate(raw: string): Date | null {
  const s = raw.trim();
  let y: number, m: number, d: number;
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/.exec(s);
  if (match) {
    y = Number(match[1]);
    m = Number(match[2]);
    d = Number(match[3]);
  } else {
    match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:[T\s].*)?$/.exec(s);
    if (!match) return null;
    d = Number(match[1]);
    m = Number(match[2]);
    y = Number(match[3]);
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null;
  }
  if (y < 2000 || y > new Date().getUTCFullYear() + 1) return null;
  return date;
}
