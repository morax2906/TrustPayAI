import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent))_0,_transparent_45%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <Badge variant="safe" className="border px-3 py-1.5 text-xs">TrustPay AI · Giới thiệu</Badge>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Kiểm tra trước khi tin. <span className="text-primary">Cân nhắc trước khi chuyển tiền.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              TrustPay AI hỗ trợ rà soát nội dung và tình huống tài chính đáng ngờ. Nội dung giới thiệu chi tiết sẽ được cập nhật.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Đăng nhập / Dùng thử
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="/how-to-try" className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Cách dùng
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">Công cụ hỗ trợ cân nhắc; quyết định cuối cùng thuộc về bạn.</p>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div aria-hidden="true" className="absolute -left-6 top-10 size-24 rounded-full bg-risk-safe-bg blur-2xl" />
            <div aria-hidden="true" className="absolute -right-3 bottom-4 size-32 rounded-full bg-accent blur-2xl" />
            <div className="relative rounded-[2rem] border border-border/80 bg-card p-6 shadow-xl shadow-navy/10 sm:p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <ShieldCheck aria-hidden="true" className="size-6" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-primary">Khu vực minh họa</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy">Báo cáo giải thích rủi ro</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Kết quả kiểm tra sẽ trình bày tín hiệu, bằng chứng và gợi ý để bạn tự cân nhắc.</p>
              <div className="mt-6 space-y-3 rounded-xl border border-border bg-background p-4" aria-hidden="true">
                <div className="h-2 w-2/3 rounded-full bg-muted" />
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-4/5 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-navy">Các khu vực trải nghiệm</p>
            <p className="mt-1 text-sm text-muted-foreground">Tin nhắn · Đường dẫn · Giao dịch mô phỏng · Tổng quan thu chi</p>
          </div>
          <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Về TrustPay AI <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
