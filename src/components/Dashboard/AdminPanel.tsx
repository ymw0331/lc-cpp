"use client";
import * as data from "@/lib/data"
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { AdminStatCard } from "../Cards/AdminStatCard";
import { MetricChart } from "../Charts/MetricChart";
import { DualLineMetricChart } from "../Charts/DualLineMetricChart";
import { RankingTable } from "../Tables/RankingTable";

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);

const AgentDashboard: React.FC = () => {
    const [salesTimeFilter, setSalesTimeFilter] = useState("Month")
    const [onboardingTimeFilter, setOnboardingTimeFilter] = useState("Month")
    const [agentTimeFilter, setAgentTimeFilter] = useState("Month")
    const [partnerTimeFilter, setPartnerTimeFilter] = useState("Month")


    return (
        <>
            <Breadcrumb pageName="Overview" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <AdminStatCard
                    title="Total Sales"
                    value="12,373"
                    description="Card Activation Fees $150"
                    metric={{ value: "107.52%", trend: "up" }}
                    todayValue="53"
                    sparklineData={data.salesSparklineData}
                    trendColor="#10B981"
                    sparklineColor="#EF4444"
                />
                <AdminStatCard
                    title="Total Revenue"
                    value="20,801,541.08"
                    description="All Transactions"
                    metric={{ value: "107.52%", trend: "up" }}
                    todayValue="53,480"
                    sparklineData={data.revenueSparklineData}
                    valuePrefix="$"
                    trendColor="#10B981"
                    sparklineColor="#EF4444"
                />
                <AdminStatCard
                    title="Total Agents"
                    value="13,402"
                    description="Level 1, Level 2"
                    metric={{ value: "107.52%", trend: "up" }}
                    todayValue="3"
                    sparklineData={data.agentsSparklineData}
                    trendColor="#10B981"
                    sparklineColor="#F97316"
                />
                <AdminStatCard
                    title="Total Partners"
                    value="2,401"
                    description="Level 3, Level 4, Level 5"
                    metric={{ value: "107.52%", trend: "up" }}
                    todayValue="0"
                    sparklineData={data.partnersSparklineData}
                    trendColor="#10B981"
                    sparklineColor="#EC4899"
                />
            </div>

            <div className="mt-2">
                <MetricChart
                    title="Sales Volume & Card Activations"
                    data={data.salesData}
                    barKey="value"
                    lineKey="activations"
                    secondaryMetric={{
                        value: "$655,950",
                        activations: "4,373"
                    }}
                    timeFilters={["Custom", "Day", "Month", "Year"]}
                    activeTimeFilter={salesTimeFilter}
                    onTimeFilterChange={setSalesTimeFilter}
                    yAxisPrefix="$"
                    barColor="#E5E7EB"
                    lineColor="#EC4899"
                />
            </div>

            <div className="mt-2">
                <DualLineMetricChart
                    title="Agents & Partners Onboarding"
                    data={data.onboardingData}
                    primaryKey="agents"
                    secondaryKey="partners"
                    metrics={{
                        primary: { label: "Total Agents", value: "6,239" },
                        secondary: { label: "Total Partners", value: "359" }
                    }}
                    timeFilters={["History", "Pay", "Month", "YTD"]}
                    activeTimeFilter="Month"
                    onTimeFilterChange={setOnboardingTimeFilter}
                    height={400}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-2">
                <RankingTable
                    title="Top 5 Agents"
                    columns={[
                        { key: "name", label: "NAME" },
                        { key: "rank", label: "RANK" },
                        {
                            key: "salesVolume",
                            label: "SALES VOLUME",
                            format: (value) => formatCurrency(value)
                        }
                    ]}
                    data={data.agentRankingData[agentTimeFilter.toLowerCase() as keyof typeof data.agentRankingData]}
                    timeFilters={["Month", "Year"]}
                    activeTimeFilter={agentTimeFilter}
                    onTimeFilterChange={setAgentTimeFilter}
                />

                <RankingTable
                    title="Top 5 Partners"
                    columns={[
                        { key: "name", label: "NAME" },
                        { key: "rank", label: "RANK" },
                        {
                            key: "salesVolume",
                            label: "SALES VOLUME",
                            format: (value) => formatCurrency(value)
                        }
                    ]}
                    data={data.partnerRankingData[partnerTimeFilter.toLowerCase() as keyof typeof data.partnerRankingData]}
                    timeFilters={["Month", "Year"]}
                    activeTimeFilter={partnerTimeFilter}
                    onTimeFilterChange={setPartnerTimeFilter}
                />
            </div>
        </>
    );
};

export default AgentDashboard;
