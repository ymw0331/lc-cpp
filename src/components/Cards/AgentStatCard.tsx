"use client"

import USDTIcon from "../Icons/dashboard/USDTIcon";

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    amount: number;
    currency?: 'USDT';
    className?: string;
}

const AgentStatCard = ({
    icon,
    title,
    amount,
}: StatCardProps) => {
    return (
        <div className="p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">


            <div className="flex flex-col">

                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-meta-4 flex items-center justify-center">
                        {icon}
                    </div>
                </div>

                <div>
                    <h4 className="text-base text-gray-500 dark:text-gray-400 font-medium flex items-center">
                        {title}
                    </h4>
                </div>

                <div className="mt-2 flex items-center gap-4">
                    <h4 className="text-2xl font-bold text-black dark:text-white">
                        {amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </h4>
                    <span>
                        <USDTIcon />
                    </span>
                </div>
                
            </div>


        </div>
    )
}

export default AgentStatCard
