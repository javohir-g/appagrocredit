/**
 * API Client для банковских операций
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app-agrocredit.onrender.com';

export interface ApplicationSummary {
    id: number;
    farmer_id: string;
    farmer_name: string;
    loan_amount: number;
    loan_term_months: number;
    purpose: string;
    date_submitted: string;
    status: string;
    ai_score: number | null;
    risk_category: string | null;
    interest_rate: number | null;
    monthly_payment: number | null;
}

export interface ScoringDetail {
    land_score: number;
    tech_score: number;
    crop_score: number;
    ban_score: number;
    infra_score: number;
    geo_score: number;
    diversification_score: number;
    total_score: number;
    interest_rate: number;
    monthly_payment: number;
    debt_to_income_ratio: number;
}

export interface ApplicationDetail {
    id: number;
    farmer_id: string;
    loan_amount: number;
    loan_term_months: number;
    purpose: string;
    expected_cash_flow: number | null;
    date_submitted: string;
    status: string;
    farmer_profile: any;
    scoring: ScoringDetail | null;
}

export const bankService = {
    /**
     * Получить все заявки
     */
    async getAllApplications(status?: string): Promise<ApplicationSummary[]> {
        const url = `${API_BASE_URL}/api/bank/applications${status ? `?status=${status}` : ''}`;
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        return response.json();
    },

    /**
     * Получить детали заявки
     */
    async getApplicationDetail(id: number): Promise<ApplicationDetail> {
        const response = await fetch(`${API_BASE_URL}/api/bank/applications/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch application detail');
        }

        return response.json();
    },

    /**
     * Рассчитать скоринг для заявки
     */
    async calculateScoring(id: number): Promise<ScoringDetail> {
        const response = await fetch(`${API_BASE_URL}/api/bank/applications/${id}/calculate-score`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to calculate scoring');
        }

        return response.json();
    },

    /**
     * Обновить статус заявки
     */
    async updateStatus(id: number, status: string): Promise<{ success: boolean; status: string }> {
        const response = await fetch(`${API_BASE_URL}/api/bank/applications/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        return response.json();
    },

    /**
     * Получить статистику
     */
    async getStatistics(): Promise<{
        total_applications: number;
        pending_applications: number;
        approved_applications: number;
        total_farmers: number;
        average_score: number;
    }> {
        const response = await fetch(`${API_BASE_URL}/api/bank/statistics`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }

        return response.json();
    },
};
