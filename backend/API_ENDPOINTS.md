# API Endpoints Summary

## Созданные эндпоинты

### Farmer Extended Routes (`/farmer`)

#### Profile
- **GET /farmer/profile** - Получить профиль фермера с картами
  - Returns: FarmerProfileOut с информацией о фермере и его картах

#### Credits Management  
- **GET /farmer/credits** - Список всех кредитов фермера
  - Returns: List[CreditOut]
  
- **GET /farmer/credits/{credit_id}** - Детальная информация о кредите
  - Returns: CreditOut

#### Payment Processing
- **POST /farmer/credits/{credit_id}/payment** - Оплата кредита
  - Body: {"card_id": int, "amount": float}
  - Логика:
    - Проверяет баланс карты
    - Вычитает сумму из баланса карты
    - Обновляет remaining и progress кредита
    - Создает запись Payment
    - Обновляет existing_credit фермера
  - Returns: PaymentOut

- **GET /farmer/credits/{credit_id}/payments** - История платежей по кредиту
  - Returns: List[PaymentOut]

### Bank Extended Routes (`/bank`)

#### Dashboard Statistics
- **GET /bank/dashboard/stats** - Статистика для дашборда банка
  - Returns: DashboardStats с:
    - total_credits: общее количество кредитов
    - total_amount_disbursed: общая сумма выданных кредитов
    - total_outstanding: общая непогашенная сумма
    - total_paid: общая выплаченная сумма
    - active_credits: количество активных кредитов
    - overdue_credits: количество просроченных кредитов
    - risk_distribution: распределение по рискам (low/medium/high)
    - monthly_disbursement: выданные кредиты за текущий месяц

#### Farmer Analytics
- **GET /bank/farmers/credits** - Агрегированная информация по кредитам фермеров
  - Returns: List[FarmerCreditInfo] с:
    - farmer_id, farmer_name, location
    - total_credits: количество кредитов
    - total_amount: общая сумма
    - total_outstanding: непогашенная сумма
    - average_progress: средний прогресс погашения
    - risk_level: уровень риска (low/medium/high)

## Модели данных

### Database Models
1. **Farmer** - профиль фермера
2. **Credit** - кредиты с статусами (active, paid, overdue, pending)
3. **Payment** - история платежей
4. **Card** - карты пользователей
5. **Meteorology** - погодные данные
6. **CropRecommendation** - рекомендации по культурам

## Тестовые данные (seed_db.py)

### Пользователи
- farmer1@example.com / password123 (Иван Петров)
- farmer2@example.com / password123 (Мария Сидорова)
- farmer3@example.com / password123 (Алексей Козлов)
- bank@example.com / password123 (Bank Officer)

### Статистика
- 3 фермера
- 5 кредитов (разные статусы и прогресс)
- 5 карт с балансами
- 30 метеозаписей за последние 30 дней
- 3 рекомендации по регионам

## Запуск seed скрипта

```bash
cd backend
python seed_db.py
```

После запуска база данных будет заполнена тестовыми данными.

## Следующие шаги

1. ✅ Созданы все базовые API endpoints
2. ⏳ Обновить frontend страницы для работы с API
3. ⏳ Интегрировать mock данные для Google Maps & NDVI
4. ⏳ Добавить ML прогнозирование (имитация)
