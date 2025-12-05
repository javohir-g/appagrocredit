"""
AgroCredit AI - Scoring Workflow
Главный модуль для выполнения полного процесса кредитного скоринга
"""

import json
from typing import Dict, Any, Optional
from datetime import datetime

from .db_manager import DatabaseManager
from .scoring_engine import ScoringEngine
from .gpt_analyzer import GPTAnalyzer


class ScoringWorkflow:
    """Workflow для полного процесса скоринга"""
    
    def __init__(self, db_path: str = "agrocredit.db", openai_api_key: Optional[str] = None):
        """
        Инициализация workflow
        
        Args:
            db_path: Путь к базе данных
            openai_api_key: API ключ OpenAI (опционально, для GPT анализа)
        """
        self.db = DatabaseManager(db_path)
        self.scoring_engine = ScoringEngine()
        self.gpt_analyzer = None
        
        # Инициализируем GPT анализатор если есть ключ
        if openai_api_key:
            try:
                self.gpt_analyzer = GPTAnalyzer(openai_api_key)
                print("✓ GPT Analyzer initialized")
            except Exception as e:
                print(f"⚠ GPT Analyzer not available: {e}")
                self.gpt_analyzer = None
    
    def calculate_farmer_scoring(self, farmer_id: int, 
                                 use_gpt: bool = False,
                                 verbose: bool = True) -> Dict[str, Any]:
        """
        Полный расчет скоринга для фермера
        
        Args:
            farmer_id: ID фермера
            use_gpt: Использовать GPT для анализа
            verbose: Выводить подробную информацию
        
        Returns:
            Словарь с результатами скоринга и ID записи
        """
        try:
            if verbose:
                print(f"\n{'='*80}")
                print(f"РАСЧЕТ СКОРИНГА ДЛЯ ФЕРМЕРА ID={farmer_id}")
                print(f"{'='*80}\n")
            
            # 1. Получаем полный профиль фермера
            if verbose:
                print("1. Получение данных фермера...")
            
            profile = self.db.get_farmer_complete_profile(farmer_id)
            if not profile:
                raise ValueError(f"Farmer with ID {farmer_id} not found")
            
            if not profile.get('farms'):
                raise ValueError(f"Farmer {farmer_id} has no farms")
            
            if verbose:
                print(f"   ✓ Фермер: {profile['farmer_id']}")
                print(f"   ✓ Ферм: {len(profile['farms'])}")
            
            # 2. Извлекаем данные для скоринга
            if verbose:
                print("\n2. Формирование данных для скоринга...")
            
            scoring_data = self.scoring_engine.extract_farmer_json(profile)
            
            if verbose:
                farm = scoring_data['farm_characteristics']
                print(f"   ✓ Площадь фермы: {farm['farm_size_acres']:.1f} акров")
                print(f"   ✓ Культур: {len(scoring_data['crop_production']['crops'])}")
                print(f"   ✓ Техники: {len(scoring_data['machinery'])}")
            
            # 3. Рассчитываем скоринг
            if verbose:
                print("\n3. Расчет скоринга...")
            
            scoring_result = self.scoring_engine.calculate_scoring(scoring_data)
            
            if verbose:
                print(f"   ✓ Итоговый балл: {scoring_result['TotalScore']}/100")
                print(f"   ✓ Процентная ставка: {scoring_result['InterestRate']*100:.1f}%")
                if scoring_result['MonthlyPayment'] > 0:
                    print(f"   ✓ Ежемесячный платеж: ${scoring_result['MonthlyPayment']:,.2f}")
            
            # 4. GPT анализ (если включен)
            gpt_analysis_text = None
            gpt_recommendations_text = None
            
            if use_gpt and self.gpt_analyzer:
                if verbose:
                    print("\n4. GPT анализ...")
                
                try:
                    gpt_response = self.gpt_analyzer.analyze_scoring(scoring_data, scoring_result)
                    
                    if gpt_response['success']:
                        analysis = gpt_response['analysis']
                        gpt_analysis_text = json.dumps(analysis, ensure_ascii=False)
                        gpt_recommendations_text = '\n'.join(analysis.get('recommendations', []))
                        
                        if verbose:
                            print(f"   ✓ GPT анализ получен")
                            print(f"   ✓ Решение: {analysis.get('loan_decision', 'N/A')}")
                    else:
                        if verbose:
                            print(f"   ⚠ GPT анализ не выполнен: {gpt_response.get('error')}")
                except Exception as e:
                    if verbose:
                        print(f"   ⚠ Ошибка GPT анализа: {e}")
            elif use_gpt and not self.gpt_analyzer:
                if verbose:
                    print("\n4. GPT анализ пропущен (не инициализирован)")
            
            # 5. Сохраняем результаты в БД
            if verbose:
                print(f"\n{'5' if not use_gpt else '5'}. Сохранение результатов...")
            
            farm_id = profile['farms'][0]['id']
            scoring_data_json = json.dumps(scoring_data, ensure_ascii=False)
            
            scoring_id = self.db.add_scoring_result(
                farmer_id=farmer_id,
                farm_id=farm_id,
                land_score=scoring_result['LandScore'],
                tech_score=scoring_result['TechScore'],
                crop_score=scoring_result['CropScore'],
                ban_score=scoring_result['BanScore'],
                infra_score=scoring_result['InfraScore'],
                geo_score=scoring_result['GeoScore'],
                diversification_score=scoring_result['DiversificationScore'],
                total_score=scoring_result['TotalScore'],
                interest_rate=scoring_result['InterestRate'],
                monthly_payment=scoring_result.get('MonthlyPayment', 0),
                debt_to_income_ratio=scoring_result.get('DebtToIncomeRatio', 0),
                gpt_analysis=gpt_analysis_text,
                gpt_recommendations=gpt_recommendations_text,
                scoring_data_json=scoring_data_json
            )
            
            if verbose:
                print(f"   ✓ Результаты сохранены (ID={scoring_id})")
                print(f"\n{'='*80}")
                print("✓ СКОРИНГ ЗАВЕРШЕН")
                print(f"{'='*80}\n")
            
            return {
                'success': True,
                'scoring_id': scoring_id,
                'scoring_result': scoring_result,
                'gpt_analysis': gpt_analysis_text
            }
            
        except Exception as e:
            if verbose:
                print(f"\n❌ ОШИБКА: {e}\n")
            return {
                'success': False,
                'error': str(e)
            }
    
    def recalculate_all_farmers(self, use_gpt: bool = False) -> Dict[str, Any]:
        """
        Массовый пересчет скоринга для всех фермеров
        
        Args:
            use_gpt: Использовать GPT для анализа
        
        Returns:
            Статистика пересчета
        """
        print(f"\n{'='*80}")
        print("МАССОВЫЙ ПЕРЕСЧЕТ СКОРИНГА")
        print(f"{'='*80}\n")
        
        farmers = self.db.get_all_farmers()
        total = len(farmers)
        success_count = 0
        failed_count = 0
        
        print(f"Найдено фермеров: {total}\n")
        
        for i, farmer in enumerate(farmers, 1):
            print(f"[{i}/{total}] Фермер {farmer['farmer_id']}...")
            
            result = self.calculate_farmer_scoring(
                farmer['id'],
                use_gpt=use_gpt,
                verbose=False
            )
            
            if result['success']:
                score = result['scoring_result']['TotalScore']
                rate = result['scoring_result']['InterestRate'] * 100
                print(f"          ✓ Балл: {score}/100, Ставка: {rate:.1f}%")
                success_count += 1
            else:
                print(f"          ❌ Ошибка: {result.get('error')}")
                failed_count += 1
        
        print(f"\n{'='*80}")
        print(f"Успешно: {success_count}/{total}")
        print(f"Ошибок: {failed_count}/{total}")
        print(f"{'='*80}\n")
        
        return {
            'total': total,
            'success': success_count,
            'failed': failed_count
        }
    
    def get_scoring_report(self, farmer_id: int) -> Optional[str]:
        """
        Получение отчета по скорингу фермера
        
        Args:
            farmer_id: ID фермера
        
        Returns:
            Текстовый отчет или None
        """
        # Получаем последний скоринг
        scoring = self.db.get_latest_scoring_by_farmer(farmer_id)
        if not scoring:
            return None
        
        # Получаем данные фермера
        farmer = self.db.get_farmer(farmer_id)
        if not farmer:
            return None
        
        # Формируем отчет
        report = f"""
╔══════════════════════════════════════════════════════════════════╗
║          ОТЧЕТ КРЕДИТНОГО СКОРИНГА - AGROCREDIT AI              ║
╚══════════════════════════════════════════════════════════════════╝

ФЕРМЕР: {farmer['farmer_id']}
ДАТА АНАЛИЗА: {scoring['calculated_at']}

─────────────────────────────────────────────────────────────────
РЕЗУЛЬТАТЫ СКОРИНГА
─────────────────────────────────────────────────────────────────
Итоговый балл:        {scoring['total_score']}/100
Процентная ставка:    {scoring['interest_rate'] * 100:.1f}%

Детализация баллов:
  • Земля:            {scoring['land_score']}
  • Техника:          {scoring['tech_score']}
  • Культуры:         {scoring['crop_score']}
  • Обременения:      {scoring['ban_score']}
  • Инфраструктура:   {scoring['infra_score']}
  • Геометрия:        {scoring['geo_score']}
  • Диверсификация:   {scoring['diversification_score']}
"""
        
        if scoring['monthly_payment'] > 0:
            report += f"""
─────────────────────────────────────────────────────────────────
УСЛОВИЯ КРЕДИТА
─────────────────────────────────────────────────────────────────
Ежемесячный платеж:   ${scoring['monthly_payment']:,.2f}
"""
            if scoring['debt_to_income_ratio'] > 0:
                report += f"Долг к доходу:        {scoring['debt_to_income_ratio']:.2%}\n"
        
        if scoring['gpt_recommendations']:
            report += f"""
─────────────────────────────────────────────────────────────────
РЕКОМЕНДАЦИИ GPT
─────────────────────────────────────────────────────────────────
{scoring['gpt_recommendations']}
"""
        
        report += "\n╚══════════════════════════════════════════════════════════════════╝\n"
        
        return report


if __name__ == "__main__":
    # Пример использования
    import os
    
    print("AgroCredit AI - Scoring Workflow")
    print("=" * 80)
    
    # Создаем workflow (без GPT для примера)
    workflow = ScoringWorkflow("agrocredit.db")
    
    # Если нужен GPT анализ:
    # api_key = os.getenv('OPENAI_API_KEY')
    # workflow = ScoringWorkflow("agrocredit.db", openai_api_key=api_key)
    
    print("\nWorkflow initialized successfully")
    print("Use workflow.calculate_farmer_scoring(farmer_id) to score a farmer")
