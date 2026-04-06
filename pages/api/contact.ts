import type { NextApiRequest, NextApiResponse } from 'next';
import { hasMailConfig, sendEmail } from '@/lib/email/mailer';
import { buildContactAdminEmail } from '@/lib/email/templates';
import { CONTACT_API_CONTENT, EMAIL_CONTENT } from '@/lib/config/siteContent';

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: CONTACT_API_CONTENT.methodNotAllowed });
  }

  const { name, email, message } = req.body as ContactBody;

  if (!name || !email || !message) {
    return res.status(400).json({ error: CONTACT_API_CONTENT.missingFields });
  }

  const adminEmail = process.env.MAIL_ADMIN_TO;
  if (!adminEmail) {
    return res.status(500).json({ error: CONTACT_API_CONTENT.missingAdminEmail });
  }

  if (!hasMailConfig()) {
    return res.status(500).json({ error: CONTACT_API_CONTENT.smtpMissing });
  }

  const subject = `${EMAIL_CONTENT.contact.subjectPrefix} ${name}`;
  const text = [
    EMAIL_CONTENT.contact.textHeader,
    '',
    `Nom: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const sent = await sendEmail({
    to: adminEmail,
    subject,
    text,
    html: buildContactAdminEmail({
      name,
      email,
      message,
    }),
    replyTo: email,
  });

  if (!sent) {
    return res.status(500).json({ error: CONTACT_API_CONTENT.emailSendFailure });
  }

  return res.status(200).json({ success: true });
}
