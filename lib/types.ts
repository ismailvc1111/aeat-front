export type Company = {
  id: string;
  name: string;
  taxId: string;
  country: string;
  series: string[];
};

export type Customer = {
  id: string;
  companyId: string;
  name: string;
  taxId: string;
  country: string;
  email?: string;
};

export type Product = {
  id: string;
  companyId: string;
  name: string;
  unitPrice: number;
  taxRate: number;
};

export type InvoiceLine = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
};

export type InvoiceStatus = "draft" | "issued" | "sent";

export type Invoice = {
  id: string;
  companyId: string;
  customerId: string;
  status: InvoiceStatus;
  series: string;
  number?: number;
  issueDate?: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  currency: "EUR";
  lines: InvoiceLine[];
  notes?: string;
};
