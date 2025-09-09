export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message, chat_id } = req.body;

    if (!message || !chat_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and chat_id are required' 
      });
    }

    // Get bot token from environment
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ 
        success: false, 
        error: 'Bot token not configured' 
      });
    }

    // Send message via Telegram API
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message,
        parse_mode: 'Markdown'
      })
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
      message_id: telegramData.result.message_id 
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message' 
    });
  }
}
