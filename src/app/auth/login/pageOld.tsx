"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LockKeyhole, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

const TEST_CREDENTIALS = {
    email: "alex.wong+knan@one2.cloud",
    password: "Test1234@",
};

export default function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState(TEST_CREDENTIALS.email);
    const [password, setPassword] = useState(TEST_CREDENTIALS.password);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[Login] Login attempt started");
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            console.log("[Login] Login successful");
            toast({
                title: t("loginPage.success"),
                description: t("loginPage.successfullyLoggedIn"),
                duration: 3000,
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || t("loginPage.loginFailed");
            console.error("[Login] Login failed:", { error: errorMessage });
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: t("loginPage.error"),
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-boxdark">
            <div className="w-full max-w-6xl mx-auto bg-white dark:bg-boxdark-2 rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-wrap items-center">
                    {/* Left side - Logo and welcome message */}
                    <div className="hidden w-full xl:block xl:w-1/2">
                        <div className="p-12 text-center">
                            <Link className="inline-block mb-8" href="/">
                                <Image
                                    src="/images/logo/lookcard-logo.png"
                                    alt="Lookcard Logo"
                                    width={176}
                                    height={32}
                                    priority
                                />
                            </Link>

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t("loginPage.welcomeToLookcard")}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t("loginPage.pleaseSignIn")}
                            </p>
                        </div>
                    </div>

                    {/* Right side - Login form */}
                    <div className="w-full xl:w-1/2 border-l border-gray-200 dark:border-gray-700">
                        <div className="w-full p-8 sm:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {t("loginPage.signInToAgentDashboard")}
                            </h2>

                            {error && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t("loginPage.email")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t("loginPage.enterYourEmail")}
                                            className="pl-4 pr-10 py-2"
                                            disabled={isLoading}
                                            required
                                        />
                                        <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t("loginPage.password")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t("loginPage.enterYourPassword")}
                                            className="pl-4 pr-10 py-2"
                                            disabled={isLoading}
                                            required
                                        />
                                        <LockKeyhole className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("loginPage.signingIn")}...
                                        </>
                                    ) : (
                                        t("loginPage.signIn")
                                    )}
                                </Button>

                                {/* Test Credentials Info */}
                                {/* <div className="text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("loginPage.testCredentials")}: {TEST_CREDENTIALS.email}
                                    </p>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
