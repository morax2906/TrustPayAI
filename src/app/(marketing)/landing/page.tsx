import type { Metadata } from "next";
import ButtonLink from "@/components/marketing/ButtonLink";
import Callout from "@/components/marketing/Callout";
import FeatureCard from "@/components/marketing/FeatureCard";
import ReportPreview from "@/components/marketing/ReportPreview";
import Section from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: "TrustPay AI – Người bảo vệ tài chính cá nhân",
  description:
    "Quét tin nhắn và liên kết đáng ngờ trước khi bạn tin hoặc chuyển tiền. Báo cáo rủi ro giải thích được, có dẫn chứng.",
};

export default function LandingPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              Người bảo vệ tài chính cá nhân bằng AI
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-balance sm:text-5xl">
              Nghĩ kỹ trước khi tin.
              <br />
              Nghĩ kỹ trước khi chuyển tiền.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-pink-50">
              Dán một tin nhắn hoặc liên kết đáng ngờ. TrustPay AI cho bạn điểm rủi ro, nêu rõ tín hiệu nào và trích
              đúng đoạn nào khiến nó đáng ngờ.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/thu-trong-60-giay">Thử trong 60 giây</ButtonLink>
              <ButtonLink href="/gioi-thieu" variant="secondary">
                Cách hoạt động
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm italic text-pink-100">Think Before You Trust. Think Before You Pay.</p>
          </div>
          <ReportPreview />
        </div>
      </div>

      <Section
        eyebrow="Hai trụ cột"
        title="Bảo vệ tiền của bạn là trọng tâm"
        intro="Lớp tin cậy (Trust Layer) là sản phẩm chính. Phần quản lý chi tiêu chỉ đủ dùng để minh họa."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard icon="🛡️" title="Protect My Money" badge="Trọng tâm">
            Quét tin nhắn, liên kết và văn bản bạn dán từ ảnh chụp màn hình. Mỗi kết luận đều đi kèm báo cáo có thể
            kiểm chứng.
          </FeatureCard>
          <FeatureCard icon="📊" title="Manage My Money" badge="Minh họa">
            Nhập tệp CSV giao dịch, tự phân loại và xem bảng tổng quan thu chi theo danh mục.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Tính năng" title="Những gì bạn dùng được ngay">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon="💬" title="Quét tin nhắn">
            Phát hiện mạo danh ngân hàng, yêu cầu OTP, dụ trúng thưởng, giả danh cơ quan chức năng.
          </FeatureCard>
          <FeatureCard icon="🔗" title="Quét liên kết">
            Nhận ra tên miền giả mạo, đuôi tên miền đáng ngờ, địa chỉ IP trần và ký tự đánh lừa.
          </FeatureCard>
          <FeatureCard icon="🧾" title="Báo cáo giải thích được">
            Mỗi lý do nêu rõ tín hiệu và trích nguyên văn. Thiếu bằng chứng thì độ tin cậy giảm.
          </FeatureCard>
          <FeatureCard icon="🔌" title="Trust Risk API">
            Cùng một lớp đánh giá có thể gắn vào màn hình trước khi chuyển tiền của ví điện tử.
          </FeatureCard>
        </div>
      </Section>

      <Section eyebrow="Mức rủi ro" title="Kết quả luôn rõ ràng, không mơ hồ">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="font-bold text-green-800">An toàn</p>
            <p className="mt-1 text-sm text-green-900">Không thấy tín hiệu đáng ngờ trong nội dung đã quét.</p>
          </div>
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">
            <p className="font-bold text-yellow-800">Cần thận trọng</p>
            <p className="mt-1 text-sm text-yellow-900">Có tín hiệu cần kiểm tra thêm trước khi hành động.</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-bold text-red-800">Rủi ro cao</p>
            <p className="mt-1 text-sm text-red-900">Nhiều tín hiệu lừa đảo. Không bấm, không chuyển tiền.</p>
          </div>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Nguyên tắc" title="Bạn luôn là người quyết định">
        <div className="grid gap-4 md:grid-cols-3">
          <Callout tone="info" title="AI không chuyển tiền">
            TrustPay chỉ cảnh báo. Quyết định và thao tác chuyển tiền luôn do bạn thực hiện.
          </Callout>
          <Callout tone="info" title="Bạn kiểm soát dữ liệu">
            Chỉ xử lý khi bạn đồng ý, lưu tối thiểu, có thể thu hồi quyền.
          </Callout>
          <Callout tone="info" title="Không khẳng định quá mức">
            Ít bằng chứng thì độ tin cậy thấp. Hệ thống không bịa ra sự chắc chắn.
          </Callout>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/thu-trong-60-giay" variant="ghost">
            Xem cách thử trong 60 giây
          </ButtonLink>
          <ButtonLink href="/chinh-sach-du-lieu" variant="ghost">
            Chính sách dữ liệu
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
