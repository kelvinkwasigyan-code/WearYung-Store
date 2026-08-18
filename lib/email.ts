import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'wearyungworldwide@gmail.com';
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'WEAR YUNG Alerts <onboarding@resend.dev>';

export interface NewUserAlertParams {
  email: string;
  name?: string | null;
  userId: string;
}

export interface SaleAlertItem {
  title: string;
  quantity: number;
  price: number;
  sku?: string;
}

export interface SaleAlertParams {
  orderId: string;
  amount: number;
  customerEmail: string;
  items: SaleAlertItem[];
}

/**
 * Sends an admin alert email when a new member registers on WEAR YUNG
 */
export async function sendNewUserAdminAlert({ email, name, userId }: NewUserAlertParams) {
  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not configured. Skipping new user alert.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  const displayName = name ? name.trim() : email;
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  const subject = `⚡ [WY ALERT] New Member Registered: ${displayName}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 30px 15px; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #141416; border: 1px solid #27272A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
        <!-- Header -->
        <tr>
          <td style="padding: 28px 32px; background: linear-gradient(90deg, #09090B 0%, #18181B 100%); border-bottom: 2px solid #FFC800;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 22px; font-weight: 900; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase;">
                    WEAR <span style="color: #FFC800;">YUNG</span>
                  </span>
                </td>
                <td align="right">
                  <span style="display: inline-block; padding: 4px 10px; background-color: rgba(255, 200, 0, 0.15); border: 1px solid #FFC800; border-radius: 6px; color: #FFC800; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
                    NEW MEMBER
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.02em;">
              A New Member Has Joined WEAR YUNG
            </h2>
            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #A1A1AA;">
              A new customer account was created on the storefront. Review customer details below:
            </p>

            <!-- User Detail Card -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid #27272A; border-radius: 12px; margin-bottom: 28px;">
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #71717A; width: 35%;">
                  Full Name
                </td>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 14px; font-weight: 700; color: #FFFFFF;">
                  ${name || '<span style="color: #71717A;">Not specified</span>'}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #71717A;">
                  Email Address
                </td>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 14px; font-weight: 700; color: #FFC800;">
                  ${email}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #71717A;">
                  User ID
                </td>
                <td style="padding: 16px 20px; border-bottom: 1px solid #1E1E22; font-size: 12px; font-family: monospace; color: #E4E4E7;">
                  ${userId}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-size: 13px; color: #71717A;">
                  Registered At
                </td>
                <td style="padding: 16px 20px; font-size: 13px; color: #D4D4D8;">
                  ${timestamp} UTC
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com'}/admin/users" style="display: inline-block; padding: 12px 28px; background-color: #FFC800; color: #000000; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border-radius: 8px;">
                    View Customers in Admin
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 32px; background-color: #09090B; border-top: 1px solid #1E1E22; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #52525B;">
              &copy; ${new Date().getFullYear()} WEAR YUNG &bull; Automated System Alert &bull; Koforidua, Ghana
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('[Email Alert Error] Failed to send new user alert:', error);
    return { success: false, error };
  }
}

/**
 * Sends an admin alert email when a new sale / order is placed on WEAR YUNG
 */
export async function sendSaleAdminAlert({ orderId, amount, customerEmail, items }: SaleAlertParams) {
  if (!resend) {
    console.warn('[Email Alert] RESEND_API_KEY is not configured. Skipping sale alert.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  const formattedAmount = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  const subject = `💰 [WY SALE] New Order Placed: GH₵ ${formattedAmount}`;

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #FFFFFF; font-weight: 600;">
          ${item.title}
          ${item.sku ? `<br/><span style="font-size: 11px; font-family: monospace; color: #71717A;">SKU: ${item.sku}</span>` : ''}
        </td>
        <td align="center" style="padding: 12px 16px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #D4D4D8;">
          ${item.quantity}
        </td>
        <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #1E1E22; font-size: 13px; font-weight: 700; color: #FFC800;">
          GH₵ ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 30px 15px; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #141416; border: 1px solid #27272A; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
        <!-- Header -->
        <tr>
          <td style="padding: 28px 32px; background: linear-gradient(90deg, #09090B 0%, #18181B 100%); border-bottom: 2px solid #FFC800;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 22px; font-weight: 900; letter-spacing: 0.08em; color: #FFFFFF; text-transform: uppercase;">
                    WEAR <span style="color: #FFC800;">YUNG</span>
                  </span>
                </td>
                <td align="right">
                  <span style="display: inline-block; padding: 4px 10px; background-color: rgba(34, 197, 94, 0.15); border: 1px solid #22C55E; border-radius: 6px; color: #22C55E; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
                    NEW SALE
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 32px;">
            <!-- Sale Amount Highlight Banner -->
            <div style="background-color: #09090B; border: 1px solid rgba(255, 200, 0, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px;">
              <span style="display: block; font-size: 12px; font-weight: 800; color: #A1A1AA; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
                TOTAL ORDER VALUE
              </span>
              <span style="display: block; font-size: 32px; font-weight: 900; color: #FFC800; letter-spacing: 0.02em;">
                GH₵ ${formattedAmount}
              </span>
            </div>

            <!-- Order Metadata -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid #27272A; border-radius: 12px; margin-bottom: 24px;">
              <tr>
                <td style="padding: 14px 18px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #71717A; width: 35%;">
                  Order ID
                </td>
                <td style="padding: 14px 18px; border-bottom: 1px solid #1E1E22; font-size: 13px; font-family: monospace; font-weight: 700; color: #FFFFFF;">
                  #${orderId}
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 18px; border-bottom: 1px solid #1E1E22; font-size: 13px; color: #71717A;">
                  Customer Email
                </td>
                <td style="padding: 14px 18px; border-bottom: 1px solid #1E1E22; font-size: 13px; font-weight: 700; color: #FFC800;">
                  ${customerEmail}
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 18px; font-size: 13px; color: #71717A;">
                  Order Placed At
                </td>
                <td style="padding: 14px 18px; font-size: 13px; color: #D4D4D8;">
                  ${timestamp} UTC
                </td>
              </tr>
            </table>

            <!-- Line Items Table -->
            <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.06em; text-transform: uppercase;">
              Ordered Items (${items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090B; border: 1px solid #27272A; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
              <thead>
                <tr style="background-color: #141416; border-bottom: 1px solid #27272A;">
                  <th align="left" style="padding: 10px 16px; font-size: 11px; font-weight: 800; color: #71717A; text-transform: uppercase; letter-spacing: 0.08em;">
                    Product
                  </th>
                  <th align="center" style="padding: 10px 16px; font-size: 11px; font-weight: 800; color: #71717A; text-transform: uppercase; letter-spacing: 0.08em;">
                    Qty
                  </th>
                  <th align="right" style="padding: 10px 16px; font-size: 11px; font-weight: 800; color: #71717A; text-transform: uppercase; letter-spacing: 0.08em;">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <!-- CTA -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://wearyung.com'}/admin/orders" style="display: inline-block; padding: 12px 28px; background-color: #FFC800; color: #000000; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; border-radius: 8px;">
                    Fulfill Order in Admin
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 20px 32px; background-color: #09090B; border-top: 1px solid #1E1E22; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #52525B;">
              &copy; ${new Date().getFullYear()} WEAR YUNG &bull; Automated System Alert &bull; Koforidua, Ghana
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('[Email Alert Error] Failed to send sale alert:', error);
    return { success: false, error };
  }
}
