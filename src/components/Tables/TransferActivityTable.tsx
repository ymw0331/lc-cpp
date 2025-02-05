'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TransferActivityProps } from "@/types/account/data";
import USDCIcon from "../Icons/dashboard/USDCIcon";
import USDTIcon from "../Icons/dashboard/USDTIcon";

interface TransferActivityTableProps {
    data: TransferActivityProps[];
}

const TransferActivityTable = ({ data }: TransferActivityTableProps) => {

    return (
        <div className="rounded-sm border border-stroke bg-white px-4 sm:px-7.5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-black dark:text-white px-2">
                Transfer Activity
            </h4>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-black text-white dark:bg-meta-4">
                        <TableRow>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                TRANSACTION ID
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                TRANSFERRED AMOUNT
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                DATE TIME
                            </TableHead>
                            <TableHead className="py-3 sm:py-4.5 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap">
                                STATUS
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((transfer, index) => (
                            <TableRow
                                key={transfer.id}
                                className={index % 2 === 1 ? 'bg-gray-2 dark:bg-meta-4' : ''}
                            >
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <p className="text-xs sm:text-sm text-black dark:text-white">
                                        {transfer.id}
                                    </p>
                                </TableCell>
                                <TableCell className="py-4 sm:py-5 px-2 sm:px-4">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                                            {transfer.currency === 'USDT' ? (
                                                <USDTIcon className="w-full h-full" />
                                            ) : (
                                                <USDCIcon className="w-full h-full" />
                                            )}
                                        </div>
                                        <span className="text-xs sm:text-sm text-black dark:text-white">
                                            {transfer.amount.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
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
                                        className={`text-xs sm:text-sm font-medium ${
                                            transfer.status === 'SUCCEED'
                                                ? 'text-success'
                                                : 'text-danger'
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