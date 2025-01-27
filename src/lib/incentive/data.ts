/*** Incentive Management Page ***/

import { IncentivePageData, IncentiveActivity } from "@/types/incentive/data";

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

export const generateMockData = (): { [key: string]: IncentiveActivity[] } => {
    const data: { [key: string]: IncentiveActivity[] } = {};
    const today = new Date();

    // Generate data for last 3 months
    for (let monthsAgo = 0; monthsAgo < 3; monthsAgo++) {
        const currentDate = new Date(today);
        currentDate.setMonth(currentDate.getMonth() - monthsAgo);
        const monthKey = currentDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

        const monthData = Array.from({ length: 35 }, (_, index): IncentiveActivity => {
            const day = Math.floor(Math.random() * 28) + 1;
            currentDate.setDate(day);

            return {
                type: incentiveTypes[Math.floor(Math.random() * incentiveTypes.length)],
                amount: Number((Math.random() * 25000 + 500).toFixed(2)),
                datetime: currentDate.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
        });

        // Sort by date in descending order
        monthData.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        data[monthKey] = monthData;
    }

    return data;
};

// Sample static data
export const incentivePageData: IncentivePageData = {
    summary: {
        total_incentive: 18302.34,
        milestone_bonus: {
            amount: 1000,
        },
        direct_recruit_referral: 18302.34,
        direct_admin_charge: 18302.34,
        direct_recruit_deposit: 18302.34,
        direct_recruit_level: 18302.34,
        performance_bonus: {
            amount: 500000,
            activeUsers: 10
        }
    },
    activities: generateMockData()
};


// Table columns configuration
export const tableColumns = [
    { key: 'type', header: 'TYPE OF INCENTIVE', align: 'left' as const },
    { key: 'amount', header: 'AMOUNT', align: 'right' as const },
    { key: 'datetime', header: 'DATE TIME', align: 'right' as const },
];
