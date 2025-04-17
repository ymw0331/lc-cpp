import { Skeleton } from "@/components/ui/skeleton";

export default function PerformanceSkeleton() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-[150px] rounded-xl" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-4 h-full">
                {/* Left Column */}
                <div className="col-span-12 xl:col-span-8 space-y-4">
                    {/* Progress Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                                <Skeleton className="h-6 w-[200px] mb-2 rounded-xl" />
                                <Skeleton className="h-4 w-[150px] mb-4 rounded-xl" />
                                <Skeleton className="h-2 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>

                    {/* Next Level Card */}
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[200px] mb-2 rounded-xl" />
                        <Skeleton className="h-4 w-[150px] mb-4 rounded-xl" />
                        <Skeleton className="h-2 w-full rounded-xl" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 xl:col-span-4">
                    <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[200px] mb-2 rounded-xl" />
                        <Skeleton className="h-4 w-[150px] mb-4 rounded-xl" />
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                    <Skeleton className="h-6 w-[200px] mb-2 rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
                <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                    <Skeleton className="h-6 w-[200px] mb-2 rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}