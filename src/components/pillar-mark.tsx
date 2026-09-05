import { PILLAR_META } from "@/lib/pillars";
import type { Pillar } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PillarMark({
  pillar,
  className,
}: {
  pillar: Pillar;
  className?: string;
}) {
  const meta = PILLAR_META[pillar];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        meta.soft,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
