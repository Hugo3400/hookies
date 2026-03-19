import type { NextApiRequest, NextApiResponse } from 'next';
import { hasMailConfig, sendEmail } from '@/lib/email/mailer';
import { buildContactAdminEmail } from '@/lib/email/templates';

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode non autorisee' });
  }

  const { name, email, message } = req.body as ContactBody;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont requis' });
  }

  const adminEmail = process.env.MAIL_ADMIN_TO;
  if (!adminEmail) {
    return res.status(500).json({ error: 'Email admin non configure' });
  }

  if (!hasMailConfig()) {
    return res.status(500).json({ error: 'SMTP non configure' });
  }

  const subject = `[Hookies] Nouveau message contact - ${name}`;
  const text = [
    'Nouveau message depuis la page contact:',
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
    return res.status(500).json({ error: 'Echec envoi email' });
  }

  return res.status(200).json({ success: true });
}
