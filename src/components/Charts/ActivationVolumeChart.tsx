"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { recruitApi } from "@/api/referral/referral.api"; // Import recruit API
import Loader from "@/components/common/Loader";

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

type TimeRange = 'Week' | 'Month' | 'Year';

const ActivationVolumeChart = () => {
    const [activeRange, setActiveRange] = useState<TimeRange>("Year");
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchRecruitData = async () => {
            try {
                setLoading(true);
                const data = await recruitApi.getRecruitData();

                // Assuming the API returns chartData with Week, Month, Year keys
                const newData = data.chartData[activeRange] || [];
                setChartData(newData);
            } catch (err) {
                console.error('Failed to fetch recruit data:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch recruit data'));
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitData();
    }, [activeRange]);

    if (loading) return <Loader />;

    if (error) {
        return (
            <Card className="w-full bg-white dark:bg-boxdark border-none">
                <CardContent className="flex items-center justify-center h-[500px]">
                    <p className="text-red-500">{error.message}</p>
                </CardContent>
            </Card>
        );
    }

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
                    {(['Week', 'Month', 'Year'] as TimeRange[]).map((range) => (
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
                                barSize={activeRange === "Year" ? 40 : (activeRange === "Month" ? 60 : 30)}
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