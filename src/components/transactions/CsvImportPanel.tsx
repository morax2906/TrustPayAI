"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  parseCsvPreview,
  buildSampleCsv,
  isCsvFile,
  type CsvPreview,
  type ImportSummaryResponse,
} from "@/lib/transactions/client";

type CsvImportPanelProps = {
  onImported: () => void;
};

function downloadSampleCsv() {
  const blob = new Blob([buildSampleCsv()], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trustpay-sao-ke-mau.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function CsvImportPanel({ onImported }: CsvImportPanelProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<CsvPreview | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<ImportSummaryResponse | null>(null);

  async function handleSelectedFile(selected: File | null) {
    setError(null);
    setSummary(null);
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!isCsvFile(selected)) {
      setFile(null);
      setPreview(null);
      setError("Vui lòng chọn file có phần mở rộng .csv.");
      return;
    }

    setFile(selected);
    try {
      const text = await selected.text();
      setPreview(parseCsvPreview(text, 8));
    } catch {
      setPreview(null);
      setError("Không thể đọc nội dung file CSV để xem trước.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    void handleSelectedFile(e.currentTarget.files?.[0] ?? null);
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (!uploading) setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    if (uploading) return;

    const selected = Array.from(e.dataTransfer.files).find(isCsvFile);
    if (!selected) {
      setFile(null);
      setPreview(null);
      setSummary(null);
      setError("Vui lòng thả file có phần mở rộng .csv.");
      return;
    }
    void handleSelectedFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setSummary(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
          message?: string;
        } | null;
        if (res.status === 413 || body?.error === "file_too_large") {
          setError("File vượt quá dung lượng tối đa 1 MB.");
        } else if (res.status === 422 || body?.error === "invalid_format") {
          setError(
            body?.message
              ? `Sai định dạng CSV: ${body.message}`
              : "File CSV thiếu cột bắt buộc (ngày, nội dung, số tiền)."
          );
        } else if (res.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError("Không thể import file lúc này. Vui lòng thử lại.");
        }
        return;
      }

      const data = (await res.json()) as ImportSummaryResponse;
      setSummary(data);
      onImported();
    } catch {
      setError("Lỗi kết nối khi tải file CSV lên máy chủ.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="border-primary/25 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg text-navy">
            <FileSpreadsheet aria-hidden="true" className="size-5 text-primary" />
            Import sao kê CSV
          </CardTitle>
          <CardDescription>
            Hỗ trợ dấu phẩy (,), chấm phẩy (;), tab và UTF-8 BOM. Tối đa 1 MB / 2.000 dòng.
          </CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={downloadSampleCsv}>
          <Download aria-hidden="true" className="size-4" />
          Tải CSV mẫu
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor="csv-upload-input"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-1 cursor-pointer items-center justify-between rounded-lg border border-dashed px-4 py-3 text-sm transition ${dragging ? "border-primary bg-accent/60 ring-2 ring-primary/30" : "border-border bg-muted/30 hover:bg-muted/60"}`}
          >
            <span className="truncate text-foreground">
              {file ? file.name : "Kéo thả file .csv vào đây hoặc chọn từ máy..."}
            </span>
            <span className="ml-3 shrink-0 rounded bg-card px-2.5 py-1 text-xs font-medium text-primary shadow-sm">
              Chọn file
            </span>
            <input
              id="csv-upload-input"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => void handleFileChange(e)}
              disabled={uploading}
            />
          </label>

          <Button
            type="button"
            disabled={!file || uploading}
            onClick={() => void handleUpload()}
          >
            {uploading ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Đang import...
              </>
            ) : (
              <>
                <Upload aria-hidden="true" className="size-4" />
                Xác nhận Import
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" className="size-4" />
            <AlertTitle>Import không thành công</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <Alert variant={summary.imported > 0 ? "safe" : "info"}>
            <CheckCircle2 aria-hidden="true" className="size-4" />
            <AlertTitle>Kết quả Import CSV</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Tổng dòng: <strong>{summary.totalRows}</strong> · Đã nhập mới:{" "}
                <strong>{summary.imported}</strong> · Bỏ qua trùng lặp:{" "}
                <strong>{summary.duplicates}</strong> · Lỗi:{" "}
                <strong>{summary.errorCount}</strong>
              </p>
              {summary.errors.length > 0 && (
                <ul className="list-inside list-disc text-xs">
                  {summary.errors.map((err, idx) => (
                    <li key={`${err.line}-${idx}`}>
                      Dòng {err.line}: {err.reason}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        {preview && preview.headers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Xem trước tối đa {preview.rows.length} dòng đầu tiên (kiểm tra trước khi gửi):
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    {preview.headers.map((h, i) => (
                      <th key={i} className="whitespace-nowrap px-3 py-2 font-semibold">
                        {h || `Cột ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {preview.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {preview.headers.map((_, cIdx) => (
                        <td key={cIdx} className="whitespace-nowrap px-3 py-2 text-foreground">
                          {row[cIdx] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
