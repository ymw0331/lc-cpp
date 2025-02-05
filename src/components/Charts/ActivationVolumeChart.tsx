"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useState, useEffect } from "react";

interface DataPoint {
    label: string;
    value: number;
}

type TimeRange = 'Month' | 'Year';

interface TimeRangeData {
    [key: string]: {
        Month: DataPoint[];
        Year: DataPoint[];
    };
}

// Simplified weekly data
const activationData: TimeRangeData = {
    "2023": {
        Month: [
            { label: "Week 1", value: 1250 },
            { label: "Week 2", value: 2100 },
            { label: "Week 3", value: 1800 },
            { label: "Week 4", value: 2400 },
        ],
        Year: [
            { label: "Jan", value: 150 },
            { label: "Feb", value: 450 },
            { label: "Mar", value: 380 },
            { label: "Apr", value: 560 },
            { label: "May", value: 270 },
            { label: "Jun", value: 490 },
            { label: "Jul", value: 120 },
            { label: "Aug", value: 590 },
            { label: "Sep", value: 310 },
            { label: "Oct", value: 430 },
            { label: "Nov", value: 580 },
            { label: "Dec", value: 530 },
        ],
    }
};

const CustomBarLabel = ({ x, y, width, value }: any) => (
    <text
        x={x + width / 2}
        y={y - 8}
        fill="#94A3B8"
        textAnchor="middle"
        fontSize={12}
        fontFamily="Inter"
    >
        {value.toLocaleString()}
    </text>
);

const ActivationVolumeChart = () => {
    const [activeYear] = useState<string>("2023");
    const [activeRange, setActiveRange] = useState<TimeRange>("Year");
    const [chartData, setChartData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const newData = activationData[activeYear][activeRange] || [];
        setChartData(newData);
    }, [activeYear, activeRange]);

    const totalVolume = chartData.reduce((sum, item) => sum + item.value, 0);

    const CustomBar = (props: any) => {
        const { x, y, width, height } = props;
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#60A5FA"
                rx={4}
                ry={4}
            />
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.[0]) {
            return (
                <div className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg shadow-lg p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payload[0].payload.label}
                    </p>
                    <p className="font-medium text-black dark:text-white">
                        {payload[0].value.toLocaleString()} activations
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full bg-white dark:bg-boxdark border-none">
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
                <div>
                    <CardTitle className="text-2xl font-bold text-black dark:text-white">
                        Card Activation Volume
                    </CardTitle>
                    <p className="text-[44px] leading-[55px] font-bold text-black dark:text-white mt-2">
                        {totalVolume.toLocaleString()}
                    </p>
                </div>

                <div className="flex space-x-2 bg-gray-100 dark:bg-meta-4 p-1 rounded-full">
                    {(['Month', 'Year'] as TimeRange[]).map((range) => (
                        <Button
                            key={range}
                            variant={activeRange === range ? "default" : "ghost"}
                            onClick={() => setActiveRange(range)}
                            className={`
                                rounded-full px-6 transition-all duration-200
                                ${activeRange === range 
                                    ? "bg-primary text-white hover:bg-primary/90" 
                                    : "text-black dark:text-white hover:bg-meta-4/50"
                                }
                            `}
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 30, right: 10, left: 0, bottom: 20 }}
                            className="text-black dark:text-white"
                        >
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                interval={0}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                width={80}
                                tickFormatter={(value) => value.toLocaleString()}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                            />
                            <Bar
                                dataKey="value"
                                barSize={activeRange === "Year" ? 40 : 60}
                                shape={<CustomBar />}
                                isAnimationActive={false}
                                label={<CustomBarLabel />}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivationVolumeChart;