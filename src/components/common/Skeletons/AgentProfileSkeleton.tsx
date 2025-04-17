import { Skeleton } from "@/components/ui/skeleton"

export default function AgentProfileSkeleton() {
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

            {/* Profile Info */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-xl" />
                        <Skeleton className="h-10 w-[120px] rounded-xl" />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-[100px] rounded-xl" />
                                    <Skeleton className="h-10 w-full rounded-xl" />
                                </div>
                            ))}
                        </div>
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