const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('Получен запрос:', req.method);
    const formData = await req.json();
    console.log('Данные формы:', formData);
    
    const token = '8333811204:AAGLp8hqvrQMo615Af36WKYOEWth6MqxO2M';
    const chatId = '7954117398';
    
    console.log('Отправляем в чат:', chatId);
    console.log('Используем токен:', token);

    // Проверяем информацию о боте
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const botInfo = await botInfoResponse.json();
    console.log('Информация о боте:', botInfo);
    
    if (!botInfo.ok) {
      console.error('Бот не работает:', botInfo);
      return new Response(
        JSON.stringify({ success: false, error: 'Бот не активен' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Проверяем, может ли бот писать в чат
    try {
      const chatInfoResponse = await fetch(`https://api.telegram.org/bot${token}/getChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId })
      });
      const chatInfo = await chatInfoResponse.json();
      console.log('Информация о чате:', chatInfo);
    } catch (error) {
      console.log('Не удалось получить информацию о чате:', error);
    }

    const message = `📩 Новая заявка с сайта:
👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
💬 Telegram: ${formData.telegramNick || '—'}
🚗 Авто: ${formData.carBrand} ${formData.carModel} (${formData.year})
📝 Комментарий: ${formData.comment || '—'}
📲 Предпочтительный мессенджер: ${formData.messenger}`;

    console.log('Сообщение:', message);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    console.log('Статус ответа Telegram:', response.status);
    const result = await response.json();
    console.log('Ответ Telegram:', result);

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: 'Сообщение отправлено' }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    } else {
      console.error('Ошибка Telegram:', result);
      return new Response(
        JSON.stringify({ success: false, error: result.description }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }
  } catch (error) {
    console.error('Ошибка:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Внутренняя ошибка сервера' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
});