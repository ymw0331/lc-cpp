import { Skeleton } from "@/components/ui/skeleton"

export default function WalletsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px] rounded-xl" />
                <Skeleton className="h-10 w-[120px] rounded-xl" />
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                        <Skeleton className="h-6 w-[100px] rounded-xl" />
                        <Skeleton className="h-8 w-[150px] mt-2 rounded-xl" />
                        <Skeleton className="h-4 w-[80px] mt-2 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Transaction History */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-4 shadow-default">
                <Skeleton className="h-8 w-[200px] mb-4 rounded-xl" />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div>
                                    <Skeleton className="h-4 w-[150px] rounded-xl" />
                                    <Skeleton className="h-3 w-[100px] mt-2 rounded-xl" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-[80px] rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 