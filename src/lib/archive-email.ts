/**
 * Short “booklet is ready” mail. PDF is attached by the sender; body has no scores.
 */

import {
  ARCHIVE_CTA_LABEL,
  DIGEST_ARHIVA_URL,
  MONTHLY_INTRO,
  WEEKLY_INTRO,
  YEARLY_INTRO,
  monthlySubject,
  weeklySubject,
  yearlySubject,
  type DigestKind,
} from "@/lib/monday-digest";
import type { ArchivePeriod } from "@/lib/archive";

export type ArchiveReadyEmail = {
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlShell(title: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="ro">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4eee3;color:#4a3d32;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fffdf8;border:1px solid #e6dcc8;border-radius:16px;">
            <tr>
              <td style="padding:36px 32px 40px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7a6d5e;">
                  educatie.echilibru-cartea.ro
                </p>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;font-weight:600;color:#3d5a45;">
                  Echilibru educație
                </h1>
                ${inner}
                <p style="margin:32px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#7a6d5e;">
                  Echilibru educație
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export function archiveMailIntro(kind: DigestKind): string {
  if (kind === "yearly") return YEARLY_INTRO;
  if (kind === "monthly") return MONTHLY_INTRO;
  return WEEKLY_INTRO;
}

export function archiveMailSubject(period: ArchivePeriod, theme?: string): string {
  if (period.kind === "yearly") {
    return yearlySubject(Number(period.label) || Number(period.start.slice(0, 4)));
  }
  if (period.kind === "monthly") return monthlySubject(period.label);
  return weeklySubject(theme?.trim() || period.label);
}

export function renderArchiveReadyEmail(args: {
  period: ArchivePeriod;
  theme?: string;
}): ArchiveReadyEmail {
  const intro = archiveMailIntro(args.period.kind);
  const subject = archiveMailSubject(args.period, args.theme);
  const text = [
    intro,
    "",
    args.period.label,
    "",
    `${ARCHIVE_CTA_LABEL}: ${DIGEST_ARHIVA_URL}`,
    "",
  ].join("\n");
  const html = htmlShell(
    subject,
    [
      `<h2 style="margin:28px 0 0;font-size:22px;line-height:1.3;font-weight:600;color:#4a3d32;">${escapeHtml(subject.replace(" — Echilibru educație", ""))}</h2>`,
      `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4a3d32;">${escapeHtml(intro)}</p>`,
      `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4a3d32;">${escapeHtml(args.period.label)}</p>`,
      `<p style="margin:28px 0 0;">
                  <a href="${escapeHtml(DIGEST_ARHIVA_URL)}" style="display:inline-block;background:#3d5a45;color:#faf6ee;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;padding:12px 22px;border-radius:10px;">
                    ${escapeHtml(ARCHIVE_CTA_LABEL)}
                  </a>
                </p>`,
    ].join("\n                "),
  );
  return { subject, text, html };
}
