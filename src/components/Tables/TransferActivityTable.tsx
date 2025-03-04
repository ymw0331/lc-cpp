"use client";

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

interface TransferActivityTableProps {
    data: TransferActivityProps[];
    comingSoon?: boolean;
}

const TransferActivityTable = ({ data, comingSoon = false }: TransferActivityTableProps) => {
    const { t } = useTranslation();

    // If comingSoon is true, render coming soon state
    if (comingSoon) {
        return (
            <div className="rounded-sm border border-stroke bg-white px-4 sm:px-7.5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-black dark:text-white px-2">
                    {t("transferActivityTable.transactionHistory")}
                </h4>
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {t('common.comingSoon')}
                    </p>
                </div>
            </div>
        );
    }

    // If no data, show empty state
    if (data.length === 0) {
        return (
            <div className="rounded-sm border border-stroke bg-white px-4 sm:px-7.5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-black dark:text-white px-2">
                    {t("transferActivityTable.transactionHistory")}
                </h4>
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {t('transferActivityTable.noTransactionsYet')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-4 sm:px-7.5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-black dark:text-white px-2">
                {t("transferActivityTable.transactionHistory")}
            </h4>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-black text-white dark:bg-meta-4">
                        <TableRow>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                {t("transferActivityTable.descriptionHeader")}
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                {t("transferActivityTable.transferredAmountHeader")}
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                {t("transferActivityTable.dateTimeHeader")}
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                {t("transferActivityTable.statusHeader")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((transfer, index) => (
                            <TableRow
                                key={transfer.id}
                                className={index % 2 === 1 ? "bg-gray-2 dark:bg-meta-4" : ""}
                            >
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <p className="text-xs sm:text-sm text-black dark:text-white">
                                        {transfer.description || transfer.id}
                                    </p>
                                </TableCell>
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                                            {transfer.currency === "USDT" ? (
                                                <USDTIcon className="w-full h-full" />
                                            ) : (
                                                <USDCIcon className="w-full h-full" />
                                            )}
                                        </div>
                                        <span className={`text-xs sm:text-sm ${transfer.type === 'transfer-out' ? 'text-danger' : 'text-success'} font-medium`}>
                                            {transfer.type === 'transfer-out' ? '- ' : '+ '}
                                            {Math.abs(transfer.amount).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <p className="text-xs sm:text-sm text-black dark:text-white">
                                        {transfer.dateTime}
                                    </p>
                                </TableCell>
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <span
                                        className={`text-xs sm:text-sm font-medium ${transfer.status === "SUCCEED" ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        {transfer.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TransferActivityTable;