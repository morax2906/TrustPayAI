import type { Metadata } from "next";
import ButtonLink from "@/components/marketing/ButtonLink";
import Callout from "@/components/marketing/Callout";
import PageHeader from "@/components/marketing/PageHeader";
import SampleBox from "@/components/marketing/SampleBox";
import Section from "@/components/marketing/Section";
import StepList, { type Step } from "@/components/marketing/StepList";

export const metadata: Metadata = {
  title: "Thử trong 60 giây – TrustPay AI",
  description: "Hướng dẫn dùng thử TrustPay AI với tài khoản demo và các mẫu có sẵn.",
};

const STEPS: Step[] = [
  {
    title: "Đăng nhập bằng tài khoản demo",
    seconds: 10,
    body: (
      <>
        Email <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800">demo@trustpay.ai</code>. Mật
        khẩu do nhóm cung cấp trong phần nộp bài.
      </>
    ),
  },
  {
    title: "Dán tin nhắn lừa đảo vào ô Quét tin nhắn",
    seconds: 15,
    body: "Chọn một mẫu bên dưới, sao chép và dán vào ô nhập, rồi bấm Quét.",
  },
  {
    title: "Đọc báo cáo giải thích được",
    seconds: 15,
    body: "Xem điểm rủi ro, mức độ, các tín hiệu và đoạn văn bản bị trích làm bằng chứng.",
  },
  {
    title: "Quét một liên kết đáng ngờ",
    seconds: 10,
    body: "Dán một liên kết mẫu vào ô Quét liên kết và so sánh với liên kết an toàn.",
  },
  {
    title: "Xem màn hình mô phỏng trước khi chuyển tiền",
    seconds: 10,
    body: "Màn hình mô phỏng ví điện tử gọi Trust Risk API và hiện cảnh báo trước bước xác nhận.",
  },
];

export default function TryIn60SecondsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dùng thử"
        title="Thử TrustPay AI trong 60 giây"
        description="Năm bước ngắn, dùng các mẫu có sẵn. Không cần dữ liệu thật của bạn."
      >
        <ButtonLink href="/about" variant="secondary">
          Tìm hiểu cách hoạt động
        </ButtonLink>
      </PageHeader>

      <Section eyebrow="Các bước" title="Làm theo thứ tự này">
        <StepList steps={STEPS} />
        <div className="mt-6">
          <Callout tone="warning" title="Lưu ý">
            Đừng dán dữ liệu thật như OTP, mật khẩu hay số thẻ khi dùng thử. Hãy dùng các mẫu bên dưới.
          </Callout>
        </div>
      </Section>

      <Section
        tone="soft"
        eyebrow="Mẫu để dán"
        title="Ba mẫu, ba kết quả khác nhau"
        intro="Nhãn bên phải là kết quả mong đợi, dùng để bạn đối chiếu."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <SampleBox
            kind="Tin nhắn mạo danh ngân hàng"
            expected="high"
            text="[Vietcombank] Tài khoản của quý khách sẽ bị khóa trong vòng 24h. Vui lòng đăng nhập tại http://vcb-xacthuc.top để xác minh tài khoản."
          />
          <SampleBox
            kind="Liên kết giả mạo ví"
            expected="high"
            text="https://secure.zalopay-hoantien.icu/"
          />
          <SampleBox
            kind="Tin nhắn bình thường"
            expected="safe"
            text="Chiều nay đi cà phê nhé, 4h gặp ở quán cũ."
          />
        </div>
      </Section>

      <Section eyebrow="Mô phỏng tích hợp" title="Màn hình trước khi chuyển tiền">
        <div className="mx-auto max-w-md rounded-3xl border-4 border-pink-200 bg-white p-5 shadow-xl">
          <p className="text-center text-sm font-semibold text-pink-600">Màn hình mô phỏng ví điện tử</p>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              Chuyển <strong>5.000.000đ</strong> tới <strong>NGUYEN VAN A</strong>
            </p>
            <p className="mt-1 text-slate-500">Nội dung: đóng học phí gấp</p>
          </div>
          <div className="mt-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
            <p className="font-bold">Cảnh báo từ TrustPay AI: cần thận trọng</p>
            <p className="mt-1">Nội dung tạo áp lực thời gian và yêu cầu chuyển tiền. Hãy gọi trực tiếp cho người thân để xác nhận.</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <span className="rounded-full bg-slate-200 py-2 text-center text-sm font-semibold text-slate-700">
              Quay lại
            </span>
            <span className="rounded-full bg-pink-600 py-2 text-center text-sm font-semibold text-white">
              Vẫn tiếp tục
            </span>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản.
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">Hình minh họa tĩnh, không phải kết quả quét thật.</p>
      </Section>
    </>
  );
}
