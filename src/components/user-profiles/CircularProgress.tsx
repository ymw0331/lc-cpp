interface CircularProgressProps {
    percentage: number;
    label: string;
}

export const CircularProgress = ({ percentage, label }: CircularProgressProps) => {
    const radius = 40;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-2 dark:text-meta-4"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
                <circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="64"
                    cy="64"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-black dark:text-white">
                    {percentage}%
                </span>
                <span className="text-sm text-body dark:text-bodydark">
                    {label}
                </span>
            </div>
        </div>
    );
};