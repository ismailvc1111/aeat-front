import { mockCompanies } from "./companies";
import { mockCustomers } from "./customers";
import { mockProducts } from "./products";
import { mockInvoices } from "./invoices";
import type { Company, Customer, Invoice, Product } from "../types";

export type MockDatabase = {
  companies: Company[];
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let db: MockDatabase = {
  companies: clone(mockCompanies),
  customers: clone(mockCustomers),
  products: clone(mockProducts),
  invoices: clone(mockInvoices),
};

export const getDb = () => db;

export const setDb = (next: MockDatabase) => {
  db = next;
};

export const resetDb = () => {
  db = {
    companies: clone(mockCompanies),
    customers: clone(mockCustomers),
    products: clone(mockProducts),
    invoices: clone(mockInvoices),
  };
  return db;
};
