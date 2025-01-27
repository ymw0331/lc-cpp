interface ProgressCardProps {
    title: string;
    current: number;
    total: number;
    label: string;
}


const ProgressCard = ({ title, current, total, label }: ProgressCardProps) => {
    const percentage = (current / total) * 100;

    return (
        <div className="p-6 bg-whiter dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <h4 className="text-black dark:text-white font-semibold mb-4">{title}</h4>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-title-md font-bold text-black dark:text-white">
                    {current}
                </span>
                <span className="text-body dark:text-bodydark">/ {total}</span>
            </div>
            <div className="relative h-3 bg-stroke dark:bg-strokedark rounded-full">
                <div
                    className="absolute left-0 h-full bg-primary rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="block text-sm text-body dark:text-bodydark mt-2">{label}</span>
        </div>
    );
};
export default ProgressCard
