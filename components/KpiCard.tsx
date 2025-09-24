import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/95 p-4 shadow-sm shadow-black/10 backdrop-blur">
      <div className="flex items-center gap-2 text-text-secondary">
        {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-text-primary tabular-nums">{value}</div>
      {hint ? (
        <div className="mt-1 text-xs text-text-secondary">{hint}</div>
      ) : null}
    </div>
  );
}
