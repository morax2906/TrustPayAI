"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ExplainableReport } from "@/components/risk/ExplainableReport";
import { AnalyzeRequestError, requestRiskAnalysis } from "@/lib/risk/client";
import { MOMO_SCENARIOS, buildPreTransferPayload, formatVnd } from "@/lib/risk/momo-sim";
import type { AnalyzeResponse } from "@/lib/risk/schema";

type SimOutcome = "cancelled" | "proceeded" | null;

export function MockMomoWorkspace() {
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null);
  const [checkedAmount, setCheckedAmount] = React.useState<number | null>(null);
  const [outcome, setOutcome] = React.useState<SimOutcome>(null);

  async function handleCheckSafety(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOutcome(null);

    const built = buildPreTransferPayload({ recipient, amount, note });
    if (!built.ok) {
      setError(built.error);
      return;
    }

    setLoading(true);
    try {
      const data = await requestRiskAnalysis(
        built.payload,
        "Không thể kết nối máy chủ kiểm tra an toàn. Vui lòng thử lại."
      );
      setResult(data);
      setCheckedAmount(built.amountNum);
    } catch (error) {
      setError(
        error instanceof AnalyzeRequestError
          ? error.message
          : "Không thể kết nối máy chủ kiểm tra an toàn. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setOutcome(null);
    setError(null);
    setCheckedAmount(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-navy">Mô phỏng chuyển tiền MoMo</h1>
          <Badge variant="momo">Pre-Transfer Guard</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Minh họa lớp bảo vệ TrustPay AI kiểm tra rủi ro ngay trước khi bạn xác nhận chuyển tiền.
        </p>
      </div>

      <Alert variant="momo">
        <Smartphone aria-hidden="true" className="size-4" />
        <AlertTitle>Thông báo mô phỏng</AlertTitle>
        <AlertDescription>
          Đây là mô phỏng tích hợp; TrustPay không giữ tiền, không tự chuyển khoản.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="overflow-hidden border-momo/25 shadow-sm lg:col-span-5">
          <CardHeader className="bg-momo text-momo-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone aria-hidden="true" className="size-5" />
                Chuyển tiền ví MoMo
              </CardTitle>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                Demo UI
              </span>
            </div>
            <CardDescription className="text-momo-foreground/85">
              Nhập thông tin giao dịch hoặc chọn nhanh kịch bản bên dưới.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Kịch bản mẫu:</span>
              <div className="flex flex-wrap gap-2">
                {MOMO_SCENARIOS.map((sc) => (
                  <Button
                    key={sc.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => {
                      setRecipient(sc.data.recipient);
                      setAmount(sc.data.amount);
                      setNote(sc.data.note);
                      setResult(null);
                      setOutcome(null);
                      setError(null);
                    }}
                  >
                    {sc.label}
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" className="size-4" />
                <AlertTitle>Chưa thể kiểm tra</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCheckSafety} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="momo-recipient">Người nhận (Tên / SĐT)</Label>
                <Input
                  id="momo-recipient"
                  placeholder="0912345678 - Nguyễn Văn A"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="momo-amount">Số tiền (VND)</Label>
                <Input
                  id="momo-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="momo-note">Lời nhắn / Link / Lý do chuyển (tùy chọn)</Label>
                <textarea
                  id="momo-note"
                  rows={3}
                  placeholder="Ví dụ: Đặt cọc, hoàn tiền, hoặc đường dẫn người nhận gửi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
              </div>

              <Button type="submit" variant="momo" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    Đang kiểm tra an toàn...
                  </>
                ) : (
                  <>
                    <ShieldCheck aria-hidden="true" className="size-4" />
                    Kiểm tra an toàn
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-7">
          {loading ? (
            <Card className="border-border p-6">
              <div className="space-y-3">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
                <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            </Card>
          ) : outcome === "cancelled" ? (
            <Card className="border-risk-safe/30 bg-risk-safe-bg/40 p-6">
              <div className="flex items-start gap-3">
                <XCircle aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-risk-safe" />
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-navy">Đã hủy giao dịch an toàn</h3>
                  <p className="text-sm text-foreground">
                    Bạn đã chọn dừng giao dịch{" "}
                    {checkedAmount ? formatVnd(checkedAmount) : ""} tới{" "}
                    <span className="font-semibold">{recipient}</span>. Không có khoản tiền nào được chuyển.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Thử giao dịch khác
                  </Button>
                </div>
              </div>
            </Card>
          ) : outcome === "proceeded" ? (
            <Card className="border-momo/30 bg-momo-soft/50 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-momo" />
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-navy">
                    Mô phỏng hoàn tất: Chuyển sang bước xác nhận trên ví
                  </h3>
                  <p className="text-sm text-foreground">
                    Giao dịch mô phỏng {checkedAmount ? formatVnd(checkedAmount) : ""} đến{" "}
                    <span className="font-semibold">{recipient}</span> đã qua bước xác nhận người dùng.
                    TrustPay không giữ tiền, không trừ tiền thật và không ghi vào sổ giao dịch.
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw aria-hidden="true" className="size-4" />
                    Thử giao dịch khác
                  </Button>
                </div>
              </div>
            </Card>
          ) : result ? (
            <div className="space-y-4">
              <ExplainableReport
                result={result}
                title="Đánh giá an toàn trước chuyển tiền"
              />
              <Card className="border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Quyết định cuối cùng luôn thuộc về bạn (Human-in-the-loop).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={result.level === "high" ? "destructive" : "outline"}
                      onClick={() => setOutcome("cancelled")}
                    >
                      Hủy giao dịch
                    </Button>
                    <Button
                      type="button"
                      variant={result.level === "high" ? "outline" : "momo"}
                      onClick={() => setOutcome("proceeded")}
                    >
                      Tôi hiểu rủi ro, vẫn tiếp tục
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="flex min-h-[340px] items-center justify-center border-dashed border-border bg-card/60 p-8 text-center">
              <div className="max-w-sm space-y-2">
                <ShieldCheck aria-hidden="true" className="mx-auto size-10 text-momo/60" />
                <h3 className="text-base font-semibold text-navy">Chưa kiểm tra giao dịch</h3>
                <p className="text-sm text-muted-foreground">
                  Điền thông tin bên trái (hoặc chọn kịch bản mẫu) và bấm &ldquo;Kiểm tra an toàn&rdquo; để xem TrustPay cảnh báo trước khi chuyển tiền.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
