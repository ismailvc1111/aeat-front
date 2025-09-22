import { getDb, setDb } from "../mock/seed";
import type { Invoice, InvoiceLine } from "../types";
import { computeTotals } from "../utils/totals";

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

export const fetchInvoices = async (companyId: string): Promise<Invoice[]> => {
  await wait();
  const { invoices } = getDb();
  return invoices
    .filter((invoice) => invoice.companyId === companyId)
    .sort((a, b) => (b.issueDate ?? "").localeCompare(a.issueDate ?? ""));
};

export const getInvoice = async (id: string): Promise<Invoice | undefined> => {
  await wait();
  const { invoices } = getDb();
  return invoices.find((invoice) => invoice.id === id);
};

const calculateInvoice = (invoice: Invoice) => {
  const lines = invoice.lines.map((line) => {
    const base = line.qty * line.unitPrice;
    const tax = base * (line.taxRate / 100);
    return {
      ...line,
      lineTotal: +(base + tax).toFixed(2),
    };
  });
  const totals = computeTotals(
    lines.map((line) => ({
      qty: line.qty,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
    }))
  );
  return {
    ...invoice,
    lines,
    subtotal: totals.subtotal,
    taxTotal: totals.taxTotal,
    total: totals.total,
  };
};

export const createInvoice = async (
  payload: Omit<Invoice, "id" | "subtotal" | "taxTotal" | "total">
): Promise<Invoice> => {
  await wait();
  const db = getDb();
  const invoice: Invoice = calculateInvoice({
    ...payload,
    id: `inv-${Date.now()}`,
    subtotal: 0,
    taxTotal: 0,
    total: 0,
  });
  setDb({
    ...db,
    invoices: [...db.invoices, invoice],
  });
  return invoice;
};

export const updateInvoice = async (
  id: string,
  payload: Partial<
    Omit<Invoice, "id" | "subtotal" | "taxTotal" | "total" | "lines">
  > & { lines?: InvoiceLine[] }
): Promise<Invoice | undefined> => {
  await wait();
  const db = getDb();
  const invoices = db.invoices.map((invoice) => {
    if (invoice.id !== id) return invoice;
    const updated: Invoice = calculateInvoice({
      ...invoice,
      ...payload,
      lines: payload.lines ?? invoice.lines,
    });
    return updated;
  });
  const updated = invoices.find((invoice) => invoice.id === id);
  setDb({ ...db, invoices });
  return updated;
};

export const issueInvoice = async (id: string): Promise<Invoice | undefined> => {
  await wait();
  const db = getDb();
  const invoice = db.invoices.find((item) => item.id === id);
  if (!invoice) return undefined;
  const sameSeries = db.invoices.filter(
    (item) => item.companyId === invoice.companyId && item.series === invoice.series
  );
  const maxNumber = sameSeries.reduce((max, current) => {
    if (typeof current.number === "number") {
      return Math.max(max, current.number);
    }
    return max;
  }, 0);
  const issued: Invoice = {
    ...invoice,
    status: "issued",
    number: maxNumber + 1,
    issueDate: new Date().toISOString(),
  };
  const invoices = db.invoices.map((item) => (item.id === id ? issued : item));
  setDb({ ...db, invoices });
  return issued;
};

export const removeInvoice = async (id: string) => {
  await wait();
  const db = getDb();
  setDb({ ...db, invoices: db.invoices.filter((invoice) => invoice.id !== id) });
};
