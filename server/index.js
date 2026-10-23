const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3007;

// Trust reverse proxy (Nginx)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory rate limiter: max 5 requests per 10 minutes per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };

  if (now > clientData.resetAt) {
    clientData.count = 1;
    clientData.resetAt = now + RATE_LIMIT_WINDOW;
  } else {
    clientData.count += 1;
  }

  rateLimitMap.set(ip, clientData);

  // Periodic cleanup
  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  if (clientData.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan kirim pesan. Silakan coba beberapa saat lagi atau kontak langsung via WhatsApp.'
    });
  }

  next();
}

// Mail Transporter setup
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 465;
  const secure = process.env.SMTP_SECURE === 'false' ? false : (port === 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('[SMTP WARNING] SMTP_USER or SMTP_PASS is not configured in .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'portofolio-contact-api',
    timestamp: new Date().toISOString()
  });
});

// Contact endpoint
app.post('/api/contact', rateLimit, async (req, res) => {
  try {
    const { name, email, message, _gotcha } = req.body;

    // Honeypot check for spam bots
    if (_gotcha) {
      console.log(`[SPAM BLOCKED] Honeypot field filled from IP: ${req.ip}`);
      return res.status(200).json({ success: true, message: 'Pesan berhasil terkirim.' });
    }

    // Validation
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim();
    const cleanMessage = (message || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ success: false, message: 'Nama harus diisi minimal 2 karakter.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Format alamat email tidak valid.' });
    }

    if (!cleanMessage || cleanMessage.length < 8) {
      return res.status(400).json({ success: false, message: 'Pesan minimal 8 karakter.' });
    }

    const receiverEmail = process.env.RECEIVER_EMAIL || process.env.SMTP_USER || 'astdnn48@gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error('[SMTP ERROR] Pengaturan SMTP (.env) belum lengkap.');
      return res.status(503).json({
        success: false,
        message: 'Layanan email sedang dalam pemeliharaan konfigurasi. Silakan kontak via WhatsApp atau email langsung.'
      });
    }

    const transporter = getTransporter();

    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Asia/Jakarta'
    }).format(new Date());

    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;

    const mailOptions = {
      from: `"${cleanName} via Portfolio" <${smtpUser}>`,
      to: receiverEmail,
      replyTo: cleanEmail,
      subject: `[Portofolio] Pesan Baru dari ${cleanName}`,
      text: `Pesan baru dari pengunjung website portofolio:\n\nNama: ${cleanName}\nEmail: ${cleanEmail}\nWaktu: ${formattedDate} (WIB)\nIP: ${clientIp}\n\nIsi Pesan:\n${cleanMessage}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; color: #1e293b;">
          <h2 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; font-size: 20px;">
            📬 Pesan Baru dari Website Portofolio
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 90px;"><strong>Pengirim:</strong></td>
              <td style="padding: 8px 0; font-size: 15px; font-weight: 600;">${cleanName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${cleanEmail}" style="color: #2563eb; text-decoration: none;">${cleanEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Waktu:</strong></td>
              <td style="padding: 8px 0; font-size: 13px; color: #64748b;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>IP Address:</strong></td>
              <td style="padding: 8px 0; font-size: 13px; color: #64748b;">${clientIp}</td>
            </tr>
          </table>

          <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #334155;">${cleanMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            💡 Anda bisa langsung membalas email ini dengan klik tombol <b>Reply</b> untuk merespons ke <b>${cleanEmail}</b>.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] Berhasil mengirim email dari ${cleanName} (${cleanEmail})`);

    return res.status(200).json({
      success: true,
      message: 'Pesan berhasil terkirim. Terima kasih, saya akan merespons sesegera mungkin.'
    });

  } catch (error) {
    console.error('[EMAIL ERROR]', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan melalui server email. Silakan hubungi via WhatsApp.'
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Contact API server running on http://127.0.0.1:${PORT}`);
});
