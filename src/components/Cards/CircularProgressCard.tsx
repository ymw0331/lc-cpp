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
    const radius = 40;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <Card className={cn(
            "bg-white dark:bg-boxdark border-none shadow-none",
            className
        )}>
            <CardContent className="p-6">
                <div className="flex flex-col mb-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-lg text-gray-500 dark:text-bodydark2">
                        {current} / {total.toLocaleString()}
                    </p>
                </div>

                <div className="relative w-32 h-32 mx-auto">
                    <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            className="text-pink-100 dark:text-pink-100/20"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                        />
                        <motion.circle
                            className="text-primary dark:text-primary/90"
                            strokeWidth="12"
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
                            transition={{
                                duration: 1.5,
                                ease: "easeOut"
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="text-3xl font-bold text-black dark:text-white"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {percentage}%
                        </motion.span>
                        <motion.span
                            className="text-base text-gray-500 dark:text-bodydark2"
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