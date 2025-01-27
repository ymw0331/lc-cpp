'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { MetricCard } from "@/components/Cards/MetricCard"
import { MetricCardWithChart } from "@/components/Cards/MetricCardWithChart"
import { ComparativeBarChart } from "@/components/Charts/ComparativeBarChart"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { StatusTable } from "@/components/Tables/StatusTable"
import { metricChartData, transactionsData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { useState } from "react"


const WalletsPage = () => {

    const [timeFilter, setTimeFilter] = useState("month")

    const formatCurrency = (value: number) => {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(Math.abs(value))
        return `${value < 0 ? '- ' : '+ '}${formatted}`
    }


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Wallets" />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-4">
                    <MetricCard
                        title="Total Revenue"
                        subtitle="All Transactions"
                        value={20801541.08}
                        metrics={[
                            { value: 17829892.84, icon: 'T', color: 'green' },
                            { value: 2971648.24, icon: 'circle', color: 'blue' }
                        ]}
                        className="h-full"
                    />
                </div>

                <div className="col-span-12 md:col-span-8">
                    <MetricCardWithChart
                        title="Pending Payout"
                        subtitle="Payout to Agents / Partners"
                        value={1348453.95}
                        comparison={{
                            value: 12,
                            label: "Comparison last month Payout"
                        }}
                        chartData={metricChartData}
                        className="h-full"
                    />
                </div>
            </div>

            <div className="mt-2">
                <ComparativeBarChart
                    title="Balance & Payout"
                    data={metricChartData}
                    primaryMetric={{
                        key: "payout",
                        label: "Payout",
                        value: metricChartData[metricChartData.length - 1].payout,
                        color: "#EC4899"
                    }}
                    secondaryMetric={{
                        key: "revenue",
                        label: "Revenue",
                        value: metricChartData[metricChartData.length - 1].revenue,
                        color: "#FBCFE8"
                    }}
                    timeFilters={[
                        { label: "Custom", value: "custom" },
                        { label: "Day", value: "day" },
                        { label: "Month", value: "month" },
                        { label: "Year", value: "year" }
                    ]}
                    activeTimeFilter={timeFilter}
                    onTimeFilterChange={setTimeFilter}
                    valuePrefix="$"
                />
            </div>

            <div className="mt-2">
                <StatusTable
                    title="Transaction History"
                    columns={[
                        {
                            key: "description",
                            label: "DESCRIPTION",
                            render: (value) => (
                                <div>
                                    <div>{value}</div>
                                    <div className="text-sm text-zinc-500">{transactionsData[0].timestamp}</div>
                                </div>
                            )
                        },
                        { key: "name", label: "NAME" },
                        { key: "rank", label: "RANK" },
                        {
                            key: "status",
                            label: "STATUS",
                            render: (value) => (
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                    {
                                        "bg-yellow-100 text-yellow-700": value === "Pending",
                                        "bg-emerald-100 text-emerald-700": value === "Success",
                                        "bg-red-100 text-red-700": value === "Failed",
                                    }
                                )}>
                                    {value}
                                </span>
                            )
                        },
                        {
                            key: "amount",
                            label: "SALES VOLUME",
                            render: (value) => (
                                <span className={cn(
                                    "text-right block",
                                    value < 0 ? "text-red-600" : "text-emerald-600"
                                )}>
                                    {formatCurrency(value)}
                                </span>
                            )
                        }
                    ]}
                    data={transactionsData}
                    timeFilters={[{ label: "Month", value: "month" }]}
                    activeTimeFilter="month"
                />
            </div>
        </DefaultLayout >
    )
}

export default WalletsPage