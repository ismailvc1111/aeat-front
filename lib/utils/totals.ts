export function computeTotals(
  lines: { qty: number; unitPrice: number; taxRate: number }[]
) {
  return lines.reduce(
    (acc, line) => {
      const base = line.qty * line.unitPrice;
      const tax = base * (line.taxRate / 100);
      return {
        subtotal: +(acc.subtotal + base).toFixed(2),
        taxTotal: +(acc.taxTotal + tax).toFixed(2),
        total: +(acc.total + base + tax).toFixed(2),
      };
    },
    { subtotal: 0, taxTotal: 0, total: 0 }
  );
}
