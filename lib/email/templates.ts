type ContactTemplateInput = {
  name: string;
  email: string;
  message: string;
};

type ReservationTemplateInput = {
  name: string;
  email: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequest?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nlToBr(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br/>');
}

function cardRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#8f9db4;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#f6e9d2;font-size:14px;font-family:Arial,Helvetica,sans-serif;text-align:right;">${escapeHtml(value)}</td>
  </tr>`;
}

function baseEmailTemplate(title: string, subtitle: string, content: string): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#120d0a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:radial-gradient(circle at top,#3e2617 0%,#120d0a 65%);padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#1a120e;border:1px solid #7a4a2b;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;background:linear-gradient(135deg,#c8863c,#8b552e);">
                <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#1d120a;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Hookies Restaurant</div>
                <div style="margin-top:8px;font-size:26px;line-height:1.2;color:#fff4dd;font-weight:700;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(title)}</div>
                <div style="margin-top:8px;font-size:14px;line-height:1.45;color:#f8e7ca;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(subtitle)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px;">${content}</td>
            </tr>
            <tr>
              <td style="padding:14px 24px;border-top:1px solid #3a2a1f;color:#8f9db4;font-size:12px;font-family:Arial,Helvetica,sans-serif;">
                Hookies - Quai des Corsaires, Paris
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildContactAdminEmail(input: ContactTemplateInput): string {
  const content = `
    <p style="margin:0 0 14px;color:#e8d7bf;font-size:14px;line-height:1.55;font-family:Arial,Helvetica,sans-serif;">
      Nouveau message recu depuis le formulaire de contact.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #3a2a1f;border-bottom:1px solid #3a2a1f;margin:0 0 14px;">
      ${cardRow('Nom', input.name)}
      ${cardRow('Email', input.email)}
    </table>
    <div style="margin:0;padding:14px;border:1px solid #3f2f23;border-radius:10px;background:#140f0c;color:#f6e9d2;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
      ${nlToBr(input.message)}
    </div>
  `;

  return baseEmailTemplate('Nouveau message contact', 'Un client souhaite etre recontacte.', content);
}

export function buildReservationCustomerEmail(input: ReservationTemplateInput): string {
  const requestValue = input.specialRequest && input.specialRequest.trim().length > 0
    ? input.specialRequest
    : 'Aucune';

  const content = `
    <p style="margin:0 0 14px;color:#e8d7bf;font-size:14px;line-height:1.55;font-family:Arial,Helvetica,sans-serif;">
      Bonjour <strong>${escapeHtml(input.name)}</strong>, votre reservation est bien enregistree.
      Notre equipage vous confirmera rapidement.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #3a2a1f;border-bottom:1px solid #3a2a1f;margin:0 0 14px;">
      ${cardRow('Date', input.date)}
      ${cardRow('Heure', input.time)}
      ${cardRow('Couverts', String(input.guestCount))}
      ${cardRow('Demande speciale', requestValue)}
    </table>
    <p style="margin:0;color:#b9c7dd;font-size:13px;line-height:1.5;font-family:Arial,Helvetica,sans-serif;">
      Si besoin, repondez directement a cet email pour modifier votre reservation.
    </p>
  `;

  return baseEmailTemplate('Reservation recue', 'Votre table se prepare a bord de Hookies.', content);
}

export function buildReservationAdminEmail(input: ReservationTemplateInput): string {
  const requestValue = input.specialRequest && input.specialRequest.trim().length > 0
    ? input.specialRequest
    : 'Aucune';

  const content = `
    <p style="margin:0 0 14px;color:#e8d7bf;font-size:14px;line-height:1.55;font-family:Arial,Helvetica,sans-serif;">
      Nouvelle reservation a traiter.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #3a2a1f;border-bottom:1px solid #3a2a1f;margin:0 0 14px;">
      ${cardRow('Client', input.name)}
      ${cardRow('Email', input.email)}
      ${cardRow('Date', input.date)}
      ${cardRow('Heure', input.time)}
      ${cardRow('Couverts', String(input.guestCount))}
      ${cardRow('Demande speciale', requestValue)}
    </table>
  `;

  return baseEmailTemplate('Nouvelle reservation', 'Action admin recommandee: verifier et confirmer.', content);
}
