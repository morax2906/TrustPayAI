import type { Metadata } from "next";
import Callout from "@/components/marketing/Callout";
import PageHeader from "@/components/marketing/PageHeader";
import Section from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: "Chính sách dữ liệu – TrustPay AI",
  description: "Cách TrustPay AI thu thập, lưu trữ và bảo vệ dữ liệu cá nhân theo Nghị định 13/2023.",
};

const PRINCIPLES = [
  {
    title: "Đồng ý rõ ràng",
    body: "Bạn phải đồng ý một cách chủ động khi đăng ký. Chúng tôi không xử lý dữ liệu của bạn khi chưa có sự đồng ý đó.",
  },
  {
    title: "Thu hồi được",
    body: "Bạn có quyền rút lại sự đồng ý và yêu cầu ngừng xử lý dữ liệu của mình.",
  },
  {
    title: "Lưu trữ tối thiểu",
    body: "Với mỗi lần quét, chúng tôi lưu mã băm và một đoạn trích ngắn của nội dung, không lưu toàn văn.",
  },
  {
    title: "Có thể xóa",
    body: "Nội dung bạn đã dán và lịch sử quét thuộc về bạn, và có thể xóa theo yêu cầu.",
  },
  {
    title: "Không ghi nhật ký nội dung",
    body: "Nội dung quét và thông tin xác thực không được ghi vào nhật ký hệ thống.",
  },
  {
    title: "Không giữ tiền",
    body: "TrustPay không giữ tiền và không tự chuyển khoản. Màn hình trước khi chuyển tiền chỉ là mô phỏng.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chính sách dữ liệu"
        title="Dữ liệu của bạn thuộc về bạn"
        description="Trang này mô tả những gì TrustPay AI thu thập, vì sao, và bạn kiểm soát chúng thế nào. Căn cứ tham chiếu: Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân."
      />

      <Section eyebrow="Nguyên tắc" title="Sáu cam kết chính">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-2xl border border-fuchsia-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-fuchsia-800">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow="Chi tiết" title="Chúng tôi xử lý những dữ liệu nào">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-fuchsia-50 text-fuchsia-900">
              <tr>
                <th scope="col" className="px-4 py-3">Dữ liệu</th>
                <th scope="col" className="px-4 py-3">Mục đích</th>
                <th scope="col" className="px-4 py-3">Cách lưu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-4 py-3">Email, tên hiển thị</td>
                <td className="px-4 py-3">Đăng nhập và nhận diện tài khoản</td>
                <td className="px-4 py-3">Mật khẩu chỉ lưu dạng băm</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Nội dung bạn dán để quét</td>
                <td className="px-4 py-3">Đánh giá rủi ro và tạo báo cáo</td>
                <td className="px-4 py-3">Lưu mã băm và đoạn trích ngắn</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Giao dịch từ tệp CSV</td>
                <td className="px-4 py-3">Phân loại và hiển thị tổng quan thu chi</td>
                <td className="px-4 py-3">Chỉ người dùng đó truy cập được</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Lưu ý khi dùng" title="Bảo vệ chính bạn">
        <div className="grid gap-4 md:grid-cols-2">
          <Callout tone="warning" title="Đừng dán thông tin nhạy cảm">
            Không dán OTP, mật khẩu, số thẻ hay mã CVV vào bất kỳ ô nhập nào, kể cả của TrustPay.
          </Callout>
          <Callout tone="info" title="Xử lý bằng dịch vụ AI">
            Khi dịch vụ AI được bật, nội dung bạn quét có thể được gửi tới nhà cung cấp mô hình để phân tích. Khi dịch
            vụ không khả dụng, hệ thống dùng luật chạy cục bộ.
          </Callout>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Đây là chính sách của sản phẩm dự thi, không phải tư vấn pháp lý.
        </p>
      </Section>
    </>
  );
}
