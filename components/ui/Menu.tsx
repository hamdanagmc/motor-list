"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/format";

/** Button + dropdown panel that closes on outside click, Escape, or when an item calls close(). */
export function Menu({
  label,
  trigger,
  triggerClassName,
  panelClassName,
  align = "right",
  children,
}: {
  label: string;
  trigger: ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
  align?: "left" | "right";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={id}
          className={cn(
            "absolute top-full z-50 mt-2 rounded-2xl border border-line bg-white/95 p-1.5 text-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export const menuItemClass =
  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-panel focus-visible:bg-panel focus-visible:outline-none";
