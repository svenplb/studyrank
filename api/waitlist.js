import { Resend } from 'resend';

let resend;
try {
  resend = new Resend(process.env.RESEND_API_KEY);
} catch (e) {
  console.error('Resend init failed:', e.message);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email.' });
  }

  try {
    await resend.emails.send({
      from: 'StudyRank <onboarding@resend.dev>',
      to: 'psven595@gmail.com',
      subject: `New waitlist signup: ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#7c3aed;">📬 New StudyRank signup</h2>
          <p style="font-size:18px;"><strong>${email}</strong></p>
          <p style="color:#6b7280;font-size:14px;">${new Date().toUTCString()}</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send.' });
  }
}
