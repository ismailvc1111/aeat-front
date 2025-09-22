export const formatCurrency = (
  value: number,
  locale: string = "es-ES",
  currency: string = "EUR"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
