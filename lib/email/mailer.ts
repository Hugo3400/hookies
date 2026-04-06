import nodemailer from 'nodemailer';

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let transporter: nodemailer.Transporter | null = null;

function isMailConfigured(): boolean {
  return Boolean(
    process.env.MAIL_HOST &&
      process.env.MAIL_PORT &&
      process.env.MAIL_USER &&
      process.env.MAIL_PASS
  );
}

function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!isMailConfigured()) {
    console.warn('Email non envoye: configuration SMTP manquante.');
    return false;
  }

  try {
    const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USER;
    if (!fromAddress) {
      console.warn('Email non envoye: MAIL_FROM ou MAIL_USER manquant.');
      return false;
    }

    await getTransporter().sendMail({
      from: fromAddress,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo,
    });

    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

export function hasMailConfig(): boolean {
  return isMailConfigured();
}
