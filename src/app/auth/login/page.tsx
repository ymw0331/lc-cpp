"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useRememberCredentials } from "@/hooks/useRememberCredentials";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import ForgotPasswordDialog from "@/components/Dialogs/ForgotPasswordDialog";

const carouselImages = [
    {
        src: "/images/login/Slider-Banner-06.jpg",
        alt: "Earn Up to $80 Per Referral",
    },
    {
        src: "/images/login/Slider-Banner-07.jpg",
        alt: "Earn Rewards Effortlessly",
    },
    {
        src: "/images/login/Slider-Banner-08.jpg",
        alt: "No Passport Fret Not",
    },
    {
        src: "/images/login/Slider-Banner-09.jpg",
        alt: "Exclusive Limited Offer",
    },
];

export default function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { login } = useAuth();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const { saveCredentials, clearCredentials, getCredentials } =
        useRememberCredentials();
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    // Carousel Auto-rotation
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    // Load remembered credentials on mount
    useEffect(() => {
        const savedCredentials = getCredentials();
        if (savedCredentials) {
            setEmail(savedCredentials.email);
            setPassword(savedCredentials.password);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);

            // Handle remember me
            if (rememberMe) {
                saveCredentials(email, password);
            } else {
                clearCredentials();
            }

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

    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        if (!checked) {
            clearCredentials();
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Carousel */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden  ">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={carouselImages[currentImageIndex].src}
                            alt={carouselImages[currentImageIndex].alt}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[45%] px-8 lg:px-16 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/images/logo/lookcard-logo.png"
                            alt="Lookcard Logo"
                            width={150}
                            height={30}
                            className="mb-12"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold mb-2">
                        {t("loginPage.signInTo")}
                    </h1>
                    <h2 className="text-xl mb-8">
                        {t("loginPage.communityPartnershipProgramPortal")}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    {t("loginPage.email")}
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1"
                                        placeholder={t("loginPage.enterYourEmail")}
                                        required
                                    />
                                    <Mail className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                    {t("loginPage.password")}
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 pr-24" // Increased right padding for both icons
                                        placeholder={t("loginPage.enterYourPassword")}
                                        required
                                    />
                                    <div className="absolute right-3 top-2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                            tabIndex={-1} // Prevents tab focus on the button
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" aria-label="Hide password" />
                                            ) : (
                                                <Eye className="h-5 w-5" aria-label="Show password" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={handleRememberMeChange}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600 cursor-pointer dark:text-gray-400"
                                >
                                    {t("loginPage.rememberMe")}
                                </label>
                            </div>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setForgotPasswordOpen(true);
                                }}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                            >
                                {t("loginPage.forgotPassword")}
                            </Link>
                        </div>

                        <ForgotPasswordDialog
                            open={forgotPasswordOpen}
                            onOpenChange={setForgotPasswordOpen}
                        />

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#E31C5F] hover:bg-[#c4164f] text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("loginPage.signingIn")}...
                                </>
                            ) : (
                                t("loginPage.signIn")
                            )}
                        </Button>

                        {/* Warning Message */}
                        <div className="mt-6 text-sm text-red-500">
                            <p>
                                <b>
                                    <u>{t("loginPage.warning")}!</u>
                                </b>
                            </p>
                            <p>
                                {t("loginPage.warningDescription")}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
