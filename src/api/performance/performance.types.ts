export interface PerformanceData {
    cardActivationVolume: {
        currentValue: number;
        targetValue: number;
    };
    totalAgentRecruitment: {
        currentValue: number;
        targetValue: number;
    };
    userLevel: {
        currentLevel: string;
        progress: number;
        isMaxLevel: boolean;
    };
    salesSummary: {
        groupSales: number;
        personalSales: number;
    };
    demographicData: Record<string, any>;
    salesVolumeData: {
        monthlyData2024: any[];
        monthlyData2023: any[];
        weeklyData: any[];
    };
}