import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { BackToHomeLink } from "@/components/marketing/BackToHomeLink";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string;
    registered?: string;
  };
};

function sanitizeCallbackUrl(raw?: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const callbackUrl = sanitizeCallbackUrl(searchParams?.callbackUrl);
  const registered = searchParams?.registered === "1";

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-5xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 w-full max-w-md">
        <BackToHomeLink />
      </div>
      <LoginForm callbackUrl={callbackUrl} registered={registered} />
    </div>
  );
}
