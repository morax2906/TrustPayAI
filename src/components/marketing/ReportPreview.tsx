import RiskBadge from "./RiskBadge";

const SIGNALS = [
  {
    code: "urgency",
    label: "Tạo áp lực thời gian",
    evidence: "“sẽ bị khóa trong vòng 24h”",
  },
  {
    code: "credential_request",
    label: "Yêu cầu đăng nhập qua liên kết lạ",
    evidence: "“đăng nhập tại http://vcb-xacthuc.top”",
  },
] as const;

/** Static, illustrative example of an explainable report. Not live output. */
export default function ReportPreview() {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <figcaption className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Ví dụ báo cáo (minh họa)</span>
        <span>Quét tin nhắn</span>
      </figcaption>

      <blockquote className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        [Vietcombank] Tài khoản của quý khách sẽ bị khóa trong vòng 24h. Vui lòng đăng nhập tại
        http://vcb-xacthuc.top để xác minh tài khoản.
      </blockquote>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <RiskBadge level="high" />
        <span className="text-sm text-slate-600">
          Điểm rủi ro <strong className="text-red-700">85/100</strong> · Độ tin cậy <strong>0,9</strong>
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {SIGNALS.map((s) => (
          <li key={s.code} className="rounded-lg border border-red-100 bg-red-50/60 p-3 text-sm">
            <p className="font-semibold text-red-800">{s.label}</p>
            <p className="mt-0.5 text-slate-600">
              Bằng chứng: <span className="italic">{s.evidence}</span>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
        <strong>Khuyến nghị:</strong> Không bấm liên kết. Mở ứng dụng ngân hàng chính thức để kiểm tra.
      </p>
    </figure>
  );
}
