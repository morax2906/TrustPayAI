/** Minimal RFC 4180 CSV parser. Handles BOM, quoted cells, and `,` `;` tab delimiters. */

function detectDelimiter(firstLine: string): string {
  const candidates = [",", ";", "\t"];
  let best = ",";
  let bestCount = -1;
  for (const c of candidates) {
    let count = 0;
    let inQuotes = false;
    for (const ch of firstLine) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === c && !inQuotes) count++;
    }
    if (count > bestCount) {
      best = c;
      bestCount = count;
    }
  }
  return best;
}

export function parseCsvText(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = detectDelimiter(firstLine);

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    if (row.some((c) => c.trim() !== "")) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      endCell();
    } else if (ch === "\n") {
      endRow();
    } else if (ch === "\r") {
      // ignore, handled by \n
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) endRow();
  return rows;
}
