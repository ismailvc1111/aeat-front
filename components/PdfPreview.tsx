"use client";

import { useCallback, useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/toast-provider";
import { useI18n } from "../lib/i18n";
import { useRegisterCommand } from "./CommandK";

export function PdfPreview({ invoiceNumber }: { invoiceNumber?: string }) {
  const { notify } = useToast();
  const { t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const blob = new Blob([
      `PDF placeholder for invoice ${invoiceNumber ?? "draft"}`,
    ]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${invoiceNumber ?? "draft"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    notify({
      title: t("invoices.download"),
      description: t("invoices.pdfReady"),
    });
    setIsGenerating(false);
  }, [invoiceNumber, notify, t]);

  useRegisterCommand(
    useMemo(
      () => ({
        id: "download-pdf",
        title: t("invoices.download"),
        onSelect: () => handleDownload(),
      }),
      [handleDownload, t]
    )
  );

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-2">
        <CardTitle>{t("invoices.preview")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-52 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/60 text-sm text-muted-foreground shadow-inner shadow-black/10">
          PDF Preview Placeholder
        </div>
        <Button
          onClick={handleDownload}
          className="w-full gap-2"
          disabled={isGenerating}
        >
          <FileDown className="h-4 w-4" />
          {isGenerating ? t("common.loading") : t("invoices.download")}
        </Button>
      </CardContent>
    </Card>
  );
}
