import { LockKeyhole } from "lucide-react";
import { BackToHomeLink } from "@/components/marketing/BackToHomeLink";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackToHomeLink />
      <div className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary"><LockKeyhole aria-hidden="true" className="size-6" /></div>
        <p className="mt-6 text-sm font-semibold text-primary">Quyền riêng tư</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-navy sm:text-5xl">Chính sách bảo vệ dữ liệu cá nhân</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Nội dung chính sách đầy đủ sẽ được bổ sung trước khi mở chức năng tạo tài khoản.</p>
      </div>
    </div>
  );
}
