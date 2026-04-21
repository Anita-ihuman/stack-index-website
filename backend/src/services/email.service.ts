import { env } from '../config/environment';

type ContactPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
};

/**
 * Send a contact form notification via Brevo transactional email API.
 * Falls back to logging if BREVO_API_KEY is not set (e.g. local dev).
 */
export const sendContactEmail = async (payload: ContactPayload) => {
  const recipient = env.CONTACT_RECIPIENT || 'thestackindex@gmail.com';
  const name = `${payload.firstName} ${payload.lastName ?? ''}`.trim();
  const subject = `New contact form submission from ${name}`;

  const html = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Message:</strong></p>
    <div style="white-space:pre-wrap">${payload.message.replace(/\n/g, '<br/>')}</div>
  `;

  if (!env.BREVO_API_KEY) {
    // Dev fallback — log to console so local testing still works
    console.log('[Contact] No BREVO_API_KEY — logging message instead of sending email');
    console.log({ to: recipient, subject, from: payload.email, message: payload.message });
    return { ok: true, dev: true };
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Stack Index', email: 'thestackindex@gmail.com' },
      to: [{ email: recipient }],
      replyTo: { email: payload.email, name },
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }

  return { ok: true };
};
