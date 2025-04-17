import { Skeleton } from "@/components/ui/skeleton"

export default function ReferredUsersSkeleton() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[250px] rounded-xl" />
            </div>

            {/* RecruitmentSummaryCard and AgentRecruitmentSummaryCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                        <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-6 w-[180px] rounded-xl" />
                            <Skeleton className="h-8 w-[100px] rounded-xl" />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                                <Skeleton className="h-5 w-[120px] mb-2 rounded-xl" />
                                <Skeleton className="h-8 w-[80px] rounded-xl" />
                            </div>
                            <div className="flex-1">
                                <Skeleton className="h-5 w-[120px] mb-2 rounded-xl" />
                                <Skeleton className="h-8 w-[80px] rounded-xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RecruitAgentCard */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-6 w-[150px] rounded-xl" />
                        <Skeleton className="h-4 w-[250px] mt-2 rounded-xl" />
                    </div>
                    <Skeleton className="h-10 w-[120px] rounded-xl" />
                </div>
            </div>

            {/* MilestoneAchievementCard or RecruitmentSummaryChart */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <Skeleton className="h-6 w-[180px] rounded-xl" />
                        <Skeleton className="h-4 w-[120px] mt-2 rounded-xl" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-[120px] rounded-xl" />
                        <Skeleton className="h-10 w-[120px] rounded-xl" />
                    </div>
                </div>
                
                {/* Chart skeleton */}
                <div className="h-[250px] sm:h-[300px] w-full mt-8">
                    <div className="w-full h-full bg-gray-100 dark:bg-meta-4 rounded-xl grid grid-cols-12 items-end gap-2 p-4">
                        {Array.from({ length: 12 }, (_, i) => (
                            <Skeleton 
                                key={i} 
                                className="w-full rounded-t-xl" 
                                style={{ 
                                    height: `${Math.max(20, Math.random() * 100)}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 