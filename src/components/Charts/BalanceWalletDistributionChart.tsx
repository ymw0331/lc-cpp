'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';
import { useState, useEffect } from 'react';

interface BalanceWalletDistributionProps {
    data: Array<{
        name: string;
        value: number;
        amount: number;
        icon: React.ReactNode;
    }>;
    title: string;
}

const BalanceWalletDistributionChart = ({ data, title }: BalanceWalletDistributionProps) => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>();
    const [chartSize, setChartSize] = useState({ outerRadius: 100, labelRadius: 35 });
    const COLORS = ['#7C74FF', '#E4E2FF'];

    // Responsive chart sizing
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) { // mobile
                setChartSize({ outerRadius: 70, labelRadius: 25 });
            } else if (width < 1024) { // tablet
                setChartSize({ outerRadius: 85, labelRadius: 30 });
            } else { // desktop
                setChartSize({ outerRadius: 100, labelRadius: 35 });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + (window.innerWidth < 640 ? 4 : 8)}
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
        const { cx, cy, midAngle, outerRadius, percent } = props;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + chartSize.labelRadius;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#64748B"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs sm:text-sm font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark h-full">
            <h3 className="text-base sm:text-lg text-black/60 dark:text-white/60 mb-4 sm:mb-6">
                {title}
            </h3>

            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                {data.map((item, index) => (
                    <div
                        key={item.name}
                        className="flex items-center gap-2"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                    >
                        <div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-xl sm:text-[32px] font-bold text-black dark:text-white">
                            {item.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-[200px] sm:h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={renderLabel}
                            outerRadius={chartSize.outerRadius}
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

export default BalanceWalletDistributionChart;