import type { AgeBand } from "@/lib/types";

/** V1 publishes only band 2–3. Birthdate is stored; band is 2–3. */
export function bandFromBirthdate(isoDate: string | null): AgeBand {
  void isoDate;
  return "2-3";
}
