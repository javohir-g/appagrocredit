"""
Seed script для создания тестовых данных в SQLite БД
Создает фермеров с разными профилями для демонстрации
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from database.db_manager import DatabaseManager
from database.scoring_workflow import ScoringWorkflow


def seed_database():
    """Заполнение БД тестовыми данными"""
    
    print("=" * 80)
    print("СОЗДАНИЕ ТЕСТОВЫХ ДАННЫХ")
    print("=" * 80)
    
    db = DatabaseManager("agrocredit.db")
    db.initialize_database()
    
    # Очистить существующие данные
    print("\n1. Очистка БД...")
    try:
        db.clear_database()
        print("   ✓ БД очищена")
    except Exception as e:
        print(f"   Note: {e}")
    
    # Фермер 1: Успешный фермер (высокий скоринг)
    print("\n2. Создание фермера #1 (Успешный)")
    
    farmer1_id = db.add_farmer(
        farmer_id="farmer1@agrocredit.uz",  # Email для логина
        age=45,
        education_level="высшее",
        farming_experience_years=20,
        number_of_loans=2,
        past_defaults=0,
        repayment_score=90
    )
    
    farm1_id = db.add_farm(
        farmer_id=farmer1_id,
        farm_size_acres=500.0,  # ~202 га
        ownership_status="собственность",
        land_valuation_usd=800000,
        soil_quality_index=85,
        water_availability_score=80,
        irrigation_type="капельное",
        crop_rotation_history_years=8
    )
    
    db.add_crop(farm1_id, "пшеница", [60, 62, 58, 61, 63], 64.0, True, True)
    db.add_crop(farm1_id, "кукуруза", [70, 72, 68, 71, 73], 75.0, True, True)
    db.add_crop(farm1_id, "овощи", [40, 42, 39, 41, 43], 44.0, True, True)
    
    db.add_machinery(farm1_id, "Трактор", "John Deere 8R", 2020, "отличное")
    db.add_machinery(farm1_id, "Комбайн", "Case IH Axial-Flow", 2019, "хорошее")
    
    db.add_object(farm1_id, 800.0, "склад", "зарегистрировано")
    db.add_object(farm1_id, 300.0, "офис", "зарегистрировано")
    
    db.add_geometry(farm1_id, 18, "высокое")
    
    db.add_loan_request(
        farm1_id, 
        "Покупка дополнительной техники",
        150000.0,
        36,
        250000.0,
        85
    )
    
    print(f"   ✓ Фермер создан (ID: {farmer1_id})")
    
    # Фермер 2: Средний фермер
    print("\n3. Создание фермера #2 (Средний)")
    
    farmer2_id = db.add_farmer(
        farmer_id="farmer2@agrocredit.uz",  # Email для логина
        age=38,
        education_level="среднее",
        farming_experience_years=12,
        number_of_loans=1,
        past_defaults=0,
        repayment_score=70
    )
    
    farm2_id = db.add_farm(
        farmer_id=farmer2_id,
        farm_size_acres=250.0,  # ~101 га
        ownership_status="собственность",
        land_valuation_usd=400000,
        soil_quality_index=70,
        water_availability_score=65,
        irrigation_type="поверхностное",
        crop_rotation_history_years=5
    )
    
    db.add_crop(farm2_id, "пшеница", [45, 47, 44, 46, 48], 49.0, True, True)
    db.add_crop(farm2_id, "кукуруза", [55, 57, 53, 56, 58], 59.0, True, False)
    
    db.add_machinery(farm2_id, "Трактор", "Belarus MTZ-82", 2015, "хорошее")
    
    db.add_object(farm2_id, 400.0, "склад", "зарегистрировано")
    
    db.add_geometry(farm2_id, 10, "среднее")
    
    db.add_loan_request(
        farm2_id,
        "Покупка удобрений и семян",
        75000.0,
        24,
        120000.0,
        70
    )
    
    print(f"   ✓ Фермер создан (ID: {farmer2_id})")
    
    # Фермер 3: Начинающий фермер (низкий скоринг)
    print("\n4. Создание фермера #3 (Начинающий)")
    
    farmer3_id = db.add_farmer(
        farmer_id="farmer3@agrocredit.uz",  # Email для логина
        age=28,
        education_level="среднее",
        farming_experience_years=3,
        number_of_loans=0,
        past_defaults=0,
        repayment_score=50
    )
    
    farm3_id = db.add_farm(
        farmer_id=farmer3_id,
        farm_size_acres=80.0,  # ~32 га
        ownership_status="аренда",
        land_valuation_usd=150000,
        soil_quality_index=60,
        water_availability_score=55,
        irrigation_type="дождевание",
        crop_rotation_history_years=2
    )
    
    db.add_crop(farm3_id, "пшеница", [30, 32, 29, 31, 33], 34.0, False, True)
    
    db.add_machinery(farm3_id, "Трактор", "Старая модель", 2005, "удовлетворительное")
    
    db.add_object(farm3_id, 150.0, "сарай", "не зарегистрировано")
    
    db.add_geometry(farm3_id, 4, "низкое")
    
    db.add_loan_request(
        farm3_id,
        "Покупка семян",
        30000.0,
        12,
        50000.0,
        55
    )
    
    print(f"   ✓ Фермер создан (ID: {farmer3_id})")
    
    # Рассчитываем скоринг для всех фермеров
    print("\n5. Расчет скоринга...")
    
    workflow = ScoringWorkflow("agrocredit.db")
    
    for farmer_id in [farmer1_id, farmer2_id, farmer3_id]:
        result = workflow.calculate_farmer_scoring(farmer_id, use_gpt=False, verbose=False)
        if result['success']:
            score = result['scoring_result']['TotalScore']
            rate = result['scoring_result']['InterestRate'] * 100
            payment = result['scoring_result'].get('MonthlyPayment', 0)
            print(f"   ✓ Фермер {farmer_id}: {score}/100, ставка {rate:.1f}%, платеж ${payment:,.2f}/мес")
        else:
            print(f"   ✗ Ошибка скоринга для фермера {farmer_id}")
    
    # Статистика
    print("\n6. Статистика БД:")
    stats = db.get_statistics()
    for key, value in stats.items():
        print(f"   {key}: {value}")
    
    print("\n" + "=" * 80)
    print("✓ ТЕСТОВЫЕ ДАННЫЕ СОЗДАНЫ УСПЕШНО")
    print("=" * 80)
    print("\nДоступные пользователи:")
    print("  • ivan.petrov@example.com (Высокий скоринг)")
    print("  • maria.sidorova@example.com (Средний скоринг)")
    print("  • alexey.kozlov@example.com (Низкий скоринг)")
    print("\nБаза данных: agrocredit.db")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    seed_database()
