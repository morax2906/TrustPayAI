import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: string;
  title: string;
  badge?: string;
  children: ReactNode;
};

export default function FeatureCard({ icon, title, badge, children }: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-fuchsia-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-fuchsia-100 text-xl">
          {icon}
        </span>
        {badge && (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">{badge}</span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}
