"use client";

import { useState } from "react";
import { useAppData } from "../../../lib/providers/app-data";
import { useI18n } from "../../../lib/i18n";
import { Table, type TableColumn } from "../../../components/Table";
import type { Product } from "../../../lib/types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "../../../components/ui/dialog";
import { useToast } from "../../../components/ui/toast-provider";
import { formatCurrency } from "../../../lib/utils/currency";
import { Plus } from "lucide-react";

export const runtime = "edge";

export default function ProductsPage() {
  const { products, createProduct, companyId } = useAppData();
  const { t, locale } = useI18n();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(21);

  const columns: TableColumn<Product>[] = [
    {
      header: t("products.title"),
      accessor: (product) => product.name,
    },
    {
      header: t("products.price"),
      accessor: (product) => formatCurrency(product.unitPrice, locale),
    },
    {
      header: t("products.taxRate"),
      accessor: (product) => `${product.taxRate}%`,
    },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyId) return;
    const product = await createProduct({
      companyId,
      name,
      unitPrice: price,
      taxRate,
    });
    notify({
      title: t("products.new"),
      description: product.name,
      variant: "success",
    });
    setName("");
    setPrice(0);
    setTaxRate(21);
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{t("products.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("products.subtitle")}</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("products.new")}
        </Button>
      </div>
      <Table
        data={products}
        columns={columns}
        emptyMessage={t("products.empty")}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{t("products.new")}</DialogTitle>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="product-name">{t("products.title")}</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-price">{t("products.price")}</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-tax">{t("products.taxRate")}</Label>
                <Input
                  id="product-tax"
                  type="number"
                  min="0"
                  max="21"
                  step="1"
                  value={taxRate}
                  onChange={(event) => setTaxRate(Number(event.target.value))}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("common.create")}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
