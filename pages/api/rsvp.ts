import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

const sendOwnerEmail = async (name: string, attending: boolean, attendeeCount: number) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const attendanceText = attending
    ? `✅ Sẽ tham dự (${attendeeCount} người)`
    : '❌ Không thể tham dự';

  await transporter.sendMail({
    from: `"Wedding Invitation" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `[Thiệp cưới] Xác nhận tham dự từ ${name || 'Khách'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #3a4a3a; text-align: center; margin-bottom: 24px;">Xác nhận tham dự mới</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 40%;">Họ và tên:</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${name || 'Không cung cấp'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Tham dự:</td>
            <td style="padding: 8px 0; color: #333; font-weight: bold;">${attendanceText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Thời gian:</td>
            <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
          </tr>
        </table>
      </div>
    `,
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, attending, attendeeCount } = req.body;

  if (typeof attending !== 'boolean') {
    return res.status(400).json({ error: 'attending (boolean) is required' });
  }

  const { error } = await supabase.from('rsvp').insert({
    name: (typeof name === 'string' && name.trim()) ? name.trim() : null,
    attending,
    attendee_count: attending ? (Number(attendeeCount) || 1) : 0,
  });

  if (error) {
    console.error('Supabase RSVP error:', error);
    return res.status(500).json({ error: 'Failed to save RSVP' });
  }

  try {
    await sendOwnerEmail(
      (typeof name === 'string' && name.trim()) ? name.trim() : 'Khách',
      attending,
      Number(attendeeCount) || 1
    );
  } catch (mailErr) {
    console.error('Email send error:', mailErr);
    // Don't fail the request if email fails
  }

  res.status(201).json({ ok: true });
}
