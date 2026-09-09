/**
 * Plain-text + simple HTML for archive booklet mail.
 * Brand matches auth emails (warm paper, green heading). PDF is attached separately.
 */

import { renderArchiveReadyEmail } from "@/lib/archive-email";
import type { DigestModel } from "@/lib/monday-digest";

export type DigestEmail = {
  subject: string;
  text: string;
  html: string;
};

export function renderDigestEmail(model: DigestModel): DigestEmail {
  if (model.kind === "weekly") {
    return renderArchiveReadyEmail({
      period: {
        kind: "weekly",
        start: model.start,
        end: model.end,
        periodKey: model.periodKey,
        label: `S${model.week} · ${model.theme}`,
        filename: `caiet-saptamana-${model.start}.pdf`,
      },
      theme: model.theme,
    });
  }
  return renderArchiveReadyEmail({
    period: {
      kind: "monthly",
      start: model.start,
      end: model.end,
      periodKey: model.periodKey,
      label: model.monthLabel,
      filename: `caiet-luna-${model.year}-${String(model.month).padStart(2, "0")}.pdf`,
    },
  });
}
