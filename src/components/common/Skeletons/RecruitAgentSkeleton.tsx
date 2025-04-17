import { Skeleton } from "@/components/ui/skeleton";

// For recruit agent page
export default function RecruitAgentSkeleton() {
    return (
        <div className="space-y-8 bg-white dark:bg-boxdark p-8 rounded-xl shadow-default dark:shadow-8">
            {/* Agent Recruitment Details Section */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[200px] rounded-xl" />
                    <Skeleton className="h-4 w-[300px] rounded-xl" />
                </div>

                <div className="grid gap-6">
                    {/* Referral ID and Email Row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px] rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px] rounded-xl" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 flex-1 rounded-xl" />
                                <Skeleton className="h-10 w-[100px] rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Full Name and Member Verification Row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px] rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px] rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>

                    {/* Market Selection and Contact Number Row */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px] rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px] rounded-xl" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Acknowledgement Section */}
            <div className="space-y-6">
                <Skeleton className="h-6 w-[200px] rounded-xl" />
                <div className="space-y-6 bg-gray dark:bg-meta-4 p-6 rounded-lg">
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-[300px] rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-[300px] rounded-xl" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-[120px] rounded-xl" />
            </div>
        </div>
    );
}