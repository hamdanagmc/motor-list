import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { allowedDomain } from "@/lib/auth/email";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  const domain = allowedDomain();
  return (
    <main className="grid min-h-dvh place-items-center bg-panel px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center">
          <Logo large href="/login" />
        </div>
        <div className="mt-8 rounded-3xl bg-white px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] sm:px-8">
          <h1 className="text-[24px] font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-[15px] text-mute">Use your AGMC work email to continue.</p>
          <Suspense>
            <LoginForm domain={domain} />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-[12px] text-mute">For AGMC employees only.</p>
      </div>
    </main>
  );
}
