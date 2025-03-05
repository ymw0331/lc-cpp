"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { IncentiveResponse } from "@/api/incentive/incentive.api";

// Updated props interface that accepts data from parent component
interface IncomeSummaryTableProps {
    incentiveData: IncentiveResponse;
    availableMonths: string[];
}

const IncomeSummaryTable: React.FC<IncomeSummaryTableProps> = ({
    incentiveData,
    availableMonths
}) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [month, setMonth] = useState(availableMonths[0] || "");

    // Check if user is a Level 1 agent
    const isLevelOneAgent = user?.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER;

    const { summary } = incentiveData;

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
                        availableMonths.map((monthKey) => {
                            // Format the month display (e.g., "Jan 2025" to "January 2025")
                            const [monthAbbr, year] = monthKey.split(' ');
                            const monthNames: Record<string, string> = {
                                'Jan': t('months.january'),
                                'Feb': t('months.february'),
                                'Mar': t('months.march'),
                                'Apr': t('months.april'),
                                'May': t('months.may'),
                                'Jun': t('months.june'),
                                'Jul': t('months.july'),
                                'Aug': t('months.august'),
                                'Sep': t('months.september'),
                                'Oct': t('months.october'),
                                'Nov': t('months.november'),
                                'Dec': t('months.december')
                            };
                            const fullMonthName = monthNames[monthAbbr as keyof typeof monthNames] || monthAbbr;

                            return (
                                <option key={monthKey} value={monthKey}>
                                    {fullMonthName} {year}
                                </option>
                            );
                        })
                    )}
                </select>
            </div>

            {/* Table rows */}
            <div>
                {/* All users can see Referral Fee Bonus */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incomeSummary.referralFeeBonus')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.directReferralFee.toFixed(2)}</p>
                </div>

                {/* All users can see Deposit Admin Charge Rebate */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incomeSummary.depositAdminChargeRebate')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.directTopupRebate.toFixed(2)}</p>
                </div>

                {/* Direct Recruit Referral Override Bonus - grayed out for Level 1 */}
                <div className={`flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark ${isLevelOneAgent ? 'bg-gray-2 dark:bg-graydark' : ''}`}>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        {t('incomeSummary.directRecruitReferralOverrideBonus')}
                    </p>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        $ {isLevelOneAgent ? '0.00' : summary.downstreamReferralFee.toFixed(2)}
                    </p>
                </div>

                {/* Direct Recruit's Deposit Admin Charge Rebate - grayed out for Level 1 */}
                <div className={`flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark ${isLevelOneAgent ? 'bg-gray-2 dark:bg-graydark' : ''}`}>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        {t('incomeSummary.directRecruitsDepositAdminChargeRebate')}
                    </p>
                    <p className={`font-medium ${isLevelOneAgent ? 'text-bodydark2 dark:text-bodydark' : 'text-black dark:text-white'}`}>
                        $ {isLevelOneAgent ? '0.00' : summary.downstreamTopupRebate.toFixed(2)}
                    </p>
                </div>

                {/* Performance Bonus */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incomeSummary.performanceBonus')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.performance_bonus.amount.toFixed(2)}</p>
                </div>

                {/* Milestone Achievement Bonus */}
                <div className="flex justify-between items-center px-4 py-3 border-t border-stroke dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">{t('incomeSummary.milestoneAchievementBonus')}</p>
                    <p className="font-medium text-black dark:text-white">$ {summary.milestone_bonus.amount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default IncomeSummaryTable;