import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get bot configuration from Supabase
      const { data, error } = await supabase
        .from('bot_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      res.status(200).json({
        rules: data?.rules || '',
        welcome: data?.welcome || '',
        status: {
          bot: !!process.env.BOT_TOKEN,
          webhook: !!process.env.WEBHOOK_URL,
          kv: !!(process.env.VERCEL_KV_REST_API_URL && process.env.VERCEL_KV_REST_API_TOKEN),
          supabase: !!(supabaseUrl && supabaseKey)
        }
      });
    } catch (error) {
      console.error('Error fetching bot config:', error);
      res.status(500).json({ error: 'Failed to fetch bot configuration' });
    }
  } else if (req.method === 'POST') {
    try {
      const { rules, welcome } = req.body;

      // Upsert bot configuration
      const { error } = await supabase
        .from('bot_config')
        .upsert({
          id: 1,
          rules: rules || '',
          welcome: welcome || '',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving bot config:', error);
      res.status(500).json({ error: 'Failed to save bot configuration' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
