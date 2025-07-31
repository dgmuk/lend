// Обновленный код для /api/telegram.js с улучшенной диагностикой
module.exports = async (request, response) => {
    // Лог, который покажет, что функция вообще запустилась
    console.log("Функция /api/telegram запущена.");

    if (request.method !== 'POST') {
        console.log("Ошибка: Метод не является POST.");
        return response.status(405).json({ message: 'Метод не разрешен' });
    }

    const token = process.env.TELEGRAM_TOKEN;
    if (!token) {
        console.error("Критическая ошибка: Переменная TELEGRAM_TOKEN не найдена.");
        return response.status(500).json({ message: 'Ошибка конфигурации сервера: токен не найден.' });
    }

    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const { chat_id, text } = request.body;
        console.log(`Получен запрос для чата: ${chat_id}`);

        if (!chat_id || !text) {
            console.error("Ошибка: В теле запроса отсутствуют 'chat_id' или 'text'.");
            return response.status(400).json({ message: 'Неверный запрос: отсутствуют "chat_id" или "text".' });
        }

        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chat_id,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        const result = await telegramResponse.json();

        if (result.ok) {
            console.log("Сообщение успешно отправлено в Telegram.");
            return response.status(200).json({ message: 'Сообщение успешно отправлено' });
        } else {
            console.error("API Telegram вернуло ошибку:", result);
            return response.status(500).json({ message: 'Ошибка API Telegram', error: result });
        }

    } catch (error) {
        console.error("Произошла непредвиденная ошибка:", error);
        return response.status(500).json({ message: 'Внутренняя ошибка сервера', error: error.message });
    }
};
