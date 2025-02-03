'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';
import { useState } from 'react';

interface AssetDistributionProps {
    data: Array<{
        name: string;
        value: number;
        amount: number;
        icon: React.ReactNode;
    }>;
    title: string;
}

const AssetDistributionChart = ({ data, title }: AssetDistributionProps) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();
    const COLORS = ['#7C74FF', '#E4E2FF'];

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    opacity={0.6}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill={fill}
                />
            </g>
        );
    };

    const renderLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, value } = props;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 35;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#64748B"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-sm font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <h3 className="text-lg text-black/60 dark:text-white/60 mb-6">{title}</h3>

            <div className="flex flex-col gap-4 mb-8">
                {data.map((item, index) => (
                    <div
                        key={item.name}
                        className="flex items-center gap-2"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-[32px] font-bold text-black dark:text-white">
                            {item.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                        {item.icon}
                    </div>
                ))}
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={renderLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(undefined)}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AssetDistributionChart;