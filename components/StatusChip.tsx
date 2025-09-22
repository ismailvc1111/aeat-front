import { Badge } from "./ui/badge";
import { useI18n } from "../lib/i18n";
import type { InvoiceStatus } from "../lib/types";

const statusMap: Record<InvoiceStatus, { variant: "default" | "success" | "warning" | "destructive"; icon: string }> = {
  draft: { variant: "warning", icon: "•" },
  issued: { variant: "success", icon: "•" },
  sent: { variant: "default", icon: "•" },
};

export function StatusChip({ status }: { status: InvoiceStatus }) {
  const { t } = useI18n();
  const config = statusMap[status];
  return (
    <Badge variant={config.variant} className="gap-1">
      <span aria-hidden="true">{config.icon}</span>
      {t(`status.${status}`)}
    </Badge>
  );
}
