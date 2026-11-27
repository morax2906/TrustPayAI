import type { ReactNode } from "react";

export type Step = { title: string; body: ReactNode; seconds?: number };

export default function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4 rounded-2xl border border-fuchsia-100 bg-white p-5 shadow-sm">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 font-bold text-white"
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">{step.title}</h3>
              {step.seconds !== undefined && (
                <span className="text-xs font-medium text-slate-400">≈ {step.seconds} giây</span>
              )}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-slate-600">{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
