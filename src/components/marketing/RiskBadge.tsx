export type RiskLevel = "safe" | "caution" | "high";

const CONFIG: Record<RiskLevel, { label: string; className: string }> = {
  safe: { label: "An toàn", className: "bg-green-100 text-green-800 ring-green-300" },
  caution: { label: "Cần thận trọng", className: "bg-yellow-100 text-yellow-800 ring-yellow-300" },
  high: { label: "Rủi ro cao", className: "bg-red-100 text-red-800 ring-red-300" },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const { label, className } = CONFIG[level];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${className}`}>
      {label}
    </span>
  );
}
