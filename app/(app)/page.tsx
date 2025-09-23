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
import { ArrowUpRight, Clock, Plus, Sparkles, TrendingUp, Wallet } from "lucide-react";

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
      >
        <Card className="border-border/40 bg-gradient-to-br from-primary/15 via-card/70 to-card/50 p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                {t("common.appName")}
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-balance">
                {t("dashboard.heroTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("dashboard.heroSubtitle")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="gap-2" onClick={() => router.push("/invoices/new")}>
                <Plus className="h-4 w-4" />
                {t("invoices.new")}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => router.push("/invoices")}
              >
                {t("invoices.viewAll")}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              {t("status.issued")} · {stats.issuedCount}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
              {t("status.draft")} · {stats.draftCount}
            </span>
            {company ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {company.name}
              </span>
            ) : null}
          </div>
        </Card>
      </motion.section>
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
          icon={<Sparkles className="h-4 w-4" />}
        />
        <KpiCard
          title={t("dashboard.draftTotal")}
          value={stats.draftCount.toString()}
          trend={`${stats.draftCount} ${t("status.draft")}`}
          accent="warning"
          icon={<Clock className="h-4 w-4" />}
        />
        <KpiCard
          title={t("dashboard.totalAmount")}
          value={formatCurrency(stats.totalAmount, locale)}
          trend={t("dashboard.chartTitle")}
          accent="success"
          icon={<Wallet className="h-4 w-4" />}
        />
        <KpiCard
          title={t("dashboard.averageAmount")}
          value={formatCurrency(stats.averageAmount, locale)}
          trend={t("dashboard.timeline")}
          accent="primary"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader className="pb-2">
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
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle>{t("dashboard.timeline")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((invoice) => {
              const customer = customers.find((c) => c.id === invoice.customerId);
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-2xl border border-border/40 bg-white/5 p-4 backdrop-blur"
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
