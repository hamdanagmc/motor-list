/** Server-only: the domain is read from env at request time. Pass it to client code as a prop. */
export const allowedDomain = () => (process.env.AUTH_ALLOWED_EMAIL_DOMAIN || "agmc.com").toLowerCase();

/** Shared by the login form (inline validation) and the Credentials provider (enforcement). */
export function isAllowedEmail(email: string, domain: string) {
  return /^[^\s@]+@[^\s@]+$/.test(email) && email.toLowerCase().endsWith(`@${domain}`);
}
