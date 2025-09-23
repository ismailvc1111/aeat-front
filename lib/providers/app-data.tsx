"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "../api/customers";
import {
  createInvoice,
  fetchInvoices,
  issueInvoice,
  removeInvoice,
  updateInvoice,
} from "../api/invoices";
import { fetchCompanies } from "../api/companies";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../api/products";
import type {
  Company,
  Customer,
  Invoice,
  InvoiceLine,
  Product,
} from "../types";

export type DataContextValue = {
  companies: Company[];
  companyId: string | null;
  setCompanyId: (id: string) => void;
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  loading: boolean;
  refreshing: boolean;
  refreshCompanyData: (id?: string) => Promise<void>;
  upsertInvoice: (invoice: Invoice) => void;
  createDraftInvoice: (
    data: Omit<Invoice, "id" | "subtotal" | "taxTotal" | "total">
  ) => Promise<Invoice>;
  updateDraftInvoice: (
    id: string,
    data: Partial<
      Omit<Invoice, "id" | "subtotal" | "taxTotal" | "total" | "lines">
    > & { lines?: InvoiceLine[] }
  ) => Promise<Invoice | undefined>;
  issueInvoiceById: (id: string) => Promise<Invoice | undefined>;
  removeInvoiceById: (id: string) => Promise<void>;
  createCustomer: (payload: Omit<Customer, "id">) => Promise<Customer>;
  updateCustomer: (
    id: string,
    payload: Partial<Omit<Customer, "id">>
  ) => Promise<Customer | undefined>;
  deleteCustomer: (id: string) => Promise<void>;
  createProduct: (payload: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (
    id: string,
    payload: Partial<Omit<Product, "id">>
  ) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      setLoading(true);
      const fetchedCompanies = await fetchCompanies();
      if (!active) return;
      setCompanies(fetchedCompanies);
      setCompanyId((current) => current ?? fetchedCompanies[0]?.id ?? null);
      setLoading(false);
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCompanyData = async () => {
      if (!companyId) return;
      setRefreshing(true);
      const [companyCustomers, companyProducts, companyInvoices] = await Promise.all([
        fetchCustomers(companyId),
        fetchProducts(companyId),
        fetchInvoices(companyId),
      ]);
      if (!active) return;
      setCustomers(companyCustomers);
      setProducts(companyProducts);
      setInvoices(companyInvoices);
      setRefreshing(false);
    };
    loadCompanyData();
    return () => {
      active = false;
    };
  }, [companyId]);

  const refreshCompanyData = useCallback(async (id?: string) => {
    const targetId = id ?? companyId;
    if (!targetId) return;
    setRefreshing(true);
    const [companyCustomers, companyProducts, companyInvoices] = await Promise.all([
      fetchCustomers(targetId),
      fetchProducts(targetId),
      fetchInvoices(targetId),
    ]);
    setCustomers(companyCustomers);
    setProducts(companyProducts);
    setInvoices(companyInvoices);
    setRefreshing(false);
  }, [companyId]);

  const value = useMemo<DataContextValue>(() => ({
    companies,
    companyId,
    setCompanyId,
    customers,
    products,
    invoices,
    loading,
    refreshing,
    refreshCompanyData,
    upsertInvoice: (invoice: Invoice) => {
      setInvoices((current) => {
        const exists = current.some((item) => item.id === invoice.id);
        if (exists) {
          return current.map((item) => (item.id === invoice.id ? invoice : item));
        }
        return [invoice, ...current];
      });
    },
    createDraftInvoice: async (payload) => {
      const invoice = await createInvoice(payload);
      setInvoices((current) => [invoice, ...current]);
      return invoice;
    },
    updateDraftInvoice: async (id, data) => {
      const invoice = await updateInvoice(id, data);
      if (invoice) {
        setInvoices((current) =>
          current.map((item) => (item.id === invoice.id ? invoice : item))
        );
      }
      return invoice;
    },
    issueInvoiceById: async (id) => {
      const issued = await issueInvoice(id);
      if (issued) {
        setInvoices((current) =>
          current.map((item) => (item.id === issued.id ? issued : item))
        );
      }
      return issued;
    },
    removeInvoiceById: async (id) => {
      await removeInvoice(id);
      setInvoices((current) => current.filter((item) => item.id !== id));
    },
    createCustomer: async (payload) => {
      const customer = await createCustomer(payload);
      setCustomers((current) => [customer, ...current]);
      return customer;
    },
    updateCustomer: async (id, payload) => {
      const updated = await updateCustomer(id, payload);
      if (updated) {
        setCustomers((current) =>
          current.map((item) => (item.id === id ? updated : item))
        );
      }
      return updated;
    },
    deleteCustomer: async (id) => {
      await deleteCustomer(id);
      setCustomers((current) => current.filter((item) => item.id !== id));
    },
    createProduct: async (payload) => {
      const product = await createProduct(payload);
      setProducts((current) => [product, ...current]);
      return product;
    },
    updateProduct: async (id, payload) => {
      const updated = await updateProduct(id, payload);
      if (updated) {
        setProducts((current) =>
          current.map((item) => (item.id === id ? updated : item))
        );
      }
      return updated;
    },
    deleteProduct: async (id) => {
      await deleteProduct(id);
      setProducts((current) => current.filter((item) => item.id !== id));
    },
  }), [
    companies,
    companyId,
    customers,
    products,
    invoices,
    loading,
    refreshing,
    refreshCompanyData,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useAppData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return context;
};
