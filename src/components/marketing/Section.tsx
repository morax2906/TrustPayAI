import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  title?: string;
  eyebrow?: string;
  intro?: ReactNode;
  tone?: "white" | "soft";
  children: ReactNode;
};

export default function Section({ id, title, eyebrow, intro, tone = "white", children }: SectionProps) {
  return (
    <section id={id} className={tone === "soft" ? "bg-fuchsia-50/50" : "bg-white"}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {(eyebrow || title || intro) && (
          <div className="mb-8 max-w-3xl">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wide text-fuchsia-600">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-1 text-2xl font-bold text-slate-900 text-balance sm:text-3xl">{title}</h2>
            )}
            {intro && <div className="mt-3 text-base leading-relaxed text-slate-600">{intro}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
