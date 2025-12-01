interface RiskBadgeProps {
    category: string;
}

export default function RiskBadge({ category }: RiskBadgeProps) {
    const getColorClasses = () => {
        switch (category.toLowerCase()) {
            case "low":
                return "bg-primary-100 text-primary-800 border-primary-200";
            case "medium":
                return "bg-secondary-100 text-secondary-800 border-secondary-200";
            case "high":
                return "bg-danger-100 text-danger-800 border-danger-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getColorClasses()}`}>
            {category}
        </span>
    );
}
