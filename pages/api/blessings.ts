import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'blessings.json');

const ensureFile = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  ensureFile();

  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { name, message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.push({
      name: (typeof name === 'string' && name.trim()) ? name.trim() : 'Ẩn danh',
      message: message.trim(),
      timestamp: Date.now(),
    });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(201).json({ ok: true });
  }

  res.status(405).end();
}
