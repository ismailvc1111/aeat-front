"use client";

import { useEffect, useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MoneyInput } from "./MoneyInput";
import { TaxBadge } from "./TaxBadge";
import { useToast } from "./ui/toast-provider";
import type { Customer, Invoice, Product } from "../lib/types";
import { computeTotals } from "../lib/utils/totals";
import { useI18n } from "../lib/i18n";
import { useRegisterCommand } from "./CommandK";
import { formatCurrency } from "../lib/utils/currency";
import { Eye, Plus, Save, Send } from "lucide-react";

const LineSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1),
  qty: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
  taxRate: z.coerce.number().min(0).max(21),
});

const InvoiceSchema = z.object({
  customerId: z.string().min(1),
  series: z.string().min(1),
  currency: z.literal("EUR"),
  notes: z.string().optional(),
  lines: z.array(LineSchema).min(1),
});

export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;

export function InvoiceForm({
  invoice,
  customers,
  products,
  series,
  isSubmitting,
  isIssuing,
  onSubmit,
  onIssue,
  onPreview,
}: {
  invoice?: Invoice;
  customers: Customer[];
  products: Product[];
  series: string[];
  isSubmitting?: boolean;
  isIssuing?: boolean;
  onSubmit: (values: InvoiceFormValues) => Promise<void> | void;
  onIssue?: (values: InvoiceFormValues) => Promise<void> | void;
  onPreview?: () => void;
}) {
  const { notify } = useToast();
  const { t, locale } = useI18n();

  const defaultValues: InvoiceFormValues = useMemo(
    () => ({
      customerId: invoice?.customerId ?? customers[0]?.id ?? "",
      series: invoice?.series ?? series[0] ?? "",
      currency: "EUR",
      notes: invoice?.notes ?? "",
      lines:
        invoice?.lines ?? [
          {
            id: "temp-1",
            description: products[0]?.name ?? "",
            qty: 1,
            unitPrice: products[0]?.unitPrice ?? 0,
            taxRate: products[0]?.taxRate ?? 21,
          },
        ],
    }),
    [invoice, customers, products, series]
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues,
    mode: "onChange",
  });

  const { control, watch, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const watchedLines = watch("lines") ?? [];
  const totals = computeTotals(watchedLines);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useRegisterCommand(
    useMemo(
      () => ({
        id: "invoice-preview",
        title: t("invoices.preview"),
        shortcutKey: "p",
        shortcutLabel: "P",
        onSelect: () => onPreview?.(),
      }),
      [onPreview, t]
    )
  );

  const handleIssue = useMemo(
    () =>
      handleSubmit(async (values) => {
        if (onIssue) {
          await onIssue(values);
        }
      }),
    [handleSubmit, onIssue]
  );

  useRegisterCommand(
    useMemo(
      () => ({
        id: "invoice-issue",
        title: t("invoices.issue"),
        shortcutKey: "s",
        shortcutLabel: "S",
        onSelect: () => handleIssue(),
      }),
      [handleIssue, t]
    )
  );

  const submitHandler: SubmitHandler<InvoiceFormValues> = async (values) => {
    await onSubmit(values);
    notify({
      title: t("invoices.saveDraft"),
      description: t("invoices.draftSaved"),
      variant: "success",
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-border/40 bg-card/70 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.28)]">
          <div>
            <Label htmlFor="customer">{t("invoices.customer")}</Label>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-2" id="customer">
                    <SelectValue placeholder={t("customers.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="series">{t("invoices.series")}</Label>
            <Controller
              control={control}
              name="series"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-2" id="series">
                    <SelectValue placeholder={t("invoices.series")} />
                  </SelectTrigger>
                  <SelectContent>
                    {series.map((serie) => (
                      <SelectItem key={serie} value={serie}>
                        {serie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-border/40 bg-card/70 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.28)]">
          <div>
            <Label>{t("invoices.notes")}</Label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea {...field} className="mt-2" rows={4} />
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">
            {t("invoices.lines")}
          </h3>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() =>
              append({ description: "", qty: 1, unitPrice: 0, taxRate: 21 })
            }
          >
            <Plus className="h-4 w-4" />
            {t("invoices.addLine")}
          </Button>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-4 rounded-3xl border border-border/40 bg-card/70 p-5 shadow-[0_18px_40px_rgba(15,15,15,0.2)] md:grid-cols-6"
            >
              <div className="md:col-span-2">
                <Label htmlFor={`lines.${index}.description`}>
                  {t("invoices.description")}
                </Label>
                <Input
                  id={`lines.${index}.description`}
                  {...form.register(`lines.${index}.description` as const)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor={`lines.${index}.qty`}>
                  {t("invoices.quantity")}
                </Label>
                <Input
                  id={`lines.${index}.qty`}
                  type="number"
                  step="1"
                  min="1"
                  {...form.register(`lines.${index}.qty` as const, {
                    valueAsNumber: true,
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t("products.price")}</Label>
                <Controller
                  control={control}
                  name={`lines.${index}.unitPrice` as const}
                  render={({ field }) => (
                    <MoneyInput {...field} className="mt-1" />
                  )}
                />
              </div>
              <div>
                <Label>{t("products.taxRate")}</Label>
                <Controller
                  control={control}
                  name={`lines.${index}.taxRate` as const}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min="0"
                      max="21"
                      step="1"
                      {...field}
                      className="mt-1"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col justify-between gap-2">
                <TaxBadge rate={watch(`lines.${index}.taxRate`)} />
                <Button
                  type="button"
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  {t("invoices.remove")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border/40 bg-card/70 p-6 shadow-[0_18px_40px_rgba(15,15,15,0.2)]">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt>{t("invoices.subtotal")}</dt>
              <dd>{formatCurrency(totals.subtotal, locale)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>{t("invoices.taxes")}</dt>
              <dd>{formatCurrency(totals.taxTotal, locale)}</dd>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <dt>{t("invoices.totalDue")}</dt>
              <dd>{formatCurrency(totals.total, locale)}</dd>
            </div>
          </dl>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="outline" className="gap-2" onClick={() => onPreview?.()}>
            <Eye className="h-4 w-4" />
            {t("invoices.preview")}
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? t("common.loading") : t("invoices.saveDraft")}
          </Button>
          <Button
            type="button"
            className="gap-2"
            disabled={isIssuing}
            onClick={() => handleIssue()}
          >
            <Send className="h-4 w-4" />
            {isIssuing ? t("common.loading") : t("invoices.issue")}
          </Button>
        </div>
      </div>
    </form>
  );
}
