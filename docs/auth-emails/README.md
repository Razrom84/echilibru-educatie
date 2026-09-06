# Auth email templates (RO)

Sursă de adevăr pentru HTML-ul Auth. SMTP e în afara acestui ticket — nu se configurează aici.

## Subjects

| Template Supabase | Fișier | Subject |
| --- | --- | --- |
| Confirm signup | `confirm-signup.html` | `Confirmă contul — Echilibru educație` |
| Magic link / resend | `magic-link.html` | `Link nou de confirmare — Echilibru educație` |

Ambele template-uri folosesc variabila Go `{{ .ConfirmationURL }}`. Brand: **Echilibru educație**. Fără „Powered by Supabase”.

## Aplicare

1. Supabase Dashboard → **Authentication** → **Email Templates** — lipești subject + HTML din fișierele de mai sus.
2. Sau Management API (`PATCH /v1/projects/{ref}/config/auth`):
   - Confirm signup: `mailer_subjects_confirmation` / `mailer_templates_confirmation_content`
   - Magic link: `mailer_subjects_magic_link` / `mailer_templates_magic_link_content`

<!--
Notă opțională (nu e template built-in Supabase; nu se aplică din Dashboard Auth):
Un email de bun-venit după confirmare, dacă îl trimitem separat (app / transactional):
Subject: Ești înăuntru — Azi te așteaptă
-->
