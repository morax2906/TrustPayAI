import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackToHomeLink } from "@/components/marketing/BackToHomeLink";

export default function HowToTryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackToHomeLink />
      <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-primary">Dùng thử trong 60 giây</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy sm:text-5xl">Cách dùng TrustPay AI</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Hướng dẫn trải nghiệm nhanh sẽ được bổ sung tại đây.</p>
        <Link href="/login" className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          Đăng nhập / Dùng thử <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}
