import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

const STYLES = {
  primary: "bg-white text-fuchsia-700 hover:bg-pink-50 shadow-sm",
  secondary: "border border-white/60 text-white hover:bg-white/10",
  ghost: "bg-fuchsia-600 text-white hover:bg-fuchsia-700",
} as const;

export default function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors sm:text-base ${STYLES[variant]}`}
    >
      {children}
    </Link>
  );
}
