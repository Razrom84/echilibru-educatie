/**
 * Plain-text + simple HTML for the Monday digest.
 * Brand matches auth emails (warm paper, green heading). No PDF.
 */

import {
  DIGEST_ANUL_URL,
  DIGEST_AZI_URL,
  MONTHLY_CTA_ANUL,
  MONTHLY_CTA_AZI,
  MONTHLY_INTRO,
  NOTES_HEADING,
  THEMES_HEADING,
  WEEKLY_CTA_LABEL,
  WEEKLY_INTRO,
  formatRoDayMonth,
  monthlyProgressLine,
  noteLine,
  progressLine,
  themeLine,
  type DigestChildProgress,
  type DigestModel,
  type MonthlyDigestModel,
  type WeeklyDigestModel,
} from "@/lib/monday-digest";

export type DigestEmail = {
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

function childProgressLines(
  children: readonly DigestChildProgress[],
  monthly: boolean,
): string[] {
  return children.map((child) => {
    const stat = monthly
      ? monthlyProgressLine(child.done)
      : progressLine(child.done, child.total);
    return children.length > 1 ? `${child.childName}: ${stat}` : stat;
  });
}

function weeklyText(model: WeeklyDigestModel): string {
  const range = `${formatRoDayMonth(model.start)} – ${formatRoDayMonth(model.end)}`;
  const lines = [
    `Săptămâna trecută · ${model.theme}`,
    "",
    WEEKLY_INTRO,
    "",
    `S${model.week} · ${range}`,
    ...childProgressLines(model.children, false),
  ];
  if (model.notes.length > 0) {
    lines.push("", NOTES_HEADING);
    for (const note of model.notes) {
      lines.push(noteLine(note, { showWeek: false }));
    }
  }
  lines.push("", `${WEEKLY_CTA_LABEL}: ${DIGEST_AZI_URL}`);
  return `${lines.join("\n")}\n`;
}

function monthlyText(model: MonthlyDigestModel): string {
  const lines = [
    `Luna trecută · ${model.monthLabel}`,
    "",
    MONTHLY_INTRO,
    "",
    THEMES_HEADING,
  ];
  if (model.themes.length === 0) {
    lines.push("Nicio săptămână de program în luna aceasta.");
  } else {
    for (const theme of model.themes) {
      lines.push(themeLine(theme));
    }
  }
  lines.push("", ...childProgressLines(model.children, true));
  if (model.notes.length > 0) {
    lines.push("", NOTES_HEADING);
    for (const note of model.notes) {
      lines.push(noteLine(note, { showWeek: true }));
    }
  }
  lines.push(
    "",
    `${MONTHLY_CTA_ANUL}: ${DIGEST_ANUL_URL}`,
    `${MONTHLY_CTA_AZI}: ${DIGEST_AZI_URL}`,
  );
  return `${lines.join("\n")}\n`;
}

function button(href: string, label: string): string {
  return `<p style="margin:28px 0 0;">
                  <a href="${escapeHtml(href)}" style="display:inline-block;background:#3d5a45;color:#faf6ee;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;padding:12px 22px;border-radius:10px;">
                    ${escapeHtml(label)}
                  </a>
                </p>`;
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

function p(text: string): string {
  return `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#4a3d32;">${escapeHtml(text)}</p>`;
}

function h2(text: string): string {
  return `<h2 style="margin:28px 0 0;font-size:22px;line-height:1.3;font-weight:600;color:#4a3d32;">${escapeHtml(text)}</h2>`;
}

function h3(text: string): string {
  return `<h3 style="margin:24px 0 0;font-size:16px;line-height:1.4;font-weight:600;color:#4a3d32;">${escapeHtml(text)}</h3>`;
}

function weeklyHtml(model: WeeklyDigestModel): string {
  const range = `${formatRoDayMonth(model.start)} – ${formatRoDayMonth(model.end)}`;
  const blocks = [
    h2(`Săptămâna trecută · ${model.theme}`),
    p(WEEKLY_INTRO),
    p(`S${model.week} · ${range}`),
    ...childProgressLines(model.children, false).map(p),
  ];
  if (model.notes.length > 0) {
    blocks.push(h3(NOTES_HEADING));
    for (const note of model.notes) {
      blocks.push(p(noteLine(note)));
    }
  }
  blocks.push(button(DIGEST_AZI_URL, WEEKLY_CTA_LABEL));
  return htmlShell(model.subject, blocks.join("\n                "));
}

function monthlyHtml(model: MonthlyDigestModel): string {
  const blocks = [
    h2(`Luna trecută · ${model.monthLabel}`),
    p(MONTHLY_INTRO),
    h3(THEMES_HEADING),
  ];
  if (model.themes.length === 0) {
    blocks.push(p("Nicio săptămână de program în luna aceasta."));
  } else {
    for (const theme of model.themes) {
      blocks.push(p(themeLine(theme)));
    }
  }
  blocks.push(...childProgressLines(model.children, true).map(p));
  if (model.notes.length > 0) {
    blocks.push(h3(NOTES_HEADING));
    for (const note of model.notes) {
      blocks.push(p(noteLine(note, { showWeek: true })));
    }
  }
  blocks.push(button(DIGEST_ANUL_URL, MONTHLY_CTA_ANUL));
  blocks.push(button(DIGEST_AZI_URL, MONTHLY_CTA_AZI));
  return htmlShell(model.subject, blocks.join("\n                "));
}

export function renderDigestEmail(model: DigestModel): DigestEmail {
  if (model.kind === "weekly") {
    return {
      subject: model.subject,
      text: weeklyText(model),
      html: weeklyHtml(model),
    };
  }
  return {
    subject: model.subject,
    text: monthlyText(model),
    html: monthlyHtml(model),
  };
}
