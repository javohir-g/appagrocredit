# AgroCredit AI - Database Documentation

## Описание

База данных SQLite для системы автоматического кредитного скоринга аграрных заемщиков.

## Структура базы данных

База данных состоит из **10 взаимосвязанных таблиц**:

### 1. **farmers** - Фермеры
Основная таблица с информацией о фермерах.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ |
| farmer_id | TEXT | Уникальный идентификатор фермера |
| age | INTEGER | Возраст (18-100) |
| education_level | TEXT | Уровень образования |
| farming_experience_years | INTEGER | Опыт работы в сельском хозяйстве |
| number_of_loans | INTEGER | Количество кредитов |
| past_defaults | INTEGER | Количество просрочек |
| repayment_score | INTEGER | Рейтинг платежеспособности (0-100) |

### 2. **farms** - Фермерские хозяйства
Информация о земельных участках.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ |
| farmer_id | INTEGER | Внешний ключ на farmers(id) |
| farm_size_acres | REAL | Размер фермы в акрах |
| ownership_status | TEXT | Статус владения |
| land_valuation_usd | REAL | Оценка земли в USD |
| soil_quality_index | INTEGER | Индекс качества почвы (0-100) |
| water_availability_score | INTEGER | Оценка доступности воды (0-100) |
| irrigation_type | TEXT | Тип орошения |
| crop_rotation_history_years | INTEGER | История севооборота |

### 3. **crops** - Сельскохозяйственные культуры
Информация о выращиваемых культурах.

| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ |
| farm_id | INTEGER | Внешний ключ на farms(id) |
| crop_type | TEXT | Тип культуры |
| crop_yield_last_5_years_tonnes | TEXT | JSON массив урожайности |
| yield_variance_index | REAL | Индекс вариации урожайности |
| expected_yield_next_season | REAL | Ожидаемый урожай |
| market_price_volatility_score | REAL | Волатильность цен |
| use_of_certified_seeds | INTEGER | Использование сертифицированных семян |
| use_of_fertilizers | INTEGER | Использование удобрений |

### 4. **machinery** - Сельскохозяйственная техника
### 5. **objects** - Объекты недвижимости
### 6. **geometry** - Геометрические данные участков
### 7. **market_access** - Доступ к рынкам
### 8. **technology_usage** - Использование технологий
### 9. **insurance_and_risk_mitigation** - Страхование
### 10. **loan_requests** - Заявки на кредиты

## Установка и инициализация

### 1. Инициализация базы данных

```python
from database import DatabaseManager

# Создание менеджера БД
db = DatabaseManager("agrocredit.db")

# Инициализация схемы
db.initialize_database()
```

### 2. Добавление данных

```python
# Добавление фермера
farmer_id = db.add_farmer(
    farmer_id="F-2023-001",
    age=45,
    education_level="высшее",
    farming_experience_years=20,
    repayment_score=85
)

# Добавление фермы
farm_id = db.add_farm(
    farmer_id=farmer_id,
    farm_size_acres=250.5,
    ownership_status="собственность",
    land_valuation_usd=500000
)

# Добавление культуры
crop_id = db.add_crop(
    farm_id=farm_id,
    crop_type="пшеница",
    crop_yield_last_5_years=[45.2, 48.5, 50.1, 47.8, 49.3],
    expected_yield_next_season=51.0,
    use_of_certified_seeds=True
)

# Добавление кредитной заявки
loan_id = db.add_loan_request(
    farm_id=farm_id,
    loan_purpose="Покупка техники",
    requested_loan_amount=75000.0,
    repayment_capacity_score=80
)
```

### 3. Получение данных

```python
# Получение фермера
farmer = db.get_farmer(farmer_id)

# Получение всех ферм фермера
farms = db.get_farms_by_farmer(farmer_id)

# Получение полного профиля
profile = db.get_farmer_complete_profile(farmer_id)

# Статистика
stats = db.get_statistics()
```

### 4. Обновление данных

```python
# Обновление фермера
db.update_farmer(farmer_id, repayment_score=90)

# Обновление статуса кредита
db.update_loan_status(loan_id, "approved")
```

## Запуск примеров

```bash
cd backend/database
python example_usage.py
```

## Особенности

- ✅ Поддержка внешних ключей (CASCADE DELETE)
- ✅ Автоматические триггеры для обновления timestamp
- ✅ Валидация данных через CHECK constraints
- ✅ JSON поля для хранения массивов данных
- ✅ Индексы для оптимизации запросов
- ✅ Транзакционная целостность данных

## Файлы модуля

- `schema.sql` - SQL схема базы данных
- `db_manager.py` - Менеджер базы данных с CRUD операциями
- `example_usage.py` - Примеры использования
- `__init__.py` - Инициализация модуля

## Требования

- Python 3.7+
- sqlite3 (встроена в Python)

## Связи между таблицами

```
farmers (1) ─────┐
                 │
                 ├─ farms (N) ─────┬─ crops (N)
                                   ├─ machinery (N)
                                   ├─ objects (N)
                                   ├─ geometry (1)
                                   ├─ market_access (1)
                                   ├─ technology_usage (1)
                                   ├─ insurance_and_risk_mitigation (1)
                                   └─ loan_requests (N)
```

## Лицензия

AgroCredit AI © 2023
