"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "../../components/ui/button";
import { ArrowRight, Clock, Plus, Sparkles, TrendingUp, Wallet } from "lucide-react";

export const runtime = "edge";

export default function DashboardPage() {
  const { invoices, customers, refreshing, companies, companyId } = useAppData();
  const { t, locale } = useI18n();
  const router = useRouter();

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

  const company = useMemo(
    () => companies.find((item) => item.id === companyId),
    [companies, companyId]
  );

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl border border-border/50 bg-surface/95 px-8 py-8 shadow-[0_30px_80px_rgba(8,8,8,0.25)] backdrop-blur"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-text-primary lg:text-[34px]">
                {t("dashboard.heroTitle")}
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary">
                {t("dashboard.heroSubtitle")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                {t("status.issued")} · {stats.issuedCount}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
                {t("status.draft")} · {stats.draftCount}
              </span>
              {company ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  {company.name}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              className="gap-2 text-sm"
              size="lg"
              onClick={() => router.push("/invoices/new")}
              aria-label={t("invoices.new")}
            >
              <Plus className="h-4 w-4" />
              {t("invoices.new")}
            </Button>
            <Button
              variant="secondary"
              className="gap-2 text-sm"
              size="lg"
              onClick={() => router.push("/invoices")}
              aria-label={t("invoices.viewAll")}
            >
              {t("invoices.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <KpiCard
          label={t("dashboard.issuedTotal")}
          value={stats.issuedCount.toString()}
          hint={`${stats.issuedCount} ${t("status.issued")}`}
          icon={Sparkles}
        />
        <KpiCard
          label={t("dashboard.draftTotal")}
          value={stats.draftCount.toString()}
          hint={`${stats.draftCount} ${t("status.draft")}`}
          icon={Clock}
        />
        <KpiCard
          label={t("dashboard.totalAmount")}
          value={formatCurrency(stats.totalAmount, locale)}
          hint={t("dashboard.chartTitle")}
          icon={Wallet}
        />
        <KpiCard
          label={t("dashboard.averageAmount")}
          value={formatCurrency(stats.averageAmount, locale)}
          hint={t("dashboard.timeline")}
          icon={TrendingUp}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-text-primary">
              {t("dashboard.chartTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {refreshing ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" hide />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      borderRadius: 12,
                      border: `1px solid var(--border)` as string,
                      color: "var(--text-primary)",
                    }}
                    formatter={(value: number) => formatCurrency(value, locale)}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[10, 10, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-text-primary">
              {t("dashboard.timeline")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/invoices")}>
              {t("invoices.viewAll")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border/60 px-4 py-8 text-center text-sm text-text-secondary">
                {t("dashboard.emptyTimeline")}
              </p>
            ) : (
              <ul className="space-y-3">
                {timeline.map((invoice) => {
                  const customer = customers.find((item) => item.id === invoice.customerId);
                  return (
                    <li
                      key={invoice.id}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface/80 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-text-primary">
                          #{invoice.series}
                          {invoice.number ?? "—"}
                        </p>
                        <p className="text-xs text-text-secondary">{customer?.name ?? "—"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <StatusChip status={invoice.status} />
                        <p className="text-sm font-semibold text-text-primary">
                          {formatCurrency(invoice.total, locale)}
                        </p>
                        <p className="text-xs text-text-secondary">{invoice.issueDate}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
