import { ChartDataPoint } from "../dashboard/dashboard.types";

export interface RecruitData {
    count: number;
    agentsToPartner: {
        count: number;
        trend: 'up' | 'down';
    };
    chartData: {
        Week: ChartDataPoint[];
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    };

    // Recruitment summary data
    recruitmentSummary: {
        noOfDirectReferrals: number | null;
        totalDepositFromDirectReferrals: number | null;
    };

    // Agent recruitment summary data
    agentRecruitmentSummary: {
        directRecruitVolume: number | null;
        depositVolume: number | null;
    };

    // Milestone achievement data (for Level 1 agents)
    milestoneAchievement: {
        activatedUsers: number;
        targetUsers: number;
        completeAt?: string | null;
        milestones: Array<{
            months: number;
            reward: number;
            date?: string;
            isCompleted?: boolean;
            isCurrent?: boolean;
        }>;
        milestone_bonus?: number;
    };
}

export interface DownstreamChartParams {
    year: number;
    month?: number;
}

export interface DownstreamChartResponse {
    totalDownstream: number;
    chartDataYear: {
        date: string;
        value: number;
    }[];
    chartDataMonth: {
        date: string;
        value: number;
    }[];
}