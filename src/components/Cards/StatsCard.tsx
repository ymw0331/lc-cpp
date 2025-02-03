interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
}
const StatsCard = ({ title, value, icon }: StatsCardProps) => {
    return (
        <div className="p-6 bg-whiter dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-body dark:text-bodydark block mb-2">{title}</span>
                    <h4 className="text-title-md text-black dark:text-white font-bold">{value}</h4>
                </div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard
