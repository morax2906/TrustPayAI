import { levelFromScore, type AnalyzeRequest, type AnalyzeResponse, type Signal } from "./schema";

/**
 * Deterministic, offline risk engine. Used as the fallback when Bedrock is unavailable,
 * and as the only engine until the Haiku layer is added. Never calls the network.
 */

type Rule = { code: string; label: string; weight: number; pattern: RegExp };

// Patterns run on accent-stripped lowercase text ("d" for "đ"), so they match with or without diacritics.
const TEXT_RULES: Rule[] = [
  {
    code: "otp_request",
    label: "Yêu cầu cung cấp mã OTP / mã xác thực",
    weight: 35,
    pattern: /\b(otp|ma xac thuc|ma xac nhan|ma bao mat)\b/,
  },
  {
    code: "credential_request",
    label: "Yêu cầu mật khẩu, mã PIN hoặc thông tin thẻ",
    weight: 30,
    pattern: /(mat khau|ma pin|\bcvv\b|so the\b|thong tin the|dang nhap lai|xac minh tai khoan)/,
  },
  {
    code: "urgency",
    label: "Tạo áp lực phải hành động gấp",
    weight: 20,
    pattern:
      /(khan cap|ngay lap tuc|trong vong \d+ ?(gio|h|phut)|bi khoa|tam khoa|se bi khoa|het han|cang som cang tot|urgent|immediately)/,
  },
  {
    code: "prize_bait",
    label: "Dụ nhận thưởng / quà tặng",
    weight: 25,
    pattern: /(trung thuong|nhan qua|qua tang mien phi|hoan tien|nhan ngay \d|voucher mien phi)/,
  },
  {
    code: "authority_impersonation",
    label: "Mạo danh cơ quan chức năng hoặc ngân hàng",
    weight: 25,
    pattern: /(cong an|vien kiem sat|toa an|co quan dieu tra|bo cong an|lenh bat|nhan vien ngan hang)/,
  },
  {
    code: "transfer_request",
    label: "Yêu cầu chuyển tiền / đặt cọc",
    weight: 15,
    pattern: /(chuyen khoan|chuyen tien|dat coc|nop phi|phi xu ly|dong phi)/,
  },
  {
    code: "prompt_injection",
    label: "Nội dung chứa lệnh cố điều khiển hệ thống phân tích",
    weight: 25,
    pattern:
      /(ignore (all |the )?(previous|above|prior) (instructions|prompts?)|disregard (the )?(previous|above)|system prompt|bo qua (moi |cac )?(huong dan|chi dan|lenh)|danh gia (la )?an toan|mark (this )?as safe)/,
  },
];

const BAD_TLDS = new Set(["xyz", "top", "click", "icu", "vip", "work", "buzz", "cfd", "sbs", "rest", "cyou", "monster", "zip", "mov"]);
const SHORTENERS = new Set(["bit.ly", "tinyurl.com", "cutt.ly", "t.ly", "rebrand.ly", "is.gd", "shorturl.at", "tiny.cc", "rb.gy", "s.id"]);

const BRANDS: Record<string, string[]> = {
  momo: ["momo.vn", "mservice.com.vn"],
  zalopay: ["zalopay.vn"],
  vnpay: ["vnpay.vn"],
  vietcombank: ["vietcombank.com.vn", "vietcombank.com"],
  techcombank: ["techcombank.com", "techcombank.com.vn"],
  bidv: ["bidv.com.vn"],
  mbbank: ["mbbank.com.vn"],
  vietinbank: ["vietinbank.vn"],
  agribank: ["agribank.com.vn"],
  tpbank: ["tpb.vn", "tpbank.com.vn"],
  vpbank: ["vpbank.com.vn"],
  shopee: ["shopee.vn", "shopee.com"],
};

type Mapped = { text: string; map: number[] };

/** Accent-stripped lowercase copy of `s`, with an index map back to the original string. */
function fold(s: string): Mapped {
  const nfc = s.normalize("NFC");
  let text = "";
  const map: number[] = [];
  for (let i = 0; i < nfc.length; i++) {
    const folded = nfc[i]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d")
      .toLowerCase();
    for (const ch of folded) {
      text += ch;
      map.push(i);
    }
  }
  return { text, map };
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function isOfficial(host: string, domains: string[]): boolean {
  return domains.some((d) => host === d || host.endsWith(`.${d}`));
}

function findBrandImpersonation(host: string): string | null {
  const squashed = host.replace(/rn/g, "m").replace(/0/g, "o").replace(/[1|]/g, "l");
  const labels = squashed.split(/[.\-]/).filter(Boolean);
  for (const [brand, domains] of Object.entries(BRANDS)) {
    if (isOfficial(host, domains)) continue;
    const hit =
      squashed.replace(/[.\-]/g, "").includes(brand) ||
      (brand.length >= 6 && labels.some((l) => l !== brand && Math.abs(l.length - brand.length) <= 1 && levenshtein(l, brand) === 1));
    if (hit) return brand;
  }
  return null;
}

const URL_IN_TEXT = /(?:https?:\/\/|www\.)[^\s<>"')]+|\b(?:[a-z0-9-]+\.)+[a-z]{2,10}(?:\/[^\s<>"')]*)?/gi;

function extractUrls(req: AnalyzeRequest): string[] {
  if (req.type === "url") return [req.content.trim()];
  const found = req.content.match(URL_IN_TEXT) ?? [];
  return Array.from(new Set(found.map((u) => u.replace(/[.,;:!?]+$/, "")))).slice(0, 5);
}

function urlSignals(raw: string): Array<Signal & { weight: number }> {
  const out: Array<Signal & { weight: number }> = [];
  let u: URL;
  try {
    u = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return out;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return out;
  const host = u.hostname.toLowerCase();
  const add = (code: string, label: string, weight: number, evidence: string) =>
    out.push({ code, label, weight, evidence: evidence.slice(0, 500) });

  if (host.includes("xn--")) add("punycode_domain", "Tên miền dùng ký tự giả mạo (punycode)", 35, `Tên miền: ${host}`);
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add("ip_host", "Liên kết trỏ thẳng tới địa chỉ IP", 35, `Địa chỉ: ${host}`);
  if (u.username) add("userinfo_in_url", "Liên kết chứa '@' để đánh lạc hướng tên miền", 30, raw);
  if (SHORTENERS.has(host)) add("url_shortener", "Liên kết rút gọn, không thấy đích thật", 15, `Dịch vụ rút gọn: ${host}`);
  const tld = host.split(".").pop() ?? "";
  if (BAD_TLDS.has(tld)) add("bad_tld", "Đuôi tên miền hay bị lạm dụng cho lừa đảo", 20, `Đuôi .${tld} trong ${host}`);
  const brand = findBrandImpersonation(host);
  if (brand) add("brand_impersonation", `Tên miền giống thương hiệu "${brand}" nhưng không phải tên miền chính thức`, 55, `Tên miền: ${host}`);
  if (u.protocol === "http:") add("no_https", "Liên kết không dùng HTTPS", 10, raw);
  return out;
}

function recommendationFor(level: AnalyzeResponse["level"], preTransfer: boolean): string {
  if (level === "high") {
    return preTransfer
      ? "Không chuyển tiền. Nhiều dấu hiệu lừa đảo. Hãy tự liên hệ tổ chức liên quan qua kênh chính thức trước khi làm gì tiếp."
      : "Không bấm liên kết, không cung cấp OTP hay mật khẩu. Liên hệ tổ chức liên quan qua kênh chính thức để xác minh.";
  }
  if (level === "caution") {
    return preTransfer
      ? "Tạm dừng chuyển tiền và xác minh người nhận qua kênh khác (gọi số chính thức) trước khi tiếp tục."
      : "Có dấu hiệu đáng ngờ. Hãy xác minh nguồn gửi qua kênh chính thức trước khi phản hồi hoặc bấm liên kết.";
  }
  return "Chưa phát hiện dấu hiệu rõ ràng, nhưng công cụ này không thể đảm bảo an toàn tuyệt đối. Vẫn nên xác minh người nhận trước khi chuyển tiền.";
}

export function analyzeHeuristic(req: AnalyzeRequest): AnalyzeResponse {
  const found: Array<Signal & { weight: number }> = [];
  const seen = new Set<string>();
  const push = (s: Signal & { weight: number }) => {
    if (seen.has(s.code)) return;
    seen.add(s.code);
    found.push(s);
  };

  // URL scans only look at the URL itself; text rules apply to messages and pasted image text.
  if (req.type !== "url") {
    const { text, map } = fold(req.content);
    const original = req.content.normalize("NFC");
    for (const rule of TEXT_RULES) {
      const m = rule.pattern.exec(text);
      if (!m) continue;
      const start = map[m.index];
      const end = map[Math.min(m.index + m[0].length - 1, map.length - 1)] + 1;
      push({ code: rule.code, label: rule.label, weight: rule.weight, evidence: original.slice(start, end).slice(0, 500) });
    }
  }
  for (const url of extractUrls(req)) for (const s of urlSignals(url)) push(s);

  const preTransfer = req.context === "pre_transfer";
  if (preTransfer && found.length > 0) {
    push({
      code: "pre_transfer_context",
      label: "Đang chuẩn bị chuyển tiền trong khi có dấu hiệu đáng ngờ",
      weight: 10,
      evidence: "Ngữ cảnh: người dùng đang ở bước trước khi chuyển tiền",
    });
  }

  const score = Math.min(100, found.reduce((sum, s) => sum + s.weight, 0)) || 5;
  const level = levelFromScore(score);
  // Heuristics cannot prove safety, so confidence stays low without signals and never exceeds 0.85.
  const confidence = found.length === 0 ? 0.4 : Math.min(0.85, 0.5 + 0.1 * found.length);

  return {
    score,
    level,
    signals: found.map(({ code, label, evidence }) => ({ code, label, evidence })),
    recommendation: recommendationFor(level, preTransfer),
    confidence,
    model: "heuristic",
  };
}
