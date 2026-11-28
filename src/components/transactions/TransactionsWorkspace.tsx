"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { CsvImportPanel } from "@/components/transactions/CsvImportPanel";
import { formatVnd } from "@/lib/risk/momo-sim";
import {
  extractUniqueCategories,
  filterTransactionsByCategory,
  formatDateVi,
  type CategorizeResponse,
  type TransactionItem,
  type TransactionListResponse,
  type TxType,
} from "@/lib/transactions/client";

const PAGE_LIMIT = 20;

export function TransactionsWorkspace() {
  const [items, setItems] = React.useState<TransactionItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [typeFilter, setTypeFilter] = React.useState<"all" | TxType>("all");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const [showImport, setShowImport] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [categorizing, setCategorizing] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Create form state
  const [newDate, setNewDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [newType, setNewType] = React.useState<TxType>("expense");
  const [newAmount, setNewAmount] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  const loadTransactions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });
      if (typeFilter !== "all") qs.set("type", typeFilter);
      if (fromDate) qs.set("from", fromDate);
      if (toDate) qs.set("to", toDate);

      const res = await fetch(`/api/transactions?${qs.toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }
      if (!res.ok) {
        setError("Không thể tải danh sách giao dịch.");
        return;
      }
      const data = (await res.json()) as TransactionListResponse;
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError("Lỗi kết nối khi tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, fromDate, toDate]);

  React.useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError(null);
    const amountNum = Number(newAmount.replace(/[.,\s_]/g, ""));
    if (!Number.isInteger(amountNum) || amountNum <= 0) {
      setCreateError("Số tiền phải là số nguyên dương (VND).");
      return;
    }
    if (!newDesc.trim()) {
      setCreateError("Vui lòng nhập nội dung giao dịch.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          type: newType,
          amount: amountNum,
          description: newDesc.trim(),
        }),
      });
      if (res.status === 409) {
        setCreateError("Giao dịch này đã tồn tại (trùng ngày, số tiền và nội dung).");
        return;
      }
      if (!res.ok) {
        setCreateError("Thông tin giao dịch chưa hợp lệ.");
        return;
      }
      setNewAmount("");
      setNewDesc("");
      setShowCreate(false);
      setNotice("Đã thêm giao dịch mới.");
      setPage(1);
      await loadTransactions();
    } catch {
      setCreateError("Không thể kết nối máy chủ.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Không thể xóa giao dịch này.");
        return;
      }
      setConfirmDeleteId(null);
      setNotice("Đã xóa giao dịch.");
      await loadTransactions();
    } catch {
      setError("Lỗi kết nối khi xóa giao dịch.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCategorize() {
    setCategorizing(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/transactions/categorize", { method: "POST" });
      if (!res.ok) {
        setError("Không thể chạy phân loại tự động lúc này.");
        return;
      }
      const data = (await res.json()) as CategorizeResponse;
      setNotice(
        `Đã kiểm tra ${data.examined} dòng chưa phân loại: gán danh mục cho ${data.categorized} dòng, còn ${data.stillUncategorized} dòng chưa khớp luật.`
      );
      await loadTransactions();
    } catch {
      setError("Lỗi kết nối khi phân loại giao dịch.");
    } finally {
      setCategorizing(false);
    }
  }

  const categoryOptions = React.useMemo(() => extractUniqueCategories(items), [items]);
  const visibleItems = React.useMemo(
    () => filterTransactionsByCategory(items, categoryFilter),
    [items, categoryFilter]
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Sổ giao dịch</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý thu/chi, lọc theo thời gian và nhập sao kê CSV.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={categorizing}
            onClick={() => void handleCategorize()}
          >
            {categorizing ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" className="size-4" />
            )}
            Phân loại tự động
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImport((v) => !v)}
          >
            <FileSpreadsheet aria-hidden="true" className="size-4" />
            {showImport ? "Đóng Import CSV" : "Import CSV"}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setShowCreate((v) => !v)}
          >
            <Plus aria-hidden="true" className="size-4" />
            {showCreate ? "Đóng form" : "Thêm giao dịch"}
          </Button>
        </div>
      </div>

      {notice && (
        <Alert variant="info">
          <AlertTitle>Thông báo</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" className="size-4" />
          <AlertTitle>Đã xảy ra lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showImport && (
        <CsvImportPanel
          onImported={() => {
            setPage(1);
            void loadTransactions();
          }}
        />
      )}

      {showCreate && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-navy">Thêm giao dịch mới</CardTitle>
            <CardDescription>Hệ thống sẽ tự động gán danh mục nếu khớp từ khóa.</CardDescription>
          </CardHeader>
          <CardContent>
            {createError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle aria-hidden="true" className="size-4" />
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1.5">
                <Label htmlFor="tx-date">Ngày</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  disabled={creating}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-type">Loại</Label>
                <select
                  id="tx-type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TxType)}
                  disabled={creating}
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="expense">Chi tiêu</option>
                  <option value="income">Thu nhập</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-amount">Số tiền (VND)</Label>
                <Input
                  id="tx-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="50000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  disabled={creating}
                  required
                />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="tx-desc">Nội dung</Label>
                <div className="flex gap-2">
                  <Input
                    id="tx-desc"
                    placeholder="Cơm trưa, tiền điện, lương..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    disabled={creating}
                    required
                  />
                  <Button type="submit" disabled={creating} className="shrink-0">
                    {creating ? <Loader2 className="size-4 animate-spin" /> : "Lưu"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-border shadow-sm">
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="filter-type">Loại giao dịch</Label>
            <select
              id="filter-type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "all" | TxType);
                setPage(1);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="all">Tất cả</option>
              <option value="expense">Chi tiêu</option>
              <option value="income">Thu nhập</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-from">Từ ngày</Label>
            <Input
              id="filter-from"
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-to">Đến ngày</Label>
            <Input
              id="filter-to"
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-cat">Danh mục (trên trang)</Label>
            <select
              id="filter-cat"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="uncategorized">Chưa phân loại</option>
              {categoryOptions.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-navy">Chưa có giao dịch phù hợp</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Thử đổi bộ lọc hoặc bấm &ldquo;Import CSV&rdquo; / &ldquo;Thêm giao dịch&rdquo;.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ngày</th>
                    <th className="px-4 py-3 font-semibold">Nội dung</th>
                    <th className="px-4 py-3 font-semibold">Danh mục</th>
                    <th className="px-4 py-3 text-right font-semibold">Số tiền</th>
                    <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {visibleItems.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                        {formatDateVi(tx.date)}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{tx.description}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {tx.category ? (
                          <Badge variant="secondary">{tx.category.name}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Chưa phân loại
                          </Badge>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-semibold">
                        <span
                          className={
                            tx.type === "income"
                              ? "inline-flex items-center gap-1 text-risk-safe"
                              : "inline-flex items-center gap-1 text-foreground"
                          }
                        >
                          {tx.type === "income" ? (
                            <ArrowDownLeft aria-hidden="true" className="size-3.5" />
                          ) : (
                            <ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
                          )}
                          {tx.type === "income" ? "+" : "-"}
                          {formatVnd(tx.amount)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {confirmDeleteId === tx.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={deletingId === tx.id}
                              onClick={() => void handleDelete(tx.id)}
                            >
                              {deletingId === tx.id ? "Đang xóa..." : "Xóa"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={deletingId === tx.id}
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Hủy
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label={`Xóa giao dịch ${tx.description}`}
                            onClick={() => setConfirmDeleteId(tx.id)}
                          >
                            <Trash2 aria-hidden="true" className="size-4 text-muted-foreground" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Tổng {total} giao dịch · Trang {page}/{totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Trước
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
