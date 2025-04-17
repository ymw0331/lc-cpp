"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { IncentiveData } from "@/api/incentive/incentive.types";
import { formatInTimeZone } from 'date-fns-tz';
import { HONG_KONG_TIMEZONE, formatDateTimeWithHK } from '@/lib/dateUtils';

// Define reward types enum for better type safety
export enum REWARD_TYPE {
    REFERRAL = 'REFERRAL',
    TOPUP_REBATE = 'TOPUP_REBATE',
    PERFORMANCE_BONUS = 'PERFORMANCE_BONUS',
    DOWNSTREAM_REFERRAL = 'DOWNSTREAM_REFERRAL',
    DOWNSTREAM_TOPUP_REBATE = 'DOWNSTREAM_TOPUP_REBATE',
    DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS = 'DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS'
}

// Interface for an individual activity item
interface ActivityItem {
    type: string;
    amount: number;
    datetime: string;
}

// Interface for grouped activity by type
interface GroupedActivity {
    type: string;
    totalAmount: number;
    latestDatetime: string;
}

// Updated props interface that accepts data from parent component
interface IncomeSummaryTableProps {
    incentiveData: IncentiveData;
    availableMonths: string[];
}

const IncomeSummaryTable: React.FC<IncomeSummaryTableProps> = ({
    incentiveData,
    availableMonths
}) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [month, setMonth] = useState(availableMonths[0] || "");
    const [groupedActivities, setGroupedActivities] = useState<GroupedActivity[]>([]);

    // Check if user is a Level 1 agent
    const isLevelOneAgent = user?.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER;

    const { summary, activities } = incentiveData;

    // Helper function to get the sum of amounts for a specific reward type in the current month
    const getRewardAmountForMonth = (rewardType: REWARD_TYPE): number => {
        if (!month || !activities.activities[month]) {
            return 0;
        }

        return activities.activities[month]
            .filter(activity => activity.type === rewardType)
            .reduce((sum, activity) => sum + activity.amount, 0);
    };

    // Group activities by type and calculate total amount for each type
    useEffect(() => {
        if (month && activities.activities[month]) {
            const monthActivities = activities.activities[month];

            // Group activities by type
            const typeGroups: Record<string, ActivityItem[]> = {};

            monthActivities.forEach(activity => {
                if (!typeGroups[activity.type]) {
                    typeGroups[activity.type] = [];
                }
                typeGroups[activity.type].push(activity);
            });

            // Create an array of grouped activities
            const grouped = Object.entries(typeGroups).map(([type, items]) => {
                // Calculate total amount for this type
                const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

                // Get the latest datetime for this type
                const sortedItems = [...items].sort((a, b) =>
                    new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
                );

                return {
                    type,
                    totalAmount,
                    latestDatetime: sortedItems[0].datetime
                };
            });

            setGroupedActivities(grouped);
        } else {
            setGroupedActivities([]);
        }
    }, [month, activities]);

    // Format date for display
    const formatDateTime = (dateString: string): string => {
        return formatDateTimeWithHK(dateString);
    };

    // Format date for the monthly rewards section
    const formatDateOnly = (dateString: string): string => {
        return formatDateTimeWithHK(dateString);
    };

    // Translate reward types to user-friendly labels
    const getRewardTypeLabel = (type: string): string => {
        switch (type) {
            case REWARD_TYPE.REFERRAL:
                return t('incentiveManagementPage.referralFeeBonus');
            case REWARD_TYPE.TOPUP_REBATE:
                return t('incentiveManagementPage.depositAdminChargeRebate');
            case REWARD_TYPE.DOWNSTREAM_REFERRAL:
                return t('incentiveManagementPage.directRecruitReferralFeeOverrideBonus');
            case REWARD_TYPE.DOWNSTREAM_TOPUP_REBATE:
                return t('incentiveManagementPage.directRecruitDepositAdminChargeOverridingRebate');
            case REWARD_TYPE.PERFORMANCE_BONUS:
                return t('incentiveManagementPage.performanceBonus');
            case REWARD_TYPE.DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS:
                return t('incentiveManagementPage.directRecruitLevelAdvancementBonus');
            default:
                return type;
        }
    };

    const formatMonthDisplay = (monthKey: string) => {
        const [monthAbbr, year] = monthKey.split(' ');
        const date = new Date(`${monthAbbr} 1, ${year}`);
        return formatInTimeZone(date, HONG_KONG_TIMEZONE, 'MMMM yyyy');
    };

    return (
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-card dark:shadow-none w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-stroke dark:border-strokedark">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-black dark:text-white">{t('incomeSummary.title')}</h2>
                    <div className="bg-primary p-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-black-2 dark:bg-black text-white px-4 py-2 rounded">
                    <p className="text-xs">{t('incomeSummary.totalEarning')}:</p>
                    <p className="text-lg font-bold">$ {summary.total_incentive.toFixed(2)}</p>
                </div>
            </div>

            {/* Month selector */}
            <div className="px-4 py-3">
                <select
                    className="text-sm text-body dark:text-bodydark border border-stroke dark:border-strokedark rounded px-3 py-2 w-full md:w-44 focus:border-primary focus:ring-0 bg-gray-2 dark:bg-form-input"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    disabled={availableMonths.length === 0}
                >
                    {availableMonths.length === 0 ? (
                        <option value="">{t('incomeSummary.noDataAvailable')}</option>
                    ) : (
                        availableMonths.map((monthKey) => (
                            <option key={monthKey} value={monthKey}>
                                {formatMonthDisplay(monthKey)}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* Monthly Rewards section */}
            {month && (
                <div className="px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white mb-2">{t('incomeSummary.monthlyDetails')}</h3>

                    {groupedActivities.length > 0 ? (
                        <div className="space-y-2">
                            {groupedActivities.map((activity, index) => (
                                <div key={index} className="flex justify-between items-center px-4 py-2 bg-gray-2 dark:bg-meta-4 rounded">
                                    <div>
                                        <p className="font-medium text-black dark:text-white">{getRewardTypeLabel(activity.type)}</p>
                                        <p className="text-xs text-bodydark">{formatDateOnly(activity.latestDatetime)}</p>
                                    </div>
                                    <p className="font-medium text-black dark:text-white">$ {activity.totalAmount.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-bodydark italic">{t('incomeSummary.noActivitiesForMonth')}</p>
                    )}
                </div>
            )}

            {/* Table rows - Summary Section */}
            <div className="mt-3 border-t border-stroke dark:border-strokedark pt-3">
                <h3 className="px-4 font-medium text-black dark:text-white mb-2">{t('incentiveManagementPage.totalIncentiveEarnedToDate')}</h3>

                {/* All users can see Referral Fee Bonus */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incentiveManagementPage.referralFeeBonus')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.directReferralFee.toFixed(2)}</p>
                </div>

                {/* All users can see Deposit Admin Charge Rebate */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incentiveManagementPage.depositAdminChargeRebate')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.directTopupRebate.toFixed(2)}</p>
                </div>

                {/* Direct Recruit Referral Override Bonus - grayed out for Level 1 */}
                <div className={`flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark ${isLevelOneAgent ? 'bg-gray-2 dark:bg-graydark' : ''}`}>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        {t('incentiveManagementPage.directRecruitReferralFeeOverrideBonus')}
                    </p>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        $ {isLevelOneAgent ? '0.00' : summary.downstreamReferralFee.toFixed(2)}
                    </p>
                </div>

                {/* Direct Recruit's Deposit Admin Charge Rebate - grayed out for Level 1 */}
                <div className={`flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark ${isLevelOneAgent ? 'bg-gray-2 dark:bg-graydark' : ''}`}>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        {t('incentiveManagementPage.directRecruitDepositAdminChargeOverridingRebate')}
                    </p>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        $ {isLevelOneAgent ? '0.00' : summary.downstreamTopupRebate.toFixed(2)}
                    </p>
                </div>

                {/* Performance Bonus */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incentiveManagementPage.performanceBonus')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.performance_bonus.amount.toFixed(2)}</p>
                </div>

                {/* Milestone Achievement Bonus - Only shown for Level 1 agents */}
                {isLevelOneAgent && (
                    <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">{t('incomeSummary.milestoneAchievementBonus')}</p>
                        <p className="font-medium text-black dark:text-white">$ {summary.milestoneAchievement.milestone_bonus.toFixed(2)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomeSummaryTable;