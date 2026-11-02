import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return <ContentPage slug="terms-and-conditions" />;
}
