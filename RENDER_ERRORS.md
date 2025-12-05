# 🔥 CORS & 500 Error на Render

## Проблемы:
1. ❌ **CORS blocked** - `No 'Access-Control-Allow-Origin' header`
2. ❌ **500 Internal Server Error** на `/api/farmer/loan-applications`

## Исправления:

### 1. CORS - Added `expose_headers`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # NEW
)
```

### 2. Проверьте логи на Render

**500 Error** означает что backend упал при обработке запроса.

**Зайдите в Render Dashboard:**
1. Откройте https://dashboard.render.com
2. Найдите ваш backend service
3. Перейдите в **Logs**
4. Посмотрите последние ошибки

**Возможные причины 500:**
- Database не инициализирована
- Отсутствует `agrocredit.db`
- Ошибка в scoring workflow
- Отсутствуют environment variables

### 3. Временное решение - Mock Auth

Скорее всего проблема в том, что **нет базы данных** на Render.

SQLite файл `agrocredit.db` не задеплоен (он в .gitignore).

**Что делать:**

#### Вариант 1: Использовать PostgreSQL (рекомендуется)
Render предоставляет бесплатный PostgreSQL.

#### Вариант 2: Создать БД при старте
Добавить в backend команду для инициализации БД:

```python
# В main.py
from .db import init_db
init_db()  # Создаст таблицы при запуске
```

### 4. После fix - Git Push

```bash
git add .
git commit -m "Fix: Add CORS expose_headers for Render deployment"
git push origin main
```

Render автоматически re-deploy.

---

## Логи которые нужно искать:

Искать в Render Logs:
- `ModuleNotFoundError`
- `sqlite3.OperationalError`
- `No such table`
- `FOREIGN KEY constraint failed`

Пришлите лог ошибки если найдете - помогу исправить!
