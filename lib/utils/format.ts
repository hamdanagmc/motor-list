const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatNumber = (n: number) => nf.format(n);
export const formatAED = (n: number) => `AED ${nf.format(n)}`;
export const formatKm = (n: number) => `${nf.format(n)} km`;

/** "AED 150k", "AED 1.2M" for chip labels. */
export function compactAED(n: number) {
  if (n >= 1_000_000) return `AED ${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${Math.round(n / 1_000)}k`;
  return `AED ${n}`;
}

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
