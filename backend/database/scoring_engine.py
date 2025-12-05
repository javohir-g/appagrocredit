"""
AgroCredit AI - Scoring Engine
Модуль для расчета кредитного скоринга на основе данных фермера
"""

import json
from typing import Dict, Any, List, Optional
from datetime import datetime


class ScoringEngine:
    """Движок для расчета кредитного скоринга"""
    
    # Базовые коэффициенты доходности для разных типов культур
    BASE_VALUES = {
        'виноградник': 2.0,
        'виноград': 2.0,
        'сад': 1.5,
        'фрукты': 1.5,
        'овощи': 3.0,
        'теплица': 3.0,
        'зерно': 1.0,
        'пшеница': 1.0,
        'кукуруза': 1.0,
        'ячмень': 1.0,
        'прочее': 0.8,
        'другое': 0.8
    }
    
    def __init__(self):
        """Инициализация движка скоринга"""
        pass
    
    def extract_farmer_json(self, farmer_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Извлечение данных фермера в формате JSON для скоринга
        
        Args:
            farmer_profile: Полный профиль фермера из db_manager.get_farmer_complete_profile()
        
        Returns:
            JSON объект с данными для скоринга
        """
        if not farmer_profile or not farmer_profile.get('farms'):
            raise ValueError("Invalid farmer profile or no farms found")
        
        # Берем первую ферму для скоринга (можно расширить для нескольких ферм)
        farm = farmer_profile['farms'][0]
        
        # Формируем JSON объект
        scoring_data = {
            "farmer_profile": {
                "farmer_id": farmer_profile.get('farmer_id'),
                "age": farmer_profile.get('age'),
                "education_level": farmer_profile.get('education_level'),
                "farming_experience_years": farmer_profile.get('farming_experience_years'),
                "number_of_loans": farmer_profile.get('number_of_loans', 0),
                "past_defaults": farmer_profile.get('past_defaults', 0),
                "repayment_score": farmer_profile.get('repayment_score', 0)
            },
            "farm_characteristics": {
                "farm_id": farm.get('id'),
                "farm_size_acres": farm.get('farm_size_acres'),
                "ownership_status": farm.get('ownership_status'),
                "land_valuation_usd": farm.get('land_valuation_usd'),
                "soil_quality_index": farm.get('soil_quality_index'),
                "water_availability_score": farm.get('water_availability_score'),
                "irrigation_type": farm.get('irrigation_type'),
                "crop_rotation_history_years": farm.get('crop_rotation_history_years')
            },
            "crop_production": {
                "crops": []
            },
            "machinery": [],
            "objects": [],
            "geometry": {},
            "market_access": {},
            "technology_usage": {},
            "insurance_and_risk_mitigation": {},
            "loan_specific": {}
        }
        
        # Добавляем культуры
        if farm.get('crops'):
            for crop in farm['crops']:
                crop_data = {
                    "crop_type": crop.get('crop_type'),
                    "expected_yield": crop.get('expected_yield_next_season'),
                    "yield_history": crop.get('crop_yield_last_5_years_tonnes'),
                    "use_certified_seeds": bool(crop.get('use_of_certified_seeds')),
                    "use_fertilizers": bool(crop.get('use_of_fertilizers'))
                }
                scoring_data["crop_production"]["crops"].append(crop_data)
        
        # Добавляем технику
        if farm.get('machinery'):
            for machine in farm['machinery']:
                current_year = datetime.now().year
                age = current_year - machine.get('build_years', current_year)
                scoring_data["machinery"].append({
                    "name": machine.get('name'),
                    "model": machine.get('model'),
                    "age": age,
                    "condition": machine.get('condition')
                })
        
        # Добавляем объекты
        if farm.get('objects'):
            for obj in farm['objects']:
                scoring_data["objects"].append({
                    "type": obj.get('type'),
                    "area": obj.get('area'),
                    "legal_status": obj.get('legal_status')
                })
        
        # Добавляем геометрию
        if farm.get('geometry'):
            scoring_data["geometry"] = {
                "vertices": farm['geometry'].get('vertices'),
                "polygon_quality": farm['geometry'].get('polygon_quality'),
                "has_coordinates": bool(farm['geometry'].get('coordinates'))
            }
        
        # Добавляем доступ к рынкам
        if farm.get('market_access'):
            scoring_data["market_access"] = {
                "distance_to_market_km": farm['market_access'].get('distance_to_market_km'),
                "storage_facilities": bool(farm['market_access'].get('availability_of_storage_facilities')),
                "contract_farming": bool(farm['market_access'].get('access_to_contract_farming')),
                "supply_chain_score": farm['market_access'].get('supply_chain_linkages_score')
            }
        
        # Добавляем технологии
        if farm.get('technology_usage'):
            scoring_data["technology_usage"] = {
                "mechanization_level": farm['technology_usage'].get('mechanization_level'),
                "precision_tools": bool(farm['technology_usage'].get('precision_agri_tools_used')),
                "financial_software": bool(farm['technology_usage'].get('use_of_financial_software')),
                "drones_satellite": bool(farm['technology_usage'].get('use_of_drones_or_satellite_data'))
            }
        
        # Добавляем страхование
        if farm.get('insurance'):
            scoring_data["insurance_and_risk_mitigation"] = {
                "crop_insurance": bool(farm['insurance'].get('crop_insurance_coverage')),
                "insurance_sum": farm['insurance'].get('insurance_sum_assured'),
                "past_claims": farm['insurance'].get('past_claim_history'),
                "weather_insurance": bool(farm['insurance'].get('weather_index_insurance'))
            }
        
        # Добавляем информацию о кредитных заявках
        if farm.get('loan_requests'):
            latest_loan = farm['loan_requests'][0] if farm['loan_requests'] else None
            if latest_loan:
                scoring_data["loan_specific"] = {
                    "loan_purpose": latest_loan.get('loan_purpose'),
                    "requested_amount": latest_loan.get('requested_loan_amount'),
                    "loan_term_months": latest_loan.get('loan_term_months', 12),
                    "expected_cash_flow": latest_loan.get('expected_cash_flow_after_loan'),
                    "repayment_capacity_score": latest_loan.get('repayment_capacity_score')
                }
        
        return scoring_data
    
    def calculate_land_score(self, farm_data: Dict[str, Any]) -> int:
        """
        Расчет балла за землю
        
        Правила:
        - A ≥ 200 га → 25 баллов
        - 100 ≤ A < 200 → 18 баллов
        - 50 ≤ A < 100 → 12 баллов
        - A < 50 → 6 баллов
        
        Коррекция за аренду:
        - Собственность (T=1) → без изменений
        - Аренда (T=2) → умножить на 0.85
        """
        # Конвертируем акры в гектары (1 акр ≈ 0.4047 га)
        area_acres = farm_data.get('farm_size_acres', 0)
        area_ha = area_acres * 0.4047
        
        # Определяем базовый балл
        if area_ha >= 200:
            score = 25
        elif area_ha >= 100:
            score = 18
        elif area_ha >= 50:
            score = 12
        else:
            score = 6
        
        # Коррекция за тип владения
        ownership = farm_data.get('ownership_status', '').lower()
        if 'аренда' in ownership or 'rent' in ownership:
            score = int(score * 0.85)
        
        return score
    
    def calculate_machinery_score(self, machinery: List[Dict[str, Any]]) -> int:
        """
        Расчет балла за технику
        
        Правила:
        - M=1 (новая/хорошая, ≤10 лет) → 25 баллов
        - M=2 (старая, >10 лет) → 17 баллов
        - M=3 (нет техники) → 8 баллов
        """
        if not machinery or len(machinery) == 0:
            return 8  # M=3
        
        # Проверяем возраст техники
        has_new = False
        has_old = False
        
        for machine in machinery:
            age = machine.get('age', 999)
            if age <= 10:
                has_new = True
            else:
                has_old = True
        
        if has_new:
            return 25  # M=1
        elif has_old:
            return 17  # M=2
        else:
            return 8   # M=3
    
    def calculate_crop_score(self, crops: List[Dict[str, Any]], farm_area_acres: float) -> int:
        """
        Расчет балла за доходность культур
        
        Правила:
        - Для каждого растения: Доходность = площадь × base_value(тип)
        - CropIncome = сумма всех доходностей
        - ≥150 → 20 баллов
        - 80-150 → 14 баллов
        - 30-80 → 8 баллов
        - <30 → 3 балла
        """
        if not crops:
            return 3
        
        total_income = 0.0
        farm_area_ha = farm_area_acres * 0.4047
        
        # Если не указаны площади под отдельные культуры, 
        # делим общую площадь поровну
        area_per_crop = farm_area_ha / len(crops) if crops else 0
        
        for crop in crops:
            crop_type = crop.get('crop_type', '').lower()
            
            # Определяем базовую стоимость
            base_value = 0.8  # По умолчанию
            for key, value in self.BASE_VALUES.items():
                if key in crop_type:
                    base_value = value
                    break
            
            # Рассчитываем доходность
            income = area_per_crop * base_value
            total_income += income
        
        # Определяем балл
        if total_income >= 150:
            return 20
        elif total_income >= 80:
            return 14
        elif total_income >= 30:
            return 8
        else:
            return 3
    
    def calculate_ban_score(self, objects: List[Dict[str, Any]]) -> int:
        """
        Расчет балла за обременения
        
        Правила:
        - Нет обременений → 15 баллов
        - 1 обременение → 8 баллов
        - >1 обременения → 3 балла
        
        Проверяем по legal_status объектов
        """
        bans_count = 0
        
        for obj in objects:
            legal_status = obj.get('legal_status', '').lower()
            # Считаем обременением, если статус "не зарегистрировано" или "в процессе"
            if 'не зарегистрировано' in legal_status or 'процесс' in legal_status:
                bans_count += 1
        
        if bans_count == 0:
            return 15
        elif bans_count == 1:
            return 8
        else:
            return 3
    
    def calculate_infra_score(self, objects: List[Dict[str, Any]]) -> int:
        """
        Расчет балла за инфраструктуру
        
        Правила:
        - area ≥ 400 → 15 баллов
        - 200 ≤ area < 400 → 10 баллов
        - area < 200 → 5 баллов
        - Нет построек → 0 баллов
        """
        if not objects:
            return 0
        
        total_area = sum(obj.get('area', 0) for obj in objects)
        
        if total_area >= 400:
            return 15
        elif total_area >= 200:
            return 10
        elif total_area > 0:
            return 5
        else:
            return 0
    
    def calculate_geometry_score(self, geometry: Dict[str, Any]) -> int:
        """
        Расчет балла за качество границ
        
        Правила:
        - vertices ≥ 12 → 10 баллов
        - 6 ≤ vertices < 12 → 6 баллов
        - < 6 → 3 балла
        """
        if not geometry:
            return 3
        
        vertices = geometry.get('vertices', 0)
        
        if vertices >= 12:
            return 10
        elif vertices >= 6:
            return 6
        else:
            return 3
    
    def calculate_diversification_score(self, crops: List[Dict[str, Any]]) -> int:
        """
        Расчет балла за диверсификацию
        
        Правила:
        - ≥3 типа культур → 10 баллов
        - 2 типа → 6 баллов
        - 1 тип → 3 балла
        - 0 типов → 0 баллов
        """
        if not crops:
            return 0
        
        # Подсчитываем уникальные типы культур
        unique_types = set()
        for crop in crops:
            crop_type = crop.get('crop_type', '').lower()
            if crop_type:
                unique_types.add(crop_type)
        
        count = len(unique_types)
        
        if count >= 3:
            return 10
        elif count == 2:
            return 6
        elif count == 1:
            return 3
        else:
            return 0
    
    def calculate_interest_rate(self, total_score: int) -> float:
        """
        Расчет процентной ставки
        
        Правила:
        - Score ≥ 80 → R = 0.20
        - 65 ≤ Score < 80 → R = 0.24
        - 50 ≤ Score < 65 → R = 0.28
        - Score < 50 → R = 0.32
        """
        base_rate = 0.20
        
        if total_score >= 80:
            return base_rate
        elif total_score >= 65:
            return base_rate + 0.04
        elif total_score >= 50:
            return base_rate + 0.08
        else:
            return base_rate + 0.12
    
    def calculate_monthly_payment(self, loan_amount: float, 
                                  annual_interest_rate: float, 
                                  loan_term_months: int) -> float:
        """
        Расчет ежемесячного платежа по аннуитетной схеме
        
        Args:
            loan_amount: Сумма кредита
            annual_interest_rate: Годовая процентная ставка (напр. 0.20 для 20%)
            loan_term_months: Срок кредита в месяцах
        
        Returns:
            Ежемесячный платеж
        """
        if loan_term_months == 0:
            return 0
        
        # Месячная процентная ставка
        monthly_rate = annual_interest_rate / 12
        
        if monthly_rate == 0:
            # Если ставка 0, то просто делим сумму на количество месяцев
            return loan_amount / loan_term_months
        
        # Формула аннуитетного платежа
        # M = L * (r * (1 + r)^n) / ((1 + r)^n - 1)
        # где M - ежемесячный платеж, L - сумма кредита, r - месячная ставка, n - кол-во месяцев
        payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** loan_term_months) / \
                  ((1 + monthly_rate) ** loan_term_months - 1)
        
        return round(payment, 2)
    
    def calculate_scoring(self, scoring_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Полный расчет скоринга
        
        Args:
            scoring_data: JSON объект с данными фермера
        
        Returns:
            Словарь с результатами скоринга
        """
        farm = scoring_data.get('farm_characteristics', {})
        crops = scoring_data.get('crop_production', {}).get('crops', [])
        machinery = scoring_data.get('machinery', [])
        objects = scoring_data.get('objects', [])
        geometry = scoring_data.get('geometry', {})
        
        # Рассчитываем все компоненты
        land_score = self.calculate_land_score(farm)
        tech_score = self.calculate_machinery_score(machinery)
        crop_score = self.calculate_crop_score(crops, farm.get('farm_size_acres', 0))
        ban_score = self.calculate_ban_score(objects)
        infra_score = self.calculate_infra_score(objects)
        geo_score = self.calculate_geometry_score(geometry)
        diversification_score = self.calculate_diversification_score(crops)
        
        # Итоговый балл
        total_score = (
            land_score + tech_score + crop_score + ban_score +
            infra_score + geo_score + diversification_score
        )
        
        # Ограничиваем максимум 100 баллами
        total_score = min(total_score, 100)
        
        # Рассчитываем процентную ставку
        interest_rate = self.calculate_interest_rate(total_score)
        
        # Рассчитываем ежемесячный платеж если есть данные о кредите
        loan_data = scoring_data.get('loan_specific', {})
        monthly_payment = 0
        debt_to_income_ratio = 0
        
        if loan_data.get('requested_amount') and loan_data.get('loan_term_months'):
            monthly_payment = self.calculate_monthly_payment(
                loan_data['requested_amount'],
                interest_rate,
                loan_data['loan_term_months']
            )
            
            # Рассчитываем отношение долга к доходу (если есть ожидаемый cash flow)
            expected_cash_flow = loan_data.get('expected_cash_flow', 0)
            if expected_cash_flow and expected_cash_flow > 0:
                # Месячный cash flow
                monthly_cash_flow = expected_cash_flow / 12
                debt_to_income_ratio = round(monthly_payment / monthly_cash_flow, 3) if monthly_cash_flow > 0 else 0
        
        return {
            "LandScore": land_score,
            "TechScore": tech_score,
            "CropScore": crop_score,
            "BanScore": ban_score,
            "InfraScore": infra_score,
            "GeoScore": geo_score,
            "DiversificationScore": diversification_score,
            "TotalScore": total_score,
            "InterestRate": interest_rate,
            "MonthlyPayment": monthly_payment,
            "DebtToIncomeRatio": debt_to_income_ratio
        }


if __name__ == "__main__":
    # Пример использования
    print("Scoring Engine initialized successfully")
