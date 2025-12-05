"""
AgroCredit AI - Примеры использования базы данных
Демонстрация работы с базой данных SQLite
"""

from db_manager import DatabaseManager


def main():
    """Основной пример использования базы данных"""
    print("=" * 80)
    print("AGROCREDIT AI - DATABASE EXAMPLE")
    print("=" * 80)
    
    # Инициализация базы данных
    db = DatabaseManager("agrocredit_example.db")
    db.initialize_database()
    print("\n✓ База данных инициализирована")
    
    # 1. Добавляем фермера
    farmer_id = db.add_farmer(
        farmer_id="F-2023-001",
        age=45,
        education_level="высшее",
        farming_experience_years=20,
        number_of_loans=2,
        past_defaults=0,
        repayment_score=85
    )
    print(f"\n✓ Фермер добавлен с ID: {farmer_id}")
    
    # 2. Добавляем ферму
    farm_id = db.add_farm(
        farmer_id=farmer_id,
        farm_size_acres=250.5,
        ownership_status="собственность",
        land_valuation_usd=500000,
        soil_quality_index=75,
        water_availability_score=80,
        irrigation_type="капельное",
        crop_rotation_history_years=5
    )
    print(f"✓ Ферма добавлена с ID: {farm_id}")
    
    # 3. Добавляем культуры
    wheat_id = db.add_crop(
        farm_id=farm_id,
        crop_type="пшеница",
        crop_yield_last_5_years=[45.2, 48.5, 50.1, 47.8, 49.3],
        yield_variance_index=0.12,
        expected_yield_next_season=51.0,
        market_price_volatility_score=0.25,
        use_of_certified_seeds=True,
        use_of_fertilizers=True
    )
    print(f"✓ Культура 'Пшеница' добавлена с ID: {wheat_id}")
    
    # 4. Добавляем технику
    tractor_id = db.add_machinery(
        farm_id=farm_id,
        name="Трактор",
        model="John Deere 6155M",
        build_years=2020,
        condition="отличное"
    )
    print(f"✓ Техника добавлена с ID: {tractor_id}")
    
    # 5. Добавляем объект
    warehouse_id = db.add_object(
        farm_id=farm_id,
        area=500.0,
        object_type="склад",
        legal_status="зарегистрировано"
    )
    print(f"✓ Объект добавлен с ID: {warehouse_id}")
    
    # 6. Добавляем геометрию
    geometry_id = db.add_geometry(
        farm_id=farm_id,
        vertices=5,
        polygon_quality="высокое",
        coordinates=[[69.24, 41.31], [69.25, 41.31], [69.25, 41.32], [69.24, 41.32], [69.24, 41.31]]
    )
    print(f"✓ Геометрия участка добавлена с ID: {geometry_id}")
    
    # 7. Добавляем доступ к рынкам
    market_id = db.add_market_access(
        farm_id=farm_id,
        distance_to_market_km=15.5,
        availability_of_storage_facilities=True,
        access_to_contract_farming=True,
        supply_chain_linkages_score=75
    )
    print(f"✓ Доступ к рынкам добавлен с ID: {market_id}")
    
    # 8. Добавляем технологии
    tech_id = db.add_technology_usage(
        farm_id=farm_id,
        mechanization_level="высокий",
        precision_agri_tools_used=True,
        use_of_financial_software=True,
        use_of_drones_or_satellite_data=True
    )
    print(f"✓ Технологии добавлены с ID: {tech_id}")
    
    # 9. Добавляем страхование
    insurance_id = db.add_insurance(
        farm_id=farm_id,
        crop_insurance_coverage=True,
        insurance_sum_assured=100000.0,
        past_claim_history=0,
        weather_index_insurance=True
    )
    print(f"✓ Страхование добавлено с ID: {insurance_id}")
    
    # 10. Добавляем кредитную заявку
    loan_id = db.add_loan_request(
        farm_id=farm_id,
        loan_purpose="Покупка новой техники и семян",
        requested_loan_amount=75000.0,
        expected_cash_flow_after_loan=120000.0,
        repayment_capacity_score=80
    )
    print(f"✓ Кредитная заявка добавлена с ID: {loan_id}")
    
    # Получаем полный профиль фермера
    print("\n" + "=" * 80)
    print("ПОЛНЫЙ ПРОФИЛЬ ФЕРМЕРА")
    print("=" * 80)
    
    profile = db.get_farmer_complete_profile(farmer_id)
    
    print(f"\nФермер: {profile['farmer_id']}")
    print(f"Возраст: {profile['age']} лет")
    print(f"Образование: {profile['education_level']}")
    print(f"Опыт: {profile['farming_experience_years']} лет")
    print(f"Рейтинг: {profile['repayment_score']}/100")
    
    for i, farm in enumerate(profile['farms'], 1):
        print(f"\n--- Ферма #{i} ---")
        print(f"Размер: {farm['farm_size_acres']} акров")
        print(f"Оценка: ${farm['land_valuation_usd']:,.2f}")
        print(f"Культур: {len(farm['crops'])}")
        print(f"Техники: {len(farm['machinery'])}")
        print(f"Кредитных заявок: {len(farm['loan_requests'])}")
    
    # Статистика
    print("\n" + "=" * 80)
    print("СТАТИСТИКА")
    print("=" * 80)
    
    stats = db.get_statistics()
    print(f"\nВсего фермеров: {stats['total_farmers']}")
    print(f"Всего ферм: {stats['total_farms']}")
    print(f"Всего заявок: {stats['total_loan_requests']}")
    print(f"Средний рейтинг: {stats['average_farmer_score']}/100")
    
    print("\n" + "=" * 80)
    print("✓ Пример выполнен успешно!")
    print("=" * 80)
    print(f"\nБаза данных: agrocredit_example.db\n")


if __name__ == "__main__":
    main()
