import { describe, expect, test } from "vitest";
import {
  authorizeCronRequest,
  parseAsOf,
  parseDryRun,
} from "./cron-auth";

describe("cron auth + QA query flags", () => {
  test("requires Bearer CRON_SECRET", () => {
    const prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    try {
      expect(
        authorizeCronRequest(
          new Request("http://localhost/api/cron/raport-luni"),
        ),
      ).toBe(false);
      expect(
        authorizeCronRequest(
          new Request("http://localhost/api/cron/raport-luni", {
            headers: { authorization: "Bearer wrong" },
          }),
        ),
      ).toBe(false);
      expect(
        authorizeCronRequest(
          new Request("http://localhost/api/cron/raport-luni", {
            headers: { authorization: "Bearer test-secret" },
          }),
        ),
      ).toBe(true);
    } finally {
      if (prev == null) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = prev;
    }
  });

  test("dryRun and asOf parse from the URL", () => {
    const request = new Request(
      "http://localhost/api/cron/raport-luni?dryRun=1&asOf=2026-09-14",
    );
    expect(parseDryRun(request)).toBe(true);
    expect(parseAsOf(request)).toBe("2026-09-14");
    expect(parseAsOf(new Request("http://localhost/x?asOf=nope"))).toBeNull();
  });
});
