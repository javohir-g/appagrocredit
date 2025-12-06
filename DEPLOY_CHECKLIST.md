# ✅ Финальная проверка перед деплоем

## Что исправлено:

### 1. ✅ Frontend API URLs
- `loan-service.ts`: ✅ используетRender URL
- `bank-service.ts`: ✅ используетRender URL  
- `api.ts`: ✅ используетRender URL
- `farmer/profile/page.tsx`: ✅ используетRender URL
- `farmer/fields/page.tsx`: ✅ используетRender URL
- `bank/dashboard/page.tsx`: ✅ используетRender URL

### 2. ✅ Backend
- `database_adapter.py`: ✅ миграция для farmer_id колонки
- `main.py`: ✅ OpenAI API проверка при старте
- `main.py`: ✅ /api/db-check endpoint
- `database_adapter.py`: ✅ детальное логирование

### 3. ✅ CORS
- `main.py`: ✅ wildcard CORS (credentials=False)

### 4. ✅ GPT Model
- `gpt_analyzer.py`: ✅ GPT-4o вместо GPT-4

## После деплоя проверить:

### 1. Проверка БД:
```
https://app-agrocredit.onrender.com/api/db-check
```
Ожидается:
```json
{
  "has_farmer_id_column": true
}
```

### 2. Проверка health:
```
https://app-agrocredit.onrender.com/api/health
```
Ожидается:
```json
{
  "status": "healthy"
}
```

### 3. Создание заявки:
1. Откройте https://appagrocredit.onrender.com
2. Login как фермер
3. Попробуйте подать заявку
4. Если ошибка - проверьте логи Render

## Что проверить в логах Render:

```
✓ Database schema up to date (farmer_id exists)
```
или
```
⚠️  MIGRATION: farmer_id column missing, adding it...
✓ Migration complete!
```

И при создании заявки:
```
[DB_ADAPTER] Creating loan application for: farmer@example.com
[DB_ADAPTER] ✓ Success! Loan application ID=X created
```

## Если всё равно 500 error:

Скопируйте ПОЛНЫЙ traceback из Render Logs после:
```
[DB_ADAPTER] ❌ ERROR in create_loan_application: ...
```
