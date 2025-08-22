// ШАГ 1: Внедряем наш скрипт-шпион (inject.js) на страницу
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

// ШАГ 2: Слушаем сообщения, которые приходят от нашего шпиона
window.addEventListener("message", (event) => {
    // Убеждаемся, что сообщение пришло от нашего скрипта
    if (event.source === window && event.data && event.data.type === "FROM_PAGE") {
        console.log("Данные из ytInitialPlayerResponse УСПЕШНО ПОЛУЧЕНЫ!", event.data.payload);
        const processedData = processData(event.data.payload);
        sendDataToServer(processedData);
    }
});

// ШАГ 3: Обрабатываем полученные "сырые" данные в удобный формат
function processData(payload) {
    const data = {};
    const videoDetails = payload.videoDetails;
    const microformat = payload.microformat.playerMicroformatRenderer;

    data.title = videoDetails.title || "N/A";
    data.url = "https://www.youtube.com/watch?v=" + videoDetails.videoId;
    data.channelName = videoDetails.author || "N/A";
    data.views = parseInt(videoDetails.viewCount) || 0;
    
    // Используем самое точное поле uploadDate (с датой и временем)
    data.uploadDate = microformat.uploadDate || microformat.publishDate || "N/A";

    console.log("Обработанные данные для отправки (с точным временем):", data);
    return data;
}

// ШАГ 4: Отправляем готовые данные на наш сервер
async function sendDataToServer(data) {
    try {
        const response = await fetch('http://localhost:8000/collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Ответ сервера:', result);
    } catch (error) {
        console.error('ОШИБКА при отправке данных на сервер:', error);
    }
}