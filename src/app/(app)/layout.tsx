import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/app/AppShell";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        email: session.user.email,
        name: session.user.name,
      }}
    >
      {children}
    </AppShell>
  );
}
