import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface ErrorDisplayProps {
    errorMessage?: string;
    onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const handleRetry = async () => {
        setIsLoading(true);
        if (onRetry) {
            await onRetry();
        } else {
            window.location.reload();
        }
        setIsLoading(false);
    };

    // Hexagon points for the background pattern
    const hexagonPoints = "M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] p-6 relative overflow-hidden dark:"
        >
            {/* Modern gradient background */}
            {/* <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                }}
                style={{
                    backgroundSize: "400% 400%",
                }}
            /> */}

            {/* Decorative hexagon grid */}
            <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.svg
                        key={i}
                        className="absolute"
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 20 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <path
                            d={hexagonPoints}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </motion.svg>
                ))}
            </div>

            {/* Main content container */}
            <div className="relative z-10 bg-white dark:bg-boxdark-2 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                {/* Modern connection visualization */}
                <div className="relative w-32 h-32 mb-6 mx-auto">
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {/* Modern connection lines */}
                        {Array.from({ length: 6 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border-2 border-primary/30 rounded-full"
                                style={{
                                    transform: `rotate(${i * 30}deg)`,
                                }}
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.5,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Central connecting dots */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="flex gap-2"
                            animate={{
                                scale: [1, 0.9, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        >
                            {Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 bg-primary rounded-full"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.3,
                                        repeat: Infinity,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center"
                >
                    {t('common.errorTitle')}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md"
                >
                    {errorMessage || t('common.errorDescription')}
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="w-full relative px-6 py-3 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                            />
                            {t('common.loading')}
                        </div>
                    ) : (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            {t('common.retry')}
                        </motion.span>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ErrorDisplay; 