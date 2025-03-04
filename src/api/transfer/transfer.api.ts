import { accountApi } from "../account/account.api";
import { API_ENDPOINTS } from "../config/endpoints";
import { CurrencyType, TransferActivityProps, WalletTransaction, TransferType } from "./transfer.types";
import resellerAxios from "../config/reseller.config";

// Use this flag to toggle between real API calls and mocks
const USE_MOCK = true; // Set to false to use real API

// Use this flag to simulate success or failure in mock mode
const MOCK_SUCCESS = false; // Set to false to test error handling
import { dashboardApi } from "../dashboard/dashboard.api";

interface TransferToCurrentWalletProps {
    amount: number;
    fromType: "REBATE";
    // transfer money from reward wallet to current wallet
}

export const transferApi = {
    getTransferData: async () => {
        try {
            // Fetch both account data and dashboard data in parallel
            const [accountData, dashboardData] = await Promise.all([
                accountApi.getAccountData(),
                dashboardApi.getDashboardData()
            ]);

            // Format wallet transactions for transfer activity
            const transferActivity: TransferActivityProps[] =
                dashboardData.rewardWallet?.transactions?.map((transaction: WalletTransaction) => {
                    // Determine the transfer type based on amount
                    const type: TransferType = transaction.amount < 0 ? 'transfer-out' : 'transfer-in';

                    return {
                        id: transaction.id,
                        description: transaction.description,
                        amount: transaction.amount,
                        dateTime: transaction.createdAt,
                        currency: transaction.currency as CurrencyType,
                        status: 'SUCCEED',
                        type: type
                    };
                }) || [];

            return {
                sourceWallet: {
                    amount: accountData.rebate.balance ?? 0,
                    currency: 'USDT' as CurrencyType
                },
                currencyOptions: [
                    { name: 'USDT' as CurrencyType, symbol: 'USDT' as CurrencyType },
                    // Uncomment when USDC is supported
                    // { name: 'USDC' as CurrencyType, symbol: 'USDC' as CurrencyType }
                ],
                walletBalanceDistribution: {
                    data: [] // Will be updated when backend provides data
                },
                transferActivity: transferActivity
            };
        } catch (error) {
            console.error('Error fetching transfer data:', error);
            throw error; // Re-throw to allow proper error handling
        }
    },

    transferToCurrentWallet: async (data: TransferToCurrentWalletProps) => {
        try {
            console.log('[Transfer API] Sending request to:', API_ENDPOINTS.RESELLER.TRANSFER);
            console.log('[Transfer API] Request data:', data);

            // Mock implementation for testing
            // if (USE_MOCK) {
            //     console.log('[Transfer API] Using mock response for testing');

            //     // Simulate network delay
            //     await new Promise(resolve => setTimeout(resolve, 1000));

            //     if (MOCK_SUCCESS) {
            //         // Mock successful response
            //         console.log('[Transfer API] Mock success response');
            //         return {
            //             success: true,
            //             transactionId: 'mock-' + Math.floor(Math.random() * 1000000),
            //             timestamp: new Date().toISOString(),
            //             amount: data.amount,
            //             status: 'completed'
            //         };
            //     } else {
            //         // Mock error response
            //         console.log('[Transfer API] Mock error response');

            //         // Create a mock error with response structure similar to axios error
            //         const mockError: any = new Error('Mock API Error');
            //         mockError.response = {
            //             status: 400,
            //             data: {
            //                 success: false,
            //                 code: 'INSUFFICIENT_FUNDS',
            //                 message: 'Insufficient funds in reward wallet',
            //                 details: {
            //                     required: data.amount,
            //                     available: data.amount * 0.8, // Simulate having less than required
            //                 }
            //             },
            //             headers: {
            //                 'content-type': 'application/json'
            //             }
            //         };

            //         throw mockError;
            //     }
            // }

            // Real API implementation
            const response = await resellerAxios.post(
                API_ENDPOINTS.RESELLER.TRANSFER,
                data
            );

            console.log('[Transfer API] Response received:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });

            if (response.status >= 200 && response.status < 300) {
                return response.data;
            } else {
                console.error('[Transfer API] Non-success status code:', response.status);
                throw new Error(`Transfer failed with status ${response.status}`);
            }
        } catch (error: any) {
            console.error('[Transfer API] Error transferring to current wallet:', error);

            // Log more detailed error information
            if (error.response) {
                console.error('[Transfer API] Response error details:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            } else if (error.request) {
                console.error('[Transfer API] Request error (no response received):', error.request);
            } else {
                console.error('[Transfer API] Error message:', error.message);
            }

            throw error; // Re-throw to allow proper error handling
        }
    }
};