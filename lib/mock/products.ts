import { Product } from "../types";

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    companyId: "c1",
    name: "Consultoría mensual",
    unitPrice: 1200,
    taxRate: 21,
  },
  {
    id: "prod-2",
    companyId: "c1",
    name: "Mantenimiento anual",
    unitPrice: 4800,
    taxRate: 21,
  },
  {
    id: "prod-3",
    companyId: "c2",
    name: "Suscripción SaaS",
    unitPrice: 89,
    taxRate: 21,
  },
];
