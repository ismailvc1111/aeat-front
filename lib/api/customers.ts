import { getDb, setDb } from "../mock/seed";
import type { Customer } from "../types";

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

export const fetchCustomers = async (companyId: string): Promise<Customer[]> => {
  await wait();
  const { customers } = getDb();
  return customers.filter((customer) => customer.companyId === companyId);
};

export const createCustomer = async (
  payload: Omit<Customer, "id">
): Promise<Customer> => {
  await wait();
  const db = getDb();
  const customer: Customer = {
    ...payload,
    id: `cus-${Date.now()}`,
  };
  setDb({
    ...db,
    customers: [...db.customers, customer],
  });
  return customer;
};

export const updateCustomer = async (
  id: string,
  payload: Partial<Omit<Customer, "id">>
): Promise<Customer | undefined> => {
  await wait();
  const db = getDb();
  const customers = db.customers.map((customer) =>
    customer.id === id ? { ...customer, ...payload } : customer
  );
  const updated = customers.find((customer) => customer.id === id);
  setDb({ ...db, customers });
  return updated;
};

export const deleteCustomer = async (id: string) => {
  await wait();
  const db = getDb();
  setDb({
    ...db,
    customers: db.customers.filter((customer) => customer.id !== id),
  });
};
