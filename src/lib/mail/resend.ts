import { Resend } from "resend";
import { DIGEST_FROM } from "@/lib/monday-digest";

export type MailSendInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type MailSender = {
  send(input: MailSendInput): Promise<{ id: string | null }>;
};

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key && !key.startsWith("YOUR_") ? key : null;
}

export function createResendSender(
  apiKey = getResendApiKey(),
): MailSender | null {
  if (!apiKey) return null;
  const resend = new Resend(apiKey);
  return {
    async send(input) {
      const { data, error } = await resend.emails.send({
        from: DIGEST_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });
      if (error) {
        throw new Error(error.message || "Resend a refuzat trimiterea.");
      }
      return { id: data?.id ?? null };
    },
  };
}
