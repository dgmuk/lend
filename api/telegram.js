// Код для файла /api/telegram.js
module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        const token = process.env.TELEGRAM_TOKEN;
        if (!token) {
            return response.status(500).send('Server configuration error: Token not found');
        }

        const { chat_id, text } = request.body;
        if (!chat_id || !text) {
            return response.status(400).send('Bad Request: chat_id and text are required');
        }

        const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

        const apiResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chat_id,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            console.error('Telegram API Error:', errorData);
            return response.status(500).send('Failed to send message');
        }

        return response.status(200).json({ success: true });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return response.status(500).send('Internal Server Error');
    }
};
