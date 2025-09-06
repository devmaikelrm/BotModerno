
export default async function handler(req, res){
  try{
    const token = process.env.BOT_TOKEN;
    if (!token) return res.status(400).json({ ok:false, message:'Missing BOT_TOKEN' });

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = (req.headers['x-forwarded-proto'] || 'https');
    const baseUrl = `${proto}://${host}`;
    const url = `${baseUrl}/api/webhook`;

    // get webhook info
    const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`).then(r=>r.json()).catch(()=>({}));
    let changed = false;
    if (!info?.result?.url || info.result.url !== url){
      await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(url)}`).then(r=>r.json());
      changed = true;
    }
    res.status(200).json({ ok: true, message: changed ? 'Webhook set' : 'Webhook already set', url });
  }catch(e){
    res.status(200).json({ ok: false, message: String(e?.message||e) });
  }
}
