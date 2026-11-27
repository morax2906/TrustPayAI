import type { Metadata } from "next";
import ButtonLink from "@/components/marketing/ButtonLink";
import Callout from "@/components/marketing/Callout";
import FeatureCard from "@/components/marketing/FeatureCard";
import PageHeader from "@/components/marketing/PageHeader";
import Section from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: "Giới thiệu – TrustPay AI",
  description: "TrustPay AI hoạt động thế nào: hai lớp đánh giá, báo cáo giải thích được, con người luôn quyết định.",
};

const API_EXAMPLE = `POST /api/analyze
{ "type": "message" | "url" | "image_text",
  "content": "...",
  "context": "pre_transfer" }

→ { "score": 0-100,
    "level": "safe" | "caution" | "high",
    "signals": [{ "code", "label", "evidence" }],
    "recommendation": "...",
    "confidence": 0-1,
    "model": "haiku" | "heuristic" }`;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Giới thiệu"
        title="Lớp tin cậy cho mọi lần bạn sắp tin và sắp trả tiền"
        description="Lừa đảo qua tin nhắn và liên kết giả ngày càng tinh vi. TrustPay AI giúp bạn dừng lại một nhịp, với lý do rõ ràng để quyết định."
      >
        <ButtonLink href="/thu-trong-60-giay">Thử trong 60 giây</ButtonLink>
      </PageHeader>

      <Section eyebrow="Vấn đề" title="Người dùng cần lý do, không chỉ cảnh báo">
        <p className="max-w-3xl leading-relaxed text-slate-600">
          Một cảnh báo chung chung dễ bị bỏ qua. TrustPay AI chỉ ra tín hiệu cụ thể và trích đúng đoạn văn bản
          liên quan, để bạn tự kiểm chứng và quyết định.
        </p>
      </Section>

      <Section
        tone="soft"
        eyebrow="Kiến trúc"
        title="Hai lớp đánh giá"
        intro="Kết quả không phụ thuộc vào một mô hình ngôn ngữ duy nhất."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard icon="⚙️" title="Lớp 1: Luật tất định">
            Kiểm tra theo quy tắc: tên miền giả mạo, đuôi tên miền đáng ngờ, địa chỉ IP trần, yêu cầu OTP, tạo áp lực
            thời gian, giả danh cơ quan chức năng, dụ trúng thưởng. Chạy được cả khi không có mạng hay AI.
          </FeatureCard>
          <FeatureCard icon="🧠" title="Lớp 2: Mô hình ngôn ngữ">
            Chỉ tổng hợp và giải thích các tín hiệu đã có, theo một định dạng JSON cố định. Đầu ra sai định dạng sẽ bị
            loại.
          </FeatureCard>
        </div>
      </Section>

      <Section eyebrow="Rào chắn" title="Cách hạn chế sai sót của AI">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout tone="info" title="Chống bịa đặt">
            Mỗi lý do phải gắn với một tín hiệu hoặc một đoạn trích từ nội dung gốc. Thiếu bằng chứng thì độ tin cậy
            giảm.
          </Callout>
          <Callout tone="info" title="Chống chèn lệnh (prompt injection)">
            Nội dung người dùng được coi là dữ liệu, đặt trong khung phân tách. Mọi chỉ dẫn nằm trong nội dung đều bị
            bỏ qua và được ghi nhận như một tín hiệu.
          </Callout>
          <Callout tone="info" title="Có phương án dự phòng">
            Nếu dịch vụ AI không phản hồi, hệ thống chuyển sang luật cục bộ để vẫn trả được kết quả.
          </Callout>
          <Callout tone="info" title="Đo bằng bộ mẫu có nhãn">
            Có bộ mẫu lừa đảo và mẫu sạch để đo precision và recall. Bộ mẫu do nhóm tự soạn nên chỉ là kiểm tra hồi
            quy, chưa phản ánh độ chính xác ngoài đời thực.
          </Callout>
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Con người quyết định"
        title="AI không bao giờ tự chuyển tiền"
        intro="TrustPay chỉ đưa ra cảnh báo và khuyến nghị. Bạn là người bấm xác nhận."
      >
        <Callout tone="warning" title="Về màn hình mô phỏng">
          Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản.
        </Callout>
      </Section>

      <Section eyebrow="Tích hợp" title="Trust Risk API" intro="Một điểm gọi duy nhất, có thể gắn vào bước trước khi chuyển tiền.">
        <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-5 text-xs leading-relaxed text-slate-100 sm:text-sm">
          <code>{API_EXAMPLE}</code>
        </pre>
        <p className="mt-3 text-sm text-slate-500">
          <code>image_text</code> là văn bản người dùng tự dán từ ảnh chụp. Hệ thống không tự nhận dạng chữ trong ảnh.
        </p>
      </Section>

      <Section tone="soft" eyebrow="Phạm vi" title="Giới hạn hiện tại và lộ trình">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-bold text-slate-900">Đã có trong bản này</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Quét tin nhắn và liên kết, báo cáo giải thích được</li>
              <li>Trust Risk API và màn hình mô phỏng trước khi chuyển tiền</li>
              <li>Nhập CSV, phân loại giao dịch, bảng tổng quan cơ bản</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Dành cho phiên bản sau (v2)</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Nhận dạng chữ trong ảnh (OCR)</li>
              <li>Cảnh báo ngân sách và chi tiêu bất thường</li>
              <li>Mục tiêu tiết kiệm, giao dịch định kỳ</li>
              <li>Theo dõi hộp thư và cảnh báo qua email</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Chat chỉ dành cho các câu hỏi đơn lượt về kết quả của một lần quét, không phải trợ lý tài chính đa năng.
        </p>
      </Section>
    </>
  );
}
