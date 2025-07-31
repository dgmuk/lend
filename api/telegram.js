// ✅ ИСПРАВЛЕННЫЙ КОД ДЛЯ ФАЙЛА /api/telegram.js
// Мы заменили 'export default' на 'module.exports', чтобы обеспечить совместимость.

module.exports = async (request, response) => {
    // Проверяем, что запрос пришел методом POST.
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Разрешен только метод POST' });
    }

    // Безопасно получаем токен из переменных окружения Vercel.
    const token = process.env.TELEGRAM_TOKEN;
    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        // Получаем данные, которые отправил ваш сайт.
        const { chat_id, text } = request.body;

        if (!chat_id || !text) {
            return response.status(400).json({ message: 'Ошибка: Не указан "chat_id" или "text".' });
        }

        // Отправляем запрос в Telegram от имени сервера.
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chat_id,
                text: text,
                parse_mode: 'HTML',
            }),
        });
        
        const result = await telegramResponse.json();
        
        if (result.ok) {
            return response.status(200).json({ message: 'Сообщение успешно отправлено' });
        } else {
            return response.status(500).json({ message: 'Telegram не смог отправить сообщение', error: result });
        }

    } catch (error) {
        // В случае непредвиденной ошибки на сервере, отправляем ответ с ошибкой.
        return response.status(500).json({ message: 'Внутренняя ошибка сервера', error: error.message });
    }
};
