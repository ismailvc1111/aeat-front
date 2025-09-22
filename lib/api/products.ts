import { getDb, setDb } from "../mock/seed";
import type { Product } from "../types";

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

export const fetchProducts = async (companyId: string): Promise<Product[]> => {
  await wait();
  const { products } = getDb();
  return products.filter((product) => product.companyId === companyId);
};

export const createProduct = async (
  payload: Omit<Product, "id">
): Promise<Product> => {
  await wait();
  const db = getDb();
  const product: Product = {
    ...payload,
    id: `prod-${Date.now()}`,
  };
  setDb({
    ...db,
    products: [...db.products, product],
  });
  return product;
};

export const updateProduct = async (
  id: string,
  payload: Partial<Omit<Product, "id">>
): Promise<Product | undefined> => {
  await wait();
  const db = getDb();
  const products = db.products.map((product) =>
    product.id === id ? { ...product, ...payload } : product
  );
  const updated = products.find((product) => product.id === id);
  setDb({ ...db, products });
  return updated;
};

export const deleteProduct = async (id: string) => {
  await wait();
  const db = getDb();
  setDb({
    ...db,
    products: db.products.filter((product) => product.id !== id),
  });
};
