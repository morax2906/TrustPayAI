import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
};

export default function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-pink-100">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-extrabold text-balance sm:text-5xl">{title}</h1>
        {description && <div className="mt-4 max-w-2xl text-base leading-relaxed text-pink-50 sm:text-lg">{description}</div>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  );
}
