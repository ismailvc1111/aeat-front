"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppData } from "../../lib/providers/app-data";
import { useI18n } from "../../lib/i18n";
import { KpiCard } from "../../components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { formatCurrency } from "../../lib/utils/currency";
import { StatusChip } from "../../components/StatusChip";
import { Skeleton } from "../../components/ui/skeleton";

export const runtime = "edge";

export default function DashboardPage() {
  const { invoices, customers, refreshing } = useAppData();
  const { t, locale } = useI18n();

  const stats = useMemo(() => {
    const issued = invoices.filter((invoice) => invoice.status === "issued");
    const draft = invoices.filter((invoice) => invoice.status === "draft");
    const totalAmount = issued.reduce((acc, item) => acc + item.total, 0);
    const avgAmount = issued.length ? totalAmount / issued.length : 0;
    return {
      issuedCount: issued.length,
      draftCount: draft.length,
      totalAmount,
      averageAmount: avgAmount,
    };
  }, [invoices]);

  const chartData = useMemo(() => {
    const byMonth = new Map<string, number>();
    invoices
      .filter((invoice) => invoice.status === "issued" && invoice.issueDate)
      .forEach((invoice) => {
        const date = new Date(invoice.issueDate!);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        byMonth.set(key, (byMonth.get(key) ?? 0) + invoice.total);
      });
    return Array.from(byMonth.entries())
      .map(([key, value]) => {
        const [year, month] = key.split("-");
        const label = `${month.padStart(2, "0")}/${year}`;
        return { label, value };
      })
      .slice(-6);
  }, [invoices]);

  const timeline = useMemo(
    () =>
      invoices
        .slice()
        .sort((a, b) => (b.issueDate ?? "").localeCompare(a.issueDate ?? ""))
        .slice(0, 5),
    [invoices]
  );

  return (
    <div className="space-y-6">
      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <KpiCard
          title={t("dashboard.issuedTotal")}
          value={stats.issuedCount.toString()}
          trend={`${stats.issuedCount} ${t("status.issued")}`}
          accent="primary"
        />
        <KpiCard
          title={t("dashboard.draftTotal")}
          value={stats.draftCount.toString()}
          trend={`${stats.draftCount} ${t("status.draft")}`}
          accent="warning"
        />
        <KpiCard
          title={t("dashboard.totalAmount")}
          value={formatCurrency(stats.totalAmount, locale)}
          trend={t("dashboard.chartTitle")}
          accent="success"
        />
        <KpiCard
          title={t("dashboard.averageAmount")}
          value={formatCurrency(stats.averageAmount, locale)}
          trend={t("dashboard.timeline")}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.chartTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {refreshing ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" hide />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      borderRadius: 12,
                      border: `1px solid var(--border)` as string,
                      color: "var(--foreground)",
                    }}
                    formatter={(value: number) => formatCurrency(value, locale)}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.timeline")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((invoice) => {
              const customer = customers.find((c) => c.id === invoice.customerId);
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {customer?.name ?? "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{invoice.series}-{invoice.number ?? "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusChip status={invoice.status} />
                    <p className="mt-1 text-sm font-medium">
                      {formatCurrency(invoice.total, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
            {!timeline.length && (
              <p className="text-sm text-muted-foreground">
                {t("common.empty")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
