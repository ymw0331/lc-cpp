"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

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
    itemsPerPage?: number;
}

const DataTable = ({
    columns,
    data = [],
    title,
    currentMonth,
    onMonthChange,
    itemsPerPage = 10,
}: DataTableProps) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [months, setMonths] = useState<string[]>([]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Initialize months on component mount
    useEffect(() => {
        const today = new Date();
        const monthsList = Array.from({ length: 3 }, (_, i) => {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            return format(date, "MMM yyyy");
        });
        setMonths(monthsList);
        const index = monthsList.indexOf(currentMonth);
        setCurrentMonthIndex(index !== -1 ? index : 0);
    }, [currentMonth]);

    // Handle month navigation
    const handleMonthChange = (direction: "prev" | "next") => {
        const newIndex =
            direction === "prev" ? currentMonthIndex + 1 : currentMonthIndex - 1;

        if (newIndex >= 0 && newIndex < months.length) {
            setCurrentMonthIndex(newIndex);
            onMonthChange(months[newIndex]);
            setCurrentPage(1); // Reset to first page when month changes
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
                            onClick={() => handleMonthChange("prev")}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="px-6 py-2 font-medium text-black dark:text-white min-w-[120px] text-center">
                            {currentMonth}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-r-lg text-body dark:text-bodydark hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                            onClick={() => handleMonthChange("next")}
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
                    Export to Excel
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
                                                {column.key === "amount"
                                                    ? `$${row[column.key].toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}`
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
                {data.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between py-4.5 px-4 border-t border-stroke dark:border-strokedark">
                        {/* <p className="mb-4 sm:mb-0 text-body dark:text-bodydark">
                            {t("dataTable.showingResults", {
                                start: startIndex + 1,
                                end: Math.min(endIndex, data.length),
                                total: data.length,
                            })}
                        </p> */}
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
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
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
