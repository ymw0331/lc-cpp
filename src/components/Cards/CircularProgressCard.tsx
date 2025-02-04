"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CircularProgressCardProps {
    title: string;
    current: number;
    total: number;
    label: string;
    className?: string;
}

const CircularProgressCard = ({
    title,
    current,
    total,
    label,
    className
}: CircularProgressCardProps) => {
    const percentage = Math.round((current / total) * 100);
    const radius = 45;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Card className={cn(
            "bg-white dark:bg-boxdark shadow-sm h-full",
            className
        )}>
            <CardContent className="p-6">
                <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        {title}
                    </h3>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                        {current}/{total.toLocaleString()}
                    </p>
                </div>

                <div className="relative w-32 h-32 mx-auto">
                    <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            className="text-pink-100 dark:text-pink-900/20"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                        />
                        <motion.circle
                            className="text-pink-600 dark:text-pink-500"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-3xl font-semibold text-black dark:text-white"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {percentage}%
                        </motion.span>
                        <motion.span
                            className="text-sm text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            {label}
                        </motion.span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CircularProgressCard;