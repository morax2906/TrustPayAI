"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  ScanSearch,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatVnd } from "@/lib/risk/momo-sim";
import {
  fetchAllTransactionsForDashboard,
  summarizeTransactions,
  type DashboardSummary,
} from "@/lib/transactions/client";

const CHART_COLORS = [
  "#0B7A75",
  "#152946",
  "#D97706",
  "#AE2070",
  "#2563EB",
  "#059669",
  "#7C3AED",
  "#DC2626",
  "#64748B",
];

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-8 w-36 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      </Card>
    </div>
  );
}

export function DashboardWorkspace() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadSummary = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchAllTransactionsForDashboard();
      setSummary(summarizeTransactions(items));
    } catch (e) {
      if (e instanceof Error && e.message === "unauthorized") {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải số liệu tổng quan. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Tổng quan tài chính</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi thu/chi cá nhân và truy cập nhanh lớp bảo vệ giao dịch TrustPay AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void loadSummary()} disabled={loading}>
            <RefreshCw aria-hidden="true" className="size-4" />
            Làm mới
          </Button>
          <Link
            href="/scan"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <ScanSearch aria-hidden="true" className="size-4" />
            Quét lừa đảo
          </Link>
          <Link
            href="/mock-momo"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-momo px-3 text-xs font-semibold text-momo-foreground shadow-sm hover:bg-momo/90"
          >
            <Smartphone aria-hidden="true" className="size-4" />
            Mô phỏng MoMo
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" className="size-4" />
          <AlertTitle>Không tải được dữ liệu</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadSummary()}>
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : summary && summary.transactionCount === 0 ? (
        <Card className="border-dashed border-border p-10 text-center">
          <Wallet aria-hidden="true" className="mx-auto size-10 text-muted-foreground/60" />
          <h2 className="mt-3 text-lg font-semibold text-navy">Chưa có dữ liệu giao dịch</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Hãy nhập file sao kê CSV hoặc thêm giao dịch đầu tiên để xem biểu đồ thu/chi theo danh mục.
          </p>
          <Link
            href="/transactions"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeftRight aria-hidden="true" className="size-4" />
            Đi tới Giao dịch &amp; Import CSV
          </Link>
        </Card>
      ) : summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Tổng thu nhập</CardDescription>
                <ArrowDownLeft aria-hidden="true" className="size-4 text-risk-safe" />
              </CardHeader>
              <CardContent>
                <p className="font-mono text-2xl font-bold text-risk-safe">
                  +{formatVnd(summary.totalIncome)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Tổng chi tiêu</CardDescription>
                <ArrowUpRight aria-hidden="true" className="size-4 text-navy" />
              </CardHeader>
              <CardContent>
                <p className="font-mono text-2xl font-bold text-navy">
                  -{formatVnd(summary.totalExpense)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>Số dư ròng ({summary.transactionCount} giao dịch)</CardDescription>
                <Wallet aria-hidden="true" className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p
                  className={
                    summary.netBalance >= 0
                      ? "font-mono text-2xl font-bold text-primary"
                      : "font-mono text-2xl font-bold text-risk-high"
                  }
                >
                  {summary.netBalance >= 0 ? "+" : "-"}
                  {formatVnd(Math.abs(summary.netBalance))}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="border-border shadow-sm lg:col-span-6">
              <CardHeader>
                <CardTitle className="text-lg text-navy">Cơ cấu chi tiêu theo danh mục</CardTitle>
                <CardDescription>Tổng hợp từ toàn bộ giao dịch chi tiêu hiện có.</CardDescription>
              </CardHeader>
              <CardContent>
                {summary.expenseByCategory.length === 0 ? (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    Chưa có khoản chi tiêu nào để hiển thị biểu đồ.
                  </p>
                ) : (
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summary.expenseByCategory}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={96}
                          paddingAngle={2}
                        >
                          {summary.expenseByCategory.map((entry, idx) => (
                            <Cell
                              key={entry.slug}
                              fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            typeof value === "number" ? formatVnd(value) : String(value ?? "")
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm lg:col-span-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-navy">Chi tiết theo danh mục</CardTitle>
                  <CardDescription>Xếp hạng từ cao xuống thấp.</CardDescription>
                </div>
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Xem tất cả <ArrowRight aria-hidden="true" className="size-3.5" />
                </Link>
              </CardHeader>
              <CardContent>
                {summary.expenseByCategory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có khoản chi tiêu nào.</p>
                ) : (
                  <ul className="space-y-3">
                    {summary.expenseByCategory.map((cat, idx) => (
                      <li key={cat.slug} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium text-foreground">
                            <span
                              className="inline-block size-2.5 rounded-full"
                              style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                            />
                            {cat.name}
                          </span>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {formatVnd(cat.amount)}{" "}
                            <span className="text-muted-foreground">({cat.percentage}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(4, cat.percentage)}%`,
                              backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
