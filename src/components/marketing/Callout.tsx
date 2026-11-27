import type { ReactNode } from "react";

type CalloutProps = {
  tone?: "info" | "warning" | "safe";
  title?: string;
  children: ReactNode;
};

const TONES = {
  info: "border-purple-200 bg-purple-50 text-purple-900",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
  safe: "border-green-200 bg-green-50 text-green-900",
} as const;

export default function Callout({ tone = "info", title, children }: CalloutProps) {
  return (
    <div role="note" className={`rounded-xl border p-4 text-sm leading-relaxed ${TONES[tone]}`}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
