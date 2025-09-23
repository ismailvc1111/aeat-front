"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppData } from "../../../lib/providers/app-data";
import { useI18n } from "../../../lib/i18n";
import { Table, type TableColumn } from "../../../components/Table";
import { StatusChip } from "../../../components/StatusChip";
import { formatCurrency } from "../../../lib/utils/currency";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import type { Invoice } from "../../../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export const runtime = "edge";

export default function InvoicesPage() {
  const router = useRouter();
  const { invoices, customers, companies, companyId, refreshing } = useAppData();
  const { t, locale } = useI18n();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [series, setSeries] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const customerName =
        customers.find((customer) => customer.id === invoice.customerId)?.name?.toLowerCase() ?? "";
      const matchesQuery = query
        ? invoice.id.toLowerCase().includes(query) || customerName.includes(query)
        : true;
      const matchesStatus = status ? invoice.status === status : true;
      const matchesSeries = series ? invoice.series === series : true;
      return matchesQuery && matchesStatus && matchesSeries;
    });
  }, [customers, invoices, search, status, series]);

  const company = companies.find((item) => item.id === companyId);

  const columns = useMemo<TableColumn<Invoice>[]>(
    () => [
      {
        header: t("invoices.customer"),
        accessor: (invoice) => {
          const customer = customers.find((c) => c.id === invoice.customerId);
          return (
            <div>
              <p className="font-medium">{customer?.name ?? "-"}</p>
              <p className="text-xs text-muted-foreground">
                #{invoice.series}-{invoice.number ?? "—"}
              </p>
            </div>
          );
        },
      },
      {
        header: t("invoices.status"),
        accessor: (invoice) => <StatusChip status={invoice.status} />,
      },
      {
        header: t("invoices.total"),
        accessor: (invoice) => (
          <span className="font-medium">
            {formatCurrency(invoice.total, locale)}
          </span>
        ),
      },
      {
        header: t("invoices.issuedOn"),
        accessor: (invoice) => (
          <span className="text-xs text-muted-foreground">
            {invoice.issueDate
              ? new Date(invoice.issueDate).toLocaleDateString()
              : "—"}
          </span>
        ),
      },
      {
        header: "",
        accessor: (invoice) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/invoices/${invoice.id}`)}
          >
            {t("common.edit")}
          </Button>
        ),
      },
    ],
    [customers, locale, router, t]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("invoices.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {company ? company.name : t("common.loading")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/invoices/new")}>
          <Plus className="h-4 w-4" />
          {t("invoices.new")}
        </Button>
      </div>
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            {t("common.actions")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder={t("invoices.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="md:col-span-2"
          />
          <Select
            value={status ?? ""}
            onValueChange={(value) => setStatus(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("invoices.filterStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("invoices.filterStatus")}</SelectItem>
              <SelectItem value="draft">{t("status.draft")}</SelectItem>
              <SelectItem value="issued">{t("status.issued")}</SelectItem>
              <SelectItem value="sent">{t("status.sent")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={series ?? ""}
            onValueChange={(value) => setSeries(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("invoices.filterSeries")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("invoices.filterSeries")}</SelectItem>
              {company?.series.map((serie) => (
                <SelectItem key={serie} value={serie}>
                  {serie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Table
        data={filtered}
        columns={columns}
        emptyMessage={t("invoices.empty")}
        isLoading={refreshing}
      />
    </div>
  );
}
