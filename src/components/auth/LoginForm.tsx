"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

const DEMO_EMAIL = "demo@trustpay.ai";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "Demo@12345";

type LoginFormProps = {
  callbackUrl?: string;
  registered?: boolean;
};

export function LoginForm({ callbackUrl = "/dashboard", registered = false }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loadingMode, setLoadingMode] = React.useState<"credentials" | "demo" | null>(null);

  async function performSignIn(targetEmail: string, targetPassword: string, mode: "credentials" | "demo") {
    setError(null);
    setLoadingMode(mode);
    try {
      const res = await signIn("credentials", {
        email: targetEmail.trim().toLowerCase(),
        password: targetPassword,
        redirect: false,
      });
      if (!res || res.error || !res.ok) {
        setError(
          mode === "demo"
            ? "Không thể đăng nhập tài khoản Demo. Kiểm tra kết nối DB và seed dữ liệu."
            : "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại."
        );
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ xác thực. Vui lòng thử lại sau.");
    } finally {
      setLoadingMode(null);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    void performSignIn(email, password, "credentials");
  }

  const busy = loadingMode !== null;

  return (
    <Card className="w-full max-w-md border-border shadow-md">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          <ShieldCheck aria-hidden="true" className="size-4" />
          TrustPay AI
        </div>
        <CardTitle className="text-2xl font-bold text-navy">Đăng nhập</CardTitle>
        <CardDescription>
          Truy cập bộ quét lừa đảo, mô phỏng chuyển tiền an toàn và sổ giao dịch cá nhân.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {registered && (
          <Alert variant="safe">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            <AlertTitle>Đăng ký thành công</AlertTitle>
            <AlertDescription>Bạn có thể đăng nhập bằng tài khoản vừa tạo.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" className="size-4" />
            <AlertTitle>Đăng nhập chưa thành công</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-primary/25 bg-accent/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-navy">Dùng thử nhanh trong 60 giây</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tài khoản mẫu có sẵn 50 giao dịch:{" "}
                <span className="font-mono text-foreground">{DEMO_EMAIL}</span>
              </p>
            </div>
            <Sparkles aria-hidden="true" className="size-4 shrink-0 text-primary" />
          </div>
          <Button
            type="button"
            variant="default"
            className="mt-3 w-full"
            disabled={busy}
            onClick={() => void performSignIn(DEMO_EMAIL, DEMO_PASSWORD, "demo")}
          >
            {loadingMode === "demo" ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Đang vào tài khoản Demo...
              </>
            ) : (
              "Đăng nhập nhanh tài khoản Demo"
            )}
          </Button>
        </div>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-border" />
          <span className="mx-3 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
            Hoặc dùng email cá nhân
          </span>
          <div className="flex-grow border-t border-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="ban@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Tối thiểu 8 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              required
            />
          </div>

          <Button type="submit" variant="navy" className="w-full" disabled={busy}>
            {loadingMode === "credentials" ? (
              <>
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t border-border/70 pt-4 text-center text-sm text-muted-foreground">
        <p>
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
