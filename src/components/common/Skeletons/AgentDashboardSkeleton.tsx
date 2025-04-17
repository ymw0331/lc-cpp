import { Skeleton } from "@/components/ui/skeleton"

export default function AgentDashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-[150px] rounded-xl" />
            </div>

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Profile With Referral */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-[200px] rounded-xl" />
                                <Skeleton className="h-4 w-[150px] rounded-xl" />
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <Skeleton className="h-8 w-full rounded-xl" />
                            <Skeleton className="h-8 w-full rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Right Column - 2x2 Grid of Cards */}
                <div className="lg:col-span-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                                <Skeleton className="h-6 w-[80px] rounded-xl" />
                                <Skeleton className="h-8 w-[80px] mt-2 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deposit Overview Chart */}
            <div className="space-y-6 mb-6">
                <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-[50px] rounded-xl" />
                                <Skeleton className="h-8 w-[100px] rounded-xl" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-[50px] rounded-xl" />
                                <Skeleton className="h-8 w-[100px] rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] flex items-center justify-center">
                        <Skeleton className="h-full w-full rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Income Summary Table */}
            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                    <Skeleton className="h-8 w-[200px] mb-4 rounded-xl" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-[150px] rounded-xl" />
                                <Skeleton className="h-4 w-[100px] rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* For Level 2+ Agents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-[200px] rounded-xl" />
                                <Skeleton className="h-4 w-[150px] rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[180px] mb-2 rounded-xl" />
                        <div className="flex justify-between mt-4">
                            <Skeleton className="h-8 w-[100px] rounded-xl" />
                            <Skeleton className="h-8 w-[100px] rounded-xl" />
                        </div>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[150px] mb-2 rounded-xl" />
                        <Skeleton className="h-10 w-full mt-4 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Recruit Agent Card */}
            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                    <Skeleton className="h-6 w-[150px] mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-full mt-2 rounded-xl" />
                    <Skeleton className="h-10 w-[200px] mt-4 rounded-xl" />
                </div>
            </div>
        </div>
    )
} 