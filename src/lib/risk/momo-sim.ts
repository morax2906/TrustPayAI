import type { AnalyzeRequest } from "./schema";

export type PreTransferFormRaw = {
  recipient: string;
  amount: string;
  note: string;
};

export type PreTransferResult =
  | { ok: true; payload: AnalyzeRequest; amountNum: number }
  | { ok: false; error: string };

export const MOMO_SCENARIOS: Array<{
  id: string;
  label: string;
  tone: "scam" | "safe";
  data: PreTransferFormRaw;
}> = [
  {
    id: "momo-scam",
    label: "Kịch bản nghi lừa đảo",
    tone: "scam",
    data: {
      recipient: "0988777666 - Bộ phận hỗ trợ hoàn tiền",
      amount: "2500000",
      note: "Chuyển tiền đặt cọc phí xử lý gấp trong 30 phút để nhận hoàn tiền tại https://m0m0.vn.xyz/hoan-tien",
    },
  },
  {
    id: "momo-safe",
    label: "Kịch bản chuyển bạn bè",
    tone: "safe",
    data: {
      recipient: "0912345678 - Trần Minh Khôi",
      amount: "120000",
      note: "Tiền ăn trưa hôm nay",
    },
  },
];

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(amount)} đ`;
}

export function buildPreTransferPayload(raw: PreTransferFormRaw): PreTransferResult {
  const recipient = raw.recipient.trim();
  if (!recipient) {
    return { ok: false, error: "Vui lòng nhập tên hoặc số điện thoại người nhận." };
  }

  const normalizedDigits = raw.amount.replace(/[.,\s_]/g, "");
  const amountNum = Number(normalizedDigits);
  if (!Number.isFinite(amountNum) || !Number.isInteger(amountNum) || amountNum <= 0) {
    return { ok: false, error: "Vui lòng nhập số tiền hợp lệ (lớn hơn 0 VND)." };
  }

  const note = raw.note.trim();
  const lines = [`Chuyển ${formatVnd(amountNum)} đến ${recipient}.`];
  if (note) {
    lines.push(`Nội dung kèm theo: ${note}`);
  }

  return {
    ok: true,
    amountNum,
    payload: {
      type: "message",
      content: lines.join("\n").slice(0, 5000),
      context: "pre_transfer",
    },
  };
}
