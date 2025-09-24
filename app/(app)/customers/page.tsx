"use client";

import { useState } from "react";
import { useAppData } from "../../../lib/providers/app-data";
import { useI18n } from "../../../lib/i18n";
import { Table, type TableColumn } from "../../../components/Table";
import type { Customer } from "../../../lib/types";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "../../../components/ui/dialog";
import { useToast } from "../../../components/ui/toast-provider";
import { Plus } from "lucide-react";

export const runtime = "edge";

export default function CustomersPage() {
  const { customers, createCustomer, companyId } = useAppData();
  const { t } = useI18n();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [country, setCountry] = useState("ES");

  const columns: TableColumn<Customer>[] = [
    {
      header: t("customers.title"),
      accessor: (customer) => (
        <div>
          <p className="font-semibold text-text-primary">{customer.name}</p>
          <p className="text-xs text-text-secondary">{customer.email}</p>
        </div>
      ),
    },
    {
      header: t("customers.taxId"),
      accessor: (customer) => customer.taxId,
    },
    {
      header: t("customers.country"),
      accessor: (customer) => customer.country,
    },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyId) return;
    const customer = await createCustomer({
      companyId,
      name,
      email,
      taxId,
      country,
    });
    notify({
      title: t("customers.new"),
      description: customer.name,
      variant: "success",
    });
    setName("");
    setEmail("");
    setTaxId("");
    setCountry("ES");
    setOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-text-primary">{t("customers.title")}</h1>
          <p className="text-sm text-text-secondary">
            {t("customers.subtitle")}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("customers.new")}
        </Button>
      </div>
      <Table
        data={customers}
        columns={columns}
        emptyMessage={t("customers.empty")}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{t("customers.new")}</DialogTitle>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="customer-name">{t("auth.name")}</Label>
              <Input
                id="customer-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">{t("auth.email")}</Label>
              <Input
                id="customer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-tax">{t("customers.taxId")}</Label>
                <Input
                  id="customer-tax"
                  value={taxId}
                  onChange={(event) => setTaxId(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-country">{t("customers.country")}</Label>
                <Input
                  id="customer-country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
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
