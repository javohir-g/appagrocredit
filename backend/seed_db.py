"""
Seed script to populate database with mock data
"""
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db import SessionLocal, init_db
from app.models import (
    User, UserRole, Farmer, OwnershipType,
    Credit, CreditStatus, Card, Meteorology, CropRecommendation,
    Field, FieldStatus
)
from app.core.security import get_password_hash


def seed_database():
    """Seed database with mock data"""
    init_db()
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("Database already contains data. Skipping seed.")
            return
        
        # Create users
        users_data = [
            {"email": "farmer1@example.com", "password": "password123", "role": UserRole.farmer},
            {"email": "farmer2@example.com", "password": "password123", "role": UserRole.farmer},
            {"email": "farmer3@example.com", "password": "password123", "role": UserRole.farmer},
            {"email": "bank@example.com", "password": "password123", "role": UserRole.bank_officer},
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                role=user_data["role"]
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        print(f"Created {len(users)} users")
        
        # Create farmers
        farmers_data = [
            {
                "user_id": users[0].id,
                "full_name": "Иван Петров",
                "farming_experience": 15,
                "crop_type": "Пшеница",
                "land_size": 45.5,
                "location": "Ташкентская область",
                "ownership": OwnershipType.own,
                "soil_type": "Чернозём",
                "income": 5000.0,
                "expenses": 3000.0,
                "existing_credit": 50000.0
            },
            {
                "user_id": users[1].id,
                "full_name": "Мария Сидорова",
                "farming_experience": 8,
                "crop_type": "Хлопок",
                "land_size": 30.0,
                "location": "Самаркандская область",
                "ownership": OwnershipType.rent,
                "soil_type": "Суглинок",
                "income": 4500.0,
                "expenses": 2800.0,
                "existing_credit": 30000.0
            },
            {
                "user_id": users[2].id,
                "full_name": "Алексей Козлов",
                "farming_experience": 12,
                "crop_type": "Рис",
                "land_size": 50.0,
                "location": "Бухарская область",
                "ownership": OwnershipType.lease,
                "soil_type": "Песчаный",
                "income": 6000.0,
                "expenses": 3500.0,
                "existing_credit": 75000.0
            }
        ]
        
        farmers = []
        for farmer_data in farmers_data:
            farmer = Farmer(**farmer_data)
            db.add(farmer)
            farmers.append(farmer)
        
        db.commit()
        print(f"Created {len(farmers)} farmers")
        
        # Create cards for farmers
        cards_data = [
            # Farmer 1 cards
            {"farmer_id": farmers[0].id, "card_number": "**** 4532", "card_holder": "IVAN PETROV", "card_type": "Visa", "balance": 15000.0, "is_primary": True},
            {"farmer_id": farmers[0].id, "card_number": "**** 8765", "card_holder": "IVAN PETROV", "card_type": "MasterCard", "balance": 8000.0},
            
            # Farmer 2 cards
            {"farmer_id": farmers[1].id, "card_number": "**** 2341", "card_holder": "MARIA SIDOROVA", "card_type": "Visa", "balance": 12000.0, "is_primary": True},
            
            # Farmer 3 cards
            {"farmer_id": farmers[2].id, "card_number": "**** 9876", "card_holder": "ALEXEY KOZLOV", "card_type": "Visa", "balance": 20000.0, "is_primary": True},
            {"farmer_id": farmers[2].id, "card_number": "**** 5544", "card_holder": "ALEXEY KOZLOV", "card_type": "Uzcard", "balance": 5000.0},
        ]
        
        for card_data in cards_data:
            card = Card(**card_data)
            db.add(card)
        
        db.commit()
        print(f"Created {len(cards_data)} cards")
        
        # Create credits
        credits_data = [
            # Farmer 1 - active credit
            {
                "farmer_id": farmers[0].id,
                "amount": 50000.0,
                "remaining": 35000.0,
                "rate": 12.0,
                "term_months": 24,
                "due_date": datetime.now() + timedelta(days=365),
                "status": CreditStatus.active,
                "paid": 15000.0,
                "progress": 30.0,
                "next_payment": 2500.0,
                "next_payment_date": datetime.now() + timedelta(days=15),
                "purpose": "Покупка семян и удобрений"
            },
            # Farmer 1 - second active credit
            {
                "farmer_id": farmers[0].id,
                "amount": 30000.0,
                "remaining": 5000.0,
                "rate": 10.0,
                "term_months": 12,
                "due_date": datetime.now() + timedelta(days=60),
                "status": CreditStatus.active,
                "paid": 25000.0,
                "progress": 83.0,
                "next_payment": 1500.0,
                "next_payment_date": datetime.now() + timedelta(days=20),
                "purpose": "Покупка техники"
            },
            
            # Farmer 2 - active credit
            {
                "farmer_id": farmers[1].id,
                "amount": 40000.0,
                "remaining": 28000.0,
                "rate": 11.5,
                "term_months": 18,
                "due_date": datetime.now() + timedelta(days=300),
                "status": CreditStatus.active,
                "paid": 12000.0,
                "progress": 30.0,
                "next_payment": 3000.0,
                "next_payment_date": datetime.now() + timedelta(days=10),
                "purpose": "Расширение хозяйства"
            },
            
            # Farmer 3 - active credit
            {
                "farmer_id": farmers[2].id,
                "amount": 75000.0,
                "remaining": 55000.0,
                "rate": 13.0,
                "term_months": 36,
                "due_date": datetime.now() + timedelta(days=730),
                "status": CreditStatus.active,
                "paid": 20000.0,
                "progress": 27.0,
                "next_payment": 4000.0,
                "next_payment_date": datetime.now() + timedelta(days=25),
                "purpose": "Покупка оросительного оборудования"
            },
            
            # Farmer 3 - overdue credit
            {
                "farmer_id": farmers[2].id,
                "amount": 20000.0,
                "remaining": 18000.0,
                "rate": 15.0,
                "term_months": 12,
                "due_date": datetime.now() - timedelta(days=10),
                "status": CreditStatus.overdue,
                "paid": 2000.0,
                "progress": 10.0,
                "next_payment": 2000.0,
                "next_payment_date": datetime.now() - timedelta(days=10),
                "purpose": "Покупка удобрений"
            }
        ]
        
        for credit_data in credits_data:
            credit = Credit(**credit_data)
            db.add(credit)
        
        db.commit()
        print(f"Created {len(credits_data)} credits")
        
        # Create meteorology data
        meteorology_data = []
        for i in range(30):  # Last 30 days
            date = datetime.now().date() - timedelta(days=i)
            meteorology_data.append({
                "date": date,
                "temperature": 20 + (i % 15),
                "humidity": 50 + (i % 30),
                "wind_speed": 10 + (i % 20),
                "precipitation": 0 if i % 3 else 5 + (i % 10),
                "pressure": 1010 + (i % 20),
                "description": ["Солнечно", "Облачно", "Дождь", "Ветрено"][i % 4],
                "location": "Ташкентская область"
            })
        
        for met_data in meteorology_data:
            met = Meteorology(**met_data)
            db.add(met)
        
        db.commit()
        print(f"Created {len(meteorology_data)} meteorology records")
        
        # Create crop recommendations
        recommendations_data = [
            {
                "region": "Ташкентская область",
                "date": datetime.now().date(),
                "risk_frost": 15.0,
                "risk_heatwave": 45.0,
                "irrigation_recommendation": "Умеренный полив - 2 раза в неделю",
                "fertilizer_recommendation": "Азотные удобрения - 50 кг/га",
                "pest_risk": 30.0
            },
            {
                "region": "Самаркандская область",
                "date": datetime.now().date(),
                "risk_frost": 20.0,
                "risk_heatwave": 50.0,
                "irrigation_recommendation": "Интенсивный полив - 3 раза в неделю",
                "fertilizer_recommendation": "Комплексные удобрения - 40 кг/га",
                "pest_risk": 35.0
            },
            {
                "region": "Бухарская область",
                "date": datetime.now().date(),
                "risk_frost": 10.0,
                "risk_heatwave": 60.0,
                "irrigation_recommendation": "Капельное орошение - ежедневно",
                "fertilizer_recommendation": "Органические удобрения - 30 кг/га",
                "pest_risk": 40.0
            }
        ]
        
        for rec_data in recommendations_data:
            rec = CropRecommendation(**rec_data)
            db.add(rec)
        
        db.commit()
        print(f"Created {len(recommendations_data)} crop recommendations")
        
        # Create fields for farmers
        fields_data = [
            {"farmer_id": farmers[0].id, "name": "Поле №1", "crop_type": "Пшеница", "size_hectares": 15.5, "location_description": "Ташкентская обл.", "soil_type": "Чернозём", "health_score": 92, "status": FieldStatus.healthy, "ndvi_value": 0.82, "ai_recommendation": "Отличное состояние. Продолжайте текущий режим полива."},
            {"farmer_id": farmers[0].id, "name": "Поле №2", "crop_type": "Ячмень", "size_hectares": 12.0, "location_description": "Ташкентская обл.", "soil_type": "Чернозём", "health_score": 78, "status": FieldStatus.healthy, "ndvi_value": 0.71, "ai_recommendation": "Хорошее состояние. Внесите удобрения через 5 дней."},
            {"farmer_id": farmers[1].id, "name": "Поле №1", "crop_type": "Хлопок", "size_hectares": 20.0, "location_description": "Самаркандская обл.", "soil_type": "Суглинок", "health_score": 68, "status": FieldStatus.warning, "ndvi_value": 0.62, "ai_recommendation": "Обнаружены признаки засухи. Увеличьте полив на 20%."},
            {"farmer_id": farmers[1].id, "name": "Поле №2", "crop_type": "Хлопок", "size_hectares": 10.0, "location_description": "Самаркандская обл.", "soil_type": "Суглинок", "health_score": 85, "status": FieldStatus.healthy, "ndvi_value": 0.78, "ai_recommendation": "Состояние хорошее. Продолжайте интенсивный полив."},
            {"farmer_id": farmers[2].id, "name": "Поле №1", "crop_type": "Рис", "size_hectares": 18.0, "location_description": "Бухарская обл.", "soil_type": "Песчаный", "health_score": 88, "status": FieldStatus.healthy, "ndvi_value": 0.80, "ai_recommendation": "Отличное состояние. Поддерживайте капельное орошение."},
            {"farmer_id": farmers[2].id, "name": "Поле №2", "crop_type": "Овощи", "size_hectares": 8.5, "location_description": "Бухарская обл.", "soil_type": "Песчаный", "health_score": 72, "status": FieldStatus.healthy, "ndvi_value": 0.68, "ai_recommendation": "Хорошее состояние. Рассмотрите внесение органических удобрений."},
            {"farmer_id": farmers[2].id, "name": "Поле №3", "crop_type": "Рис", "size_hectares": 23.5, "location_description": "Бухарская обл.", "soil_type": "Песчаный", "health_score": 55, "status": FieldStatus.warning, "ndvi_value": 0.52, "ai_recommendation": "Требует внимания. Проверьте систему орошения и проведите анализ почвы."}
        ]
        
        for field_data in fields_data:
            field = Field(**field_data)
            db.add(field)
        
        db.commit()
        print(f"Created {len(fields_data)} fields")
        
        print("\n✅ Database seeded successfully!")
        print("\nTest credentials:")
        print("Farmer 1: farmer1@example.com / password123")
        print("Farmer 2: farmer2@example.com / password123")
        print("Farmer 3: farmer3@example.com / password123")
        print("Bank Officer: bank@example.com / password123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
