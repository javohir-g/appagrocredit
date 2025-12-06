"""
Extended Farmer API Routes з інтеграцією scoring database
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from ..core.security import get_current_user
from ..models.user import User
from ..database_adapter import get_db_adapter


router = APIRouter(prefix="/api/farmer", tags=["farmer-extended"])


# ========================================================================
# Pydantic Models
# ========================================================================

class LoanApplicationCreate(BaseModel):
    """Создание заявки на кредит"""
    requested_loan_amount: float
    loan_term_months: int
    loan_purpose: str
    expected_cash_flow_after_loan: Optional[float] = None


class LoanApplicationResponse(BaseModel):
    """Ответ с данными заявки"""
    id: int
    farmer_id: str
    farm_id: int
    loan_amount: float
    loan_term_months: int
    purpose: str
    expected_cash_flow: Optional[float]
    date_submitted: str
    status: str
    ai_score: Optional[int]
    interest_rate: Optional[float]
    monthly_payment: Optional[float]
    risk_category: Optional[str]


class FarmerSummary(BaseModel):
    """Сводка по фермеру"""
    total_debt: float
    active_credits: int
    total_paid: float
    credit_score: int
    currency: str = "USD"


# ========================================================================
# Endpoints
# ========================================================================

@router.get("/summary", response_model=FarmerSummary)
async def get_farmer_summary(
    current_user: User = Depends(get_current_user)
):
    """
    Получить сводку по фермеру (для главной страницы)
    """
    try:
        adapter = get_db_adapter()
        # Получаем фермера через email
        farmer_id = current_user.email
        
        # Используем db_manager напрямую для эффективного запроса
        with adapter.db_manager.get_connection() as conn:
            # Находим фермера
            cursor = conn.execute("SELECT id, repayment_score FROM farmers WHERE farmer_id = ?", (farmer_id,))
            farmer = cursor.fetchone()
            
            if not farmer:
                return FarmerSummary(
                    total_debt=0,
                    active_credits=0,
                    total_paid=0,
                    credit_score=0
                )
            
            db_id = farmer['id']
            score = farmer['repayment_score'] or 0
            
            # Находим фермы этого фермера
            cursor = conn.execute("SELECT id FROM farms WHERE farmer_id = ?", (db_id,))
            farms = cursor.fetchall()
            farm_ids = [f['id'] for f in farms]
            
            if not farm_ids:
                return FarmerSummary(
                    total_debt=0,
                    active_credits=0,
                    total_paid=0,
                    credit_score=score
                )
                
            # Считаем активные кредиты (approved loan requests)
            placeholders = ','.join(['?'] * len(farm_ids))
            query = f"""
                SELECT COUNT(*) as count, SUM(requested_loan_amount) as total 
                FROM loan_requests 
                WHERE farm_id IN ({placeholders}) AND status = 'approved'
            """
            
            cursor = conn.execute(query, farm_ids)
            stats = cursor.fetchone()
            
            active_count = stats['count'] or 0
            total_debt = stats['total'] or 0
            
            return FarmerSummary(
                total_debt=total_debt,
                active_credits=active_count,
                total_paid=0, # Пока нет таблицы платежей
                credit_score=score
            )
            
    except Exception as e:
        print(f"Error fetching farmer summary: {e}")
        return FarmerSummary(
            total_debt=0,
            active_credits=0,
            total_paid=0,
            credit_score=0
        )


@router.post("/loan-applications", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_loan_application(
    data: LoanApplicationCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Создать новую заявку на кредит (фермер)
    """
    try:
        adapter = get_db_adapter()
        
        loan_data = {
            'requested_loan_amount': data.requested_loan_amount,
            'loan_term_months': data.loan_term_months,
            'loan_purpose': data.loan_purpose,
            'expected_cash_flow_after_loan': data.expected_cash_flow_after_loan
        }
        
        application = adapter.create_loan_application(
            farmer_email=current_user.email,
            loan_data=loan_data
        )
        
        return application
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create loan application: {str(e)}"
        )


@router.get("/loan-applications", response_model=List[LoanApplicationResponse])
async def get_my_loan_applications(
    current_user: User = Depends(get_current_user)
):
    """Получить все заявки текущего фермера"""
    try:
        adapter = get_db_adapter()
        applications = adapter.get_farmer_applications(current_user.email)
        return applications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch applications: {str(e)}"
        )


@router.get("/loan-applications/{loan_id}", response_model=LoanApplicationResponse)
async def get_loan_application(
    loan_id: int,
    current_user: User = Depends(get_current_user)
):
    """Получить детали конкретной заявки"""
    try:
        adapter = get_db_adapter()
        detail = adapter.get_loan_application_detail(loan_id)
        
        if not detail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan application not found"
            )
        
        # Проверка что заявка принадлежит текущему пользователю
        if detail['loan']['farmer_id'] != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        loan = detail['loan']
        scoring = detail['scoring']
        
        return {
            'id': loan['id'],
            'farmer_id': loan['farmer_id'],
            'farm_id': loan['farm_id'],
            'loan_amount': loan['requested_loan_amount'],
            'loan_term_months': loan['loan_term_months'],
            'purpose': loan['loan_purpose'],
            'expected_cash_flow': loan.get('expected_cash_flow_after_loan'),
            'date_submitted': loan['created_at'],
            'status': loan['status'],
            'ai_score': scoring['total_score'] if scoring else None,
            'interest_rate': scoring['interest_rate'] if scoring else None,
            'monthly_payment': scoring.get('monthly_payment', 0) if scoring else None,
            'risk_category': adapter._get_risk_category(scoring['total_score']) if scoring else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch application: {str(e)}"
        )
