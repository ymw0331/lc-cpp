import { Skeleton } from "@/components/ui/skeleton"

export default function SupportSkeleton() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-[150px] rounded-xl" />
            </div>

            {/* Support Form */}
            <div className="bg-white dark:bg-boxdark rounded-xl shadow-default p-4 md:p-6 space-y-8">
                {/* Form Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px] rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px] rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px] rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                    <Skeleton className="h-4 w-[150px] rounded-xl" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-[120px] rounded-xl" />
                        <Skeleton className="h-10 w-[120px] rounded-xl" />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-[120px] rounded-xl" />
                </div>
            </div>
        </div>
    )
} 