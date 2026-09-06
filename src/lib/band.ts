import type { AgeBand } from "@/lib/types";

/** Display label for the live band (en dash). */
export const PROGRAM_AGE_BAND_LABEL = "1–2";

/** Cristina lock (M2): every live-band `nota` must be this exact string. */
export const LIVE_BAND_NOTE =
  "Vârsta 1–2: scurt, fără forțare; el poate refuza.";

/** V1 publishes only band 1–2 (12–24 months). Birthdate is stored; band is 1–2. */
export function bandFromBirthdate(isoDate: string | null): AgeBand {
  void isoDate;
  return "1-2";
}
