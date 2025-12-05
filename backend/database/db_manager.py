"""
AgroCredit AI - Database Manager
Модуль для управления SQLite базой данных
"""

import sqlite3
import json
import os
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime
from contextlib import contextmanager


class DatabaseManager:
    """Менеджер базы данных SQLite для AgroCredit AI"""
    
    def __init__(self, db_path: str = "agrocredit.db"):
        """
        Инициализация менеджера базы данных
        
        Args:
            db_path: путь к файлу базы данных
        """
        self.db_path = db_path
        self.schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
        
    @contextmanager
    def get_connection(self):
        """Контекстный менеджер для работы с подключением к БД"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Позволяет получать результаты как словари
        conn.execute("PRAGMA foreign_keys = ON")  # Включение внешних ключей
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def initialize_database(self):
        """Создание всех таблиц из schema.sql"""
        if not os.path.exists(self.schema_path):
            raise FileNotFoundError(f"Schema file not found: {self.schema_path}")
        
        with open(self.schema_path, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        with self.get_connection() as conn:
            conn.executescript(schema_sql)
        
        print(f"✓ Database initialized successfully: {self.db_path}")
    
    def clear_database(self):
        """Удаление всех данных из всех таблиц"""
        tables = [
            'loan_requests', 'insurance_and_risk_mitigation', 'technology_usage',
            'market_access', 'geometry', 'objects', 'machinery', 'crops', 'farms', 'farmers'
        ]
        
        with self.get_connection() as conn:
            for table in tables:
                conn.execute(f"DELETE FROM {table}")
        
        print("✓ Database cleared successfully")
    
    # ========================================================================
    # FARMERS - Операции с фермерами
    # ========================================================================
    
    def add_farmer(self, farmer_id: str, age: int, education_level: str,
                   farming_experience_years: int, number_of_loans: int = 0,
                   past_defaults: int = 0, repayment_score: int = 0) -> int:
        """
        Добавление нового фермера
        
        Returns:
            ID созданной записи
        """
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO farmers (farmer_id, age, education_level, 
                                   farming_experience_years, number_of_loans, 
                                   past_defaults, repayment_score)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (farmer_id, age, education_level, farming_experience_years,
                 number_of_loans, past_defaults, repayment_score)
            )
            return cursor.lastrowid
    
    def get_farmer(self, farmer_id: int) -> Optional[Dict[str, Any]]:
        """Получение фермера по ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM farmers WHERE id = ?", (farmer_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_farmer_by_farmer_id(self, farmer_id: str) -> Optional[Dict[str, Any]]:
        """Получение фермера по farmer_id"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM farmers WHERE farmer_id = ?", (farmer_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def update_farmer(self, farmer_id: int, **kwargs) -> bool:
        """Обновление данных фермера"""
        if not kwargs:
            return False
        
        set_clause = ", ".join([f"{key} = ?" for key in kwargs.keys()])
        values = list(kwargs.values()) + [farmer_id]
        
        with self.get_connection() as conn:
            cursor = conn.execute(
                f"UPDATE farmers SET {set_clause} WHERE id = ?",
                values
            )
            return cursor.rowcount > 0
    
    def get_all_farmers(self) -> List[Dict[str, Any]]:
        """Получение всех фермеров"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM farmers ORDER BY id")
            return [dict(row) for row in cursor.fetchall()]
    
    # ========================================================================
    # FARMS - Операции с фермами
    # ========================================================================
    
    def add_farm(self, farmer_id: int, farm_size_acres: float, 
                 ownership_status: str, land_valuation_usd: float = None,
                 soil_quality_index: int = None, water_availability_score: int = None,
                 irrigation_type: str = None, crop_rotation_history_years: int = 0) -> int:
        """Добавление новой фермы"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO farms (farmer_id, farm_size_acres, ownership_status,
                                 land_valuation_usd, soil_quality_index, 
                                 water_availability_score, irrigation_type,
                                 crop_rotation_history_years)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (farmer_id, farm_size_acres, ownership_status, land_valuation_usd,
                 soil_quality_index, water_availability_score, irrigation_type,
                 crop_rotation_history_years)
            )
            return cursor.lastrowid
    
    def get_farm(self, farm_id: int) -> Optional[Dict[str, Any]]:
        """Получение фермы по ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM farms WHERE id = ?", (farm_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_farms_by_farmer(self, farmer_id: int) -> List[Dict[str, Any]]:
        """Получение всех ферм конкретного фермера"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM farms WHERE farmer_id = ? ORDER BY id",
                (farmer_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def update_farm(self, farm_id: int, **kwargs) -> bool:
        """Обновление данных фермы"""
        if not kwargs:
            return False
        
        set_clause = ", ".join([f"{key} = ?" for key in kwargs.keys()])
        values = list(kwargs.values()) + [farm_id]
        
        with self.get_connection() as conn:
            cursor = conn.execute(
                f"UPDATE farms SET {set_clause} WHERE id = ?",
                values
            )
            return cursor.rowcount > 0
    
    # ========================================================================
    # CROPS - Операции с культурами
    # ========================================================================
    
    def add_crop(self, farm_id: int, crop_type: str,
                 crop_yield_last_5_years: List[float] = None,
                 yield_variance_index: float = None,
                 expected_yield_next_season: float = None,
                 market_price_volatility_score: float = None,
                 use_of_certified_seeds: bool = False,
                 use_of_fertilizers: bool = False) -> int:
        """Добавление новой культуры"""
        # Преобразование списка урожайности в JSON
        yield_json = json.dumps(crop_yield_last_5_years) if crop_yield_last_5_years else None
        
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO crops (farm_id, crop_type, crop_yield_last_5_years_tonnes,
                                 yield_variance_index, expected_yield_next_season,
                                 market_price_volatility_score, use_of_certified_seeds,
                                 use_of_fertilizers)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (farm_id, crop_type, yield_json, yield_variance_index,
                 expected_yield_next_season, market_price_volatility_score,
                 int(use_of_certified_seeds), int(use_of_fertilizers))
            )
            return cursor.lastrowid
    
    def get_crops_by_farm(self, farm_id: int) -> List[Dict[str, Any]]:
        """Получение всех культур на ферме"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM crops WHERE farm_id = ? ORDER BY id",
                (farm_id,)
            )
            crops = []
            for row in cursor.fetchall():
                crop = dict(row)
                # Преобразование JSON обратно в список
                if crop['crop_yield_last_5_years_tonnes']:
                    crop['crop_yield_last_5_years_tonnes'] = json.loads(
                        crop['crop_yield_last_5_years_tonnes']
                    )
                crops.append(crop)
            return crops
    
    # ========================================================================
    # MACHINERY - Операции с техникой
    # ========================================================================
    
    def add_machinery(self, farm_id: int, name: str, model: str = None,
                     build_years: int = None, condition: str = None) -> int:
        """Добавление техники"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO machinery (farm_id, name, model, build_years, condition)
                VALUES (?, ?, ?, ?, ?)
                """,
                (farm_id, name, model, build_years, condition)
            )
            return cursor.lastrowid
    
    def get_machinery_by_farm(self, farm_id: int) -> List[Dict[str, Any]]:
        """Получение всей техники на ферме"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM machinery WHERE farm_id = ? ORDER BY id",
                (farm_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    # ========================================================================
    # OBJECTS - Операции с объектами недвижимости
    # ========================================================================
    
    def add_object(self, farm_id: int, area: float, object_type: str,
                   legal_status: str = None) -> int:
        """Добавление объекта недвижимости"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO objects (farm_id, area, type, legal_status)
                VALUES (?, ?, ?, ?)
                """,
                (farm_id, area, object_type, legal_status)
            )
            return cursor.lastrowid
    
    def get_objects_by_farm(self, farm_id: int) -> List[Dict[str, Any]]:
        """Получение всех объектов на ферме"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM objects WHERE farm_id = ? ORDER BY id",
                (farm_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    # ========================================================================
    # GEOMETRY - Операции с геометрией участков
    # ========================================================================
    
    def add_geometry(self, farm_id: int, vertices: int, polygon_quality: str,
                    coordinates: List[Tuple[float, float]] = None) -> int:
        """Добавление геометрии участка"""
        coords_json = json.dumps(coordinates) if coordinates else None
        
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO geometry (farm_id, vertices, polygon_quality, coordinates)
                VALUES (?, ?, ?, ?)
                """,
                (farm_id, vertices, polygon_quality, coords_json)
            )
            return cursor.lastrowid
    
    def get_geometry_by_farm(self, farm_id: int) -> Optional[Dict[str, Any]]:
        """Получение геометрии участка"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM geometry WHERE farm_id = ?",
                (farm_id,)
            )
            row = cursor.fetchone()
            if row:
                geometry = dict(row)
                if geometry['coordinates']:
                    geometry['coordinates'] = json.loads(geometry['coordinates'])
                return geometry
            return None
    
    # ========================================================================
    # MARKET_ACCESS - Операции с доступом к рынкам
    # ========================================================================
    
    def add_market_access(self, farm_id: int, distance_to_market_km: float,
                         availability_of_storage_facilities: bool = False,
                         access_to_contract_farming: bool = False,
                         supply_chain_linkages_score: int = None) -> int:
        """Добавление информации о доступе к рынкам"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO market_access (farm_id, distance_to_market_km,
                                         availability_of_storage_facilities,
                                         access_to_contract_farming,
                                         supply_chain_linkages_score)
                VALUES (?, ?, ?, ?, ?)
                """,
                (farm_id, distance_to_market_km, int(availability_of_storage_facilities),
                 int(access_to_contract_farming), supply_chain_linkages_score)
            )
            return cursor.lastrowid
    
    def get_market_access_by_farm(self, farm_id: int) -> Optional[Dict[str, Any]]:
        """Получение информации о доступе к рынкам"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM market_access WHERE farm_id = ?",
                (farm_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    # ========================================================================
    # TECHNOLOGY_USAGE - Операции с использованием технологий
    # ========================================================================
    
    def add_technology_usage(self, farm_id: int, mechanization_level: str,
                           precision_agri_tools_used: bool = False,
                           use_of_financial_software: bool = False,
                           use_of_drones_or_satellite_data: bool = False) -> int:
        """Добавление информации об использовании технологий"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO technology_usage (farm_id, mechanization_level,
                                            precision_agri_tools_used,
                                            use_of_financial_software,
                                            use_of_drones_or_satellite_data)
                VALUES (?, ?, ?, ?, ?)
                """,
                (farm_id, mechanization_level, int(precision_agri_tools_used),
                 int(use_of_financial_software), int(use_of_drones_or_satellite_data))
            )
            return cursor.lastrowid
    
    def get_technology_usage_by_farm(self, farm_id: int) -> Optional[Dict[str, Any]]:
        """Получение информации об использовании технологий"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM technology_usage WHERE farm_id = ?",
                (farm_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    # ========================================================================
    # INSURANCE - Операции со страхованием
    # ========================================================================
    
    def add_insurance(self, farm_id: int, crop_insurance_coverage: bool = False,
                     insurance_sum_assured: float = 0, past_claim_history: int = 0,
                     weather_index_insurance: bool = False) -> int:
        """Добавление информации о страховании"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO insurance_and_risk_mitigation (farm_id, crop_insurance_coverage,
                                                          insurance_sum_assured,
                                                          past_claim_history,
                                                          weather_index_insurance)
                VALUES (?, ?, ?, ?, ?)
                """,
                (farm_id, int(crop_insurance_coverage), insurance_sum_assured,
                 past_claim_history, int(weather_index_insurance))
            )
            return cursor.lastrowid
    
    def get_insurance_by_farm(self, farm_id: int) -> Optional[Dict[str, Any]]:
        """Получение информации о страховании"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM insurance_and_risk_mitigation WHERE farm_id = ?",
                (farm_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    # ========================================================================
    # LOAN_REQUESTS - Операции с кредитными заявками
    # ========================================================================
    
    def add_loan_request(self, farm_id: int, loan_purpose: str,
                        requested_loan_amount: float,
                        loan_term_months: int = 12,
                        expected_cash_flow_after_loan: float = None,
                        repayment_capacity_score: int = None) -> int:
        """Добавление кредитной заявки"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO loan_requests (farm_id, loan_purpose, requested_loan_amount,
                                         loan_term_months, expected_cash_flow_after_loan,
                                         repayment_capacity_score)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (farm_id, loan_purpose, requested_loan_amount, loan_term_months,
                 expected_cash_flow_after_loan, repayment_capacity_score)
            )
            return cursor.lastrowid
    
    def get_loan_requests_by_farm(self, farm_id: int) -> List[Dict[str, Any]]:
        """Получение всех кредитных заявок фермы"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM loan_requests WHERE farm_id = ? ORDER BY created_at DESC",
                (farm_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def update_loan_status(self, loan_id: int, status: str) -> bool:
        """Обновление статуса кредитной заявки"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "UPDATE loan_requests SET status = ? WHERE id = ?",
                (status, loan_id)
            )
            return cursor.rowcount > 0
    
    # ========================================================================
    # КОМПЛЕКСНЫЕ ЗАПРОСЫ
    # ========================================================================
    
    def get_farmer_complete_profile(self, farmer_id: int) -> Dict[str, Any]:
        """
        Получение полного профиля фермера со всеми связанными данными
        
        Returns:
            Словарь с полной информацией о фермере, его фермах и всех связанных данных
        """
        farmer = self.get_farmer(farmer_id)
        if not farmer:
            return None
        
        farms = self.get_farms_by_farmer(farmer_id)
        
        # Для каждой фермы получаем все связанные данные
        for farm in farms:
            farm_id = farm['id']
            farm['crops'] = self.get_crops_by_farm(farm_id)
            farm['machinery'] = self.get_machinery_by_farm(farm_id)
            farm['objects'] = self.get_objects_by_farm(farm_id)
            farm['geometry'] = self.get_geometry_by_farm(farm_id)
            farm['market_access'] = self.get_market_access_by_farm(farm_id)
            farm['technology_usage'] = self.get_technology_usage_by_farm(farm_id)
            farm['insurance'] = self.get_insurance_by_farm(farm_id)
            farm['loan_requests'] = self.get_loan_requests_by_farm(farm_id)
        
        farmer['farms'] = farms
        return farmer
    
    def get_pending_loan_requests(self) -> List[Dict[str, Any]]:
        """Получение всех ожидающих кредитных заявок"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT lr.*, f.farm_size_acres, fr.farmer_id, fr.age, fr.repayment_score
                FROM loan_requests lr
                JOIN farms f ON lr.farm_id = f.id
                JOIN farmers fr ON f.farmer_id = fr.id
                WHERE lr.status = 'pending'
                ORDER BY lr.created_at DESC
                """
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_statistics(self) -> Dict[str, Any]:
        """Получение общей статистики по базе данных"""
        with self.get_connection() as conn:
            stats = {}
            
            # Количество записей в каждой таблице
            cursor = conn.execute("SELECT COUNT(*) as count FROM farmers")
            stats['total_farmers'] = cursor.fetchone()['count']
            
            cursor = conn.execute("SELECT COUNT(*) as count FROM farms")
            stats['total_farms'] = cursor.fetchone()['count']
            
            cursor = conn.execute("SELECT COUNT(*) as count FROM loan_requests")
            stats['total_loan_requests'] = cursor.fetchone()['count']
            
            cursor = conn.execute(
                "SELECT COUNT(*) as count FROM loan_requests WHERE status = 'pending'"
            )
            stats['pending_loan_requests'] = cursor.fetchone()['count']
            
            cursor = conn.execute(
                "SELECT COUNT(*) as count FROM loan_requests WHERE status = 'approved'"
            )
            stats['approved_loan_requests'] = cursor.fetchone()['count']
            
            cursor = conn.execute(
                "SELECT SUM(requested_loan_amount) as total FROM loan_requests WHERE status = 'approved'"
            )
            result = cursor.fetchone()
            stats['total_approved_amount'] = result['total'] if result['total'] else 0
            
            cursor = conn.execute("SELECT AVG(repayment_score) as avg FROM farmers")
            result = cursor.fetchone()
            stats['average_farmer_score'] = round(result['avg'], 2) if result['avg'] else 0
            
            return stats
    
    # ========================================================================
    # SCORING - Операции со скорингом
    # ========================================================================
    
    def add_scoring_result(self, farmer_id: int, farm_id: int,
                          land_score: int, tech_score: int, crop_score: int,
                          ban_score: int, infra_score: int, geo_score: int,
                          diversification_score: int, total_score: int,
                          interest_rate: float, monthly_payment: float = 0,
                          debt_to_income_ratio: float = 0,
                          gpt_analysis: str = None, gpt_recommendations: str = None,
                          scoring_data_json: str = None) -> int:
        """Добавление результата скоринга"""
        with self.get_connection() as conn:
            # Сначала сбрасываем флаг is_latest для предыдущих результатов этого фермера
            conn.execute(
                "UPDATE scoring_results SET is_latest = 0 WHERE farmer_id = ?",
                (farmer_id,)
            )
            
            # Добавляем новый результат
            cursor = conn.execute(
                """
                INSERT INTO scoring_results (
                    farmer_id, farm_id, land_score, tech_score, crop_score,
                    ban_score, infra_score, geo_score, diversification_score,
                    total_score, interest_rate, monthly_payment, debt_to_income_ratio,
                    gpt_analysis, gpt_recommendations, scoring_data_json, is_latest
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (farmer_id, farm_id, land_score, tech_score, crop_score,
                 ban_score, infra_score, geo_score, diversification_score,
                 total_score, interest_rate, monthly_payment, debt_to_income_ratio,
                 gpt_analysis, gpt_recommendations, scoring_data_json)
            )
            scoring_id = cursor.lastrowid
            
            # Добавляем запись в историю
            conn.execute(
                """
                INSERT INTO scoring_history (scoring_result_id, farmer_id, total_score, 
                                            interest_rate, change_reason)
                VALUES (?, ?, ?, ?, ?)
                """,
                (scoring_id, farmer_id, total_score, interest_rate, "Новый расчет скоринга")
            )
            
            return scoring_id
    
    def get_scoring_result(self, scoring_id: int) -> Optional[Dict[str, Any]]:
        """Получение результата скоринга по ID"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM scoring_results WHERE id = ?",
                (scoring_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_latest_scoring_by_farmer(self, farmer_id: int) -> Optional[Dict[str, Any]]:
        """Получение последнего скоринга фермера"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM scoring_results 
                WHERE farmer_id = ? AND is_latest = 1
                ORDER BY calculated_at DESC LIMIT 1
                """,
                (farmer_id,)
            )
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def get_scoring_history(self, farmer_id: int) -> List[Dict[str, Any]]:
        """Получение истории скоринга фермера"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM scoring_history 
                WHERE farmer_id = ? 
                ORDER BY calculated_at DESC
                """,
                (farmer_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    def get_all_latest_scorings(self) -> List[Dict[str, Any]]:
        """Получение последних скорингов всех фермеров"""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT sr.*, f.farmer_id, f.age, f.repayment_score
                FROM scoring_results sr
                JOIN farmers f ON sr.farmer_id = f.id
                WHERE sr.is_latest = 1
                ORDER BY sr.total_score DESC
                """
            )
            return [dict(row) for row in cursor.fetchall()]


if __name__ == "__main__":
    # Пример использования
    db = DatabaseManager("agrocredit.db")
    
    # Инициализация базы данных
    print("Initializing database...")
    db.initialize_database()
    
    # Получение статистики
    print("\nDatabase statistics:")
    stats = db.get_statistics()
    for key, value in stats.items():
        print(f"  {key}: {value}")
