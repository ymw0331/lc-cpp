import { accountApi } from "../account/account.api";
import { WalletData, RewardChartResponse, RewardChartParams } from "./wallet.types";
import { API_ENDPOINTS } from "../config/endpoints";
import resellerAxios from "../config/reseller.config";
import { ChartDataPoint } from "../dashboard/dashboard.types";

export const walletApi = {
    getWalletData: async (): Promise<WalletData> => {
        try {
            const accountData = await accountApi.getAccountData();

            return {
                rewardWallet: {
                    amount: accountData.rebate.balance ?? 0,
                    showTransfer: true,
                },
                currentWallet: {
                    amount: accountData.current.balance ?? 0,
                    secondaryAmount: 0,
                },
            };
        } catch (error) {
            console.error('[Wallet API] Error fetching wallet data:', error);
            return {
                rewardWallet: {
                    amount: 0,
                    showTransfer: true,
                },
                currentWallet: {
                    amount: 0,
                    secondaryAmount: 0,
                },
            };
        }
    },

    getRewardChartData: async (params: RewardChartParams): Promise<RewardChartResponse> => {
        try {
            const { year, month } = params;
            let url = `${API_ENDPOINTS.RESELLER.REWARD_CHART}?year=${year}`;
            
            if (month) {
                url += `&month=${month}`;
            }

            const response = await resellerAxios.get(url);
            return response.data;
        } catch (error) {
            console.error('[Wallet API] Error fetching reward chart data:', error);
            // Return default data structure with zeros for better user experience
            return {
                totalDrReward: 0,
                chartDataYear: Array.from({ length: 12 }, (_, i) => ({
                    date: `${params.year}-${String(i + 1).padStart(2, '0')}`,
                    value: 0
                })),
                chartDataMonth: params.month ? 
                    Array.from({ length: 31 }, (_, i) => ({
                        date: `${params.year}-${String(params.month).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
                        value: 0
                    })) : []
            };
        }
    },

    formatRewardChartData: (data: RewardChartResponse): {
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    } => {
        // Format Year data
        const yearData = data.chartDataYear.map((item: { date: string; value: number }) => ({
            label: item.date.substring(5), // Extract "MM" from "YYYY-MM"
            value: item.value
        }));

        // Format Month data
        const monthData = data.chartDataMonth.map((item: { date: string; value: number }) => ({
            label: item.date.substring(8), // Extract "DD" from "YYYY-MM-DD"
            value: item.value
        }));

        return {
            Month: monthData,
            Year: yearData
        };
    }
};