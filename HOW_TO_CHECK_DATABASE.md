# 🔍 Как проверить базу данных на Render

## Способ 1: Через API endpoint

После деплоя откройте в браузере:
```
https://app-agrocredit.onrender.com/api/db-check
```

Вы увидите JSON с информацией:
```json
{
  "status": "ok",
  "database_exists": true,
  "tables": ["farmers", "farms", "crops", ...],
  "record_counts": {
    "farmers": 3,
    "farms": 3,
    "loan_requests": 0
  },
  "farmers_structure": [
    {"name": "id", "type": "INTEGER", "pk": true},
    {"name": "farmer_id", "type": "TEXT", "notnull": true},
    ...
  ],
  "has_farmer_id_column": true
}
```

## Способ 2: Через логи Render

1. Зайдите на https://dashboard.render.com
2. Найдите ваш backend service (`app-agrocredit`)
3. Перейдите в раздел **Logs**
4. Ищите строки:
   ```
   🚀 Starting AgroCredit AI...
   📊 Initializing database...
   ✓ Database schema up to date (farmer_id exists)
   ```
   или
   ```
   ⚠️  MIGRATION: farmer_id column missing, adding it...
   ✓ Migration complete! Migrated X farmers
   ```

## Способ 3: Через Shell на Render

1. В Render Dashboard → ваш service
2. Кликните **Shell** (справа сверху)
3. Выполните команды:
   ```bash
   cd backend
   python3 -c "
   from database.db_manager import DatabaseManager
   db = DatabaseManager('agrocredit.db')
   with db.get_connection() as conn:
       cursor = conn.execute('PRAGMA table_info(farmers)')
       print('Farmers table structure:')
       for row in cursor:
           print(row)
   "
   ```

## Проблемы?

### Если база не создается:
- Проверьте права на запись в директорию
- Убедитесь что `agrocredit.db` не в `.gitignore` для production

### Если нет колонки farmer_id:
- Миграция должна запуститься автоматически
- Проверьте логи на наличие ошибок миграции
- После деплоя откройте `/api/db-check` для проверки

## Что дальше?

После проверки что БД работает:
1. Проверьте `/api/health` - должно вернуть `{"status":"healthy"}`
2. Попробуйте создать заявку через frontend
3. Проверьте логи на наличие ошибок
