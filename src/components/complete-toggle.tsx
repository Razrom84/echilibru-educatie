"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Completion } from "@/lib/types";

export function CompleteToggle({
  completion,
  disabled,
  onToggle,
  compact,
}: {
  completion: Completion | null;
  disabled?: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  const done = Boolean(completion);
  const pending = done && completion?.mode === "B" && completion.parent_approved === false;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={done}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 transition",
        compact ? "size-9" : "size-11",
        done
          ? pending
            ? "border-amber-700/40 bg-amber-100 text-amber-900"
            : "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-transparent hover:border-primary/50",
        disabled && "opacity-60",
      )}
      aria-label={done ? "Marchează ca nerealizat" : "Marchează ca făcut"}
    >
      <Check className="size-5" />
    </button>
  );
}
