import { Skeleton } from "@/components/ui/skeleton"

export default function IncentiveManagementSkeleton() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-[150px] rounded-xl" />
            </div>

            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                {[1, 2].map((i) => (
                    <div key={i} className="col-span-3">
                        <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default h-full">
                            <Skeleton className="h-6 w-[200px] rounded-xl" />
                            <Skeleton className="h-8 w-[120px] mt-2 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <Skeleton className="h-8 w-[120px] mt-2 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Bottom Row - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="md:col-span-2">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default h-full">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <Skeleton className="h-8 w-[120px] mt-2 rounded-xl" />
                    </div>
                </div>
                <div className="md:col-span-4">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default h-full">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <Skeleton className="h-8 w-[120px] mt-2 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Activity Table */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-[200px] rounded-xl" />
                    <Skeleton className="h-8 w-[120px] rounded-xl" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <Skeleton className="h-4 w-[150px] rounded-xl" />
                            <Skeleton className="h-4 w-[100px] rounded-xl" />
                            <Skeleton className="h-4 w-[120px] rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 