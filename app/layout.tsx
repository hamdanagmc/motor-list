import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteUrl } from "@/lib/utils/format";
import "./globals.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Motorlist", template: "%s | Motorlist" },
  description: "AGMC internal vehicle stock portal.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white font-sans text-ink">{children}</body>
    </html>
  );
}
