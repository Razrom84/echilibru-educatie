import { BRAND_MARK_ALT, BRAND_MARK_COLORS } from "@/lib/brand-mark";
import { cn } from "@/lib/utils";

/** Semn echilibru + 4 piloni — același desen ca faviconul. */
export function BrandMark({ className }: { className?: string }) {
  const { cream, beam, fizic, mental, resurse, social, border } =
    BRAND_MARK_COLORS;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0", className)}
      role="img"
      aria-label={BRAND_MARK_ALT}
    >
      <title>{BRAND_MARK_ALT}</title>
      <rect width="32" height="32" rx="8" fill={cream} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7.5"
        fill="none"
        stroke={border}
        strokeWidth="1"
      />
      <rect x="4" y="6" width="24" height="4" rx="2" fill={beam} />
      <rect x="6" y="12" width="4" height="14" rx="1.5" fill={fizic} />
      <rect x="12" y="12" width="4" height="14" rx="1.5" fill={mental} />
      <rect x="18" y="12" width="4" height="14" rx="1.5" fill={resurse} />
      <rect x="24" y="12" width="4" height="14" rx="1.5" fill={social} />
    </svg>
  );
}
