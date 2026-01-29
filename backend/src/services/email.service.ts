import nodemailer from 'nodemailer';
import { env } from '../config/environment';

type ContactPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
};

/**
 * Send an email using nodemailer. SMTP credentials must be provided via env vars.
 * If SMTP is not configured this will throw an error and callers should handle it.
 */
export const sendContactEmail = async (payload: ContactPayload) => {
  const recipient = env.CONTACT_RECIPIENT;

  if (!env.SMTP_HOST || !env.SMTP_PORT) {
    throw new Error('SMTP not configured. Set SMTP_HOST and SMTP_PORT in backend .env');
  }

  const port = Number(env.SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });

  const subject = `New contact form submission from ${payload.firstName} ${payload.lastName ?? ''}`.trim();

  const html = `
    <p><strong>Name:</strong> ${payload.firstName} ${payload.lastName ?? ''}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Message:</strong></p>
    <div>${payload.message.replace(/\n/g, '<br/>')}</div>
  `;

  const info = await transporter.sendMail({
    from: env.SMTP_USER || `no-reply@${env.FRONTEND_URL?.replace(/^https?:\/\//, '')}`,
    to: recipient,
    subject,
    html,
    text: `${subject}\n\n${payload.message}`,
  });

  return info;
};
