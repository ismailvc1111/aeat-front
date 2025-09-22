import { getDb } from "../mock/seed";
import type { Company } from "../types";

const wait = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

export const fetchCompanies = async (): Promise<Company[]> => {
  await wait();
  const { companies } = getDb();
  return [...companies];
};

export const fetchCompany = async (companyId: string): Promise<Company | undefined> => {
  await wait();
  const { companies } = getDb();
  return companies.find((company) => company.id === companyId);
};
