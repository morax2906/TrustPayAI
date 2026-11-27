import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToHomeLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft aria-hidden="true" className="size-4" /> Trang chủ
    </Link>
  );
}
