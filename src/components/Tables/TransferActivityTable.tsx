"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TransferActivityProps } from "@/api/transfer/transfer.types";
import USDCIcon from "../Icons/dashboard/USDCIcon";
import USDTIcon from "../Icons/dashboard/USDTIcon";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { formatInTimeZone } from 'date-fns-tz';
import { HONG_KONG_TIMEZONE, formatMonthYear } from '@/lib/dateUtils';

interface TransferActivityTableProps {
    data: TransferActivityProps[];
    itemsPerPage?: number;
}

const TransferActivityTable = ({
    data = [],
    itemsPerPage = 10,
}: TransferActivityTableProps) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [currentMonth, setCurrentMonth] = useState(formatMonthYear(new Date()));

    // Get available months from data
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        data.forEach(item => {
            const date = new Date(item.dateTime);
            months.add(formatMonthYear(date));
        });
        return Array.from(months).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
        });
    }, [data]);

    // Set initial month if not already selected
    useEffect(() => {
        if (availableMonths.length > 0 && (!currentMonth || !availableMonths.includes(currentMonth))) {
            setCurrentMonth(availableMonths[0]);
        }
    }, [availableMonths, currentMonth]);

    // Handle month navigation
    const handlePrevMonth = () => {
        const currentIndex = availableMonths.indexOf(currentMonth);
        if (currentIndex > 0) {
            setCurrentMonth(availableMonths[currentIndex - 1]);
            setCurrentPage(1); // Reset to first page
        }
    };

    const handleNextMonth = () => {
        const currentIndex = availableMonths.indexOf(currentMonth);
        if (currentIndex < availableMonths.length - 1) {
            setCurrentMonth(availableMonths[currentIndex + 1]);
            setCurrentPage(1); // Reset to first page
        }
    };

    // Sort and filter data
    const filteredData = useMemo(() => {
        return [...data]
            .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
            .filter(transfer => {
                const transferDate = new Date(transfer.dateTime);
                const transferMonth = formatMonthYear(transferDate);
                const matchesMonth = transferMonth === currentMonth;
                const matchesStatus = statusFilter === "ALL" || transfer.status === statusFilter;
                return matchesMonth && matchesStatus;
            });
    }, [data, currentMonth, statusFilter]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Determine if navigation buttons should be disabled
    const currentIndex = availableMonths.indexOf(currentMonth);
    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= availableMonths.length - 1;

    // Handle Excel export
    const exportToExcel = () => {
        if (!filteredData.length) return;
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transfer Activity");
        XLSX.writeFile(wb, `Transfer_Activity_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="px-3 pt-4 pb-3 text-lg sm:text-xl md:text-2xl font-semibold text-black dark:text-white">
                    {t("transferActivityTable.transactionHistory")}
                </h4>
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-xs sm:text-sm md:text-base text-body dark:text-bodydark">
                        {t("transferActivityTable.noDataAvailable")}
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-body dark:text-bodydark">
                        {t("transferActivityTable.noRecordsToDisplay")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* Header with Title and Export/Filter Controls */}
            <div className="flex flex-row flex-wrap justify-between items-center gap-4 mb-6 p-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">
                        {t("transferActivityTable.transactionHistory")}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                    {/* Month Navigation */}
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
                            {currentMonth || t("transferActivityTable.noDataAvailable")}
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

                    {/* Status Filter */}
                    <div className="flex items-center bg-white dark:bg-boxdark rounded-lg border border-stroke dark:border-strokedark">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-black dark:text-white"
                        >
                            <option value="ALL">{t("transferActivityTable.allStatus")}</option>
                            <option value="SUCCEED">{t("transferActivityTable.succeed")}</option>
                            <option value="FAILED">{t("transferActivityTable.failed")}</option>
                        </select>
                    </div>

                    {/* Export Button */}
                    <Button
                        onClick={exportToExcel}
                        disabled={!filteredData.length}
                        className={`bg-primary text-white font-medium gap-2 rounded-lg text-sm sm:text-base
                        ${!filteredData.length ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">{t("transferActivityTable.exportToExcel")}</span>
                        <span className="xs:hidden">Export</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-sm border border-stroke bg-white dark:bg-boxdark dark:border-strokedark shadow-default">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-black text-white dark:bg-meta-4">
                            <TableRow>
                                <TableHead className="py-3 px-3 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                                    {t("transferActivityTable.descriptionHeader")}
                                </TableHead>
                                <TableHead className="py-3 px-3 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                                    {t("transferActivityTable.transferredAmountHeader")}
                                </TableHead>
                                <TableHead className="py-3 px-3 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                                    {t("transferActivityTable.dateTimeHeader")}
                                </TableHead>
                                <TableHead className="py-3 px-3 text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
                                    {t("transferActivityTable.statusHeader")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <p className="text-xs sm:text-sm md:text-base text-body dark:text-bodydark">
                                            {t("transferActivityTable.noRecordsToDisplay")}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentData.map((transfer, index) => (
                                    <TableRow
                                        key={transfer.id}
                                        className={index % 2 === 1 ? "bg-gray-2 dark:bg-meta-4" : ""}
                                    >
                                        <TableCell className="py-4 px-3">
                                            <p className="text-xs sm:text-sm md:text-base text-black dark:text-white">
                                                {transfer.description || transfer.id}
                                            </p>
                                        </TableCell>
                                        <TableCell className="py-4 px-3">
                                            <div className="flex items-center gap-1">
                                                <div className="w-5 h-5">
                                                    {transfer.currency === "USDT" ? (
                                                        <USDTIcon className="w-full h-full" />
                                                    ) : (
                                                        <USDCIcon className="w-full h-full" />
                                                    )}
                                                </div>
                                                <span className={`text-xs sm:text-sm md:text-base ${transfer.type === 'transfer-out' ? 'text-danger' : 'text-success'} font-medium`}>
                                                    {transfer.type === 'transfer-out' ? '- ' : '+ '}
                                                    {Math.abs(transfer.amount).toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-3">
                                            <p className="text-xs sm:text-sm md:text-base text-black dark:text-white">
                                                {transfer.dateTime}
                                            </p>
                                        </TableCell>
                                        <TableCell className="py-4 px-3">
                                            <span className={`text-xs sm:text-sm md:text-base font-medium ${transfer.status === "SUCCEED" ? "text-success" : "text-danger"}`}>
                                                {transfer.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between py-4.5 px-4 border-t border-stroke dark:border-strokedark">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 text-xs sm:text-sm md:text-base"
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
                                        } text-xs sm:text-sm md:text-base`}
                                >
                                    {page}
                                </Button>
                            )
                        )}
                        <Button
                            variant="outline"
                            className="border-stroke dark:border-strokedark text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 text-xs sm:text-sm md:text-base"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-body dark:text-bodydark">
                        {t("transferActivityTable.showingResults", {
                            start: startIndex + 1,
                            end: Math.min(endIndex, filteredData.length),
                            total: filteredData.length
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransferActivityTable;