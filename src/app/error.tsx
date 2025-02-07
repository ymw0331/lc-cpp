'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-boxdark">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                    Something went wrong!
                </h2>
                <p className="text-red-500 dark:text-red-400 mb-6">
                    {error.message}
                </p>
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}