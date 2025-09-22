import { Customer } from "../types";

export const mockCustomers: Customer[] = [
  {
    id: "cus-1",
    companyId: "c1",
    name: "Innova Studio",
    taxId: "ES12345678A",
    country: "ES",
    email: "hola@innova.studio",
  },
  {
    id: "cus-2",
    companyId: "c1",
    name: "Blue Ocean LLC",
    taxId: "US98-1234567",
    country: "US",
    email: "finance@blueocean.com",
  },
  {
    id: "cus-3",
    companyId: "c2",
    name: "Northwind",
    taxId: "ES87654321B",
    country: "ES",
    email: "accounting@northwind.es",
  },
];
