export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get bot token from environment
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ 
        success: false, 
        error: 'Bot token not configured' 
      });
    }

    // Test bot by getting bot info
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      method: 'GET'
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return res.status(400).json({ 
        success: false, 
        error: `Telegram API error: ${telegramData.description}` 
      });
    }

    res.status(200).json({ 
      success: true, 
      bot_info: telegramData.result 
    });

  } catch (error) {
    console.error('Error testing bot:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test bot' 
    });
  }
}
