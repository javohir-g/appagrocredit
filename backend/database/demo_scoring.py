"""
AgroCredit AI - Пример использования системы скоринга
Демонстрация полного процесса расчета кредитного скоринга с учетом суммы и срока кредита
"""

from db_manager import DatabaseManager
from scoring_engine import ScoringEngine


def demo_scoring_with_loan_params():
    """Демонстрация скоринга с учетом параметров кредита от фермера"""
    
    print("=" * 80)
    print("СИСТЕМА КРЕДИТНОГО СКОРИНГА - ДЕМОНСТРАЦИЯ")
    print("=" * 80)
    
    # Инициализация
    db = DatabaseManager("agrocredit_demo.db")
    db.initialize_database()
    scoring = ScoringEngine()
    
    print("\n1. Создание тестового фермера...")
    
    # Добавляем фермера
    farmer_id = db.add_farmer(
        farmer_id="F-2023-100",
        age=42,
        education_level="высшее",
        farming_experience_years=15,
        number_of_loans=1,
        past_defaults=0,
        repayment_score=75
    )
    print(f"   ✓ Фермер создан (ID: {farmer_id})")
    
    # Добавляем ферму
    farm_id = db.add_farm(
        farmer_id=farmer_id,
        farm_size_acres=300.0,  # ~121 га
        ownership_status="собственность",
        land_valuation_usd=600000,
        soil_quality_index=80,
        water_availability_score=75,
        irrigation_type="капельное",
        crop_rotation_history_years=5
    )
    print(f"   ✓ Ферма создана (ID: {farm_id})")
    
    # Добавляем культуры
    db.add_crop(
        farm_id=farm_id,
        crop_type="пшеница",
        crop_yield_last_5_years=[50.0, 52.0, 48.0, 51.0, 53.0],
        expected_yield_next_season=54.0,
        use_of_certified_seeds=True,
        use_of_fertilizers=True
    )
    
    db.add_crop(
        farm_id=farm_id,
        crop_type="кукуруза",
        crop_yield_last_5_years=[65.0, 63.0, 67.0, 64.0, 66.0],
        expected_yield_next_season=68.0,
        use_of_certified_seeds=True,
        use_of_fertilizers=True
    )
    print("   ✓ Культуры добавлены (пшеница, кукуруза)")
    
    # Добавляем технику
    db.add_machinery(
        farm_id=farm_id,
        name="Трактор",
        model="John Deere 8R",
        build_years=2019,
        condition="отличное"
    )
    print("   ✓ Техника добавлена (трактор 2019)")
    
    # Добавляем объект
    db.add_object(
        farm_id=farm_id,
        area=600.0,
        object_type="склад",
        legal_status="зарегистрировано"
    )
    print("   ✓ Склад добавлен (600 м²)")
    
    # Добавляем геометрию
    db.add_geometry(
        farm_id=farm_id,
        vertices=15,
        polygon_quality="высокое"
    )
    print("   ✓ Геометрия участка добавлена")
    
    # Добавляем доступ к рынкам
    db.add_market_access(
        farm_id=farm_id,
        distance_to_market_km=12.0,
        availability_of_storage_facilities=True,
        access_to_contract_farming=True,
        supply_chain_linkages_score=80
    )
    
    # Добавляем технологии
    db.add_technology_usage(
        farm_id=farm_id,
        mechanization_level="высокий",
        precision_agri_tools_used=True,
        use_of_financial_software=True
    )
    
    # Добавляем страхование
    db.add_insurance(
        farm_id=farm_id,
        crop_insurance_coverage=True,
        insurance_sum_assured=150000.0,
        weather_index_insurance=True
    )
    
    print("\n2. Фермер запрашивает кредит...")
    print("   Параметры от фермера:")
    
    # ФЕРМЕР ВВОДИТ ЭТИ ДАННЫЕ ВРУЧНУЮ:
    requested_amount = 100000.0  # Запрашиваемая сумма: $100,000
    loan_term_months = 36         # Срок: 36 месяцев (3 года)
    
    print(f"   • Сумма кредита: ${requested_amount:,.2f}")
    print(f"   • Срок кредита: {loan_term_months} месяцев ({loan_term_months//12} лет)")
    
    # Добавляем кредитную заявку с параметрами от фермера
    loan_id = db.add_loan_request(
        farm_id=farm_id,
        loan_purpose="Покупка дополнительной техники и удобрений",
        requested_loan_amount=requested_amount,
        loan_term_months=loan_term_months,
        expected_cash_flow_after_loan=180000.0,
        repayment_capacity_score=75
    )
    print(f"   ✓ Заявка создана (ID: {loan_id})")
    
    print("\n3. Расчет кредитного скоринга...")
    
    # Получаем полный профиль
    profile = db.get_farmer_complete_profile(farmer_id)
    
    # Извлекаем данные для скоринга
    scoring_data = scoring.extract_farmer_json(profile)
    
    # Рассчитываем скоринг
    result = scoring.calculate_scoring(scoring_data)
    
    print("\n" + "=" * 80)
    print("РЕЗУЛЬТАТЫ СКОРИНГА")
    print("=" * 80)
    
    print(f"\n📊 Детализация баллов:")
    print(f"   Земля:            {result['LandScore']}")
    print(f"   Техника:          {result['TechScore']}")
    print(f"   Культуры:         {result['CropScore']}")
    print(f"   Обременения:      {result['BanScore']}")
    print(f"   Инфраструктура:   {result['InfraScore']}")
    print(f"   Геометрия:        {result['GeoScore']}")
    print(f"   Диверсификация:   {result['DiversificationScore']}")
    print(f"   " + "-" * 40)
    print(f"   ИТОГО:            {result['TotalScore']}/100")
    
    print(f"\n💰 Условия кредита:")
    print(f"   Процентная ставка:      {result['InterestRate'] * 100:.1f}% годовых")
    print(f"   Ежемесячный платеж:     ${result['MonthlyPayment']:,.2f}")
    print(f"   Общая переплата:        ${(result['MonthlyPayment'] * loan_term_months - requested_amount):,.2f}")
    print(f"   Итого к возврату:       ${result['MonthlyPayment'] * loan_term_months:,.2f}")
    
    if result['DebtToIncomeRatio'] > 0:
        print(f"\n📈 Финансовый анализ:")
        print(f"   Отношение долга к доходу: {result['DebtToIncomeRatio']:.2%}")
        if result['DebtToIncomeRatio'] <= 0.3:
            print(f"   Оценка: ✅ Отличная платежеспособность")
        elif result['DebtToIncomeRatio'] <= 0.5:
            print(f"   Оценка: ⚠️  Приемлемая платежеспособность")
        else:
            print(f"   Оценка: ❌ Высокий риск")
    
    print(f"\n🎯 Рекомендация:")
    if result['TotalScore'] >= 70 and result['DebtToIncomeRatio'] <= 0.5:
        print(f"   ✅ ОДОБРИТЬ КРЕДИТ")
        print(f"   Фермер показывает высокую кредитоспособность")
    elif result['TotalScore'] >= 50:
        print(f"   ⚠️  ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА")
        print(f"   Рекомендуется анализ дополнительных документов")
    else:
        print(f"   ❌ ОТКЛОНИТЬ ЗАЯВКУ")
        print(f"   Недостаточный уровень кредитоспособности")
    
    print("\n" + "=" * 80)
    print(f"База данных: agrocredit_demo.db")
    print("=" * 80 + "\n")
    
    return result


if __name__ == "__main__":
    demo_scoring_with_loan_params()
