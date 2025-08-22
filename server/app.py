from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime

# Создаем экземпляр приложения FastAPI
app = FastAPI()

# Настройка CORS (Cross-Origin Resource Sharing)
# Это ОБЯЗАТЕЛЬНО, чтобы ваш сервер разрешил принимать запросы 
# от расширения, работающего на домене youtube.com
origins = [
    "*"  # Для теста разрешаем все источники
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем эндпоинт (URL), который будет принимать данные
@app.post("/collect")
async def collect_data(request: Request):
    # Получаем JSON данные из тела запроса
    video_data = await request.json()
    
    # Добавляем временную метку, чтобы знать, когда были собраны данные
    video_data['collected_at'] = datetime.now().isoformat()
    
    print(f"Получены данные: {video_data}") # Для отладки в терминале сервера
    
    # Сохраняем данные в файл
    # 'a' - означает append (дозапись в конец файла)
    with open("data.jsonl", "a", encoding="utf-8") as f:
        # Преобразуем словарь в JSON-строку и записываем
        f.write(json.dumps(video_data, ensure_ascii=False) + '\n')
        
    return {"status": "success", "data_received": video_data}

# Приветственное сообщение на главной странице сервера
@app.get("/")
def read_root():
    return {"message": "Сервер для сбора данных с YouTube работает!"}