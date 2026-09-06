import { describe, expect, test } from "vitest";
import { BRAND_MARK_ALT, BRAND_MARK_COLORS } from "./brand-mark";

describe("semn brand", () => {
  test("alt e în română, fără engleză", () => {
    expect(BRAND_MARK_ALT).toBe("Logo Echilibru educație");
    expect(BRAND_MARK_ALT).not.toMatch(/\b(icon|mark|brand|education|balance)\b/i);
  });

  test("culorile urmează tokenii UI live", () => {
    expect(BRAND_MARK_COLORS.beam).toBe("#2C4B33");
    expect(BRAND_MARK_COLORS.fizic).toBe("#337344");
    expect(BRAND_MARK_COLORS.mental).toBe("#C79E41");
    expect(BRAND_MARK_COLORS.resurse).toBe("#B55F40");
    expect(BRAND_MARK_COLORS.social).toBe("#397A97");
  });
});
