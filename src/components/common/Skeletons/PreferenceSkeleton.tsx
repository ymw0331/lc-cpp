import { Skeleton } from "@/components/ui/skeleton"

export default function PreferenceSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px] rounded-xl" />
                <Skeleton className="h-10 w-[120px] rounded-xl" />
            </div>

            {/* Preferences Form */}
            <div className="rounded-xl bg-white dark:bg-boxdark p-6 shadow-default">
                <div className="space-y-6">
                    {/* Notification Settings */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-[150px] rounded-xl" />
                                        <Skeleton className="h-3 w-[200px] mt-2 rounded-xl" />
                                    </div>
                                    <Skeleton className="h-6 w-12 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Language Settings */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-[150px] rounded-xl" />
                                        <Skeleton className="h-3 w-[200px] mt-2 rounded-xl" />
                                    </div>
                                    <Skeleton className="h-6 w-12 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[200px] rounded-xl" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-[150px] rounded-xl" />
                                        <Skeleton className="h-3 w-[200px] mt-2 rounded-xl" />
                                    </div>
                                    <Skeleton className="h-6 w-12 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <Skeleton className="h-10 w-[120px] rounded-xl" />
                </div>
            </div>
        </div>
    )
}