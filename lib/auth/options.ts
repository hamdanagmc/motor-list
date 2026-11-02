import { createHash, timingSafeEqual } from "node:crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { allowedDomain, isAllowedEmail } from "./email";

const sha256 = (s: string) => createHash("sha256").update(s).digest();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 10 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    // To move to Microsoft Entra ID SSO, replace this provider with
    //   AzureADProvider({ clientId, clientSecret, tenantId })  from "next-auth/providers/azure-ad"
    // and change the login form to call signIn("azure-ad"). Nothing else depends on the provider.
    // ponytail: one shared password from env is a stopgap until SSO; it identifies users by email only.
    CredentialsProvider({
      name: "AGMC email",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() ?? "";
        const password = credentials?.password ?? "";
        const expected = process.env.AUTH_CREDENTIALS_PASSWORD;
        if (!expected || !password || !isAllowedEmail(email, allowedDomain())) return null;
        if (!timingSafeEqual(sha256(password), sha256(expected))) return null;
        const name = email
          .split("@")[0]
          .split(/[._-]+/)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
        return { id: email, email, name };
      },
    }),
  ],
};
