'use client';

import AgentLevelIcon from "../Icons/dashboard/AgentLevelIcon";

interface AgentLevelCardProps {
    level: string;
    count: number;
}

const AgentLevelCard = ({ level, count }: AgentLevelCardProps) => {
    return (
        <div className="p-4 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <div className="flex items-center justify-between">
                <h4 className="text-lg text-body dark:text-bodydark2">{level}</h4>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <AgentLevelIcon />
                </span>
            </div>
            <div className="mt-4">
                <h3 className="text-3xl font-bold text-black dark:text-white">
                    {count.toLocaleString()}
                </h3>
            </div>
        </div>
    );
};

export default AgentLevelCard;