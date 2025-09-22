"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvoiceForm, type InvoiceFormValues } from "../../../../components/InvoiceForm";
import { PdfPreview } from "../../../../components/PdfPreview";
import { useAppData } from "../../../../lib/providers/app-data";
import { useI18n } from "../../../../lib/i18n";
import type { Invoice } from "../../../../lib/types";
import { useToast } from "../../../../components/ui/toast-provider";

export const runtime = "edge";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const {
    invoices,
    customers,
    products,
    companyId,
    companies,
    updateDraftInvoice,
    issueInvoiceById,
    refreshCompanyData,
  } = useAppData();
  const { notify } = useToast();
  const invoice = invoices.find((item) => item.id === params.id);
  const [issuing, setIssuing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>(invoice);

  const company = useMemo(
    () => companies.find((item) => item.id === companyId),
    [companies, companyId]
  );

  if (!invoice) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {t("invoices.empty")}
      </div>
    );
  }

  const mapLines = (values: InvoiceFormValues) =>
    values.lines.map((line, index) => ({
      id: line.id ?? `line-${Date.now()}-${index}`,
      description: line.description,
      qty: line.qty,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
      lineTotal: 0,
    }));

  const handleSave = async (values: InvoiceFormValues) => {
    setSaving(true);
    try {
      const updated = await updateDraftInvoice(invoice.id, {
        customerId: values.customerId,
        series: values.series,
        notes: values.notes,
        lines: mapLines(values),
      });
      if (updated) {
        setCurrentInvoice(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleIssue = async (values: InvoiceFormValues) => {
    setIssuing(true);
    try {
      await handleSave(values);
      const issued = await issueInvoiceById(invoice.id);
      if (issued) {
        setCurrentInvoice(issued);
        notify({
          title: t("invoices.issue"),
          description: t("status.issued"),
          variant: "success",
        });
        await refreshCompanyData();
        router.refresh();
      }
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <InvoiceForm
        invoice={invoice}
        customers={customers}
        products={products}
        series={company?.series ?? []}
        isSubmitting={saving}
        isIssuing={issuing}
        onSubmit={handleSave}
        onIssue={handleIssue}
        onPreview={() => notify({ title: t("invoices.preview"), description: t("invoices.preview") })}
      />
      <PdfPreview invoiceNumber={currentInvoice?.number?.toString()} />
    </div>
  );
}
