import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Base skeleton component
export { Skeleton }

// Dynamic imports for each skeleton
export const PerformanceSkeleton = dynamic(() => import('./PerformanceSkeleton'), {
    ssr: false
})

export const AgentDashboardSkeleton = dynamic(() => import('./AgentDashboardSkeleton'), {
    ssr: false
})

export const WalletsSkeleton = dynamic(() => import('./WalletsSkeleton'), {
    ssr: false
})

export const ProfileSkeleton = dynamic(() => import('./ProfileSkeleton'), {
    ssr: false
})

export const ManageUserSkeleton = dynamic(() => import('./ManageUserSkeleton'), {
    ssr: false
})

export const ReferredUsersSkeleton = dynamic(() => import('./ReferredUsersSkeleton'), {
    ssr: false
})

export const IncentiveManagementSkeleton = dynamic(() => import('./IncentiveManagementSkeleton'), {
    ssr: false
})

export const TransferSkeleton = dynamic(() => import('./TransferSkeleton'), {
    ssr: false
})

export const RecruitAgentSkeleton = dynamic(() => import('./RecruitAgentSkeleton'), {
    ssr: false
})

export const SupportSkeleton = dynamic(() => import('./SupportSkeleton'), {
    ssr: false
})

export const PreferenceSkeleton = dynamic(() => import('./PreferenceSkeleton'), {
    ssr: false
})

export const TermsAndConditionsSkeleton = dynamic(() => import('./TermsAndConditionsSkeleton'), {
    ssr: false
})

export const CircleOfGrowthSkeleton = dynamic(() => import('./CircleOfGrowthSkeleton'), {
    ssr: false
})

export const AgentProfileSkeleton = dynamic(() => import('./AgentProfileSkeleton'), {
    ssr: false
})

export const ManageUserProfileSkeleton = dynamic(() => import('./ManageUserProfileSkeleton'), {
    ssr: false
})
