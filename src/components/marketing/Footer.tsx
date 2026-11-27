import Link from "next/link";
import { NAV_ITEMS } from "./nav-items";

export default function Footer() {
  return (
    <footer className="border-t border-fuchsia-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="text-lg font-bold text-fuchsia-700">TrustPay AI</p>
            <p className="mt-1 text-sm italic text-slate-600">
              Think Before You Trust. Think Before You Pay.
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Sản phẩm dự thi. Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-slate-600 hover:text-fuchsia-700 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 text-xs text-slate-400">
          Viện dẫn: Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
        </p>
      </div>
    </footer>
  );
}
