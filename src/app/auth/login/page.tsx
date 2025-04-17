'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import MembershipConfirmationDialog from "@/components/Dialogs/MembershipConfirmationDialog";
import { getCarouselImages } from "@/lib/shared";


export default function LoginPage() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
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
    const [showMembershipDialog, setShowMembershipDialog] = useState(false);

    // DEFAULT REFERRAL VALUES - Used when no parameters are provided
    const DEFAULT_REFERRAL_CODE = "44ZQW3QS";
    const DEFAULT_UPSTREAM_ID = "f73fbbc5-b17d-43ec-b67e-141f05394a7f";


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


    // Check for URL parameters and show membership dialog if needed
    useEffect(() => {
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        console.log('[Login] URL parameters:', { referralCode, upstreamId });

        // If both referral code and upstream ID are present, this is from an invite
        if (referralCode && upstreamId) {
            console.log('[Login] Detected invite parameters, showing membership dialog');
            setShowMembershipDialog(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log('[Login] Attempting login:', { email });

        try {
            const isReseller = await login(email, password);
            console.log('[Login] Login response:', { isReseller });

            // Handle different user types
            if (isReseller) {
                console.log('[Login] User is a reseller, redirecting to dashboard');

                // Handle remember me
                if (rememberMe) {
                    console.log('[Login] Saving credentials');
                    saveCredentials(email, password);
                } else {
                    console.log('[Login] Clearing saved credentials');
                    clearCredentials();
                }

                // toast({
                //     title: t("loginPage.success"),
                //     description: t("loginPage.successfullyLoggedIn"),
                //     duration: 3000,
                // });

                // Redirect to dashboard
                router.push('/');
            } else {
                console.log('[Login] User is not a reseller, showing access denied dialog');
                // User is a Lookcard user but not a reseller
                // Keep referral details in this case as they might register as reseller
                setShowAccessDeniedDialog(true);
            }

        } catch (err: any) {
            console.error('[Login] Login failed:', {
                error: err,
                response: err.response?.data,
            });

            // Check specific error conditions to determine next steps
            const errorStatus = err.response?.status;
            const errorMessage = err.response?.data?.message || err.message || t("loginPage.loginFailed");
            const errorData = err.response?.data || {};

            // Check for the specific error message "Your email id not exist in our account"
            if (
                errorData.status === false &&
                errorMessage === "Your email id not exist in our account"
            ) {
                console.log('[Login] User is not registered with Lookcard, showing registration dialog');
                setShowRegistrationDialog(true);
            } else if (errorStatus === 401 || errorStatus === 404) {
                // Invalid credentials or user not found - likely not a Lookcard user
                console.log('[Login] User is not registered with Lookcard, showing registration dialog');
                setShowRegistrationDialog(true);
            } else {
                // General error
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: t("loginPage.error"),
                    description: errorMessage,
                    duration: 5000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };


    const handleContactSupport = () => {
        console.log('[Login] Navigating to contact support page');
        // window.location.href = 'https://web.whatsapp.com/send?phone=85230011108';
        window.location.href = 'https://wa.me/85230011108';
    };

    // Handler for "NO, Register for User Account" in MembershipConfirmationDialog (no default, only from invite url)
    const handleRegisterLookcardUser = () => {
        console.log('[Login] User selected "NO" in membership dialog, redirecting to Lookcard registration');

        // Get referral code from URL
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        // Build the Lookcard invitation URL
        // const lookCardUrl = `${process.env.NEXT_PUBLIC_LOOKCARD_INVITE_DEV}/${referralCode}?upstreamId=${upstreamId}`;
        const lookCardUrl = `${process.env.NEXT_PUBLIC_LOOKCARD_INVITE_PROD}/${referralCode}?upstreamId=${upstreamId}`;
        console.log('[Login] Redirecting to:', lookCardUrl);

        // Redirect to Lookcard registration
        window.location.href = lookCardUrl;
    };

    // Handler for "YES, Proceed to Agent Onboarding" in MembershipConfirmationDialog (no default, only from invite url)
    const handleProceedToAgentOnboarding = () => {
        // console.log('[Login] TODO: Implement agent onboarding flow');
        console.log('[Login] User selected "YES" in membership dialog, redirecting to SignUpAsResellerFromInvitePage');

        // Get referral parameters to pass to the signup page
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (referralCode) queryParams.set('referralCode', referralCode);
        if (upstreamId) queryParams.set('upstreamId', upstreamId);

        // Close dialog
        setShowMembershipDialog(false);

        // Navigate to the new signup page with query parameters
        router.push(`/auth/signup-reseller?${queryParams.toString()}`);

    };


    // Handler for "Register as reseller" button in AccessDeniedDialog (if no referral code or upstream id in url, use default values)
    const handleRegister = () => {
        // Pass URL parameters to registration page
        const referralCode = searchParams.get('referralCode') || DEFAULT_REFERRAL_CODE;
        const upstreamId = searchParams.get('upstreamId') || DEFAULT_UPSTREAM_ID;

        const queryParams = new URLSearchParams();
        queryParams.set('referralCode', referralCode);
        queryParams.set('upstreamId', upstreamId);

        router.push(`/auth/register?${queryParams.toString()}`);
    };


    // Handler for "Become a Lookcard user" in NotRegisteredDialog (if no referral code in url, use default value)
    // become lookcard user only use referral code not agent, no upstream id
    const handleBecomeUser = () => {
        console.log('[Login] Navigating to become Lookcard user first');

        // Get parameter directly from URL
        const searchParams = new URLSearchParams(window.location.search);
        const referralCode = searchParams.get('referralCode') || DEFAULT_REFERRAL_CODE;

        // Direct to invite URL with the referral code
        const lookCardUrl = `https://invite.lookcard.io/${referralCode}`;
        console.log('[Login] Redirecting to:', lookCardUrl);

        window.location.href = lookCardUrl;
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
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setForgotPasswordOpen(true);
                                }}
                                className="text-sm text-body hover:text-black dark:text-bodydark dark:hover:text-white underline"
                            >
                                {t("loginPage.forgotPassword")}
                            </Link>
                        </div>

                        {/* Dialogs */}
                        <ForgotPasswordDialog
                            open={forgotPasswordOpen}
                            onOpenChange={setForgotPasswordOpen}
                        />

                        <NotRegisteredDialog
                            open={showRegistrationDialog}
                            onOpenChange={setShowRegistrationDialog}
                            onBecomeAgent={handleBecomeUser}
                        />

                        <AccessDeniedDialog
                            open={showAccessDeniedDialog}
                            onOpenChange={setShowAccessDeniedDialog}
                            onContactSupport={handleContactSupport}
                            onRegister={handleRegister}
                        />

                        <MembershipConfirmationDialog
                            open={showMembershipDialog}
                            onOpenChange={setShowMembershipDialog}
                            onRegister={handleRegisterLookcardUser}
                            onProceed={handleProceedToAgentOnboarding}
                        />

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

                        {/* Register as lookcard user link */}
                        <div className="mt-4 text-center">
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const referralCode = searchParams.get('referralCode') || DEFAULT_REFERRAL_CODE;
                                    const lookCardUrl = `https://invite.lookcard.io/${referralCode}`;
                                    console.log('[Login] Redirecting to Lookcard registration:', lookCardUrl);
                                    window.location.href = lookCardUrl;
                                }}
                                className="text-sm text-body hover:text-primary dark:text-bodydark dark:hover:text-primary underline"
                            >
                                {t("loginPage.notLookcardUser", "Not a lookcard user yet? Register here")}
                            </Link>
                        </div>

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