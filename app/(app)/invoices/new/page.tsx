"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm, type InvoiceFormValues } from "../../../../components/InvoiceForm";
import { PdfPreview } from "../../../../components/PdfPreview";
import { useAppData } from "../../../../lib/providers/app-data";
import { useI18n } from "../../../../lib/i18n";
import type { Invoice } from "../../../../lib/types";
import { useToast } from "../../../../components/ui/toast-provider";

export const runtime = "edge";

export default function NewInvoicePage() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    customers,
    products,
    companyId,
    companies,
    createDraftInvoice,
    issueInvoiceById,
    refreshCompanyData,
  } = useAppData();
  const { notify } = useToast();
  const [saving, setSaving] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>();

  const company = useMemo(
    () => companies.find((item) => item.id === companyId),
    [companies, companyId]
  );

  const buildPayload = (values: InvoiceFormValues) => ({
    companyId: companyId!,
    customerId: values.customerId,
    status: "draft" as const,
    series: values.series,
    currency: values.currency,
    issueDate: undefined,
    number: undefined,
    subtotal: 0,
    taxTotal: 0,
    total: 0,
    lines: values.lines.map((line, index) => ({
      id: line.id ?? `line-${Date.now()}-${index}`,
      description: line.description,
      qty: line.qty,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
      lineTotal: 0,
    })),
    notes: values.notes,
  });

  const handleSave = async (values: InvoiceFormValues) => {
    if (!companyId) return;
    setSaving(true);
    try {
      const invoice = await createDraftInvoice(buildPayload(values));
      setCurrentInvoice(invoice);
    } finally {
      setSaving(false);
    }
  };

  const handleIssue = async (values: InvoiceFormValues) => {
    if (!companyId) return;
    setIssuing(true);
    try {
      let invoice = currentInvoice;
      if (!invoice) {
        invoice = await createDraftInvoice(buildPayload(values));
        setCurrentInvoice(invoice);
      }
      if (invoice) {
        const issued = await issueInvoiceById(invoice.id);
        if (issued) {
          setCurrentInvoice(issued);
          notify({
            title: t("invoices.issue"),
            description: t("status.issued"),
            variant: "success",
          });
          await refreshCompanyData();
          router.push(`/invoices/${issued.id}`);
        }
      }
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <InvoiceForm
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
