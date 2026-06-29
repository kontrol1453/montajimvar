import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  return null;
}

function devLog(to: string, subject: string, html: string) {
  const urlMatch = html.match(/https?:\/\/[^\s"']+/);
  console.log(`\n[DEV EMAIL] To: ${to} | Subject: ${subject}`);
  if (urlMatch) {
    console.log(`   Link: ${urlMatch[0]}\n`);
  }
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = getTransporter();

  if (!transporter) {
    devLog(to, subject, html);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || `"Montajım Var" <noreply@montajimvar.app>`,
      to,
      subject,
      html,
    });
    console.log(`\nEMAIL SENT to ${to} | Subject: ${subject}\n`);
  } catch (err: any) {
    console.error(`\nEMAIL FAILED to ${to}:`, err?.message || err);
  }
}

export function verifyEmailHtml(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#d97706;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Montajım Var</h1>
    </td></tr>
    <tr><td style="padding:32px 24px;">
      <h2 style="color:#1a1a1a;margin:0 0 12px;">E-posta Adresinizi Doğrulayın</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 24px;">
        Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın. Bu link <strong>24 saat</strong> geçerlidir.
      </p>
      <a href="${verifyUrl}" style="display:inline-block;background:#d97706;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
        E-postamı Doğrula
      </a>
      <p style="color:#999;font-size:13px;margin-top:24px;">
        Buton çalışmazsa bu linki tarayıcınıza yapıştırın:<br>
        <span style="color:#666;word-break:break-all;">${verifyUrl}</span>
      </p>
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Montajım Var &bull; Türkiye'nin montaj platformu</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function resetPasswordHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#d97706;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Montajım Var</h1>
    </td></tr>
    <tr><td style="padding:32px 24px;">
      <h2 style="color:#1a1a1a;margin:0 0 12px;">Şifre Sıfırlama</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 24px;">
        Hesabınız için şifre sıfırlama talebi aldık. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
        Bu link <strong>1 saat</strong> geçerlidir.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:#d97709;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Şifremi Sıfırla
      </a>
      <p style="color:#999;font-size:13px;margin-top:24px;">
        Buton çalışmazsa bu linki tarayıcınıza yapıştırın:<br>
        <span style="color:#666;word-break:break-all;">${resetUrl}</span>
      </p>
      <p style="color:#999;font-size:13px;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
        Bu talebi siz yapmadıysanız bu e-postayı dikkate almayın.
      </p>
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Montajım Var &bull; Türkiye'nin montaj platformu</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailHtml(userName: string, verifyUrl?: string): string {
  const verifySection = verifyUrl ? `
    <p style="color:#666;line-height:1.6;margin:0 0 20px;">
      Hesabınızı aktifleştirmek için e-posta adresinizi doğrulayın.
    </p>
    <a href="${verifyUrl}" style="display:inline-block;background:#d97706;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin-bottom:16px;">
      E-postamı Doğrula
    </a>
  ` : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#d97706;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Montajım Var</h1>
    </td></tr>
    <tr><td style="padding:32px 24px;">
      <h2 style="color:#1a1a1a;margin:0 0 12px;">Hoş Geldin${userName ? `, ${userName}` : ""}!</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 20px;">
        Montajım Var platformuna kaydoldunuz. Artık Türkiye'nin dört bir yanındaki güvenilir montaj firmalarını keşfedebilir, firmanızı ekleyebilir ve müşterilerle buluşabilirsiniz.
      </p>
      ${verifySection}
      <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="color:#333;font-size:14px;margin:0 0 8px;font-weight:bold;">Hemen başlayın:</p>
        <ul style="color:#666;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Firma profili oluşturun ve hizmetlerinizi ekleyin</li>
          <li>Müşterilerden değerlendirme ve yorum alın</li>
          <li>Premium üyeliğe geçerek firmanızı öne çıkarın</li>
        </ul>
      </div>
      <a href="https://montajimvar.xyz/ara" style="display:inline-block;background:#d97706;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Firmaları Keşfet
      </a>
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Montajım Var &bull; Türkiye'nin montaj platformu</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function premiumReminderHtml(companyName: string, daysLeft: number, renewUrl: string): string {
  const urgencyText = daysLeft <= 3
    ? "Üyeliğiniz çok yakında sona eriyor!"
    : "Premium üyeliğinizin bitmesine az kaldı.";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 20px;">
  <table align="center" style="max-width:480px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
    <tr><td style="background:#d97706;padding:24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Montajım Var</h1>
    </td></tr>
    <tr><td style="padding:32px 24px;">
      <h2 style="color:#1a1a1a;margin:0 0 12px;">Premium Üyelik ${daysLeft <= 3 ? "Sona Eriyor" : "Hatırlatma"}</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 12px;">
        Merhaba <strong>${companyName}</strong>,
      </p>
      <p style="color:#666;line-height:1.6;margin:0 0 20px;">
        ${urgencyText} Premium üyeliğinizin bitmesine <strong>${daysLeft} gün</strong> kaldı.
      </p>
      <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:0 0 20px;">
        <p style="color:#92400e;font-size:14px;margin:0;">
          Premium üyeliğinizi yenilemek için aşağıdaki butona tıklayın.
        </p>
      </div>
      <a href="${renewUrl}" style="display:inline-block;background:#d97706;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Premium&apos;u Yenile
      </a>
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid #eee;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Montajım Var &bull; Türkiye'nin montaj platformu</p>
    </td></tr>
  </table>
</body>
</html>`;
}
