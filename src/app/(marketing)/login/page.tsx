import Link from "next/link";
import { BackToHomeLink } from "@/components/marketing/back-to-home-link";

export default function LoginPlaceholderPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <BackToHomeLink />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Đăng nhập / Dùng thử</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Khu vực đăng nhập và tài khoản demo sẽ sẵn sàng trong bước tiếp theo.</p>
        <Link href="/how-to-try" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">Xem cách dùng</Link>
      </div>
    </div>
  );
}
