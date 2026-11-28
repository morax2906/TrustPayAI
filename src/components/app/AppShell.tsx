"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  ScanSearch,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const APP_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Tổng quan", icon: LayoutDashboard },
  { href: "/scan", label: "Quét lừa đảo", shortLabel: "Quét rủi ro", icon: ScanSearch },
  { href: "/mock-momo", label: "Mô phỏng MoMo", shortLabel: "MoMo", icon: Smartphone },
  { href: "/transactions", label: "Giao dịch", shortLabel: "Giao dịch", icon: ArrowLeftRight },
] as const;

type AppShellProps = {
  user: {
    email?: string | null;
    name?: string | null;
  };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = React.useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  const displayName = user.name || user.email || "Người dùng";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:self-start md:flex-col md:border-r md:border-border md:bg-card">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="flex size-9 items-center justify-center rounded-xl bg-navy text-white">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-navy">
              TrustPay <span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Điều hướng ứng dụng" className="flex-1 space-y-1 p-3">
          {APP_NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-lg bg-muted/60 px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            {user.email && user.name && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start"
            disabled={signingOut}
            onClick={() => void handleSignOut()}
          >
            <LogOut aria-hidden="true" className="size-4" />
            {signingOut ? "Đang đăng xuất..." : "Đăng xuất"}
          </Button>
        </div>
      </aside>

      {/* Main Content + Mobile Header/Bottom Nav */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-white">
              <ShieldCheck aria-hidden="true" className="size-4" />
            </span>
            <span className="text-sm font-bold text-navy">
              TrustPay <span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="max-w-[140px] truncate text-xs font-medium text-muted-foreground">
              {displayName}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
              aria-label="Đăng xuất"
            >
              <LogOut aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 md:px-8 md:pb-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>

        <nav
          aria-label="Điều hướng di động"
          className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur md:hidden"
        >
          {APP_NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span className="truncate">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
