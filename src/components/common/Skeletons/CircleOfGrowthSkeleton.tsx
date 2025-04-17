import { Skeleton } from "@/components/ui/skeleton"

export default function CircleOfGrowthSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px] rounded-xl" />
                <Skeleton className="h-10 w-[120px] rounded-xl" />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[120px] rounded-xl" />
                        <Skeleton className="h-8 w-[80px] mt-2 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Growth Network */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <Skeleton className="h-8 w-[200px] mb-6 rounded-xl" />
                <div className="space-y-6">
                    {/* Level 1 */}
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center">
                            <Skeleton className="h-16 w-16 rounded-xl" />
                            <Skeleton className="h-4 w-[100px] mt-2 rounded-xl" />
                        </div>
                    </div>

                    {/* Level 2 */}
                    <div className="flex justify-around">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <Skeleton className="h-4 w-[80px] mt-2 rounded-xl" />
                            </div>
                        ))}
                    </div>

                    {/* Level 3 */}
                    <div className="flex justify-between">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-4 w-[60px] mt-2 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-8 w-[200px] mb-4 rounded-xl" />
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    )
} 