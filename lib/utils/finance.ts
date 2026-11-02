/**
 * UAE-style flat-rate car loan: interest is charged on the full principal for the whole term.
 * monthly = (principal + principal × rate × years) / months
 */
export function flatRateMonthly(price: number, downPayment: number, ratePercent: number, years: number) {
  const principal = Math.max(0, price - downPayment);
  const interest = principal * (ratePercent / 100) * years;
  const months = Math.max(1, Math.round(years * 12));
  return { principal, interest, total: principal + interest, monthly: (principal + interest) / months };
}
