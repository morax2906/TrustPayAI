import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const navLinks = [
  { href: "/how-to-try", label: "Cách dùng" },
  { href: "/about", label: "Về TrustPay" },
  { href: "/privacy", label: "Quyền riêng tư" },
];

function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-white">
        <ShieldCheck aria-hidden="true" className="size-5" />
      </span>
      <span className="text-base font-bold tracking-tight text-navy">
        TrustPay <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}

function TrialLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/login"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      Đăng nhập / Dùng thử
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand />
          <nav aria-label="Điều hướng chính" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <TrialLink className="hidden sm:inline-flex" />
        </div>
        <nav aria-label="Điều hướng chính trên thiết bị nhỏ" className="flex gap-3 overflow-x-auto border-t border-border/70 px-3 py-3.5 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="shrink-0 text-xs font-semibold text-primary sm:hidden">
            Dùng thử →
          </Link>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <Brand />
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Công cụ hỗ trợ nhận diện tín hiệu rủi ro để bạn cân nhắc trước khi tin hoặc chuyển tiền.
            </p>
          </div>
          <nav aria-label="Liên kết cuối trang" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-border/70 px-4 py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TrustPay AI. Cân nhắc kỹ trước mỗi giao dịch.
        </div>
      </footer>
    </div>
  );
}
