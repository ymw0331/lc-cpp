'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useRememberCredentials } from "@/hooks/useRememberCredentials";
import { AlertCircle, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordDialog from "@/components/Dialogs/ForgotPasswordDialog";
import NotRegisteredDialog from "@/components/Dialogs/NotRegisteredDialog";
import AccessDeniedDialog from "@/components/Dialogs/AccessDeniedDialog";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";


const getCarouselImages = (language: string) => {
    switch (language) {
        case 'zh':
            return [
                {
                    src: "/images/login/zh-simplified/slider-01.jpg",
                    alt: "每次推荐最高可赚取80美元",
                },
                {
                    src: "/images/login/zh-simplified/slider-02.jpg",
                    alt: "轻松赚取奖励",
                },
                {
                    src: "/images/login/zh-simplified/slider-03.jpg",
                    alt: "无需护照",
                },
                {
                    src: "/images/login/zh-simplified/slider-04.jpg",
                    alt: "独家限时优惠",
                },
                {
                    src: "/images/login/zh-simplified/slider-05.jpg",
                    alt: "独家限时优惠",
                },
            ];
        case 'zh-hk':
            return [
                {
                    src: "/images/login/zh-traditional/slider-01.jpg",
                    alt: "每次推薦最高可賺取80美元",
                },
                {
                    src: "/images/login/zh-traditional/slider-02.jpg",
                    alt: "輕鬆賺取獎勵",
                },
                {
                    src: "/images/login/zh-traditional/slider-03.jpg",
                    alt: "無需護照",
                },
                {
                    src: "/images/login/zh-traditional/slider-04.jpg",
                    alt: "獨家限時優惠",
                },
                {
                    src: "/images/login/zh-traditional/slider-05.jpg",
                    alt: "獨家限時優惠",
                },
            ];
        default: // 'en'
            return [
                {
                    src: "/images/login/en/slider-01.jpg",
                    alt: "Earn Up to $80 Per Referral",
                },
                {
                    src: "/images/login/en/slider-02.jpg",
                    alt: "Earn Rewards Effortlessly",
                },
                {
                    src: "/images/login/en/slider-03.jpg",
                    alt: "No Passport Fret Not",
                },
                {
                    src: "/images/login/en/slider-04.jpg",
                    alt: "Exclusive Limited Offer",
                },
                {
                    src: "/images/login/en/slider-05.jpg",
                    alt: "Exclusive Limited Offer",
                },
            ];
    }
};


export default function LoginPage() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();
    const { saveCredentials, clearCredentials, getCredentials } = useRememberCredentials();

    // State management
    const [carouselImages, setCarouselImages] = useState(getCarouselImages(i18n.language));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
    const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);


    // Update carousel images when language changes
    useEffect(() => {
        setCarouselImages(getCarouselImages(i18n.language));
        // setCurrentImageIndex(0);
    }, [i18n.language]);

    // Carousel Auto-rotation
    useEffect(() => {
        // console.log('[Login] Setting up carousel rotation');
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => {
            // console.log('[Login] Cleaning up carousel timer');
            clearInterval(timer);
        };
    }, [carouselImages]);

    // Load remembered credentials on mount
    useEffect(() => {
        console.log('[Login] Checking for saved credentials');
        const savedCredentials = getCredentials();
        if (savedCredentials) {
            console.log('[Login] Found saved credentials, pre-filling form');
            setEmail(savedCredentials.email);
            setPassword(savedCredentials.password);
            setRememberMe(true);
        }
    }, [getCredentials]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log('[Login] Attempting login:', { email });

        try {
            const isReseller = await login(email, password);
            console.log('[Login] Login response:', { isReseller });

            if (!isReseller) {
                console.log('[Login] User is not a reseller, showing registration dialog');
                setShowRegistrationDialog(true);
                // setShowAccessDeniedDialog(true);
                return;
            }

            // Handle remember me
            if (rememberMe) {
                console.log('[Login] Saving credentials');
                saveCredentials(email, password);
            } else {
                console.log('[Login] Clearing saved credentials');
                clearCredentials();
            }

            console.log('[Login] Login successful, showing success toast');
            toast({
                title: t("loginPage.success"),
                description: t("loginPage.successfullyLoggedIn"),
                duration: 3000,
            });

            // Login successful and user is a reseller, redirect to dashboard
            console.log('[Login] Redirecting to dashboard');
            router.push('/');

        } catch (err: any) {
            console.error('[Login] Login failed:', {
                error: err,
                response: err.response?.data,
            });

            const errorMessage = err.response?.data?.message || err.message || t("loginPage.loginFailed");
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


    const handleContactSupport = () => {
        console.log('[Login] Navigating to contact support page');
        // window.location.href = 'https://web.whatsapp.com/send?phone=85230011108';
        window.location.href = 'https://wa.me/85230011108';
    };

    const handleRegister = () => {
        console.log('[Login] Navigating to registration page');
        window.location.href = 'https://lookcard.io/cpprogram/#cppform';
    };

    const handleBecomeAgent = () => {
        console.log('[Login] Navigating to registration page');
        window.location.href = 'https://lookcard.io/cpprogram/#cppform';
    };

    const handleRememberMeChange = (checked: boolean) => {
        console.log('[Login] Remember me changed:', { checked });
        setRememberMe(checked);
        if (!checked) {
            console.log('[Login] Clearing saved credentials');
            clearCredentials();
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-boxdark">
            {/* Language Switcher - Absolute positioned in top right */}
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>

            {/* Left Side - Carousel */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
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
                            sizes="(max-width: 768px) 100vw, 50vw"
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
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                ? "bg-white w-4"
                                : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[45%] px-8 lg:px-16 flex flex-col justify-center bg-white dark:bg-boxdark">
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

                    <h1 className="text-2xl font-semibold mb-2 text-black dark:text-white">
                        {t("loginPage.signInTo")}
                    </h1>
                    <h2 className="text-xl mb-8 text-body dark:text-bodydark">
                        {t("loginPage.communityPartnershipProgramPortal")}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label className="text-sm text-body dark:text-bodydark">
                                    {t("loginPage.email")}
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 bg-white dark:bg-form-input text-black dark:text-white border-stroke dark:border-form-strokedark"
                                        placeholder={t("loginPage.enterYourEmail")}
                                        required
                                    />
                                    <Mail className="absolute right-3 top-2 h-5 w-5 text-body dark:text-bodydark" />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="text-sm text-body dark:text-bodydark">
                                    {t("loginPage.password")}
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 pr-24 bg-white dark:bg-form-input text-black dark:text-white border-stroke dark:border-form-strokedark"
                                        placeholder={t("loginPage.enterYourPassword")}
                                        required
                                    />
                                    <div className="absolute right-3 top-2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-body hover:text-black dark:text-bodydark dark:hover:text-white transition-colors focus:outline-none"
                                            tabIndex={-1}
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

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={handleRememberMeChange}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-body dark:text-bodydark cursor-pointer"
                                >
                                    {t("loginPage.rememberMe")}
                                </label>
                            </div>
                            {/* <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setForgotPasswordOpen(true);
                                }}
                                className="text-sm text-body hover:text-black dark:text-bodydark dark:hover:text-white underline"
                            >
                                {t("loginPage.forgotPassword")}
                            </Link> */}
                        </div>

                        {/* Dialogs */}
                        {/* <ForgotPasswordDialog
                            open={forgotPasswordOpen}
                            onOpenChange={setForgotPasswordOpen}
                        /> */}

                        <NotRegisteredDialog
                            open={showRegistrationDialog}
                            onOpenChange={setShowRegistrationDialog}
                            onBecomeAgent={handleBecomeAgent}
                        />

                        {/* <AccessDeniedDialog
                            open={showAccessDeniedDialog}
                            onOpenChange={setShowAccessDeniedDialog}
                            onContactSupport={handleContactSupport}
                            onRegister={handleRegister}
                        /> */}

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
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
                        {/* <div className="mt-6 text-sm text-red-500">
                            <p>
                                <b>
                                    <u>{t("loginPage.warning")}!</u>
                                </b>
                            </p>
                            <p>
                                {t("loginPage.warningDescription1")}
                                <b>{t("loginPage.warningDescription2")}</b>
                                {t("loginPage.warningDescription3")}
                            </p>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    );
}