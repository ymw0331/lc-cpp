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
import { useAuth, EnhancedAuthUser } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";
import RegistrationSuccessDialog from "@/components/Dialogs/RegistrationSuccessDialog";
import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import Loader from "@/components/common/Loader";
import TermsAgreementDialog from "@/components/Dialogs/TermsAgreenmentDialog";
import { getCarouselImages } from "@/lib/shared";
import { countries } from "@/lib/countries";


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

interface UserInfo {
    userId?: number;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    country_code?: number;
}

interface FormData {
    referralId: string;
    fullName: string;
    email: string;
    contactNo: string;
    coreMarket: string;
    agreeToTerms: boolean;
}



export default function RegisterPage() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { user, refreshUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [carouselImages, setCarouselImages] = useState(getCarouselImages(i18n.language));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | EnhancedAuthUser | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showTermsDialog, setShowTermsDialog] = useState(false);

    // DEFAULT REFERRAL VALUES - Used when no parameters are provided
    const DEFAULT_UPSTREAM_ID = "f73fbbc5-b17d-43ec-b67e-141f05394a7f";


    // Track which fields were prefilled from login data
    const [prefilledFields, setPrefilledFields] = useState({
        email: true, // Email is always prefilled and readonly
        fullName: false,
        contactNo: false,
        referralId: false
    });

    // Update the form state initialization to use N/A for null values
    const [formData, setFormData] = useState({
        referralId: "N/A", // Default to N/A
        fullName: "N/A",
        email: "N/A",
        contactNo: "N/A",
        coreMarket: "",
        agreeToTerms: false
    });

    // Then update the getLocalizedCountryName function
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

    // Update carousel images when language changes
    useEffect(() => {
        setCarouselImages(getCarouselImages(i18n.language));
    }, [i18n.language]);

    // Enhanced URL parameter handling to prioritize upstreamId
    useEffect(() => {
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        console.log('[Register] Processing URL parameters:', {
            referralCode,
            upstreamId
        });

        // If we have an upstreamId, update the form immediately
        if (upstreamId) {
            // Mark referralId as prefilled
            setPrefilledFields(prev => ({
                ...prev,
                referralId: true
            }));

            setFormData(prev => ({
                ...prev,
                referralId: upstreamId
            }));
            console.log('[Register] Setting referral ID from URL:', upstreamId);
        } else {
            // Use default if no upstreamId in URL
            setFormData(prev => ({
                ...prev,
                referralId: DEFAULT_UPSTREAM_ID
            }));
            console.log('[Register] Setting default referral ID:', DEFAULT_UPSTREAM_ID);
        }

    }, [searchParams]);

    // Modified function to set user data in the form with "N/A" fallbacks
    const setUserDataInForm = (userData: any) => {
        if (!userData) return;

        const upstreamIdFromURL = searchParams.get('upstreamId');

        const referralId = upstreamIdFromURL || DEFAULT_UPSTREAM_ID;

        console.log('[Register] Setting user data with upstreamId:', referralId);

        // Mark fields as prefilled
        setPrefilledFields({
            email: true,
            fullName: true,
            contactNo: true,
            referralId: true
        });

        setFormData(prev => ({
            ...prev,
            email: userData.email || "N/A",
            fullName: userData.fullName || "N/A",
            contactNo: userData.phoneNumber || "N/A",
            referralId: referralId
        }));
    };

    // Function to extract user info directly from localStorage auth_token
    const getUserInfoFromToken = () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return null;

            // JWT tokens are split into 3 parts by dots
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            // The middle part contains the payload, which is base64 encoded
            const payload = parts[1];

            // Decode the base64 payload (need to fix padding)
            const paddedPayload = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
            const decodedPayload = atob(paddedPayload);

            // Parse the JSON payload
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('[Register] Error extracting info from token:', error);
            return null;
        }
    };


    const fetchUserFromToken = async () => {
        try {
            setIsLoadingUserData(true);
            console.log('[Register] Checking for auth token...');
            const token = storage.getToken();

            if (!token) {
                console.log('[Register] No auth token found, redirecting to login');
                // Get referral details before redirecting
                const referralCode = searchParams.get('referralCode');
                const upstreamId = searchParams.get('upstreamId');

                const queryParams = new URLSearchParams();
                if (referralCode) {
                    queryParams.set('referralCode', referralCode);
                }
                if (upstreamId) {
                    queryParams.set('upstreamId', upstreamId);
                }


                router.push(`/auth/login?${queryParams.toString()}`);
                return false;
            }

            // Attempt to get user data from storage
            const storedUser = storage.getUser();
            console.log('[Register] Stored user:', storedUser);

            // Attempt to extract info from token directly
            const tokenInfo = getUserInfoFromToken();
            console.log('[Register] Token info:', tokenInfo);

            // Set userInfo from the best available source
            let bestUserInfo = null;
            if (storedUser) {
                bestUserInfo = storedUser;
                console.log('[Register] Using stored user data');
            } else if (tokenInfo) {
                bestUserInfo = {
                    email: tokenInfo.email,
                    fullName: tokenInfo.name || tokenInfo.full_name || 'N/A',
                    phoneNumber: tokenInfo.phone_number || 'N/A'
                };
                console.log('[Register] Using token info data');
            }

            setUserInfo(bestUserInfo);

            if (bestUserInfo) {
                console.log('[Register] Setting form data from user info:', bestUserInfo);
                setUserDataInForm(bestUserInfo);
                return true;
            }

            // Last resort - use only email from token if we couldn't get full user info
            if (tokenInfo && tokenInfo.email) {
                console.log('[Register] Using only email from token:', tokenInfo.email);

                // Mark email as prefilled
                setPrefilledFields(prev => ({
                    ...prev,
                    email: true
                }));

                setFormData(prev => ({
                    ...prev,
                    email: tokenInfo.email,
                    fullName: "N/A",
                    contactNo: "N/A"
                }));
                return true;
            }

            console.log('[Register] Could not get user data, redirecting to login');
            router.push('/auth/login');
            return false;

        } catch (error) {
            console.error('[Register] Error fetching user data:', error);
            // Handle error and redirect
            // const referralDetails = storage.getReferralDetails();
            const referralCode = searchParams.get('referralCode');
            const upstreamId = searchParams.get('upstreamId');

            const queryParams = new URLSearchParams();
            if (referralCode) {
                queryParams.set('referralCode', referralCode);
            }
            if (upstreamId) {
                queryParams.set('upstreamId', upstreamId);
            }
            router.push(`/auth/login?${queryParams.toString()}`);
            return false;
        } finally {
            setIsLoadingUserData(false);
        }
    };

    useEffect(() => {
        console.log('[Register] Checking for user info...');

        if (user) {
            console.log('[Register] User data available from context:', user);
            setUserInfo(user as EnhancedAuthUser);

            // Mark fields as prefilled
            setPrefilledFields({
                email: true,
                fullName: true,
                contactNo: true,
                referralId: true
            });

            setFormData(prev => ({
                ...prev,
                email: user.email || "N/A",
                fullName: user.fullName || "N/A",
                contactNo: user.phoneNumber || "N/A"
            }));
            setIsLoadingUserData(false);
        } else {
            console.log('[Register] No user data in context, trying to extract from other sources');
            fetchUserFromToken();
        }
        // Include in dependency array so it runs once
    }, [user, router]);

    // Carousel Auto-rotation
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => clearInterval(timer);
    }, [carouselImages]);

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`[Register] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        console.log(`[Register] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSuccessDone = () => {
        console.log('[Register] Success dialog done clicked');
        // router.push('/');
        setShowSuccessDialog(false);
    };

    // Updated handleSubmit function with improved toast handling
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        console.log('[Register] Starting registration process:', {
            formData
        });

        // Get upstreamId directly from URL, fallback to form data
        const urlUpstreamId = searchParams.get('upstreamId');
        const finalUpstreamId = urlUpstreamId || formData.referralId || DEFAULT_UPSTREAM_ID;

        try {
            // Check if we have auth token
            const token = storage.getToken();
            if (!token) {
                console.error('[Register] No auth token found');
                throw new Error('Please login first as a Lookcard user');
            }

            // Validate required fields

            if (!formData.email) {
                throw new Error('Please enter your email address');
            }

            if (!formData.coreMarket) {
                throw new Error('Please select your key market');
            }

            if (!formData.agreeToTerms) {
                throw new Error('Please agree to the terms and conditions');
            }

            // Prepare the request payload with only the required fields
            const requestData = {
                email: formData.email,
                upstreamId: finalUpstreamId,
                keyMarket: formData.coreMarket
            };

            console.log('[Register] Sending registration request with data:', requestData);

            // Call the updated registerReseller method with the request data
            const response = await resellerApi.registerReseller(requestData);
            console.log('[Register] Registration response:', response);

            // Check if response has status true
            if (response && response.status === true) {
                console.log('[Register] Registration successful with status:', response.status);

                // Refresh user data to get updated reseller status
                console.log('[Register] Refreshing user data');
                await refreshUserData();

                // Set persistent success message
                setSuccessMessage(t("registerPage.successfullyRegistered") ||
                    "You have successfully registered as a reseller. Your account is now pending approval. This process typically takes up to 3 days. We'll notify you once your account is approved.");

                console.log('[Register] Showing success toast');
                toast({
                    variant: "success", // Use success variant
                    title: t("registerPage.success") || "Success",
                    description: t("registerPage.successfullyRegistered") || "You have successfully registered as a reseller",
                    duration: 3000,
                });


                // Show success dialog
                setShowSuccessDialog(true);

            } else {
                // Status not true means registration failed
                console.error('[Register] Registration failed: Response status not true', response);
                throw new Error('Registration failed. Please try again.');
            }

        } catch (err: any) {
            console.error('[Register] Registration failed:', err);

            // Safely extract error message with fallbacks
            let errorMessage = "Registration failed. Please try again.";

            if (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
            }

            // List of system messages that should not be shown as errors
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

            // Set the error message state
            setError(errorMessage);

            // Determine the appropriate toast styling
            const toastVariant = isSystemMessage ? "default" : "destructive";
            const toastTitle = isSystemMessage
                ? (t("registerPage.notice") || "Notice")
                : (t("registerPage.error") || "Error");

            // Show toast with appropriate styling
            console.log('[Register] Showing toast with message:', errorMessage);
            toast({
                variant: toastVariant,
                title: toastTitle,
                description: errorMessage,
                duration: 5000,
            });

            // 'Email not found'
            // 'Card not activated'
            // 'Reseller already exists'
            // 'Reseller Application request already exists'
            // 'Upstream not found'
            // 'Level 1 reseller cannot have downstream'
            // 'Upstream team is full'
            // 'Key market is required'

        } finally {
            setIsLoading(false);
            console.log('[Register] Form submission complete');
        }
    };

    // Show loading state while fetching user data
    if (isLoadingUserData) {
        return (
            <div className="h-screen flex items-center justify-center bg-white dark:bg-boxdark">
                <div className="text-center">
                    <Loader />
                </div>
            </div>
        );
    }

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
                        {t("registerPage.signUpNow") || "SIGN UP NOW"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Address */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.emailAddress") || "EMAIL ADDRESS:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    className="mt-1 bg-gray-100 text-gray-800 border-gray-300 cursor-not-allowed"
                                    placeholder={t("registerPage.enterEmail") || "Please enter your registered email address in lookcard.io platform account"}
                                    readOnly={true} // Always readonly
                                />
                                <Mail className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Member Verification */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.memberVerification") || "MEMBER VERIFICATION:"}
                            </label>
                            <div className="flex mt-1 space-x-4">
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${isEmailVerified ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailVerified") || "Email Verified"}</span>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${!isEmailVerified ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}`}>
                                    <span className="text-sm">{t("registerPage.emailMismatch") || "Email Mismatch"}</span>
                                    <XCircle className={`h-5 w-5 ${!isEmailVerified ? 'text-red-500' : 'text-gray-300'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.fullName") || "FULL NAME:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${prefilledFields.fullName ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterFullName") || "Upon verification, auto filled and not editable"}
                                    readOnly={prefilledFields.fullName} // Readonly if prefilled
                                />
                                <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Contact No */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.contactNo") || "CONTACT NO:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
                                    className={`mt-1 ${prefilledFields.contactNo ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} text-gray-800 border-gray-300`}
                                    placeholder={t("registerPage.enterPhoneNumber") || "Please enter your phone number"}
                                    readOnly={prefilledFields.contactNo} // Readonly if prefilled
                                />
                                <Phone className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Core Market - Dropdown */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.proposedKeyMarket") || "PROPOSED KEY MARKET:"}
                            </label>
                            <div className="relative mt-1">
                                <Select
                                    value={formData.coreMarket}
                                    onValueChange={(value) => handleSelectChange("coreMarket", value)}
                                    required
                                >
                                    <SelectTrigger className="w-full bg-white text-gray-800 border-gray-300 h-10 bg-opacity-100 !fill-none !bg-clip-border">
                                        <SelectValue placeholder={t("registerPage.selectMarket") || "Select Your Preferred Market"} />
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

                        {/* Referral ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("registerPage.referralId") || "REFERRAL ID:"}
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    name="referralId"
                                    value={formData.referralId}
                                    className="mt-1 bg-gray-100 text-gray-800 border-gray-300 cursor-not-allowed"
                                    readOnly={true} // Always readonly
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
                                        // Get the full agreement text
                                        const fullText = t("registerPage.termsAgreementFull") ||
                                            "I agree to all the terms and conditions, including program terms, privacy policy, and consent to receive communication regarding this program.";

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

                        <RegistrationSuccessDialog
                            open={showSuccessDialog}
                            onOpenChange={setShowSuccessDialog}
                            onDone={handleSuccessDone}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isLoading || !formData.agreeToTerms}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("registerPage.processing")}
                                </>
                            ) : (
                                t("registerPage.signUp") || "Sign Up"
                            )}
                        </Button>

                        {/* Sign In Link */}
                        <div className="mt-4 text-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t("registerPage.alreadyReseller") || "Already a reseller?"}{" "}
                                <a
                                    href="/auth/login"
                                    className="text-primary hover:text-primary/80 underline font-medium"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Get referral details before redirecting
                                        // const referralCode = searchParams.get('referralCode');
                                        // const upstreamId = searchParams.get('upstreamId');

                                        // const queryParams = new URLSearchParams();
                                        // if (referralCode) {
                                        //     queryParams.set('referralCode', referralCode);
                                        // }
                                        // if (upstreamId) {
                                        //     queryParams.set('upstreamId', upstreamId);
                                        // }
                                        // router.push(`/auth/login${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
                                        router.push(`/auth/login`);
                                    }}
                                >
                                    {t("registerPage.signInHere") || "Sign in here"}
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}