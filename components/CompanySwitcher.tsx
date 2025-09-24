"use client";

import { Building2 } from "lucide-react";
import { useTransition } from "react";
import { useAppData } from "../lib/providers/app-data";
import { useToast } from "./ui/toast-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useI18n } from "../lib/i18n";

export function CompanySwitcher() {
  const { companies, companyId, setCompanyId, refreshCompanyData } = useAppData();
  const { notify } = useToast();
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/90 px-3 py-1.5 shadow-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 className="h-4 w-4" aria-hidden="true" />
      </span>
      <Select
        value={companyId ?? undefined}
        onValueChange={(value) =>
          startTransition(async () => {
            setCompanyId(value);
            await refreshCompanyData(value);
            notify({
              title: t("common.company"),
              description: t("common.companyUpdated"),
              variant: "success",
            });
          })
        }
        disabled={companies.length === 0 || isPending}
      >
        <SelectTrigger
          className="w-48 border-none bg-transparent px-0 text-left text-sm font-medium text-text-primary"
          aria-label={t("common.company")}
          data-state={isPending ? "loading" : undefined}
        >
          <SelectValue placeholder={t("common.company")} />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
