"""
AgroCredit AI - GPT Analyzer
Модуль для интеграции с OpenAI GPT API для анализа кредитного скоринга
"""

import os
import json
from typing import Dict, Any, Optional
import openai
from openai import OpenAI


class GPTAnalyzer:
    """Анализатор данных скоринга с использованием GPT"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Инициализация GPT анализатора
        
        Args:
            api_key: API ключ OpenAI (если None, берется из переменной окружения)
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not provided. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = "gpt-4"  # Можно изменить на gpt-4-turbo или gpt-3.5-turbo
    
    def format_scoring_for_gpt(self, scoring_data: Dict[str, Any], 
                               scoring_result: Dict[str, Any]) -> str:
        """
        Форматирование данных для отправки в GPT
        
        Args:
            scoring_data: Исходные данные фермера
            scoring_result: Результаты расчета скоринга
        
        Returns:
            Отформатированный текст для GPT
        """
        farmer = scoring_data.get('farmer_profile', {})
        farm = scoring_data.get('farm_characteristics', {})
        
        prompt = f"""Проанализируй следующие данные кредитного скоринга фермера и предоставь детальный анализ:

ПРОФИЛЬ ФЕРМЕРА:
- ID: {farmer.get('farmer_id')}
- Возраст: {farmer.get('age')} лет
- Образование: {farmer.get('education_level')}
- Опыт: {farmer.get('farming_experience_years')} лет
- Количество кредитов: {farmer.get('number_of_loans')}
- Просрочки: {farmer.get('past_defaults')}
- Рейтинг платежеспособности: {farmer.get('repayment_score')}/100

ХАРАКТЕРИСТИКИ ФЕРМЫ:
- Размер: {farm.get('farm_size_acres')} акров ({farm.get('farm_size_acres', 0) * 0.4047:.2f} га)
- Статус владения: {farm.get('ownership_status')}
- Оценка земли: ${farm.get('land_valuation_usd'):,}
- Качество почвы: {farm.get('soil_quality_index')}/100
- Доступность воды: {farm.get('water_availability_score')}/100
- Тип орошения: {farm.get('irrigation_type')}

РЕЗУЛЬТАТЫ СКОРИНГА:
- Балл за землю: {scoring_result.get('LandScore')}
- Балл за технику: {scoring_result.get('TechScore')}
- Балл за культуры: {scoring_result.get('CropScore')}
- Балл за обременения: {scoring_result.get('BanScore')}
- Балл за инфраструктуру: {scoring_result.get('InfraScore')}
- Балл за геометрию: {scoring_result.get('GeoScore')}
- Балл за диверсификацию: {scoring_result.get('DiversificationScore')}
- ИТОГОВЫЙ БАЛЛ: {scoring_result.get('TotalScore')}/100
- ПРОЦЕНТНАЯ СТАВКА: {scoring_result.get('InterestRate') * 100:.1f}%

ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ:
{json.dumps(scoring_data, ensure_ascii=False, indent=2)}

Предоставь анализ в следующем формате JSON:
{{
    "overall_assessment": "Общая оценка кредитоспособности фермера",
    "strengths": ["Сильная сторона 1", "Сильная сторона 2", ...],
    "weaknesses": ["Слабая сторона 1", "Слабая сторона 2", ...],
    "risk_factors": ["Фактор риска 1", "Фактор риска 2", ...],
    "recommendations": ["Рекомендация 1", "Рекомендация 2", ...],
    "loan_decision": "approve/reject/review",
    "confidence_level": "high/medium/low",
    "detailed_analysis": "Детальный анализ всех аспектов"
}}

Анализ должен быть на русском языке, профессиональным и учитывать специфику сельского хозяйства."""
        
        return prompt
    
    def analyze_scoring(self, scoring_data: Dict[str, Any], 
                       scoring_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Отправка данных в GPT для анализа
        
        Args:
            scoring_data: Исходные данные фермера
            scoring_result: Результаты расчета скоринга
        
        Returns:
            Словарь с анализом от GPT
        """
        try:
            prompt = self.format_scoring_for_gpt(scoring_data, scoring_result)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Ты - эксперт по кредитному скорингу в сельском хозяйстве. Анализируй данные фермеров и предоставляй профессиональные рекомендации по выдаче кредитов."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )
            
            # Извлекаем ответ
            gpt_response = response.choices[0].message.content
            analysis = json.loads(gpt_response)
            
            return {
                "success": True,
                "analysis": analysis,
                "raw_response": gpt_response
            }
            
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse GPT response: {str(e)}",
                "analysis": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"GPT API error: {str(e)}",
                "analysis": None
            }
    
    def generate_report(self, farmer_profile: Dict[str, Any],
                       scoring_result: Dict[str, Any],
                       gpt_analysis: Dict[str, Any]) -> str:
        """
        Генерация текстового отчета
        
        Args:
            farmer_profile: Профиль фермера
            scoring_result: Результаты скоринга
            gpt_analysis: Анализ от GPT
        
        Returns:
            Отформатированный текстовый отчет
        """
        farmer = farmer_profile.get('farmer_profile', {})
        analysis = gpt_analysis.get('analysis', {})
        
        report = f"""
╔══════════════════════════════════════════════════════════════════╗
║          ОТЧЕТ КРЕДИТНОГО СКОРИНГА - AGROCREDIT AI              ║
╚══════════════════════════════════════════════════════════════════╝

ФЕРМЕР: {farmer.get('farmer_id')}
ДАТА АНАЛИЗА: {scoring_result.get('calculated_at', 'N/A')}

─────────────────────────────────────────────────────────────────
РЕЗУЛЬТАТЫ СКОРИНГА
─────────────────────────────────────────────────────────────────
Итоговый балл:        {scoring_result.get('TotalScore', 0)}/100
Процентная ставка:    {scoring_result.get('InterestRate', 0) * 100:.1f}%

Детализация баллов:
  • Земля:            {scoring_result.get('LandScore', 0)}
  • Техника:          {scoring_result.get('TechScore', 0)}
  • Культуры:         {scoring_result.get('CropScore', 0)}
  • Обременения:      {scoring_result.get('BanScore', 0)}
  • Инфраструктура:   {scoring_result.get('InfraScore', 0)}
  • Геометрия:        {scoring_result.get('GeoScore', 0)}
  • Диверсификация:   {scoring_result.get('DiversificationScore', 0)}

─────────────────────────────────────────────────────────────────
АНАЛИЗ GPT
─────────────────────────────────────────────────────────────────
Общая оценка:
{analysis.get('overall_assessment', 'N/A')}

Сильные стороны:
"""
        for i, strength in enumerate(analysis.get('strengths', []), 1):
            report += f"  {i}. {strength}\n"
        
        report += "\nСлабые стороны:\n"
        for i, weakness in enumerate(analysis.get('weaknesses', []), 1):
            report += f"  {i}. {weakness}\n"
        
        report += "\nФакторы риска:\n"
        for i, risk in enumerate(analysis.get('risk_factors', []), 1):
            report += f"  {i}. {risk}\n"
        
        report += "\nРекомендации:\n"
        for i, rec in enumerate(analysis.get('recommendations', []), 1):
            report += f"  {i}. {rec}\n"
        
        decision = analysis.get('loan_decision', 'review').upper()
        confidence = analysis.get('confidence_level', 'medium').upper()
        
        report += f"""
─────────────────────────────────────────────────────────────────
РЕШЕНИЕ
─────────────────────────────────────────────────────────────────
Рекомендация:         {decision}
Уровень уверенности:  {confidence}

─────────────────────────────────────────────────────────────────
ДЕТАЛЬНЫЙ АНАЛИЗ
─────────────────────────────────────────────────────────────────
{analysis.get('detailed_analysis', 'N/A')}

╚══════════════════════════════════════════════════════════════════╝
"""
        return report


if __name__ == "__main__":
    print("GPT Analyzer module loaded successfully")
    print("Note: Requires OPENAI_API_KEY environment variable to be set")
