// ЭТОТ КОД ДОЛЖЕН БЫТЬ В ФАЙЛЕ /api/telegram.js
// Это ваша "кухня"
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Разрешен только метод POST' });
    }

    const token = process.env.TELEGRAM_TOKEN;
    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        // Сервер получает chat_id и text из запроса от фронтенда
        const { chat_id, text } = request.body;

        if (!chat_id || !text) {
            return response.status(400).json({ message: 'Ошибка: Не указан "chat_id" или "text".' });
        }

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
        return response.status(500).json({ message: 'Внутренняя ошибка сервера', error: error.message });
    }
}
    } catch (error) {
        console.error('Сетевая ошибка или ошибка выполнения:', error);
        // Обработка ошибок сети
    }
}
