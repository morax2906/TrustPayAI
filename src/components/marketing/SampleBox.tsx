import RiskBadge, { type RiskLevel } from "./RiskBadge";

type SampleBoxProps = {
  kind: string;
  expected: RiskLevel;
  text: string;
};

export default function SampleBox({ kind, expected, text }: SampleBoxProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{kind}</span>
        <RiskBadge level={expected} />
      </div>
      <p className="break-words rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700 sm:text-sm">
        {text}
      </p>
    </div>
  );
}
