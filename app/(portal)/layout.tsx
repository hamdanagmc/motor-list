import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/layout/Providers";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </Providers>
  );
}
