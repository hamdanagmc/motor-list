import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-panel px-6 text-center">
      <div>
        <div className="flex justify-center">
          <Logo large />
        </div>
        <h1 className="mt-10 text-[28px] font-semibold tracking-tight">This page isn’t here.</h1>
        <p className="mt-2 text-[15px] text-mute">The car may have been removed from stock, or the link is wrong.</p>
        <Link
          href="/vehicle-stock"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-apple px-6 text-[15px] font-medium text-white hover:bg-applehover"
        >
          Browse vehicle stock
        </Link>
      </div>
    </main>
  );
}
