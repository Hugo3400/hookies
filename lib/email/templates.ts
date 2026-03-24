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
    <td style="padding:10px 0;color:#a0a8b8;font-size:12px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:500;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;color:#fff;font-size:14px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:600;text-align:right;">${escapeHtml(value)}</td>
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
  <body style="margin:0;padding:0;background:#0a0e13;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0e13;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#151b24;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
            <!-- Header pirate moderne -->
            <tr>
              <td style="padding:32px 28px;background:linear-gradient(135deg,#1a2332 0%,#0f1419 100%);border-bottom:3px solid #dc2626;">
                <div style="text-align:center;">
                  <div style="font-size:24px;letter-spacing:1px;margin-bottom:8px;">⚓ HOOKIES ⚓</div>
                  <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#dc2626;font-weight:700;font-family:'Segoe UI',Helvetica,sans-serif;margin-bottom:12px;">Pirate Tavern</div>
                  <div style="margin-top:12px;font-size:24px;line-height:1.3;color:#e5e7eb;font-weight:700;font-family:'Segoe UI',sans-serif;">${escapeHtml(title)}</div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.5;color:#9ca3af;font-family:'Segoe UI',sans-serif;">${escapeHtml(subtitle)}</div>
                </div>
              </td>
            </tr>
            <!-- Contenu -->
            <tr>
              <td style="padding:28px 28px;color:#d1d5db;font-family:'Segoe UI',sans-serif;">${content}</td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #2d3748;background:#0f1419;color:#6b7280;font-size:12px;font-family:'Segoe UI',sans-serif;text-align:center;">
                <div style="margin-bottom:6px;">🏴 HOOKIES - Quai des Corsaires, Paris 🏴</div>
                <div style="font-size:11px;color:#4b5563;margin-top:6px;">Bon voilage!</div>
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
    <p style="margin:0 0 16px;color:#d1d5db;font-size:14px;line-height:1.6;font-family:'Segoe UI',sans-serif;">
      📮 Un nouveau message a ete recu depuis le formulaire de contact.
    </p>
    <div style="background:#1f2937;border-left:4px solid #dc2626;padding:16px;border-radius:6px;margin-bottom:16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;">
        ${cardRow('Nom', input.name)}
        ${cardRow('Email', input.email)}
      </table>
    </div>
    <div style="margin:0;padding:16px;background:#0f1419;border:1px solid #374151;border-radius:8px;color:#e5e7eb;font-size:14px;line-height:1.6;font-family:'Segoe UI',sans-serif;">
      <strong style="color:#fbbf24;">Message:</strong><br/><br/>
      ${nlToBr(input.message)}
    </div>
  `;

  return baseEmailTemplate('Nouveau Message', 'Un client souhaite etre recontacte', content);
}

export function buildReservationCustomerEmail(input: ReservationTemplateInput): string {
  const requestValue = input.specialRequest && input.specialRequest.trim().length > 0
    ? input.specialRequest
    : 'Aucune demande';

  const content = `
    <p style="margin:0 0 16px;color:#d1d5db;font-size:14px;line-height:1.6;font-family:'Segoe UI',sans-serif;">
      Ahoy <strong style="color:#fbbf24;">${escapeHtml(input.name)}</strong>! ⚓<br/>
      Votre reservation est enregistree. Notre equipage de corsaires confirme votre arrivee tres bientot.
    </p>
    <div style="background:#1f2937;border:2px solid #dc2626;border-radius:8px;padding:20px;margin:16px 0;">
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#fbbf24;font-weight:700;margin-bottom:8px;">Vos Details</div>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;">
        ${cardRow('📅 Date', input.date)}
        ${cardRow('⏰ Heure', input.time)}
        ${cardRow('👥 Couverts', String(input.guestCount))}
        ${cardRow('📝 Demande Speciale', requestValue)}
      </table>
    </div>
    <p style="margin:16px 0 0;padding:16px;background:#0f1419;border-left:3px solid #fbbf24;color:#9ca3af;font-size:13px;line-height:1.5;font-family:'Segoe UI',sans-serif;border-radius:4px;">
      ✉️ Si vous devez modifier votre reservation, repondez simplement a cet email.
    </p>
  `;

  return baseEmailTemplate('Reservation Confirmee!', 'Votre table vous attend a bord de HOOKIES', content);
}

export function buildReservationAdminEmail(input: ReservationTemplateInput): string {
  const requestValue = input.specialRequest && input.specialRequest.trim().length > 0
    ? input.specialRequest
    : 'Aucune demande';

  const content = `
    <p style="margin:0 0 16px;color:#d1d5db;font-size:14px;line-height:1.6;font-family:'Segoe UI',sans-serif;">
      ⚔️ Alerte! Une nouvelle reservation a traiter immediatement.
    </p>
    <div style="background:#3b2221;border:2px solid #dc2626;border-radius:8px;padding:20px;margin:16px 0;">
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#fbbf24;font-weight:700;margin-bottom:8px;">Informations Client</div>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;">
        ${cardRow('Client', input.name)}
        ${cardRow('Email', input.email)}
      </table>
    </div>
    <div style="background:#1f2937;border:1px solid #374151;border-radius:8px;padding:20px;margin:16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;">
        ${cardRow('📅 Date', input.date)}
        ${cardRow('⏰ Heure', input.time)}
        ${cardRow('👥 Couverts', String(input.guestCount))}
        ${cardRow('📝 Demande Speciale', requestValue)}
      </table>
    </div>
    <div style="padding:12px 16px;background:#1f2937;border-left:4px solid #fbbf24;border-radius:4px;font-size:12px;color:#9ca3af;font-family:'Segoe UI',sans-serif;">
      ⚡ Action recommandee: Verifier la disponibilite et confirmer rapidement.
    </div>
  `;

  return baseEmailTemplate('Nouvelle Reservation ⚓', 'Action admin recommandee - Verifier et confirmer', content);
}
