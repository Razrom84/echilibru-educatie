import type { AgeBand } from "@/lib/types";

/** Display label for the live band (en dash). */
export const PROGRAM_AGE_BAND_LABEL = "1–2";

/** V1 publishes only band 1–2 (12–24 months). Birthdate is stored; band is 1–2. */
export function bandFromBirthdate(isoDate: string | null): AgeBand {
  void isoDate;
  return "1-2";
}
