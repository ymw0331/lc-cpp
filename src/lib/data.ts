/*** 00 Start of Auth Data ***/
// export enum AgentLevel {
//     LEVEL_1 = 1,
//     LEVEL_2 = 2,
//     LEVEL_3 = 3,
//     LEVEL_4 = 4,
//     LEVEL_5 = 5
// }

// export enum Role {
//     AGENT = 'agent',
//     PARTNER = 'partner',
// }

// export enum KeyMarket {
//     HK = 'Hong Kong',
//     SG = 'Singapore',
//     MY = 'Malaysia',
//     CN = 'China',
//     TH = 'Thailand',
//     PH = 'Philippines',
//     ID = 'Indonesia',
//     VN = 'Vietnam',
// }
// export interface ISocialMedia {
//     linkedin?: string;
//     facebook?: string;
//     instagram?: string;
//     twitter?: string;
// }

// export interface IUser {
//     id: string;
//     name: string;
//     email: string;
//     contactNumber: string;
//     keyMarket: KeyMarket;
//     role: Role;
//     avatarUrl?: string;
//     level?: AgentLevel;
//     referralCode: string;
//     socialMedia?: ISocialMedia;
//     token: string;
// }

// export const userData: IUser = {
//     id: '1',
//     name: 'Joby Tan',
//     email: 'agent@example.com',
//     contactNumber: '1234567890',
//     keyMarket: KeyMarket.HK,
//     role: Role.PARTNER,
//     avatarUrl: '/images/user/user-05.png',
//     level: AgentLevel.LEVEL_5,
//     referralCode: '7HKS56H5',
//     socialMedia: {
//         linkedin: 'https://www.linkedin.com/in/jobytan',
//         facebook: 'https://www.facebook.com/jobytan',
//         instagram: 'https://www.instagram.com/jobytan',
//         twitter: 'https://twitter.com/jobytan'
//     },
//     token: 'mock-jwt-token',
// }




/*** 00 End of Auth Data ***/



// /*** 01 Start Agent Dashboard Stats ***/
export type CurrencyType = 'USDT' | 'USDC';

const defaultCurrency: CurrencyType = 'USDT';

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface ChartRangeData {
    Week: ChartDataPoint[];
    Month: ChartDataPoint[];
    Year: ChartDataPoint[];
}

// export const depositChartData: ChartRangeData = {
//     Week: [
//         { label: 'Mon', value: 1200 },
//         { label: 'Tue', value: 1800 },
//         { label: 'Wed', value: 1400 },
//         { label: 'Thu', value: 2200 },
//         { label: 'Fri', value: 1900 },
//         { label: 'Sat', value: 2400 },
//         { label: 'Sun', value: 2100 },
//     ],
//     Month: [
//         { label: 'Week 1', value: 5200 },
//         { label: 'Week 2', value: 6100 },
//         { label: 'Week 3', value: 4800 },
//         { label: 'Week 4', value: 7300 },
//     ],
//     Year: [
//         { label: 'Jan', value: 605 },
//         { label: 'Feb', value: 1156 },
//         { label: 'Mar', value: 1038 },
//         { label: 'Apr', value: 1789 },
//         { label: 'May', value: 1503 },
//         { label: 'Jun', value: 904 },
//         { label: 'Jul', value: 974 },
//         { label: 'Aug', value: 1414 },
//         { label: 'Sept', value: 1355 },
//         { label: 'Oct', value: 1594 },
//         { label: 'Nov', value: 1762 },
//         { label: 'Dec', value: 2089 },
//     ]
// };

// export interface DepositActivity {
//     id: string;
//     description: string;
//     amount: number;
//     dateTime: string;
//     type: 'incentive' | 'rebate' | 'bonus' | 'override';
//     status: 'completed' | 'pending';
//     transactionHash?: string;
// }

// export const depositActivities: DepositActivity[] = [
//     {
//         id: "dep_001",
//         description: "Referral Fee Incentive",
//         amount: 24562.56,
//         dateTime: "November 13, 2024 at 9:00PM",
//         type: "incentive",
//         status: "completed",
//         transactionHash: "0x1234...abcd"
//     },
//     {
//         id: "dep_002",
//         description: "Direct Recruit Referral Override Incentive",
//         amount: 1000.00,
//         dateTime: "November 12, 2024 at 1:56PM",
//         type: "override",
//         status: "completed",
//         transactionHash: "0x5678...efgh"
//     },
//     {
//         id: "dep_003",
//         description: "Deposit Admin Charge Rebate",
//         amount: 12212.10,
//         dateTime: "November 12, 2024 at 9:00PM",
//         type: "rebate",
//         status: "completed",
//         transactionHash: "0x90ab...ijkl"
//     },
//     {
//         id: "dep_004",
//         description: "Direct Recruit's Deposit Admin Charge Rebate",
//         amount: 2381.21,
//         dateTime: "November 10, 2024 at 10:24AM",
//         type: "rebate",
//         status: "completed",
//         transactionHash: "0xcdef...mnop"
//     },
//     {
//         id: "dep_005",
//         description: "Direct Recruit Level Advancement Bonus",
//         amount: 500.00,
//         dateTime: "November 08, 2024 at 1:56PM",
//         type: "bonus",
//         status: "completed",
//         transactionHash: "0xfedc...qrst"
//     }
// ];

// export interface DashboardStatistics {
//     rewardWallet: {
//         balance: number;
//         currency: CurrencyType;
//         lastUpdated: string;
//     };
//     totalDeposits: {
//         amount: number;
//         currency: CurrencyType;
//         lastUpdated: string;
//         chartData: ChartDataPoint[];
//     };
//     directRecruitment: {
//         earnings: number;
//         currency: CurrencyType;
//         lastUpdated: string;
//     };
//     agentProfile: {
//         name: string;
//         level: string;
//         activeUsers: {
//             current: number;
//             target: number;
//             percentage: number;
//             remaining: number;
//         };
//     }
//     totalDirectRecruit: {
//         count: number;
//         agentsToPartner: number;
//     };
//     referralCode: string;
//     depositActivities: DepositActivity[];
// }

// export const dashboardData: DashboardStatistics = {
//     rewardWallet: {
//         balance: 18302.34,
//         currency: defaultCurrency,
//         lastUpdated: '2024-02-20T15:30:00Z'
//     },
//     totalDeposits: {
//         amount: 170232.22,
//         currency: defaultCurrency,
//         lastUpdated: '2024-02-20T15:30:00Z',
//         chartData: [
//             { label: 'Jan', value: 605 },
//             { label: 'Feb', value: 1156 },
//             { label: 'Mar', value: 1038 },
//             { label: 'Apr', value: 1789 },
//             { label: 'May', value: 1503 },
//             { label: 'Jun', value: 904 },
//             { label: 'Jul', value: 974 },
//             { label: 'Aug', value: 1414 },
//             { label: 'Sept', value: 1355 },
//             { label: 'Oct', value: 1594 },
//             { label: 'Nov', value: 1762 },
//             { label: 'Dec', value: 2089 }
//         ]
//     },
//     directRecruitment: {
//         earnings: 1855.00,
//         currency: defaultCurrency,
//         lastUpdated: '2024-02-20T15:30:00Z'
//     },
//     agentProfile: {
//         name: "John Smith",
//         level: "LEVEL 5 PARTNER",
//         activeUsers: {
//             current: 42208,
//             target: 50000,
//             percentage: 84.5,
//             remaining: 7792
//         },
//     },
//     totalDirectRecruit: {
//         count: 2146,
//         agentsToPartner: 22
//     },
//     referralCode: "7HKS56H5",
//     depositActivities
// };

/*** 01 End of Agent Dashboard Stats ***/



/*** 02 Start of Account Stats ***/

/*** Wallets Page ***/
// export const walletStats = {
//     rewardWallet: {
//         amount: 123123,
//         showTransfer: true
//     },
//     currentWallet: {
//         amount: 14863.09,
//         secondaryAmount: 6369.89
//     },
//     walletSummary: {
//         Week: [
//             { label: 'Mon', value: 1687.71 },
//             { label: 'Tue', value: 1723.45 },
//             { label: 'Wed', value: 1698.32 },
//             { label: 'Thu', value: 1756.89 },
//             { label: 'Fri', value: 1789.23 },
//             { label: 'Sat', value: 1802.45 },
//             { label: 'Sun', value: 1832.34 },
//         ],
//         Month: [
//             { label: 'Week 1', value: 1687.71 },
//             { label: 'Week 2', value: 1723.45 },
//             { label: 'Week 3', value: 1798.32 },
//             { label: 'Week 4', value: 1832.34 },
//         ],
//         Year: [
//             { label: 'Jan', value: 1287.99 },
//             { label: 'Feb', value: 1636.24 },
//             { label: 'Mar', value: 1520.99 },
//             { label: 'Apr', value: 1439.70 },
//             { label: 'May', value: 1499.44 },
//             { label: 'Jun', value: 1568.83 },
//             { label: 'Jul', value: 1574.56 },
//             { label: 'Aug', value: 1687.71 },
//             { label: 'Sep', value: 1582.92 },
//             { label: 'Oct', value: 1730.35 },
//             { label: 'Nov', value: 1748.00 },
//             { label: 'Dec', value: 1527.61 },
//         ],
//     }
// };


/*** Transfer Page ***/
// export type StatusType = 'SUCCEED' | 'FAILED';

// export interface TransferActivityProps {
//     id: string;
//     amount: number;
//     currency: CurrencyType;
//     dateTime: string;
//     status: StatusType;
// }

// export const transferData = {
//     sourceWallet: {
//         amount: 123123,
//         currency: 'USDT' as CurrencyType
//     },

//     currencyOptions: [
//         { name: 'USDT' as CurrencyType, symbol: 'USDT' as CurrencyType },
//         { name: 'USDC' as CurrencyType, symbol: 'USDC' as CurrencyType }
//     ],

//     walletBalanceDistribution: {
//         data: [
//             {
//                 name: 'USDT',
//                 value: 71,
//                 amount: 14863.09,
//                 currency: 'USDT' as CurrencyType
//             },
//             {
//                 name: 'USDC',
//                 value: 29,
//                 amount: 6369.89,
//                 currency: 'USDC' as CurrencyType
//             }
//         ]
//     },

//     transferActivity: [
//         {
//             id: 'TID-982374523',
//             amount: 1000.00,
//             currency: 'USDC',
//             dateTime: 'November 07, 2024 at 9:00PM',
//             status: 'SUCCEED'
//         },
//         {
//             id: 'TID-743826195',
//             amount: 1000.00,
//             currency: 'USDT',
//             dateTime: 'November 01, 2024 at 1:56PM',
//             status: 'SUCCEED'
//         },
//         {
//             id: 'TID-156849372',
//             amount: 500.00,
//             currency: 'USDT',
//             dateTime: 'October 12, 2024 at 4:38PM',
//             status: 'FAILED'
//         },
//         {
//             id: 'TID-493720586',
//             amount: 1000.00,
//             currency: 'USDT',
//             dateTime: 'October 03, 2024 at 10:24AM',
//             status: 'SUCCEED'
//         },
//         {
//             id: 'TID-672481930',
//             amount: 500.00,
//             currency: 'USDT',
//             dateTime: 'September 29, 2024 at 1:56PM',
//             status: 'SUCCEED'
//         },
//         {
//             id: 'TID-810293746',
//             amount: 200.00,
//             currency: 'USDC',
//             dateTime: 'November 07, 2024 at 9:00PM',
//             status: 'SUCCEED'
//         },
//         {
//             id: 'TID-325749681',
//             amount: 1000.00,
//             currency: 'USDT',
//             dateTime: 'November 03, 2024 at 1:56PM',
//             status: 'SUCCEED'
//         }
//     ] as TransferActivityProps[]
// };

/*** 02 End of Account Stats ***/



/*** 03 Start of Incentive Management Page ***/

// export const incentiveTypes = [
//     /** dummy data only**/
//     'Direct Recruit Referral Override Incentive',
//     'Direct Admin Charge Rebate',
//     'Direct Recruit\'s Deposit Admin Charge Overriding Rebate',
//     'Direct Recruit Level Advancement Bonus',
//     'Performance Bonus',
//     'Referral Fee Incentive',
//     'Deposit Admin Charge Rebate',
//     'Direct Recruit\'s Deposit Admin Charge Rebate'
// ] as const;


// // Enum for incentive types
// export type IncentiveType = typeof incentiveTypes[number];


// // Individual activity record
// export interface IncentiveActivity {
//     type: IncentiveType;
//     amount: number;
//     datetime: string;
// }


// export const generateMockData = (): { [key: string]: IncentiveActivity[] } => {
//     const data: { [key: string]: IncentiveActivity[] } = {};
//     const today = new Date();

//     // Generate data for last 3 months
//     for (let monthsAgo = 0; monthsAgo < 3; monthsAgo++) {
//         const currentDate = new Date(today);
//         currentDate.setMonth(currentDate.getMonth() - monthsAgo);
//         const monthKey = currentDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

//         const monthData = Array.from({ length: 35 }, (_, index): IncentiveActivity => {
//             const day = Math.floor(Math.random() * 28) + 1;
//             currentDate.setDate(day);

//             return {
//                 type: incentiveTypes[Math.floor(Math.random() * incentiveTypes.length)],
//                 amount: Number((Math.random() * 25000 + 500).toFixed(2)),
//                 datetime: currentDate.toLocaleString('en-US', {
//                     month: 'long',
//                     day: 'numeric',
//                     year: 'numeric',
//                     hour: 'numeric',
//                     minute: '2-digit',
//                     hour12: true
//                 })
//             };
//         });

//         // Sort by date in descending order
//         monthData.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
//         data[monthKey] = monthData;
//     }

//     return data;
// };


// // Monthly activities data
// export interface MonthlyIncentiveActivities {
//     [key: string]: IncentiveActivity[];
// }


// // Summary cards data
// export interface IncentiveSummaryData {
//     total_incentive: number;
//     milestone_bonus: {
//         amount: number;
//     };
//     direct_recruit_referral: number;
//     direct_admin_charge: number;
//     direct_recruit_deposit: number;
//     direct_recruit_level_advancement_bonus: number;
//     performance_bonus: {
//         amount: number;
//         activeUsers: number;
//     };
// }

// // Complete page data structure
// export interface IncentivePageData {
//     summary: IncentiveSummaryData;
//     activities: MonthlyIncentiveActivities;
// }


// // Sample static data
// export const incentivePageData: IncentivePageData = {
//     summary: {
//         total_incentive: 18302.34,
//         milestone_bonus: {
//             amount: 1000,
//         },
//         direct_recruit_referral: 18302.34,
//         direct_admin_charge: 18302.34,
//         direct_recruit_deposit: 18302.34,
//         direct_recruit_level_advancement_bonus: 18302.34,
//         performance_bonus: {
//             amount: 500000,
//             activeUsers: 10
//         }
//     },
//     activities: generateMockData()
// };


/*** 03 End of Incentive Management Page ***/




/*** 04 Start of Referred Users Page ***/
/*** Referred Users Page Data ***/
export interface RecruitData {
    count: number;
    agentsToPartner: {
        count: number;
        trend: 'up' | 'down'; // Explicitly type 'trend'
    };
    chartData: {
        Week: ChartDataPoint[];
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    };
}



export const recruitData: RecruitData = {
    count: 2146,
    agentsToPartner: {
        count: 22,
        trend: 'up',
    },
    chartData: {
        Week: [
            { label: 'Mon', value: 300 },
            { label: 'Tue', value: 310 },
            { label: 'Wed', value: 305 },
            { label: 'Thu', value: 320 },
            { label: 'Fri', value: 315 },
            { label: 'Sat', value: 325 },
            { label: 'Sun', value: 330 },
        ],
        Month: [
            { label: 'Week 1', value: 800 },
            { label: 'Week 2', value: 820 },
            { label: 'Week 3', value: 850 },
            { label: 'Week 4', value: 830 },
        ],
        Year: [
            { label: 'Jan', value: 1800 },
            { label: 'Feb', value: 1850 },
            { label: 'Mar', value: 1900 },
            { label: 'Apr', value: 1950 },
            { label: 'May', value: 2000 },
            { label: 'Jun', value: 2050 },
            { label: 'Jul', value: 2080 },
            { label: 'Aug', value: 2100 },
            { label: 'Sep', value: 2050 },
            { label: 'Oct', value: 2120 },
            { label: 'Nov', value: 2150 },
            { label: 'Dec', value: 2146 }, // Matches the count for demonstration
        ],
    },
};



/*** Manage Users Page ***/
export interface AgentLevelCount {
    level: string;
    count: number;
}

export interface User {
    id: string;
    name: string;
    userId: string;
    ranking: string;
    keyMarket: string;
    joinedSince: string;
    lastActive: string;
}

export const agentLevelsData: AgentLevelCount[] = [
    { level: 'Level 1 Agent', count: 91 },
    { level: 'Level 2 Agent', count: 69 },
    { level: 'Level 3 Agent', count: 50 },
    { level: 'Level 4 Agent', count: 19 },
];


export const usersListData: User[] = [
    {
        id: 'user1',
        name: 'John Smith',
        userId: '10118237',
        ranking: 'Partner 3',
        keyMarket: 'Malaysia',
        joinedSince: 'Jan 10, 2024',
        lastActive: 'Jan 12, 2024 10:30:00',
    },
    {
        id: 'user2',
        name: 'Jane Doe',
        userId: '10118238',
        ranking: 'Agent 2',
        keyMarket: 'Singapore',
        joinedSince: 'Feb 20, 2024',
        lastActive: 'Feb 22, 2024 14:45:00',
    },
    {
        id: 'user3',
        name: 'Robert Johnson',
        userId: '10118239',
        ranking: 'Agent 1',
        keyMarket: 'Thailand',
        joinedSince: 'Mar 05, 2024',
        lastActive: 'Mar 07, 2024 09:15:00',
    },
    {
        id: 'user4',
        name: 'Emily Brown',
        userId: '10118240',
        ranking: 'User',
        keyMarket: 'HongKong',
        joinedSince: 'Apr 15, 2024',
        lastActive: 'Apr 17, 2024 16:20:00',
    },
];


/*** Single User View Page ***/

export interface SingleUserData {
    name: string;
    avatar: string;
    level: string;
    promotedDate: string;
    details: {
        userId: string;
        joinedSince: string;
        lastActive: string;
        keyMarket: string;
    };
    stats: {
        directRecruit: number;
        directReferrals: number;
        cardActivation: {
            current: number;
            total: number;
        };
        agentRecruitment: {
            current: number;
            total: number;
        };
    };
    status: {
        deposit: boolean;
        eKYC: boolean;
        activatedCard: boolean;
        physicalCard: boolean;
    };
    socialLinks?: {  // Optional social links
        facebook?: string;
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
}

export const singleUserData: SingleUserData = {
    name: "Adam Lam",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adam",
    level: "Level 2 Agent",
    promotedDate: "Nov 07, 2024",
    // Properly structured details object
    details: {
        userId: "10118237",
        joinedSince: "Nov 07, 2024",
        lastActive: "Nov 07, 2024 18:37:32",
        keyMarket: "Malaysia"
    },
    stats: {
        directRecruit: 2,
        directReferrals: 148,
        cardActivation: {
            current: 340,
            total: 1000,
        },
        agentRecruitment: {
            current: 2,
            total: 5,
        }
    },
    status: {
        deposit: true,
        eKYC: true,
        activatedCard: true,
        physicalCard: true
    },
    // Optional social links
    socialLinks: {
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
    }

};


/*** Activation Volume Chart ***/
export interface DataPoint {
    label: string;
    value: number;
}

export type TimeRange = 'Month' | 'Year';

export interface TimeRangeData {
    [key: string]: {
        Month: DataPoint[];
        Year: DataPoint[];
    };
}

// Simplified weekly data
export const activationData: TimeRangeData = {
    "2023": {
        Month: [
            { label: "Week 1", value: 1250 },
            { label: "Week 2", value: 2100 },
            { label: "Week 3", value: 1800 },
            { label: "Week 4", value: 2400 },
        ],
        Year: [
            { label: "Jan", value: 150 },
            { label: "Feb", value: 450 },
            { label: "Mar", value: 380 },
            { label: "Apr", value: 560 },
            { label: "May", value: 270 },
            { label: "Jun", value: 490 },
            { label: "Jul", value: 120 },
            { label: "Aug", value: 590 },
            { label: "Sep", value: 310 },
            { label: "Oct", value: 430 },
            { label: "Nov", value: 580 },
            { label: "Dec", value: 530 },
        ],
    }
};




/*** 04 End of Referred Users Page ***/



/*** 05 Start of Performance Page ***/
// export interface ProgressCard {
//     title: string;
//     currentValue: number;
//     targetValue: number;
//     suffix: string;
//     progressColor: string;
// }

// export interface NextLevelCard {
//     currentLevel: string;
//     progress: number;
//     isMaxLevel: boolean;
//     avatarUrl: string;
//     name: string;
// }

// export interface SalesSummary {
//     groupSales: number;
//     personalSales: number;
// }

// export interface DemographicData {
//     [key: string]: {
//         [key: string]: number;
//     };
// }


// export interface PerformanceData {
//     progressCards: ProgressCard[];
//     nextLevelCard: NextLevelCard;
//     salesSummary: SalesSummary;
//     demographicData: DemographicData;
//     salesVolumeData: SalesVolumeData;
// }


export const performanceData = {
    cardActivationVolume:
    {
        currentValue: 42208,
        targetValue: 50000,
    },
    totalAgentRecruitment:
    {
        currentValue: 2146,
        targetValue: 3000,
    },
    nextLevelCard: {
        currentLevel: "userData.level",
        progress: 84.5,
        isMaxLevel: true,
        avatarUrl: "userData.avatarUrl",
        name: "ljdfkdsjf",

    },
    salesSummary: {
        groupSales: 73.2,
        personalSales: 27.8,
    },
    demographicData: {
        'Hong Kong': {
            Q1_2024: 92118,
            Q2_2024: 88234,
            Q3_2024: 90123,
            Q4_2024: 91456,
            Q1_2023: 85234,
            Q2_2023: 86123,
            Q3_2023: 87456,
            Q4_2023: 88789,
        },
        'Malaysia': {
            Q1_2024: 35942,
            Q2_2024: 34156,
            Q3_2024: 33943,
            Q4_2024: 35876,
            Q1_2023: 32156,
            Q2_2023: 31943,
            Q3_2023: 33876,
            Q4_2023: 34123,
        },
        'Bangkok': {
            Q1_2024: 20621,
            Q2_2024: 19943,
            Q3_2024: 20876,
            Q4_2024: 21123,
            Q1_2023: 18943,
            Q2_2023: 19876,
            Q3_2023: 20123,
            Q4_2023: 20456,
        },
        'Taiwan': {
            Q1_2024: 11424,
            Q2_2024: 10876,
            Q3_2024: 11123,
            Q4_2024: 11456,
            Q1_2023: 10876,
            Q2_2023: 11123,
            Q3_2023: 11456,
            Q4_2023: 11789,
        },
        'Philippines': {
            Q1_2024: 10127,
            Q2_2024: 9654,
            Q3_2024: 9876,
            Q4_2024: 10234,
            Q1_2023: 9654,
            Q2_2023: 9876,
            Q3_2023: 10234,
            Q4_2023: 10456,
        },
    },
    salesVolumeData: {
        monthlyData2024: [
            { name: 'Jan', value: 3741 },
            { name: 'Feb', value: 1587 },
            { name: 'Mar', value: 2085 },
            { name: 'Apr', value: 1664 },
            { name: 'May', value: 1809 },
            { name: 'Jun', value: 2536 },
            { name: 'Jul', value: 2303 },
            { name: 'Aug', value: 1718 },
            { name: 'Sep', value: 2354 },
            { name: 'Oct', value: 1914 },
            { name: 'Nov', value: 1848 },
            { name: 'Dec', value: 1831 },
        ],
        monthlyData2023: [
            { name: 'Jan', value: 2841 },
            { name: 'Feb', value: 1987 },
            { name: 'Mar', value: 2785 },
            { name: 'Apr', value: 1964 },
            { name: 'May', value: 2109 },
            { name: 'Jun', value: 2736 },
            { name: 'Jul', value: 2503 },
            { name: 'Aug', value: 1918 },
            { name: 'Sep', value: 2554 },
            { name: 'Oct', value: 2114 },
            { name: 'Nov', value: 2048 },
            { name: 'Dec', value: 2031 },
        ],
        weeklyData: {
            Jan2024: [
                { name: 'Week 1', value: 941 },
                { name: 'Week 2', value: 887 },
                { name: 'Week 3', value: 985 },
                { name: 'Week 4', value: 928 },
            ],
            Feb2024: [
                { name: 'Week 1', value: 441 },
                { name: 'Week 2', value: 387 },
                { name: 'Week 3', value: 485 },
                { name: 'Week 4', value: 274 },
            ],
        },
    },
};

/*** 05 End of Performance Page ***/




/*** 06 Start of Support Page ***/
/*** 06 End of Support Page ***/


/*** 07 Start of Settings Page ***/
/*** 07 End of Settings Page ***/


/*** 08 Start of Legal Page ***/
/*** 08 End of Legal Page ***/
export interface LegalContent {
    title: string;
    lastUpdated: string;
    sections: {
        heading?: string;
        content: string[];
    }[];
}

export const legalContentData: Record<string, LegalContent> = {
    privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "17 Nov, 2024",
        sections: [
            {
                heading: "Information Collection",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            },
            {
                heading: "Data Usage",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    termsConditions: {
        title: "Terms and Conditions",
        lastUpdated: "15 Nov, 2024",
        sections: [
            {
                heading: "General Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    userAgreement: {
        title: "User Agreement",
        lastUpdated: "16 Nov, 2024",
        sections: [
            {
                heading: "Agreement Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    codeOfConduct: {
        title: "Code Of Conduct",
        lastUpdated: "16 Nov, 2024",
        sections: [
            {
                heading: "Agreement Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    complianceAndAntiCorruption: {
        title: "Compliance and Anti-Corruption",
        lastUpdated: "16 Nov, 2024",
        sections: [
            {
                heading: "Agreement Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    profilePolicy: {
        title: "Profile Policy",
        lastUpdated: "16 Nov, 2024",
        sections: [
            {
                heading: "Agreement Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    },
    programGuideline: {
        title: "Program Guideline",
        lastUpdated: "16 Nov, 2024",
        sections: [
            {
                heading: "Agreement Terms",
                content: [
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
                    "Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat."
                ]
            }
        ]
    }
};
