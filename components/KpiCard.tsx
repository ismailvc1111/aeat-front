import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "./ui/utils";

export function KpiCard({
  title,
  value,
  trend,
  accent,
  icon,
}: {
  title: string;
  value: string;
  trend?: string;
  accent?: "success" | "warning" | "destructive" | "primary";
  icon?: ReactNode;
}) {
  const accentBar = {
    primary: "bg-primary/80",
    success: "bg-success/80",
    warning: "bg-warning/80",
    destructive: "bg-destructive/80",
  }[accent ?? "primary"];

  const accentTone = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }[accent ?? "primary"];

  return (
    <Card className="relative h-full overflow-hidden border border-border/60 bg-card/90 p-6 shadow-lg shadow-black/15">
      <span className={cn("absolute inset-x-0 top-0 h-1", accentBar)} aria-hidden="true" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {trend ? (
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", accentTone)}>
              {trend}
            </span>
          ) : null}
        </div>
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/40 text-foreground/80">
            {icon}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight md:text-4xl">{value}</p>
      </CardContent>
    </Card>
  );
}
