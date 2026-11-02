import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/ContentPage";

export const metadata: Metadata = { title: "Employee Benefits" };

export default function EmployeeBenefitsPage() {
  return <ContentPage slug="employee-benefits" />;
}
