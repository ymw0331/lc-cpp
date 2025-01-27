import { TransferActivityProps, CurrencyType } from '@/types/account/data';

/*** Account ***/

/*** Wallets Page ***/
export const walletStats = {
    rewardWallet: {
        amount: 18302.34,
        showTransfer: true
    },
    currentWallet: {
        amount: 14863.09,
        secondaryAmount: 6369.89
    },
    walletSummary: {
        Week: [
            { name: 'Mon', value: 1687.71 },
            { name: 'Tue', value: 1723.45 },
            { name: 'Wed', value: 1698.32 },
            { name: 'Thu', value: 1756.89 },
            { name: 'Fri', value: 1789.23 },
            { name: 'Sat', value: 1802.45 },
            { name: 'Sun', value: 1832.34 },
        ],
        Month: [
            { name: 'Week 1', value: 1687.71 },
            { name: 'Week 2', value: 1723.45 },
            { name: 'Week 3', value: 1798.32 },
            { name: 'Week 4', value: 1832.34 },
        ],
        Year: [
            { name: 'Jan', value: 1287.99 },
            { name: 'Feb', value: 1636.24 },
            { name: 'Mar', value: 1520.99 },
            { name: 'Apr', value: 1439.70 },
            { name: 'May', value: 1499.44 },
            { name: 'Jun', value: 1568.83 },
            { name: 'Jul', value: 1574.56 },
            { name: 'Aug', value: 1687.71 },
            { name: 'Sep', value: 1582.92 },
            { name: 'Oct', value: 1730.35 },
            { name: 'Nov', value: 1748.00 },
            { name: 'Dec', value: 1527.61 },
        ],
    }
};



/*** Transfer Page ***/
export const transferPageData = {
    sourceWallet: {
        title: "Reward Wallet Balance",
        amount: 18302.34,
        currency: 'USDT' as CurrencyType
    },

    currencyOptions: [
        { name: 'USDT' as CurrencyType, symbol: 'USDT' as CurrencyType },
        { name: 'USDC' as CurrencyType, symbol: 'USDC' as CurrencyType }
    ],

    assetDistribution: {
        data: [
            {
                name: 'USDT',
                value: 71,
                amount: 14863.09,
                currency: 'USDT' as CurrencyType
            },
            {
                name: 'USDC',
                value: 29,
                amount: 6369.89,
                currency: 'USDC' as CurrencyType
            }
        ]
    },

    transferActivity: [
        {
            id: 'TID-982374523',
            amount: 1000.00,
            currency: 'USDC',
            dateTime: 'November 07, 2024 at 9:00PM',
            status: 'SUCCEED'
        },
        {
            id: 'TID-743826195',
            amount: 1000.00,
            currency: 'USDT',
            dateTime: 'November 01, 2024 at 1:56PM',
            status: 'SUCCEED'
        },
        {
            id: 'TID-156849372',
            amount: 500.00,
            currency: 'USDT',
            dateTime: 'October 12, 2024 at 4:38PM',
            status: 'FAILED'
        },
        {
            id: 'TID-493720586',
            amount: 1000.00,
            currency: 'USDT',
            dateTime: 'October 03, 2024 at 10:24AM',
            status: 'SUCCEED'
        },
        {
            id: 'TID-672481930',
            amount: 500.00,
            currency: 'USDT',
            dateTime: 'September 29, 2024 at 1:56PM',
            status: 'SUCCEED'
        },
        {
            id: 'TID-810293746',
            amount: 200.00,
            currency: 'USDC',
            dateTime: 'November 07, 2024 at 9:00PM',
            status: 'SUCCEED'
        },
        {
            id: 'TID-325749681',
            amount: 1000.00,
            currency: 'USDT',
            dateTime: 'November 03, 2024 at 1:56PM',
            status: 'SUCCEED'
        }
    ] as TransferActivityProps[]
};