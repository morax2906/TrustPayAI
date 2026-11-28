import type { AnalyzeRequest, AnalyzeResponse, Level } from "./schema";

export type ScanType = AnalyzeRequest["type"];

export type ScanHistoryItem = {
  id: string;
  createdAt: string;
  request: AnalyzeRequest;
  response: AnalyzeResponse;
};

export type ScanPreset = {
  id: string;
  label: string;
  type: ScanType;
  content: string;
  tone: "scam" | "safe";
};

export const SCAN_PRESETS: ScanPreset[] = [
  {
    id: "sms-scam-bank",
    label: "SMS giả mạo ngân hàng",
    type: "message",
    tone: "scam",
    content:
      "THÔNG BÁO KHẨN: Tài khoản ngân hàng của bạn sẽ bị khóa trong vòng 2 giờ. Truy cập https://vietcombamk.com/xac-thuc và gửi mã OTP ngay lập tức để mở khóa.",
  },
  {
    id: "sms-safe-lunch",
    label: "Tin nhắn bạn bè bình thường",
    type: "message",
    tone: "safe",
    content: "Mình đã chuyển khoản tiền ăn trưa hôm nay cho bạn rồi nhé, rảnh kiểm tra giúp mình nha.",
  },
  {
    id: "url-scam-momo",
    label: "Link giả mạo ví MoMo",
    type: "url",
    tone: "scam",
    content: "https://m0m0.vn.xyz/login",
  },
  {
    id: "url-safe-momo",
    label: "Link chính thức MoMo",
    type: "url",
    tone: "safe",
    content: "https://momo.vn",
  },
  {
    id: "img-scam-bidv",
    label: "Chữ từ ảnh chụp giả mạo",
    type: "image_text",
    tone: "scam",
    content:
      "Cảnh báo: Tài khoản BIDV phát hiện đăng nhập lạ. Vui lòng nhập mật khẩu, số thẻ và mã CVV tại bidv-vn.xyz để xác minh tài khoản.",
  },
  {
    id: "img-safe-receipt",
    label: "Biên lai giao dịch sạch",
    type: "image_text",
    tone: "safe",
    content: "Chuyển tiền thành công 150.000đ cho Nguyễn Minh Anh. Nội dung: Tiền cà phê sáng.",
  },
];

export function getLevelPresentation(level: Level): {
  label: string;
  variant: "safe" | "caution" | "high";
  barClass: string;
} {
  switch (level) {
    case "high":
      return {
        label: "Nguy cơ cao",
        variant: "high",
        barClass: "bg-risk-high",
      };
    case "caution":
      return {
        label: "Cần cẩn trọng",
        variant: "caution",
        barClass: "bg-risk-caution",
      };
    case "safe":
      return {
        label: "Chưa thấy dấu hiệu rủi ro rõ ràng",
        variant: "safe",
        barClass: "bg-risk-safe",
      };
  }
}

export function mapAnalyzeError(status: number, errorCode?: string): string {
  if (status === 429 || errorCode === "rate_limited") {
    return "Bạn đã dùng hết 30 lượt quét trong ngày hôm nay. Vui lòng quay lại vào ngày mai (theo giờ Việt Nam).";
  }
  if (status === 401 || errorCode === "unauthorized") {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }
  if (status === 400 || errorCode === "invalid_input" || errorCode === "invalid_json") {
    return "Nội dung cần kiểm tra chưa hợp lệ (không được để trống và tối đa 5.000 ký tự).";
  }
  return "Không thể phân tích lúc này. Vui lòng thử lại sau.";
}

export class AnalyzeRequestError extends Error {
  constructor(readonly kind: "api" | "network", message: string) {
    super(message);
    this.name = "AnalyzeRequestError";
  }
}

export async function requestRiskAnalysis(
  request: AnalyzeRequest,
  networkErrorMessage: string
): Promise<AnalyzeResponse> {
  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new AnalyzeRequestError("network", networkErrorMessage);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new AnalyzeRequestError("api", mapAnalyzeError(response.status, body?.error));
  }

  try {
    return (await response.json()) as AnalyzeResponse;
  } catch {
    throw new AnalyzeRequestError("network", networkErrorMessage);
  }
}

export function appendScanHistory(
  existing: ScanHistoryItem[],
  item: ScanHistoryItem,
  maxItems = 10
): ScanHistoryItem[] {
  return [item, ...existing].slice(0, maxItems);
}
