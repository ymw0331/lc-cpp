'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Building, Loader2, CheckCircle, XCircle, Phone } from "lucide-react";
import { resellerApi } from "@/api/reseller/reseller.api";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import Loader from "@/components/common/Loader";
import TermsAgreementDialog from "@/components/Dialogs/TermsAgreenmentDialog";
import RegistrationSuccessDialog from "@/components/Dialogs/RegistrationSuccessDialog";
import { getCarouselImages } from "@/lib/shared";
import { countries } from "@/lib/countries";

// Type definition for Country translations
type TranslationLanguage = 'zh' | 'zh-hk';

interface CountryTranslation {
    zh: string;
    "zh-hk": string;
}

interface CountriesData {
    [country: string]: CountryTranslation;
}

interface CarouselImage {
    src: string;
    alt: string;
}

interface FormData {
    email: string;
    fullName: string;
    contactNo: string;
    coreMarket: string;
    upstreamId: string;
    agreeToTerms: boolean;
}


const SignUpAsResellerFromInvitePage = () => {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // State management
    const [carouselImages, setCarouselImages] = useState(getCarouselImages(i18n.language));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [error, setError] = useState("");
    const [showTermsDialog, setShowTermsDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Form state
    const [formData, setFormData] = useState<FormData>({
        email: "",
        fullName: "N/A",
        contactNo: "N/A",
        coreMarket: "",
        upstreamId: "",
        agreeToTerms: false
    });

    // Initialize with URL parameters
    useEffect(() => {
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        console.log('[SignUp] Processing URL parameters:', { referralCode, upstreamId });

        // Since upstreamId is always expected in the URL, we can set it directly
        if (upstreamId) {
            setFormData(prev => ({
                ...prev,
                upstreamId: upstreamId
            }));
        }
    }, [searchParams]);

    // Update carousel images when language changes
    useEffect(() => {
        setCarouselImages(getCarouselImages(i18n.language));
    }, [i18n.language]);

    // Carousel Auto-rotation
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => clearInterval(timer);
    }, [carouselImages]);

    // Function to verify user email
    const verifyUserEmail = async () => {
        if (!formData.email) return;

        try {
            setIsVerifyingEmail(true);
            console.log('[SignUp] Verifying email:', formData.email);

            // Use resellerApi.verifyUser instead of authApi.verifyUser
            const response = await resellerApi.verifyUser(formData.email);
            console.log('[SignUp] Verification response:', response);

            if (response.status && response.data) {
                setIsEmailVerified(response.data.emailVerified);

                // Auto-populate fields if user is verified
                if (response.data.emailVerified) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: response.data.fullname || prev.fullName,
                        contactNo: response.data.phoneNo || prev.contactNo
                    }));

                    toast({
                        title: t("registerPage.emailVerified"),
                        description: t("registerPage.emailVerifiedSuccess"),
                        duration: 3000,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: t("registerPage.error"),
                        description: t("registerPage.emailRegistrationRequired"),
                        duration: 5000,
                    });
                }
            }
        } catch (err: any) {
            console.error('[SignUp] Email verification error:', err);
            toast({
                variant: "destructive",
                title: t("registerPage.error"),
                description: "Failed to verify email",
                duration: 5000,
            });
            setIsEmailVerified(false);
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`[SignUp] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset email verification if email changes
        if (name === 'email') {
            setIsEmailVerified(false);
        }
    };

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        console.log(`[SignUp] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to get translated country name
    const getLocalizedCountryName = (countryKey: string): string => {
        if (!countryKey) return "";

        const currentLang = i18n.language;
        if (currentLang === 'zh' || currentLang === 'zh-hk') {
            // Use the more specific type for translation lookup
            const lang = currentLang as TranslationLanguage;
            return countries[countryKey]?.[lang] || countryKey;
        }
        return countryKey;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        console.log('[SignUp] Starting registration process:', { formData });

        try {
            // Validate email verification
            if (!isEmailVerified) {
                throw new Error(t("registerPage.emailMismatch"));
            }

            // Validate required fields
            if (!formData.coreMarket) {
                throw new Error(t("registerPage.selectMarket"));
            }

            if (!formData.agreeToTerms) {
                throw new Error(t("registerPage.termsAgreement"));
            }

            // Prepare the request payload
            const requestData = {
                upstreamId: formData.upstreamId,
                keyMarket: formData.coreMarket,
                email: formData.email
            };

            console.log('[SignUp] Sending registration request with data:', requestData);

            // Call the API to register the user as a reseller
            const response = await resellerApi.registerReseller(requestData);
            console.log('[SignUp] Registration response:', response);

            // Handle successful registration
            if (response && response.status === true) {
                console.log('[SignUp] Registration successful');

                // Set success message
                setSuccessMessage(t("registerPage.successfullyRegistered"));

                // Show success toast
                toast({
                    title: t("registerPage.success"),
                    description: t("registerPage.successfullyRegistered"),
                    duration: 3000,
                });

                // Show success dialog
                setShowSuccessDialog(true);
            } else {
                // Status not true means registration failed
                console.error('[SignUp] Registration failed: Response status not true', response);
                throw new Error(t("registerPage.error"));
            }
        } catch (err: any) {
            console.error('[SignUp] Registration failed:', err);

            // Safely extract error message with fallbacks
            let errorMessage = t("registerPage.error");

            if (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
            }

            // List of system information messages that should be shown as notices rather than errors
            const systemMessages = [
                'Email not found',
                'Card not activated',
                'Reseller already exists',
                'Reseller Application request already exists',
                'Upstream not found',
                'Level 1 reseller cannot have downstream',
                'Upstream team is full',
                'Key market is required'
            ];

            // Check if the message is a system message
            const isSystemMessage = systemMessages.includes(errorMessage);

            // Special handling for "Reseller already exists" message
            if (errorMessage === 'Reseller already exists') {
                errorMessage = t("registerPage.resellerAlreadyExists");
            }

            // Set the error message state
            setError(errorMessage);

            // Show toast with appropriate styling based on message type
            toast({
                variant: isSystemMessage ? "default" : "destructive",
                title: isSystemMessage ? (t("registerPage.notice") || "Notice") : (t("registerPage.error") || "Error"),
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle success dialog done button
    const handleSuccessDone = () => {
        console.log('[SignUp] Success dialog done clicked');
        setShowSuccessDialog(false);
        // router.push('/auth/login');
    };

    // Handle redirect to Lookcard registration
    const handleRedirectToLookcard = () => {
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        // Using the referral code from URL, which should always be present
        // const lookCardUrl = `${process.env.NEXT_PUBLIC_LOOKCARD_INVITE_DEV}/${referralCode}?upstreamId=${upstreamId}`;
        const lookCardUrl = `${process.env.NEXT_PUBLIC_LOOKCARD_INVITE_PROD}/${referralCode}?upstreamId=${upstreamId}`;
        console.log('[SignUp] Redirecting to Lookcard registration:', lookCardUrl, 'upstreamId:', upstreamId);

        window.location.href = lookCardUrl;
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
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-[45%] p-8 lg:px-16 flex flex-col justify-center bg-white dark:bg-boxdark">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/images/logo/lookcard-logo.png"
                            alt="Lookcard Logo"
                            width={150}
                            height={30}
                            className="mb-8"
                        />
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
                        {t("registerPage.signUpNow")}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Address with Verification Button */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.emailAddress")}
                            </label>
                            <div className="relative mt-1 flex space-x-2">
                                <div className="flex-grow relative">
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 bg-white text-gray-800 border-gray-300 pr-10"
                                        placeholder={t("registerPage.enterEmail")}
                                        required
                                    />
                                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                </div>
                                <Button
                                    type="button"
                                    onClick={verifyUserEmail}
                                    className="mt-1 bg-primary hover:bg-primary/90 text-white"
                                    disabled={isVerifyingEmail || !formData.email}
                                >
                                    {isVerifyingEmail ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Verify"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Member Verification */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.memberVerification")}
                            </label>
                            <div className="flex mt-1 space-x-4">
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${isEmailVerified ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailVerified")}</span>
                                    <CheckCircle className={`h-5 w-5 ${isEmailVerified ? 'text-green-500' : 'text-gray-300'}`} />
                                </div>
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${!isEmailVerified ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailMismatch")}</span>
                                    <XCircle className={`h-5 w-5 ${!isEmailVerified ? 'text-red-500' : 'text-gray-300'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.fullName")}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${isEmailVerified ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterFullName")}
                                    readOnly={isEmailVerified}
                                    required
                                />
                                <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Contact No */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.contactNo")}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${isEmailVerified ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterPhoneNumber")}
                                    readOnly={isEmailVerified}
                                    required
                                />
                                <Phone className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Core Market - Dropdown */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.proposedKeyMarket")}
                            </label>
                            <div className="relative mt-1">
                                <Select
                                    value={formData.coreMarket}
                                    onValueChange={(value) => handleSelectChange("coreMarket", value)}
                                    required
                                >
                                    <SelectTrigger className="w-full bg-white text-gray-800 border-gray-300 h-10 bg-opacity-100 !fill-none !bg-clip-border">
                                        <SelectValue placeholder={t("registerPage.selectMarket")} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80 bg-white">
                                        {Object.keys(countries).map((country) => (
                                            <SelectItem key={country} value={country} className="bg-white hover:bg-gray-100">
                                                {getLocalizedCountryName(country)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Referral ID (UpstreamId) */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.referralId")}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="upstreamId"
                                    value={formData.upstreamId}
                                    className="mt-1 bg-gray-100 text-gray-800 border-gray-300 cursor-not-allowed"
                                    readOnly={true}
                                />
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="pt-4">
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked: boolean) =>
                                        setFormData(prev => ({ ...prev, agreeToTerms: checked }))
                                    }
                                    required
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    {(() => {
                                        // Use the full agreement text from translation
                                        const fullText = t("registerPage.termsAgreementFull");

                                        // Find the position of the term to highlight
                                        const termToHighlight = t("termsDialog.title") ?
                                            (i18n.language === 'en' ? "terms and conditions" :
                                                i18n.language === 'zh' ? "条款和条件" :
                                                    i18n.language === 'zh-hk' ? "條款和條件" : "terms and conditions") :
                                            "terms and conditions";

                                        const termPosition = fullText.indexOf(termToHighlight);

                                        // If term not found, render the text as-is
                                        if (termPosition === -1) {
                                            return fullText;
                                        }

                                        // Split the text into three parts: before term, term, after term
                                        const beforeTerm = fullText.substring(0, termPosition);
                                        const afterTerm = fullText.substring(termPosition + termToHighlight.length);

                                        // Return the text with the term as a clickable button
                                        return (
                                            <>
                                                {beforeTerm}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTermsDialog(true)}
                                                    className="text-primary hover:underline font-medium"
                                                >
                                                    {termToHighlight}
                                                </button>
                                                {afterTerm}
                                            </>
                                        );
                                    })()}
                                </label>
                            </div>
                        </div>

                        {/* Terms Agreement Dialog */}
                        <TermsAgreementDialog
                            open={showTermsDialog}
                            onOpenChange={setShowTermsDialog}
                        />

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success Message Display */}
                        {successMessage && (
                            <Alert variant="default" className="bg-green-50 border-green-300 text-green-800">
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        {/* Registration Success Dialog */}
                        <RegistrationSuccessDialog
                            open={showSuccessDialog}
                            onOpenChange={setShowSuccessDialog}
                            onDone={handleSuccessDone}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isLoading || !isEmailVerified || !formData.agreeToTerms}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("registerPage.processing")}
                                </>
                            ) : (
                                t("registerPage.signUp")
                            )}
                        </Button>

                        {/* Not a Lookcard User Link */}
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t("registerPage.notLookcardUser")}
                                <button
                                    type="button"
                                    onClick={handleRedirectToLookcard}
                                    className="text-primary hover:text-primary/80 underline font-medium"
                                >
                                    {t("registerPage.registerHere")}
                                </button>
                            </span>
                        </div>

                        {/* Login Link */}
                        <div className="mt-2 text-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t("registerPage.alreadyReseller")}
                                <a
                                    href="/auth/login"
                                    className="text-primary hover:text-primary/80 underline font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.push('/auth/login');
                                    }}
                                >
                                    {t("registerPage.signInHere")}
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpAsResellerFromInvitePage;