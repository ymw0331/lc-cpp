import { Skeleton } from "@/components/ui/skeleton"

export default function TermsAndConditionsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px] rounded-xl" />
                <Skeleton className="h-10 w-[120px] rounded-xl" />
            </div>

            {/* Content */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <div className="space-y-6">
                    {/* Introduction */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-[300px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4 rounded-xl" />
                            <Skeleton className="h-4 w-2/3 rounded-xl" />
                        </div>
                    </div>

                    {/* Sections */}
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-6 w-[200px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded-xl" />
                                <Skeleton className="h-4 w-3/4 rounded-xl" />
                                <Skeleton className="h-4 w-2/3 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Accept Button */}
                <div className="mt-6 flex justify-end">
                    <Skeleton className="h-10 w-[120px] rounded-xl" />
                </div>
            </div>
        </div>
    )
} 