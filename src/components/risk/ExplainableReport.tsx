import { AlertTriangle, CheckCircle2, Cpu, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getLevelPresentation } from "@/lib/risk/client";
import type { AnalyzeResponse } from "@/lib/risk/schema";
import { cn } from "@/lib/utils";

type ExplainableReportProps = {
  result: AnalyzeResponse;
  title?: string;
};

export function ExplainableReport({
  result,
  title = "Báo cáo phân tích rủi ro",
}: ExplainableReportProps) {
  const presentation = getLevelPresentation(result.level);
  const confidencePct = Math.round(result.confidence * 100);
  const lowEvidence = result.confidence < 0.6;

  const LevelIcon =
    result.level === "high"
      ? ShieldAlert
      : result.level === "caution"
        ? AlertTriangle
        : CheckCircle2;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg font-bold text-navy">{title}</CardTitle>
          <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
            <Cpu aria-hidden="true" className="size-3.5" />
            {result.model === "haiku" ? "AI Haiku + Rule" : "Bộ lọc nhanh Heuristic"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-4">
          <div className="space-y-1.5">
            <Badge variant={presentation.variant} className="gap-1.5 px-3 py-1 text-xs">
              <LevelIcon aria-hidden="true" className="size-3.5" />
              {presentation.label}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Độ tin cậy:{" "}
              <span className="font-semibold text-foreground">{confidencePct}%</span>
              {lowEvidence && " (ít dữ kiện để kết luận)"}
            </p>
          </div>

          <div className="text-right">
            <div className="font-mono text-3xl font-bold tracking-tight text-navy">
              {result.score}
              <span className="text-base font-normal text-muted-foreground">/100</span>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Điểm rủi ro
            </p>
          </div>
        </div>

        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={result.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Điểm rủi ro"
        >
          <div
            className={cn("h-full transition-all duration-300", presentation.barClass)}
            style={{ width: `${Math.max(4, Math.min(100, result.score))}%` }}
          />
        </div>

        {(result.level === "safe" || lowEvidence) && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              Kết quả chỉ mang tính tham khảo từ dữ liệu đã nhập, không khẳng định an toàn tuyệt đối.
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2.5">
          <h4 className="text-sm font-semibold text-navy">
            Tín hiệu &amp; Bằng chứng ({result.signals.length})
          </h4>
          {result.signals.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
              Chưa phát hiện tín hiệu rủi ro rõ ràng nào trong nội dung đã nhập.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {result.signals.map((sig, idx) => (
                <li
                  key={`${sig.code}-${idx}`}
                  className="rounded-lg border border-border bg-card p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{sig.label}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {sig.code}
                    </span>
                  </div>
                  <p className="mt-2 border-l-2 border-primary/50 pl-2.5 font-mono text-xs text-muted-foreground">
                    &ldquo;{sig.evidence}&rdquo;
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-primary/25 bg-accent/50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Khuyến nghị hành động
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">{result.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
