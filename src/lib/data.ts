/*****  Dashboard  Data *****/
export const salesSparklineData = [
    { name: "1", value: 300 },
    { name: "2", value: 500 },
    { name: "3", value: 200 },
    { name: "4", value: 400 },
    { name: "5", value: 300 },
    { name: "6", value: 450 }
];

export const revenueSparklineData = [
    { name: "1", value: 400 },
    { name: "2", value: 600 },
    { name: "3", value: 300 },
    { name: "4", value: 500 },
    { name: "5", value: 350 },
    { name: "6", value: 480 }
];

export const agentsSparklineData = [
    { name: "1", value: 200 },
    { name: "2", value: 250 },
    { name: "3", value: 280 },
    { name: "4", value: 270 },
    { name: "5", value: 290 },
    { name: "6", value: 285 }
];

export const partnersSparklineData = [
    { name: "1", value: 100 },
    { name: "2", value: 110 },
    { name: "3", value: 115 },
    { name: "4", value: 120 },
    { name: "5", value: 125 },
    { name: "6", value: 130 }
];

export const dummySparklineData = [
    { name: "1", value: 400 },
    { name: "2", value: 300 },
    { name: "3", value: 500 },
    { name: "4", value: 450 },
    { name: "5", value: 470 },
    { name: "6", value: 480 },
];

export const salesData = [
    { name: "Jul", value: 36000, activations: 240 },
    { name: "Aug", value: 120600, activations: 870 },
    { name: "Sept", value: 161000, activations: 1007 },
    { name: "Oct", value: 135200, activations: 788 },
    { name: "Nov", value: 131100, activations: 876 },
    { name: "Dec", value: 82700, activations: 614 }
];

export const onboardingData = [
    { name: "Jul", agents: 625, partners: 4 },
    { name: "Aug", agents: 850, partners: 13 },
    { name: "Sept", agents: 1203, partners: 40 },
    { name: "Oct", agents: 1104, partners: 80 },
    { name: "Nov", agents: 1382, partners: 104 },
    { name: "Dec", agents: 877, partners: 118 }
];

export const agentRankingData = {
    month: [
        { name: "LIM AH HUAT", rank: "Level 2", salesVolume: 180000.00 },
        { name: "MOHD SAIFUL", rank: "Level 2", salesVolume: 142500.00 },
        { name: "PETER SAM", rank: "Level 2", salesVolume: 118500.00 },
        { name: "SABRIBA LAU", rank: "Level 2", salesVolume: 105600.00 },
        { name: "JESSIE THOO", rank: "Level 2", salesVolume: 104850.00 }
    ],
    year: [
        { name: "JOHN DOE", rank: "Level 3", salesVolume: 2180000.00 },
        { name: "JANE SMITH", rank: "Level 2", salesVolume: 1942500.00 },
        { name: "MIKE JOHNSON", rank: "Level 2", salesVolume: 1718500.00 },
        { name: "SARAH LEE", rank: "Level 2", salesVolume: 1605600.00 },
        { name: "TOM WILSON", rank: "Level 2", salesVolume: 1504850.00 }
    ]
};

export const partnerRankingData = {
    month: [
        { name: "CHRISTOPHER LOO", rank: "Level 4", salesVolume: 4311000.00 },
        { name: "LEE TING TING", rank: "Level 4", salesVolume: 2981250.00 },
        { name: "APPLE LIM", rank: "Level 3", salesVolume: 1313400.00 },
        { name: "ADAM ABDULLAH", rank: "Level 3", salesVolume: 1177500.00 },
        { name: "SITI", rank: "Level 3", salesVolume: 1047450.00 }
    ],
    year: [
        { name: "DAVID CHEN", rank: "Level 5", salesVolume: 54311000.00 },
        { name: "MARY WONG", rank: "Level 4", salesVolume: 42981250.00 },
        { name: "ROBERT TAN", rank: "Level 4", salesVolume: 31313400.00 },
        { name: "LISA NG", rank: "Level 4", salesVolume: 21177500.00 },
        { name: "KEVIN LIM", rank: "Level 3", salesVolume: 11047450.00 }
    ]
};


/*****  Wallets  Data *****/
export const metricChartData = [
    { name: "Jul", payout: 253218.29, revenue: 496932.12 },
    { name: "Aug", payout: 1328199.35, revenue: 5102291.29 },
    { name: "Sep", payout: 821382.10, revenue: 2314221.10 },
    { name: "Oct", payout: 3821112.93, revenue: 9281123.34 },
    { name: "Nov", payout: 489277.21, revenue: 1428291.20 },
    { name: "Dec", payout: 1348453.95, revenue: 10240325.86 }
]

export const transactionsData = [
    {
        description: "Incentive Payout",
        timestamp: "November 13, 2024 at 1:59PM",
        name: "LIM AH HUAT",
        email: "ahlock.koh",
        rank: "Level 3",
        status: "Pending",
        amount: -24562.56
    },
    {
        description: "Deposit / Top Up",
        timestamp: "November 13, 2024 at 1:59PM",
        name: "PETER SAM",
        email: "peter@mail.com",
        rank: "Level 2",
        status: "Success",
        amount: 1000.00
    },
    {
        description: "Incentive Payout",
        timestamp: "November 13, 2024 at 1:59PM",
        name: "PETER SAM",
        email: "peter@mail.com",
        rank: "Level 2",
        status: "Failed",
        amount: -12212.10
    },
    {
        description: "Incentive Payout",
        timestamp: "November 13, 2024 at 1:59PM",
        name: "SABRIBA LAU",
        email: "sabriba.lau",
        rank: "Level 2",
        status: "Success",
        amount: -2381.21
    },
    {
        description: "Deposit / Top Up",
        timestamp: "November 13, 2024 at 1:59PM",
        name: "JESSIE THOO",
        email: "jessie.thoo",
        rank: "Level 2",
        status: "Success",
        amount: 500.00
    }
]


/***** Transfer Data *****/

export const transferDescriptionsData = [
    'Referral Incentive',
    'Referral Overriding Incentive',
    'Deposit Admin Charge Rebate',
    'Deposit Admin Charge Overriding Rebate',
    'Performance Incentive',
    'Milestone Achievement Bonus',
    "Direct Recruit's Level Advancement Bonus",
    'Others'
]





/*****  Incentive Management  Data *****/



/*****  Payout Summary Data *****/
