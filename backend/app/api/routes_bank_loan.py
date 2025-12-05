"""
Extended Bank API Routes с интеграцией scoring database
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from ..core.security import require_role
from ..models.user import UserRole, User
from ..database_adapter import get_db_adapter


router = APIRouter(prefix="/api/bank", tags=["bank-extended"])


# ========================================================================
# Pydantic Models
# ========================================================================

class ApplicationSummary(BaseModel):
    """Краткая информация о заявке"""
    id: int
    farmer_id: str
    farmer_name: str
    loan_amount: float
    loan_term_months: int
    purpose: str
    date_submitted: str
    status: str
    ai_score: Optional[int]
    risk_category: Optional[str]
    interest_rate: Optional[float]
    monthly_payment: Optional[float]


class ScoringDetail(BaseModel):
    """Детализация скоринга"""
    land_score: int
    tech_score: int
    crop_score: int
    ban_score: int
    infra_score: int
    geo_score: int
    diversification_score: int
    total_score: int
    interest_rate: float
    monthly_payment: float
    debt_to_income_ratio: float


class ApplicationDetail(BaseModel):
    """Полная информация о заявке"""
    id: int
    farmer_id: str
    loan_amount: float
    loan_term_months: int
    purpose: str
    expected_cash_flow: Optional[float]
    date_submitted: str
    status: str
    farmer_profile: dict
    scoring: Optional[ScoringDetail]


class UpdateStatusRequest(BaseModel):
    """Запрос на обновление статуса"""
    status: str  # pending/approved/rejected/in_review


# ========================================================================
# Endpoints
# ========================================================================

@router.get("/applications", response_model=List[ApplicationSummary])
async def get_all_applications(
    status: Optional[str] = None,
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """
    Получить все заявки на кредит (для банка)
    
    - **status**: Фильтр по статусу (pending/approved/rejected)
    """
    try:
        adapter = get_db_adapter()
        applications = adapter.get_all_loan_applications(status=status)
        return applications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch applications: {str(e)}"
        )


@router.get("/applications/{loan_id}", response_model=ApplicationDetail)
async def get_application_detail(
    loan_id: int,
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """Получить полную информацию о заявке"""
    try:
        adapter = get_db_adapter()
        detail = adapter.get_loan_application_detail(loan_id)
        
        if not detail:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        loan = detail['loan']
        scoring = detail['scoring']
        
        scoring_detail = None
        if scoring:
            scoring_detail = ScoringDetail(
                land_score=scoring['land_score'],
                tech_score=scoring['tech_score'],
                crop_score=scoring['crop_score'],
                ban_score=scoring['ban_score'],
                infra_score=scoring['infra_score'],
                geo_score=scoring['geo_score'],
                diversification_score=scoring['diversification_score'],
                total_score=scoring['total_score'],
                interest_rate=scoring['interest_rate'],
                monthly_payment=scoring.get('monthly_payment', 0),
                debt_to_income_ratio=scoring.get('debt_to_income_ratio', 0)
            )
        
        return ApplicationDetail(
            id=loan['id'],
            farmer_id=loan['farmer_id'],
            loan_amount=loan['requested_loan_amount'],
            loan_term_months=loan['loan_term_months'],
            purpose=loan['loan_purpose'],
            expected_cash_flow=loan.get('expected_cash_flow_after_loan'),
            date_submitted=loan['created_at'],
            status=loan['status'],
            farmer_profile=detail['farmer_profile'],
            scoring=scoring_detail
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch application detail: {str(e)}"
        )


@router.post("/applications/{loan_id}/calculate-score", response_model=ScoringDetail)
async def calculate_application_score(
    loan_id: int,
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """Рассчитать скоринг для заявки"""
    try:
        adapter = get_db_adapter()
        scoring_result = adapter.calculate_scoring_for_application(loan_id)
        
        return ScoringDetail(
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
            debt_to_income_ratio=scoring_result.get('DebtToIncomeRatio', 0)
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate score: {str(e)}"
        )


@router.patch("/applications/{loan_id}/status")
async def update_application_status(
    loan_id: int,
    request: UpdateStatusRequest,
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """Обновить статус заявки"""
    try:
        adapter = get_db_adapter()
        success = adapter.update_loan_status(loan_id, request.status)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found"
            )
        
        return {"success": True, "status": request.status}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update status: {str(e)}"
        )


@router.get("/statistics")
async def get_bank_statistics(
    _: User = Depends(require_role(UserRole.bank_officer))
):
    """Получить статистику по заявкам"""
    try:
        adapter = get_db_adapter()
        stats = adapter.db_manager.get_statistics()
        
        return {
            "total_applications": stats.get('total_loan_requests', 0),
            "pending_applications": stats.get('pending_loan_requests', 0),
            "approved_applications": stats.get('approved_loan_requests', 0),
            "total_farmers": stats.get('total_farmers', 0),
            "average_score": stats.get('average_farmer_score', 0)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch statistics: {str(e)}"
        )
