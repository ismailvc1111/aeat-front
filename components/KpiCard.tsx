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
  return (
    <Card className="relative overflow-hidden border-border/40 bg-gradient-to-br from-background/50 via-card to-card/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,125,255,0.2),transparent_55%)]" />
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {title}
          {icon ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-foreground">
              {icon}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {trend ? (
          <p
            className={cn(
              "mt-2 text-sm font-medium",
              accent === "success" && "text-success",
              accent === "warning" && "text-warning",
              accent === "destructive" && "text-destructive",
              accent === "primary" && "text-primary"
            )}
          >
            {trend}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
