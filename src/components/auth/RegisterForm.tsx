"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { mapAuthApiError, validateRegisterInput } from "@/lib/auth-form";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validated = validateRegisterInput({
      name,
      email,
      password,
      confirmPassword,
      consent,
    });
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(mapAuthApiError(res.status, body?.error));
        return;
      }

      const signInRes = await signIn("credentials", {
        email: validated.data.email,
        password: validated.data.password,
        redirect: false,
      });

      if (signInRes?.ok && !signInRes.error) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login?registered=1");
      }
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border shadow-md">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <UserPlus aria-hidden="true" className="size-4" />
          Tạo tài khoản mới
        </div>
        <CardTitle className="text-2xl font-bold text-navy">Đăng ký TrustPay AI</CardTitle>
        <CardDescription>
          Lưu lịch sử giao dịch và kiểm tra an toàn trước khi chuyển khoản.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" className="size-4" />
            <AlertTitle>Không thể đăng ký</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="register-name">Họ và tên (tùy chọn)</Label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Mật khẩu</Label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Từ 8 đến 128 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
            <Input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3">
            <label htmlFor="register-consent" className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-foreground">
              <input
                id="register-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={submitting}
                className="mt-0.5 size-4 rounded border-input text-primary focus:ring-ring"
              />
              <span>
                Tôi đồng ý cho TrustPay AI xử lý dữ liệu cá nhân (tham chiếu Nghị định 13/2023/NĐ-CP) theo{" "}
                <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
                  Chính sách quyền riêng tư
                </Link>
                .
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={submitting || !consent}>
            {submitting ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Đang tạo tài khoản...
              </>
            ) : (
              "Đăng ký và bắt đầu"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/70 pt-4 text-center text-sm text-muted-foreground">
        <p>
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
