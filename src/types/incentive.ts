/*** 03 Start of Incentive Management Page ***/

export const incentiveTypes = [
    /** dummy data only**/
    'Direct Recruit Referral Override Incentive',
    'Direct Admin Charge Rebate',
    'Direct Recruit\'s Deposit Admin Charge Overriding Rebate',
    'Direct Recruit Level Advancement Bonus',
    'Performance Bonus',
    'Referral Fee Incentive',
    'Deposit Admin Charge Rebate',
    'Direct Recruit\'s Deposit Admin Charge Rebate'
] as const;


// Enum for incentive types
export type IncentiveType = typeof incentiveTypes[number];


// Individual activity record
export interface IncentiveActivity {
    type: IncentiveType;
    amount: number;
    datetime: string;
}


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


// Monthly activities data
export interface MonthlyIncentiveActivities {
    [key: string]: IncentiveActivity[];
}


// Summary cards data
export interface IncentiveSummaryData {
    total_incentive: number;
    milestone_bonus: {
        amount: number;
    };
    direct_recruit_referral: number;
    direct_admin_charge: number;
    direct_recruit_deposit: number;
    direct_recruit_level: number;
    performance_bonus: {
        amount: number;
        activeUsers: number;
    };
}

// Complete page data structure
export interface IncentivePageData {
    summary: IncentiveSummaryData;
    activities: MonthlyIncentiveActivities;
}


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
//         direct_recruit_level: 18302.34,
//         performance_bonus: {
//             amount: 500000,
//             activeUsers: 10
//         }
//     },
//     activities: generateMockData()
// };


/*** 03 End of Incentive Management Page ***/


