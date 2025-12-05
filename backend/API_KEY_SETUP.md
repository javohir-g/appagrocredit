# API ключи и конфигурация

## Как получить OpenAI API ключ:

1. Перейдите на https://platform.openai.com/api-keys
2. Войдите в свой аккаунт OpenAI
3. Нажмите "Create new secret key"
4. Скопируйте ключ (он показывается только один раз!)

## Установка API ключа:

### Вариант 1: Через .env файл (рекомендуется)

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Откройте `.env` и вставьте ваш ключ:
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxx
   ```

3. Убедитесь что `.env` в `.gitignore` (уже добавлен)

### Вариант 2: Системная переменная окружения

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxx"
```

**Windows (постоянно):**
1. Пуск → "Изменение системных переменных среды"
2. Переменные среды → Создать
3. Имя: `OPENAI_API_KEY`
4. Значение: ваш ключ

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxx"
```

Для постоянной установки добавьте в `~/.bashrc` или `~/.zshrc`

## Проверка установки:

```bash
cd backend
python -c "import os; print('API Key:', os.getenv('OPENAI_API_KEY', 'NOT SET'))"
```

## Использование в коде:

API ключ автоматически загружается из переменных окружения через `python-dotenv`. 

Скоринг использует GPT для анализа когда вызывается с `use_gpt=True`:
```python
from database.scoring_workflow import ScoringWorkflow

workflow = ScoringWorkflow("agrocredit.db")
result = workflow.calculate_farmer_scoring(
    farmer_id=1, 
    use_gpt=True,  # Включить GPT анализ
    verbose=True
)
```

## Примечания:

- GPT используется только при `use_gpt=True`, иначе используется базовый скоринг
- Убедитесь что у вас есть кредиты на OpenAI аккаунте
- Для production используйте платный план OpenAI
- Никогда не коммитьте `.env` файл в Git!
