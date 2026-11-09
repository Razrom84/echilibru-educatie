"use client";

import { useEffect, useRef } from "react";
import { nextBirthdateValue } from "@/lib/birthdate";
import { cn } from "@/lib/utils";

/**
 * Native date field. A controlled empty value makes the first pick on
 * some phones snap back to blank; the input stays uncontrolled and we
 * only adopt a non-empty day.
 */
export function BirthdateField({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = ref.current;
    if (!input || input.value === value) return;
    input.value = value;
  }, [value]);

  function commit(incoming: string) {
    const next = nextBirthdateValue(value, incoming);
    if (next !== value) onChange(next);
  }

  return (
    <input
      ref={ref}
      id={id}
      name={id}
      type="date"
      required
      autoComplete="bday"
      defaultValue={value}
      onChange={(event) => commit(event.currentTarget.value)}
      onInput={(event) => commit(event.currentTarget.value)}
      onBlur={(event) => commit(event.currentTarget.value)}
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    />
  );
}
