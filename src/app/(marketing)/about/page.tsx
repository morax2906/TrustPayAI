import { BackToHomeLink } from "@/components/marketing/BackToHomeLink";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackToHomeLink />
      <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-primary">TrustPay AI</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy sm:text-5xl">Về chúng tôi</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Nội dung giới thiệu về dự án sẽ được bổ sung tại đây.</p>
      </div>
    </div>
  );
}
