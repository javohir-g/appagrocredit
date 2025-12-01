import RiskBadge from "./RiskBadge";

interface ScoreCardProps {
    score: number;
    riskCategory: string;
}

export default function ScoreCard({ score, riskCategory }: ScoreCardProps) {
    const getScoreColor = () => {
        if (score >= 70) return "text-primary-600";
        if (score >= 40) return "text-secondary-600";
        return "text-danger-600";
    };

    const getProgressColor = () => {
        if (score >= 70) return "bg-primary-600";
        if (score >= 40) return "bg-secondary-600";
        return "bg-danger-600";
    };

    return (
        <div className="card">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Credit Score</h3>
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                    {score.toFixed(1)}
                </div>
                <div className="text-gray-500 text-sm mt-1">out of 100</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>

            {/* Risk Badge */}
            <div className="flex justify-center">
                <RiskBadge category={riskCategory} />
            </div>
        </div>
    );
}
