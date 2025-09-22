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
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {title}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {trend ? (
          <p
            className={cn(
              "mt-2 text-xs",
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
