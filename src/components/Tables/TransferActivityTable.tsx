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
}

const TransferActivityTable = (
    {
        data,
    }:
        TransferActivityTableProps
) => {
    const { t } = useTranslation();


    // If no data, show empty state
    if (data.length === 0) {
        return (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="px-3 pt-4 pb-3 text-lg font-semibold text-black dark:text-white">
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
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="px-3 pt-4 pb-3 text-lg font-semibold text-black dark:text-white">
                {t("transferActivityTable.transactionHistory")}
            </h4>

            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-black text-white dark:bg-meta-4">
                        <TableRow>
                            <TableHead className="py-3 px-3 text-xs font-medium whitespace-nowrap">
                                {t("transferActivityTable.descriptionHeader")}
                            </TableHead>
                            <TableHead className="py-3 px-3 text-xs font-medium whitespace-nowrap">
                                {t("transferActivityTable.transferredAmountHeader")}
                            </TableHead>
                            <TableHead className="py-3 px-3 text-xs font-medium whitespace-nowrap">
                                {t("transferActivityTable.dateTimeHeader")}
                            </TableHead>
                            <TableHead className="py-3 px-3 text-xs font-medium whitespace-nowrap">
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
                                <TableCell className="py-4 px-3">
                                    <p className="text-xs text-black dark:text-white">
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
                                        <span className={`text-xs ${transfer.type === 'transfer-out' ? 'text-danger' : 'text-success'} font-medium`}>
                                            {transfer.type === 'transfer-out' ? '- ' : '+ '}
                                            {Math.abs(transfer.amount).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-3">
                                    <p className="text-xs text-black dark:text-white">
                                        {transfer.dateTime}
                                    </p>
                                </TableCell>
                                <TableCell className="py-4 px-3">
                                    <span
                                        className={`text-xs font-medium ${transfer.status === "SUCCEED" ? "text-success" : "text-danger"
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