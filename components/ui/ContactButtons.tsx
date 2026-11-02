import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn, siteUrl, telHref, whatsappHref } from "@/lib/utils/format";

type Props = {
  phone?: string | null;
  whatsapp?: string | null;
  title: string;
  slug: string;
  disabled?: boolean;
  /** "card" matches the draft's compact grey buttons; "block" fills its container. */
  variant?: "card" | "block";
};

export function ContactButtons({ phone, whatsapp, title, slug, disabled, variant = "card" }: Props) {
  const base = cn(
    "relative z-10 flex h-10 items-center justify-center gap-2 rounded-lg text-[14px] font-semibold focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none",
    variant === "card" ? "bg-panel text-link" : "flex-1",
  );
  const off = "cursor-not-allowed opacity-40";
  const message = `Hi, I'm interested in the ${title} on Motorlist: ${siteUrl}/vehicle-stock/${slug}`;

  const call = (
    <>
      <FontAwesomeIcon icon={faPhone} className="text-[13px]" aria-hidden />
      Call
    </>
  );
  const wa = (
    <>
      <FontAwesomeIcon icon={faWhatsapp} className="text-[17px] text-[#25D366]" aria-hidden />
      WhatsApp
    </>
  );
  const callClass = cn(base, variant === "card" ? "w-[82px]" : "bg-apple text-white hover:bg-applehover");
  const waClass = cn(base, variant === "card" ? "w-[128px]" : "bg-panel text-ink hover:bg-[#EBEBF0]");

  return (
    <div className={cn("flex gap-2", variant === "block" && "w-full")}>
      {disabled || !phone ? (
        <button type="button" disabled aria-disabled className={cn(callClass, off)}>
          {call}
        </button>
      ) : (
        <a href={telHref(phone)} className={cn(callClass, variant === "card" && "hover:bg-[#EBEBF0]")}>
          {call}
        </a>
      )}
      {disabled || !whatsapp ? (
        <button type="button" disabled aria-disabled className={cn(waClass, off)}>
          {wa}
        </button>
      ) : (
        <a
          href={whatsappHref(whatsapp, message)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(waClass, variant === "card" && "hover:bg-[#EBEBF0]")}
        >
          {wa}
        </a>
      )}
    </div>
  );
}
