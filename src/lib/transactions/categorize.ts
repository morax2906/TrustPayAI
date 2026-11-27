import { stripDiacritics } from "./normalize";

export type CategorySlug =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "education"
  | "transfer"
  | "income"
  | "other";

// Order matters: the first matching rule wins. Patterns run on accent-stripped lowercase text.
const RULES: Array<{ slug: CategorySlug; pattern: RegExp }> = [
  {
    slug: "transfer",
    pattern: /\b(chuyen khoan|chuyen tien|ck|nap tien|rut tien|atm|ngan hang|sao ke|gui tiet kiem)\b/,
  },
  {
    slug: "bills",
    pattern: /\b(tien dien|tien nuoc|dien luc|evn|internet|wifi|fpt|viettel|vnpt|mobifone|vinaphone|cuoc|hoa don|tien nha|thue nha|tien tro|phi chung cu|bao hiem)\b/,
  },
  {
    slug: "transport",
    pattern: /\b(grab|gojek|xanh sm|taxi|xe om|xang|do xang|petrolimex|ve xe|ve tau|ve may bay|vietjet|vietnam airlines|bamboo|gui xe|parking|phi cau duong)\b/,
  },
  {
    slug: "food",
    pattern: /\b(an sang|an trua|an toi|an uong|com tam|com ga|com van phong|com binh dan|pho|bun|banh mi|tra sua|ca phe|cafe|coffee|highlands|starbucks|trung nguyen|phuc long|the coffee house|kfc|lotteria|jollibee|pizza|nha hang|quan an|grabfood|shopeefood|befood|bach hoa xanh|winmart|coopmart|co\.?opmart|circle k|ministop|7-eleven|gs25|sieu thi)\b/,
  },
  {
    slug: "health",
    pattern: /\b(benh vien|phong kham|nha thuoc|thuoc|pharmacity|long chau|kham benh|xet nghiem|nha khoa|gym|yoga|bao hiem y te)\b/,
  },
  {
    slug: "education",
    pattern: /\b(hoc phi|khoa hoc|sach|udemy|coursera|tieng anh|ielts|truong|lop hoc|gia su)\b/,
  },
  {
    slug: "entertainment",
    pattern: /\b(netflix|spotify|youtube|disney|cgv|lotte cinema|galaxy cinema|rap phim|xem phim|game|steam|karaoke|du lich|khach san|resort|booking|agoda|traveloka|ve concert)\b/,
  },
  {
    slug: "shopping",
    pattern: /\b(shopee|lazada|tiki|sendo|tiktok shop|mua sam|quan ao|giay dep|thoi trang|the gioi di dong|dien may xanh|fpt shop|cellphones|uniqlo|zara|h&m)\b/,
  },
];

/**
 * Rule-based category by keywords. Returns null when nothing matches, so the row stays
 * uncategorized instead of being labeled with a guess. Income rows are always "income".
 */
export function categorizeByRules(description: string, type: "income" | "expense"): CategorySlug | null {
  if (type === "income") return "income";
  const text = stripDiacritics(description).toLowerCase();
  for (const rule of RULES) if (rule.pattern.test(text)) return rule.slug;
  return null;
}
