/**
 * API Client для работы с loan applications (фермер)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoanApplicationData {
    requested_loan_amount: number;
    loan_term_months: number;
    loan_purpose: string;
    expected_cash_flow_after_loan?: number;
}

export interface LoanApplication {
    id: number;
    farmer_id: string;
    farm_id: number;
    loan_amount: number;
    loan_term_months: number;
    purpose: string;
    expected_cash_flow: number | null;
    date_submitted: string;
    status: string;
    ai_score: number | null;
    interest_rate: number | null;
    monthly_payment: number | null;
    risk_category: string | null;
}

export const loanService = {
    /**
     * Подать новую заявку на кредит
     */
    async submitApplication(data: LoanApplicationData): Promise<LoanApplication> {
        const response = await fetch(`${API_BASE_URL}/api/farmer/loan-applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to submit application');
        }

        return response.json();
    },

    /**
     * Получить все заявки текущего фермера
     */
    async getMyApplications(): Promise<LoanApplication[]> {
        const response = await fetch(`${API_BASE_URL}/api/farmer/loan-applications`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        return response.json();
    },

    /**
     * Получить детали конкретной заявки
     */
    async getApplicationDetail(id: number): Promise<LoanApplication> {
        const response = await fetch(`${API_BASE_URL}/api/farmer/loan-applications/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch application detail');
        }

        return response.json();
    },
};
