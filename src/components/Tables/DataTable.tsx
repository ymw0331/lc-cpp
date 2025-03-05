"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

// Define reward types enum for better type safety
export enum REWARD_TYPE {
    REFERRAL = 'REFERRAL',
    TOPUP_REBATE = 'TOPUP_REBATE',
    PERFORMANCE_BONUS = 'PERFORMANCE_BONUS',
    DOWNSTREAM_REFERRAL = 'DOWNSTREAM_REFERRAL',
    DOWNSTREAM_TOPUP_REBATE = 'DOWNSTREAM_TOPUP_REBATE',
    DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS = 'DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS'
}

interface Column {
    key: string;
    header: string;
    align: "left" | "right" | "center";
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    title: string;
    currentMonth: string;
    onMonthChange: (month: string) => void;
    availableMonths: string[];
    itemsPerPage?: number;
}

const DataTable = ({
    columns,
    data = [],
    title,
    currentMonth,
    onMonthChange,
    availableMonths = [],
    itemsPerPage = 10,
}: DataTableProps) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

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
        if (!data.length) return;
        const ws = XLSX.utils.json_to_sheet(data);
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
            default:
                return type;
        }
    };

    return (
        <div className="w-full font-archivo">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-title-sm font-bold text-black dark:text-white">
                        {title}
                    </h2>
                    <div className="flex items-center bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-l-lg text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                            onClick={handlePrevMonth}
                            disabled={isPrevDisabled || availableMonths.length === 0}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="px-6 py-2 font-medium text-black dark:text-white min-w-[120px] text-center">
                            {currentMonth || t("dataTable.noDataAvailable")}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-r-lg text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                            onClick={handleNextMonth}
                            disabled={isNextDisabled || availableMonths.length === 0}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <Button
                    onClick={exportToExcel}
                    disabled={!data.length}
                    className={`bg-primary text-white font-medium gap-2 rounded-lg ${!data.length ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                        }`}
                >
                    <Download className="w-5 h-5" />
                    {t("dataTable.exportToExcel")}
                </Button>
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
                                        className={`py-4.5 px-4 font-medium text-${column.align}`}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="py-16 text-center text-body dark:text-bodydark"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <p className="text-lg font-medium">
                                                {t("dataTable.noDataAvailable")}
                                            </p>
                                            <p className="text-sm text-body dark:text-bodydark">
                                                {t("dataTable.noRecordsToDisplay")}
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
                                                className={`py-5 px-4 text-${column.align} ${column.key === "amount"
                                                    ? "font-medium text-black dark:text-white"
                                                    : "text-body dark:text-bodydark"
                                                    }`}
                                            >
                                                {column.key === "type"
                                                    ? getRewardTypeLabel(row[column.key])
                                                    : column.key === "amount"
                                                        ? `$${row[column.key].toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}`
                                                        : column.key === "datetime"
                                                            ? new Date(row[column.key]).toLocaleString()
                                                            : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Only show if there's data */}
                {data.length > 0 && totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between py-4.5 px-4 border-t border-stroke dark:border-strokedark">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className={`${currentPage === page
                                            ? "bg-primary text-white"
                                            : "border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4"
                                            }`}
                                    >
                                        {page}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="outline"
                                className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTable;