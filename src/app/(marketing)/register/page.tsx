import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { BackToHomeLink } from "@/components/marketing/BackToHomeLink";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-5xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 w-full max-w-md">
        <BackToHomeLink />
      </div>
      <RegisterForm />
    </div>
  );
}
