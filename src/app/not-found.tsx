import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-boxdark">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}