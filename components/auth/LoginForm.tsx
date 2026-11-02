"use client";

import { faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isAllowedEmail } from "@/lib/auth/email";
import { cn } from "@/lib/utils/format";

type Errors = { email?: string; password?: string; form?: string };

/** Only same-origin paths, never back to /login or a protocol-relative URL. */
function safeCallback(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/login") || raw === "/") {
    return "/vehicle-stock";
  }
  return raw;
}

export function LoginForm({ domain }: { domain: string }) {
  const router = useRouter();
  const callbackUrl = safeCallback(useSearchParams().get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) =>
    !value.trim()
      ? "Enter your email address."
      : !isAllowedEmail(value.trim(), domain)
        ? `Use your @${domain} email address.`
        : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = { email: validateEmail(email), password: password ? undefined : "Enter your password." };
    setErrors(next);
    if (next.email || next.password) return;

    setLoading(true);
    const res = await signIn("credentials", { email: email.trim(), password, redirect: false });
    if (!res?.ok) {
      setLoading(false);
      setErrors({ form: "That email and password don’t match. Check them and try again." });
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  const field = (invalid: boolean) =>
    cn(
      "h-12 w-full rounded-full bg-fill px-5 text-[16px] outline-none transition placeholder:text-mute focus:bg-white focus:ring-4 focus:ring-apple/20",
      invalid && "bg-white ring-2 ring-flame/60 focus:ring-flame/30",
    );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      {errors.form && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-flame/10 px-4 py-3 text-[14px] text-flame">
          <FontAwesomeIcon icon={faCircleExclamation} className="mt-[3px] text-[13px]" />
          {errors.form}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block px-1 text-[13px] font-medium">
          Work email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder={`name@${domain}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => email && setErrors((er) => ({ ...er, email: validateEmail(email) }))}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field(Boolean(errors.email))}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 px-1 text-[13px] text-flame">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block px-1 text-[13px] font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={field(Boolean(errors.password))}
        />
        {errors.password && (
          <p id="password-error" className="mt-1.5 px-1 text-[13px] text-flame">
            {errors.password}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-apple text-[16px] font-medium text-white transition hover:bg-applehover focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none disabled:opacity-70"
      >
        {loading && <FontAwesomeIcon icon={faSpinner} spin className="text-[14px]" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
