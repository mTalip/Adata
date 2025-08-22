// Этот скрипт имеет доступ к переменным страницы, таким как ytInitialPlayerResponse
if (window.ytInitialPlayerResponse) {
    // Отправляем сообщение с данными в наш content.js
    window.postMessage({
        type: "FROM_PAGE", 
        payload: window.ytInitialPlayerResponse 
    }, "*");
}