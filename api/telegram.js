// Эта функция будет отправлять данные на ваш бэкенд на Vercel
async function sendMessage(messageText) {
    // URL вашего бэкенда. Используем относительный путь, это лучшая практика.
    const apiEndpoint = '/api/telegram';

    // ✅ ВАШ ID ЧАТА УЖЕ ВСТАВЛЕН
    const CHAT_ID = '-1001715276709';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Отправляем данные на ваш бэкенд в формате JSON
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
            }),
        });

        // Получаем ответ от нашего бэкенда
        const data = await response.json();

        if (response.ok) {
            console.log('Успешно отправлено через бэкенд:', data.message);
            // Сюда можно добавить код, который показывает пользователю
            // сообщение об успехе, например: alert('Сообщение отправлено!');
        } else {
            console.error('Ошибка от бэкенда:', data.message);
            // Сюда можно добавить код для отображения ошибки пользователю
        }
    } catch (error) {
        console.error('Сетевая ошибка или ошибка выполнения:', error);
        // Обработка ошибок сети
    }
}
