"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { formatInTimeZone } from 'date-fns-tz';
import { HONG_KONG_TIMEZONE, formatDateTimeWithHK } from '@/lib/dateUtils';
import IncentiveDetailDialog from '../Dialogs/IncentiveDetailDialog';

// Define reward types enum for better type safety
export enum REWARD_TYPE {
    REFERRAL = 'REFERRAL',
    TOPUP_REBATE = 'TOPUP_REBATE',
    PERFORMANCE_BONUS = 'PERFORMANCE_BONUS',
    DOWNSTREAM_REFERRAL = 'DOWNSTREAM_REFERRAL',
    DOWNSTREAM_TOPUP_REBATE = 'DOWNSTREAM_TOPUP_REBATE',
    DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS = 'DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS',
    MILESTONE_BONUS = 'MILESTONE_BONUS',
}

interface Column {
    key: string;
    header: string;
    align: "left" | "right" | "center";
    translateKey?: string; // Optional key for translations
}


interface IncentivePayoutTableProps {
    columns: Column[];
    data: any[];
    title: string;
    currentMonth: string;
    onMonthChange: (month: string) => void;
    availableMonths: string[];
    itemsPerPage?: number;
}

const IncentivePayoutTable = ({
    columns,
    data = [],
    title,
    currentMonth,
    onMonthChange,
    availableMonths = [],
    itemsPerPage = 10,
}: IncentivePayoutTableProps) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Sort data by datetime in descending order (newest first)
    const sortedData = [...data].sort((a, b) => {
        // Check if the datetime field exists
        if (a.datetime && b.datetime) {
            const dateA = new Date(a.datetime);
            const dateB = new Date(b.datetime);
            const timeA = formatInTimeZone(dateA, HONG_KONG_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
            const timeB = formatInTimeZone(dateB, HONG_KONG_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
            return new Date(timeB).getTime() - new Date(timeA).getTime();
        }
        return 0; // Keep original order if datetime field is not available
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedData.slice(startIndex, endIndex);

    // Set initial month if not already selected
    useEffect(() => {
        if (availableMonths.length > 0 && (!currentMonth || !availableMonths.includes(currentMonth))) {
            onMonthChange(availableMonths[0]);
        }
    }, [availableMonths, currentMonth, onMonthChange]);

    // Handle month navigation
    const handlePrevMonth = () => {
        const currentIndex = availableMonths.indexOf(currentMonth);
        if (currentIndex > 0) {
            onMonthChange(availableMonths[currentIndex - 1]);
            setCurrentPage(1); // Reset to first page
        }
    };

    const handleNextMonth = () => {
        const currentIndex = availableMonths.indexOf(currentMonth);
        if (currentIndex < availableMonths.length - 1) {
            onMonthChange(availableMonths[currentIndex + 1]);
            setCurrentPage(1); // Reset to first page
        }
    };

    // Handle Excel export
    const exportToExcel = () => {
        if (!sortedData.length) return;

        // Transform data to include all details and readable labels
        const exportData = sortedData.map(item => ({
            'Incentive Type': getRewardTypeLabel(item.type),
            'From Name': item.from.name,
            'From Email': item.from.email,
            'Amount (USD)': item.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            'Date & Time': formatDateTimeWithHK(item.datetime)
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Incentive Activity");
        XLSX.writeFile(wb, `Incentive_Activity_${currentMonth}.xlsx`);
    };

    // Determine if navigation buttons should be disabled
    const currentIndex = availableMonths.indexOf(currentMonth);
    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= availableMonths.length - 1;

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
            case REWARD_TYPE.MILESTONE_BONUS:
                return t('incentiveManagementPage.milestoneAchievementBonus');
            default:
                return type;
        }
    };

    // Get translated column header text
    const getColumnHeaderText = (column: Column): string => {
        // If a translation key is provided, use it
        if (column.translateKey) {
            return t(column.translateKey);
        }

        // Otherwise, try to translate using the column key
        const translationKey = `incentivePayoutTable.columns.${column.key}`;
        const translation = t(translationKey);

        // If the translation exists and isn't the same as the key, use it
        if (translation !== translationKey) {
            return translation;
        }

        // Fall back to the provided header text
        return column.header;
    };

    return (
        <div className="w-full font-archivo">
            {/* Header */}
            <div className="flex flex-row flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">
                        {title}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                    <div className="flex items-center bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark w-full sm:w-auto justify-center sm:justify-start">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-l-lg text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                            onClick={handlePrevMonth}
                            disabled={isPrevDisabled || availableMonths.length === 0}
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <span className="px-3 sm:px-6 py-2 font-medium text-black dark:text-white text-sm sm:text-base md:text-lg min-w-[100px] sm:min-w-[120px] text-center">
                            {currentMonth || t("incentivePayoutTable.noDataAvailable")}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-r-lg text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                            onClick={handleNextMonth}
                            disabled={isNextDisabled || availableMonths.length === 0}
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </div>
                    <Button
                        onClick={exportToExcel}
                        disabled={!sortedData.length}
                        className={`bg-primary text-white font-medium gap-2 rounded-lg text-sm sm:text-base
                        ${!sortedData.length ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">{t("incentivePayoutTable.exportToExcel")}</span>
                        <span className="xs:hidden">Export</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black text-white dark:bg-meta-4">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`py-3 sm:py-4.5 px-2 sm:px-4 font-medium text-${column.align} text-xs sm:text-sm md:text-base whitespace-nowrap`}
                                    >
                                        {getColumnHeaderText(column)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-8 sm:py-16 text-center text-body dark:text-bodydark"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <p className="text-base sm:text-lg md:text-xl font-medium">
                                                {t("incentivePayoutTable.noDataAvailable")}
                                            </p>
                                            <p className="text-xs sm:text-sm md:text-base text-body dark:text-bodydark">
                                                {t("incentivePayoutTable.noRecordsToDisplay")}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={`${rowIndex % 2 === 0
                                            ? "bg-white dark:bg-boxdark"
                                            : "bg-gray-2 dark:bg-meta-4"
                                            } border-b border-stroke dark:border-strokedark hover:bg-gray-3 dark:hover:bg-boxdark-2 transition-colors`}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${rowIndex}-${column.key}`}
                                                className={`py-3 sm:py-5 px-2 sm:px-4 text-${column.align} text-xs sm:text-sm md:text-base 
                                                ${column.key === "amount"
                                                        ? "font-medium text-black dark:text-white"
                                                        : "text-body dark:text-bodydark"
                                                    } ${column.key === "type" ? "max-w-[150px] sm:max-w-none truncate" : ""}`}
                                            >
                                                {column.key === "action" ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRecord(row);
                                                            setIsDetailModalOpen(true);
                                                        }}
                                                        className="text-primary hover:text-primary/80 underline text-xs sm:text-sm md:text-base font-medium"
                                                    >
                                                        {t("incentivePayoutTable.viewDetail")}
                                                    </button>
                                                ) : column.key === "type" ? (
                                                    getRewardTypeLabel(row[column.key])
                                                ) : column.key === "amount" ? (
                                                    `$${row[column.key].toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}`
                                                ) : column.key === "datetime" ? (
                                                    formatDateTimeWithHK(row[column.key])
                                                ) : (
                                                    row[column.key]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sortedData.length > 0 && totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between py-4.5 px-4 border-t border-stroke dark:border-strokedark">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 text-xs sm:text-sm h-8 sm:h-9"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className={`${currentPage === page
                                                ? "bg-primary text-white"
                                                : "border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4"
                                                } text-xs sm:text-sm h-8 sm:h-9 w-8 sm:w-9`}
                                        >
                                            {page}
                                        </Button>
                                    )
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 text-xs sm:text-sm h-8 sm:h-9"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="text-sm text-body dark:text-bodydark">
                            {t("incentivePayoutTable.showingResults", {
                                start: startIndex + 1,
                                end: Math.min(endIndex, sortedData.length),
                                total: sortedData.length
                            })}
                        </div>
                    </div>
                )}
            </div>


            <IncentiveDetailDialog
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedRecord(null);
                }}
                data={selectedRecord}
            />
        </div>
    );
};

export default IncentivePayoutTable;