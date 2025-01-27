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
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Transfer Activity
            </h4>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-black text-white dark:bg-meta-4">
                        <TableRow>
                            <TableHead className="py-4.5 px-4 font-medium">
                                TRANSACTION ID
                            </TableHead>
                            <TableHead className="py-4.5 px-4 font-medium">
                                TRANSFERRED AMOUNT
                            </TableHead>
                            <TableHead className="py-4.5 px-4 font-medium">
                                DATE TIME
                            </TableHead>
                            <TableHead className="py-4.5 px-4 font-medium">
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
                                <TableCell className="py-5 px-4">
                                    <p className="text-black dark:text-white">{transfer.id}</p>
                                </TableCell>
                                <TableCell className="py-5 px-4">
                                    <div className="flex items-center gap-2">
                                        {transfer.currency === 'USDT' ? (
                                            <USDTIcon className="w-6 h-6" />
                                        ) : (
                                            <USDCIcon className="w-6 h-6" />
                                        )}
                                        <span className="text-black dark:text-white">
                                            {transfer.amount.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-5 px-4">
                                    <p className="text-black dark:text-white">{transfer.dateTime}</p>
                                </TableCell>
                                <TableCell className="py-5 px-4">
                                    <span
                                        className={`font-medium ${transfer.status === 'SUCCEED'
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