import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('blessings')
      .select('name, message')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase blessings GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch blessings' });
    }

    return res.json(data ?? []);
  }

  if (req.method === 'POST') {
    const { name, message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    const { error } = await supabase.from('blessings').insert({
      name: (typeof name === 'string' && name.trim()) ? name.trim() : 'Ẩn danh',
      message: message.trim(),
    });

    if (error) {
      console.error('Supabase blessings POST error:', error);
      return res.status(500).json({ error: 'Failed to save blessing' });
    }

    return res.status(201).json({ ok: true });
  }

  res.status(405).end();
}
