"""
Database Adapter для интеграции SQLite scoring DB с FastAPI
Конвертирует данные между SQLite и Pydantic моделями
"""

import sys
import os
from typing import Dict, Any, Optional, List
from datetime import datetime

# Добавляем путь к модулю database
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from database.db_manager import DatabaseManager
from database.scoring_workflow import ScoringWorkflow


class DatabaseAdapter:
    """Адаптер для работы с SQLite scoring database"""
    
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(os.path.dirname(__file__), "..", "agrocredit.db")
        
        self.db_manager = DatabaseManager(db_path)
        self.scoring_workflow = ScoringWorkflow(db_path)
        
        # Инициализируем БД если нужно
        try:
            self.db_manager.initialize_database()
        except Exception as e:
            print(f"Database already initialized: {e}")
        
        # MIGRATION: Add farmer_id column if missing
        self._migrate_add_farmer_id_column()
    
    def _migrate_add_farmer_id_column(self):
        """Добавить колонку farmer_id в таблицу farmers если отсутствует"""
        try:
            with self.db_manager.get_connection() as conn:
                # Проверяем наличие колонки
                cursor = conn.execute("PRAGMA table_info(farmers)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'farmer_id' not in columns:
                    print("⚠️  MIGRATION: farmer_id column missing, adding it...")
                    
                    # SQLite не поддерживает ALTER COLUMN, нужно пересоздать таблицу
                    # Но сначала сохраним данные
                    cursor = conn.execute("SELECT * FROM farmers")
                    existing_data = cursor.fetchall()
                    
                    if existing_data:
                        print(f"   Found {len(existing_data)} existing farmers, migrating...")
                        
                        # Создаем временную таблицу
                        conn.execute("ALTER TABLE farmers RENAME TO farmers_old")
                        
                        # Создаем новую таблицу с правильной схемой
                        conn.execute("""
                            CREATE TABLE farmers (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                farmer_id TEXT UNIQUE NOT NULL,
                                age INTEGER NOT NULL CHECK(age >= 18 AND age <= 100),
                                education_level TEXT NOT NULL,
                                farming_experience_years INTEGER NOT NULL CHECK(farming_experience_years >= 0),
                                number_of_loans INTEGER DEFAULT 0,
                                past_defaults INTEGER DEFAULT 0,
                                repayment_score INTEGER DEFAULT 0,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        """)
                        
                        # Копируем данные, используя id как farmer_id
                        conn.execute("""
                            INSERT INTO farmers (id, farmer_id, age, education_level, 
                                               farming_experience_years, number_of_loans,
                                               past_defaults, repayment_score)
                            SELECT id, 'farmer_' || id, age, education_level,
                                   farming_experience_years, number_of_loans,
                                   past_defaults, repayment_score
                            FROM farmers_old
                        """)
                        
                        # Удаляем старую таблицу
                        conn.execute("DROP TABLE farmers_old")
                        
                        print(f"   ✓ Migration complete! Migrated {len(existing_data)} farmers")
                    else:
                        # Нет данных, просто пересоздаем таблицу
                        conn.execute("DROP TABLE IF EXISTS farmers")
                        conn.execute("""
                            CREATE TABLE farmers (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                farmer_id TEXT UNIQUE NOT NULL,
                                age INTEGER NOT NULL CHECK(age >= 18 AND age <= 100),
                                education_level TEXT NOT NULL,
                                farming_experience_years INTEGER NOT NULL CHECK(farming_experience_years >= 0),
                                number_of_loans INTEGER DEFAULT 0,
                                past_defaults INTEGER DEFAULT 0,
                                repayment_score INTEGER DEFAULT 0,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            )
                        """)
                        print("   ✓ farmers table recreated with farmer_id column")
                else:
                    print("✓ Database schema up to date (farmer_id exists)")
                    
        except Exception as e:
            print(f"⚠️  Migration error: {e}")
    
    # ========================================================================
    # Loan Applications (заявки)
    # ========================================================================
    
    def create_loan_application(self, farmer_email: str, loan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Создание новой заявки на кредит
        
        Args:
            farmer_email: Email фермера
            loan_data: {
                requested_loan_amount: float,
                loan_term_months: int,
                loan_purpose: str,
                expected_cash_flow_after_loan: float (optional)
            }
        
        Returns:
            Словарь с данными созданной заявки
        """
        try:
            print(f"[DB_ADAPTER] Creating loan application for: {farmer_email}")
            print(f"[DB_ADAPTER] Loan data: {loan_data}")
            
            # Найти или создать фермера
            print(f"[DB_ADAPTER] Getting/creating farmer...")
            farmer = self.get_or_create_farmer_by_email(farmer_email)
            print(f"[DB_ADAPTER] Farmer found: ID={farmer.get('id')}, farmer_id={farmer.get('farmer_id')}")
            
            # Получить или создать ферму для фермера
            print(f"[DB_ADAPTER] Getting farms for farmer ID={farmer['id']}")
            farms = self.db_manager.get_farms_by_farmer(farmer['id'])
            
            if not farms:
                print(f"[DB_ADAPTER] No farms found, creating default farm...")
                # Создаем ферму по умолчанию
                farm_id = self.db_manager.add_farm(
                    farmer_id=farmer['id'],
                    farm_size_acres=100.0,
                    ownership_status="собственность"
                )
                print(f"[DB_ADAPTER] Farm created with ID={farm_id}")
            else:
                farm_id = farms[0]['id']
                print(f"[DB_ADAPTER] Using existing farm ID={farm_id}")
            
            # Создаем заявку
            print(f"[DB_ADAPTER] Creating loan request for farm_id={farm_id}")
            loan_id = self.db_manager.add_loan_request(
                farm_id=farm_id,
                loan_purpose=loan_data.get('loan_purpose', 'Не указано'),
                requested_loan_amount=loan_data['requested_loan_amount'],
                loan_term_months=loan_data.get('loan_term_months', 12),
                expected_cash_flow_after_loan=loan_data.get('expected_cash_flow_after_loan')
            )
            print(f"[DB_ADAPTER] Loan request created with ID={loan_id}")
            
            # Получаем созданную зав ку
            loan_requests = self.db_manager.get_loan_requests_by_farm(farm_id)
            created_loan = next((lr for lr in loan_requests if lr['id'] == loan_id), None)
            
            print(f"[DB_ADAPTER] Formatting response...")
            response = self._format_loan_application(created_loan, farmer, farm_id)
            print(f"[DB_ADAPTER] ✓ Success! Loan application ID={loan_id} created")
            
            return response
            
        except Exception as e:
            print(f"[DB_ADAPTER] ❌ ERROR in create_loan_application: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def get_all_loan_applications(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Получить все заявки (для банка)
        
        Args:
            status: фильтр по статусу (pending/approved/rejected)
        
        Returns:
            Список заявок
        """
        if status:
            # Фильтр по статусу через SQL
            with self.db_manager.get_connection() as conn:
                cursor = conn.execute("""
                    SELECT 
                        lr.*,
                        f.farmer_id,
                        f.age,
                        f.repayment_score,
                        fm.id as farm_id,
                        fm.farm_size_acres
                    FROM loan_requests lr
                    JOIN farms fm ON lr.farm_id = fm.id
                    JOIN farmers f ON fm.farmer_id = f.id
                    WHERE lr.status = ?
                    ORDER BY lr.created_at DESC
                """, (status,))
                rows = cursor.fetchall()
        else:
            # Все заявки
            with self.db_manager.get_connection() as conn:
                cursor = conn.execute("""
                    SELECT 
                        lr.*,
                        f.farmer_id,
                        f.age,
                        f.repayment_score,
                        fm.id as farm_id,
                        fm.farm_size_acres
                    FROM loan_requests lr
                    JOIN farms fm ON lr.farm_id = fm.id
                    JOIN farmers f ON fm.farmer_id = f.id
                    ORDER BY lr.created_at DESC
                """)
                rows = cursor.fetchall()
        
        applications = []
        for row in rows:
            loan = dict(row)
            
            # Получить скоринг если есть
            farmer_id_int = self.db_manager.get_farmer_by_farmer_id(loan['farmer_id'])['id']
            scoring = self.db_manager.get_latest_scoring_by_farmer(farmer_id_int)
            
            applications.append({
                'id': loan['id'],
                'farmer_id': loan['farmer_id'],
                'farmer_name': loan['farmer_id'],  # TODO: добавить имя в БД
                'loan_amount': loan['requested_loan_amount'],
                'loan_term_months': loan['loan_term_months'],
                'purpose': loan['loan_purpose'],
                'date_submitted': loan['created_at'],
                'status': loan['status'],
                'ai_score': scoring['total_score'] if scoring else None,
                'risk_category': self._get_risk_category(scoring['total_score']) if scoring else None,
                'interest_rate': scoring['interest_rate'] if scoring else None,
                'monthly_payment': scoring['monthly_payment'] if scoring else None
            })
        
        return applications
    
    def get_loan_application_detail(self, loan_id: int) -> Optional[Dict[str, Any]]:
        """Получить детальную информацию о заявке"""
        with self.db_manager.get_connection() as conn:
            cursor = conn.execute("""
                SELECT 
                    lr.*,
                    f.id as farmer_internal_id,
                    f.farmer_id,
                    f.age,
                    f.education_level,
                    f.farming_experience_years,
                    f.repayment_score,
                    fm.id as farm_id,
                    fm.farm_size_acres,
                    fm.ownership_status
                FROM loan_requests lr
                JOIN farms fm ON lr.farm_id = fm.id
                JOIN farmers f ON fm.farmer_id = f.id
                WHERE lr.id = ?
            """, (loan_id,))
            row = cursor.fetchone()
        
        if not row:
            return None
        
        loan = dict(row)
        
        # Получить полный профиль фермера
        profile = self.db_manager.get_farmer_complete_profile(loan['farmer_internal_id'])
        
        # Получить скоринг
        scoring = self.db_manager.get_latest_scoring_by_farmer(loan['farmer_internal_id'])
        
        return {
            'loan': loan,
            'farmer_profile': profile,
            'scoring': scoring
        }
    
    def calculate_scoring_for_application(self, loan_id: int) -> Dict[str, Any]:
        """Рассчитать скоринг для заявки"""
        detail = self.get_loan_application_detail(loan_id)
        if not detail:
            raise ValueError(f"Loan application {loan_id} not found")
        
        farmer_id = detail['loan']['farmer_internal_id']
        
        # Запускаем скоринг
        result = self.scoring_workflow.calculate_farmer_scoring(
            farmer_id=farmer_id,
            use_gpt=False,  # GPT опционально
            verbose=False
        )
        
        if not result['success']:
            raise Exception(f"Scoring failed: {result.get('error')}")
        
        return result['scoring_result']
    
    def update_loan_status(self, loan_id: int, new_status: str) -> bool:
        """Обновить статус заявки"""
        return self.db_manager.update_loan_status(loan_id, new_status)
    
    # ========================================================================
    # Farmers (Фермеры)
    # ========================================================================
    
    def get_or_create_farmer_by_email(self, email: str) -> Dict[str, Any]:
        """Найти или создать фермера по email"""
        # Используем farmer_id как email для простоты
        farmer = self.db_manager.get_farmer_by_farmer_id(email)
        
        if not farmer:
            # Создаем нового фермера
            farmer_id = self.db_manager.add_farmer(
                farmer_id=email,
                age=35,
                education_level="среднее",
                farming_experience_years=10
            )
            farmer = self.db_manager.get_farmer(farmer_id)
        
        return farmer
    
    def get_farmer_applications(self, farmer_email: str) -> List[Dict[str, Any]]:
        """Получить все заявки фермера"""
        farmer = self.get_or_create_farmer_by_email(farmer_email)
        farms = self.db_manager.get_farms_by_farmer(farmer['id'])
        
        applications = []
        for farm in farms:
            loan_requests = self.db_manager.get_loan_requests_by_farm(farm['id'])
            for lr in loan_requests:
                # Получить скоринг
                scoring = self.db_manager.get_latest_scoring_by_farmer(farmer['id'])
                applications.append(self._format_loan_application(lr, farmer, farm['id'], scoring))
        
        return applications
    
    # ========================================================================
    # Helper Methods
    # ========================================================================
    
    def _format_loan_application(self, loan: Dict[str, Any], farmer: Dict[str, Any], 
                                 farm_id: int, scoring: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Форматирование заявки для API"""
        return {
            'id': loan['id'],
            'farmer_id': farmer['farmer_id'],
            'farm_id': farm_id,
            'loan_amount': loan['requested_loan_amount'],
            'loan_term_months': loan.get('loan_term_months', 12),
            'purpose': loan['loan_purpose'],
            'expected_cash_flow': loan.get('expected_cash_flow_after_loan'),
            'date_submitted': loan['created_at'],
            'status': loan['status'],
            'ai_score': scoring['total_score'] if scoring else None,
            'interest_rate': scoring['interest_rate'] if scoring else None,
            'monthly_payment': scoring.get('monthly_payment', 0) if scoring else None,
            'risk_category': self._get_risk_category(scoring['total_score']) if scoring else None
        }
    
    def _get_risk_category(self, score: int) -> str:
        """Определить категорию риска по скорингу"""
        if score >= 70:
            return "Low"
        elif score >= 50:
            return "Medium"
        else:
            return "High"


# Глобальный инстанс
_adapter = None

def get_db_adapter() -> DatabaseAdapter:
    """Получить глобальный инстанс адаптера"""
    global _adapter
    if _adapter is None:
        _adapter = DatabaseAdapter()
    return _adapter
