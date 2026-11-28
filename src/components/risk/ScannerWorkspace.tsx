"use client";

import * as React from "react";
import {
  AlertCircle,
  Clock,
  FileImage,
  Link2,
  Loader2,
  MessageSquareWarning,
  ScanSearch,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ExplainableReport } from "@/components/risk/ExplainableReport";
import {
  SCAN_PRESETS,
  appendScanHistory,
  getLevelPresentation,
  AnalyzeRequestError,
  requestRiskAnalysis,
  type ScanHistoryItem,
  type ScanType,
} from "@/lib/risk/client";
import type { AnalyzeResponse } from "@/lib/risk/schema";
import { cn } from "@/lib/utils";

const HISTORY_STORAGE_KEY = "trustpay_scan_history_v1";
const MAX_CONTENT_LEN = 5000;

const TABS: Array<{ type: ScanType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: "message", label: "Tin nhắn SMS / Chat", icon: MessageSquareWarning },
  { type: "url", label: "Đường dẫn URL", icon: Link2 },
  { type: "image_text", label: "Văn bản từ ảnh", icon: FileImage },
];

function ReportSkeleton() {
  return (
    <Card className="border-border">
      <CardHeader className="space-y-3">
        <div className="h-5 w-44 animate-pulse rounded bg-muted" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      </CardContent>
    </Card>
  );
}

export function ScannerWorkspace() {
  const [activeType, setActiveType] = React.useState<ScanType>("message");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null);
  const [history, setHistory] = React.useState<ScanHistoryItem[]>([]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ScanHistoryItem[];
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, 10));
    } catch {
      // Ignore invalid local storage payloads.
    }
  }, []);

  function persistHistory(next: ScanHistoryItem[]) {
    setHistory(next);
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors.
    }
  }

  async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Vui lòng nhập nội dung hoặc đường dẫn cần kiểm tra.");
      return;
    }
    if (trimmed.length > MAX_CONTENT_LEN) {
      setError(`Nội dung tối đa ${MAX_CONTENT_LEN} ký tự.`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await requestRiskAnalysis(
        { type: activeType, content: trimmed },
        "Không thể kết nối máy chủ phân tích. Vui lòng thử lại."
      );
      setResult(data);
      const entry: ScanHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        request: { type: activeType, content: trimmed },
        response: data,
      };
      persistHistory(appendScanHistory(history, entry, 10));
    } catch (error) {
      setError(
        error instanceof AnalyzeRequestError
          ? error.message
          : "Không thể kết nối máy chủ phân tích. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }

  const presets = SCAN_PRESETS.filter((p) => p.type === activeType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">Bộ quét rủi ro lừa đảo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dán tin nhắn, đường dẫn hoặc chữ trích từ ảnh chụp màn hình để kiểm tra dấu hiệu bất thường.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-navy">Nội dung cần kiểm tra</CardTitle>
              <CardDescription>
                Chọn loại dữ liệu đầu vào hoặc bấm mẫu thử nhanh bên dưới.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="tablist" aria-label="Loại nội dung quét">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeType === tab.type;
                  return (
                    <button
                      key={tab.type}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setActiveType(tab.type);
                        setError(null);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors",
                        active
                          ? "border-primary bg-accent text-accent-foreground font-semibold"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">Mẫu thử nhanh:</span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      onClick={() => {
                        setContent(preset.content);
                        setError(null);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle aria-hidden="true" className="size-4" />
                  <AlertTitle>Không thể phân tích</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scan-content">
                      {activeType === "url"
                        ? "Đường dẫn (URL)"
                        : activeType === "image_text"
                          ? "Văn bản sao chép từ ảnh chụp màn hình"
                          : "Nội dung tin nhắn SMS / Chat"}
                    </Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {content.length}/{MAX_CONTENT_LEN}
                    </span>
                  </div>

                  {activeType === "url" ? (
                    <Input
                      id="scan-content"
                      type="text"
                      placeholder="https://example.com/..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={loading}
                      maxLength={MAX_CONTENT_LEN}
                    />
                  ) : (
                    <textarea
                      id="scan-content"
                      rows={6}
                      placeholder={
                        activeType === "image_text"
                          ? "Dán đoạn chữ bạn đọc được từ ảnh chụp màn hình..."
                          : "Dán nội dung tin nhắn đáng ngờ tại đây..."
                      }
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={loading}
                      maxLength={MAX_CONTENT_LEN}
                      className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                    {loading ? (
                      <>
                        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <ScanSearch aria-hidden="true" className="size-4" />
                        Kiểm tra rủi ro
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading || !content}
                    onClick={() => {
                      setContent("");
                      setError(null);
                    }}
                  >
                    Xóa nội dung
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold text-navy">
                  Lịch sử quét gần đây (trình duyệt)
                </CardTitle>
              </div>
              {history.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => persistHistory([])}
                  aria-label="Xóa lịch sử quét"
                >
                  <Trash2 aria-hidden="true" className="size-3.5" />
                  Xóa
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Chưa có lượt quét nào trong phiên trình duyệt này.
                </p>
              ) : (
                <ul className="space-y-2">
                  {history.map((item) => {
                    const p = getLevelPresentation(item.response.level);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveType(item.request.type);
                            setContent(item.request.content);
                            setResult(item.response);
                            setError(null);
                          }}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs transition hover:bg-muted/60"
                        >
                          <span className="truncate font-medium text-foreground">
                            {item.request.content}
                          </span>
                          <Badge variant={p.variant} className="shrink-0">
                            {item.response.score}
                          </Badge>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          {loading ? (
            <ReportSkeleton />
          ) : result ? (
            <ExplainableReport result={result} />
          ) : (
            <Card className="flex min-h-[320px] items-center justify-center border-dashed border-border bg-card/60 p-8 text-center">
              <div className="max-w-sm space-y-2">
                <ScanSearch aria-hidden="true" className="mx-auto size-10 text-muted-foreground/60" />
                <h3 className="text-base font-semibold text-navy">Chưa có kết quả phân tích</h3>
                <p className="text-sm text-muted-foreground">
                  Nhập tin nhắn hoặc đường dẫn bên trái và bấm &ldquo;Kiểm tra rủi ro&rdquo; để xem báo cáo chi tiết.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
