"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DepositActivity } from "@/api/dashboard/dashboard.types";
import { useTranslation } from "react-i18next";

interface DepositActivityTableProps {
    activities: DepositActivity[];
    className?: string;
}

export function DepositActivityTable({ activities, className }: DepositActivityTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const hasData = activities && activities.length > 0;
    const { t } = useTranslation();

    return (
        <Card
            className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${className || ''}`}
        >
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-2xl font-bold text-black dark:text-white font-archivo">
                    {t("depositActivityTable.incomeEarningSummaryLabel")}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-black hover:bg-black dark:bg-black dark:hover:bg-black rounded-none">
                                    <TableHead className="text-white font-bold text-base font-archivo uppercase py-4">
                                        {t("depositActivityTable.descriptionHeader")}
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-base font-archivo uppercase text-right py-4">
                                        {t("depositActivityTable.amountHeader")}
                                    </TableHead>
                                    <TableHead className="text-white font-bold text-base font-archivo uppercase text-right py-4">
                                        {t("depositActivityTable.dateTimeHeader")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hasData ? (
                                    activities.map((activity, index) => (
                                        <TableRow
                                            key={index}
                                            className={`${index % 2 === 1
                                                ? "bg-gray-2 dark:bg-meta-4"
                                                : "bg-white dark:bg-boxdark"
                                                }
                      border-b border-stroke dark:border-strokedark`}
                                        >
                                            <TableCell className="font-medium text-black dark:text-white py-4">
                                                {activity.description}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-black dark:text-white py-4">
                                                {formatCurrency(activity.amount)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-black dark:text-white py-4">
                                                {activity.dateTime}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center font-medium text-black dark:text-white py-4"
                                        >
                                            {t("depositActivityTable.noDataAvailable")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}