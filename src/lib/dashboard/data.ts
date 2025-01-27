/*** Agent Dashboard Stats ***/

import { DashboardStatistics, CurrencyType, ChartDataPoint, DepositActivity } from "@/types/dashboard/data";

export const defaultCurrency: CurrencyType = 'USDT';

interface ChartRangeData {
    Week: ChartDataPoint[];
    Month: ChartDataPoint[];
    Year: ChartDataPoint[];
}

export const depositChartData: ChartRangeData = {
    Week: [
        { label: 'Mon', value: 1200 },
        { label: 'Tue', value: 1800 },
        { label: 'Wed', value: 1400 },
        { label: 'Thu', value: 2200 },
        { label: 'Fri', value: 1900 },
        { label: 'Sat', value: 2400 },
        { label: 'Sun', value: 2100 },
    ],
    Month: [
        { label: 'Week 1', value: 5200 },
        { label: 'Week 2', value: 6100 },
        { label: 'Week 3', value: 4800 },
        { label: 'Week 4', value: 7300 },
    ],
    Year: [
        { label: 'Jan', value: 605 },
        { label: 'Feb', value: 1156 },
        { label: 'Mar', value: 1038 },
        { label: 'Apr', value: 1789 },
        { label: 'May', value: 1503 },
        { label: 'Jun', value: 904 },
        { label: 'Jul', value: 974 },
        { label: 'Aug', value: 1414 },
        { label: 'Sept', value: 1355 },
        { label: 'Oct', value: 1594 },
        { label: 'Nov', value: 1762 },
        { label: 'Dec', value: 2089 },
    ]
};

export const depositActivities: DepositActivity[] = [
    {
        id: "dep_001",
        description: "Referral Fee Incentive",
        amount: 24562.56,
        dateTime: "November 13, 2024 at 9:00PM",
        type: "incentive",
        status: "completed",
        transactionHash: "0x1234...abcd"
    },
    {
        id: "dep_002",
        description: "Direct Recruit Referral Override Incentive",
        amount: 1000.00,
        dateTime: "November 12, 2024 at 1:56PM",
        type: "override",
        status: "completed",
        transactionHash: "0x5678...efgh"
    },
    {
        id: "dep_003",
        description: "Deposit Admin Charge Rebate",
        amount: 12212.10,
        dateTime: "November 12, 2024 at 9:00PM",
        type: "rebate",
        status: "completed",
        transactionHash: "0x90ab...ijkl"
    },
    {
        id: "dep_004",
        description: "Direct Recruit's Deposit Admin Charge Rebate",
        amount: 2381.21,
        dateTime: "November 10, 2024 at 10:24AM",
        type: "rebate",
        status: "completed",
        transactionHash: "0xcdef...mnop"
    },
    {
        id: "dep_005",
        description: "Direct Recruit Level Advancement Bonus",
        amount: 500.00,
        dateTime: "November 08, 2024 at 1:56PM",
        type: "bonus",
        status: "completed",
        transactionHash: "0xfedc...qrst"
    }
];


export const dashboardStat: DashboardStatistics = {
    rewardWallet: {
        balance: 18302.34,
        currency: defaultCurrency,
        lastUpdated: '2024-02-20T15:30:00Z'
    },
    totalDeposits: {
        amount: 170232.22,
        currency: defaultCurrency,
        lastUpdated: '2024-02-20T15:30:00Z',
        chartData: [
            { label: 'Jan', value: 605 },
            { label: 'Feb', value: 1156 },
            { label: 'Mar', value: 1038 },
            { label: 'Apr', value: 1789 },
            { label: 'May', value: 1503 },
            { label: 'Jun', value: 904 },
            { label: 'Jul', value: 974 },
            { label: 'Aug', value: 1414 },
            { label: 'Sept', value: 1355 },
            { label: 'Oct', value: 1594 },
            { label: 'Nov', value: 1762 },
            { label: 'Dec', value: 2089 }
        ]
    },
    directRecruitment: {
        earnings: 1855.00,
        currency: defaultCurrency,
        totalRecruits: 2146,
        lastUpdated: '2024-02-20T15:30:00Z'
    },
    agentProfile: {
        name: "John Smith",
        level: "LEVEL 5 PARTNER",
        activeUsers: {
            current: 42208,
            target: 50000,
            percentage: 84.5,
            remaining: 7792
        },
    },
    totalDirectRecruit: {
        count: 2146,
        agentsToPartner: 22
    },
    referralCode: "7HKS56H5",
    depositActivities
};

