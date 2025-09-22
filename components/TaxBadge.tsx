import { Badge } from "./ui/badge";
import { useI18n } from "../lib/i18n";

export function TaxBadge({ rate }: { rate: number }) {
  const { t } = useI18n();
  return (
    <Badge variant="outline" className="text-xs">
      {t("products.taxRate")}: {rate}%
    </Badge>
  );
}
