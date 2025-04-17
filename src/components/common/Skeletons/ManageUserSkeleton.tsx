import { Skeleton } from "@/components/ui/skeleton"

export default function ManageUserSkeleton() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            {/* Header with Breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <Skeleton className="h-6 w-[180px] rounded-xl" />
            </div>

            {/* Main Content */}
            <div className="grid gap-4 sm:gap-6">
                {/* Agent Level Cards Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-5 w-24 rounded-xl" />
                                        <Skeleton className="h-4 w-16 rounded-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-20 rounded-xl" />
                                <Skeleton className="h-8 w-8 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users Table */}
                <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    {/* Table Header with Search and Actions */}
                    <div className="p-4 md:p-6 xl:p-7.5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex w-full max-w-md items-center gap-3">
                                <Skeleton className="h-11 w-full rounded-xl" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-11 w-11 rounded-xl" />
                                <Skeleton className="h-11 w-32 rounded-xl" />
                                <Skeleton className="h-11 w-32 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="max-w-full overflow-x-auto">
                        <div className="grid">
                            {/* Table Headers */}
                            <div className="grid grid-cols-6 border-t border-stroke dark:border-strokedark bg-black dark:bg-meta-4 py-4.5">
                                <Skeleton className="px-4 py-2 h-4 w-32 rounded-xl" />
                                <Skeleton className="px-4 py-2 h-4 w-24 rounded-xl" />
                                <Skeleton className="px-4 py-2 h-4 w-36 rounded-xl" />
                                <Skeleton className="px-4 py-2 h-4 w-28 rounded-xl" />
                                <Skeleton className="px-4 py-2 h-4 w-24 rounded-xl" />
                                <Skeleton className="px-4 py-2 h-4 w-20 rounded-xl" />
                            </div>

                            {/* Table Rows */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="grid grid-cols-6 border-t border-stroke dark:border-strokedark">
                                    <div className="px-4 py-4 flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-4 w-32 rounded-xl" />
                                            <Skeleton className="h-3 w-24 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-4 flex items-center">
                                        <Skeleton className="h-4 w-20 rounded-xl" />
                                    </div>
                                    <div className="px-4 py-4 flex items-center">
                                        <Skeleton className="h-4 w-32 rounded-xl" />
                                    </div>
                                    <div className="px-4 py-4 flex items-center">
                                        <Skeleton className="h-4 w-24 rounded-xl" />
                                    </div>
                                    <div className="px-4 py-4 flex items-center">
                                        <Skeleton className="h-6 w-16 rounded-xl" />
                                    </div>
                                    <div className="px-4 py-4 flex items-center justify-center">
                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Footer with Pagination */}
                    <div className="p-4 md:p-6 xl:p-7.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-48 rounded-xl" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-24 rounded-xl" />
                            <Skeleton className="h-9 w-16 rounded-xl" />
                            <Skeleton className="h-9 w-24 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 
