'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Building, Loader2 } from "lucide-react";
import { resellerApi } from "@/api/reseller/reseller.api";
import { useAuth } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";
import RegistrationSuccessDialog from "@/components/Dialogs/RegistrationSuccessDialog";

const carouselImages = [
    {
        src: "/images/login/slider-01.jpg",
        alt: "Earn Up to $80 Per Referral",
    },
    {
        src: "/images/login/slider-02.jpg",
        alt: "Earn Rewards Effortlessly",
    },
    {
        src: "/images/login/slider-03.jpg",
        alt: "No Passport Fret Not",
    },
    {
        src: "/images/login/slider-04.jpg",
        alt: "Exclusive Limited Offer",
    },
    {
        src: "/images/login/slider-05.jpg",
        alt: "Exclusive Limited Offer",
    },
];


// as of now we have only cater for user
// but not for non-user, we need to get them to pre-register page, based on referral/upstreamId (based on new flow)
// so we need to check if the user is already registered or not, if not then we need to redirect them to pre-register page



export default function RegisterPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { toast } = useToast();
    const { refreshUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        referralId: "",
        fullName: "",
        email: "",
        coreMarket: "",
        agreeToTerms: false
    });

    // Carousel Auto-rotation
    useEffect(() => {
        // console.log('[Register] Setting up carousel rotation');
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === carouselImages.length - 1 ? 0 : prev + 1
            );
        }, 10000);

        return () => {
            // console.log('[Register] Cleaning up carousel timer');
            clearInterval(timer);
        };
    }, []);

    // Form input handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`[Register] Field '${name}' changed:`, { value });
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSuccessDone = () => {
        console.log('[Register] Success dialog done clicked, redirecting to CP program');
        window.location.href = 'https://lookcard.io/cpprogram';
    };

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        console.log('[Register] Starting registration process:', {
            formData
        });

        try {
            // Check if we have auth token
            const token = storage.getToken();
            if (!token) {
                console.error('[Register] No auth token found');
                throw new Error('Please login first as lookcard user first');
            }

            // Validate required fields
            if (!formData.fullName || !formData.email || !formData.coreMarket) {
                throw new Error('Please fill in all required fields');
            }

            if (!formData.agreeToTerms) {
                throw new Error('Please agree to the terms and conditions');
            }

            console.log('[Register] Attempting to register as reseller with existing auth');
            const response = await resellerApi.registerReseller();
            console.log('[Register] Registration response:', response);


            // Check if response has an id property
            if (response && response.id) {
                console.log('[Register] Registration successful with id:', response.id);

                // Refresh user data to get updated reseller status
                console.log('[Register] Refreshing user data');
                await refreshUserData();

                console.log('[Register] Showing success toast');
                toast({
                    title: t("registerPage.success"),
                    description: t("registerPage.successfullyRegistered"),
                    duration: 3000,
                });

                // Redirect to login page on success
                // console.log('[Register] Redirecting to login page');
                // router.push('/auth/login');

                // Show success dialog
                setShowSuccessDialog(true);

            } else {
                // No id in response means registration failed
                console.error('[Register] Registration failed: No id in response', response);
                throw new Error('Registration failed. Please try again.');
            }

        } catch (err: any) {
            console.error('[Register] Registration failed:', {
                error: err,
                message: err.message,
                response: err.response?.data
            });

            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);

            console.log('[Register] Showing error toast');
            toast({
                variant: "destructive",
                title: t("registerPage.error"),
                description: errorMessage,
                duration: 5000,
            });

            // Stay on registration page
            console.log('[Register] Staying on registration page due to error');
        } finally {
            setIsLoading(false);
            console.log('[Register] Form submission complete');
        }
    };
    // JSX remains largely the same but with improved error handling and loading states
    return (
        <div className="min-h-screen flex">
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
            <div className="w-full lg:w-[45%] h-screen overflow-y-auto">
                <div className="px-8 lg:px-16 py-8">
                    <div className="max-w-md w-full mx-auto">
                        {/* Logo */}
                        <div className="mb-8">
                            <Image
                                src="/images/logo/lookcard-logo.png"
                                alt="Lookcard Logo"
                                width={150}
                                height={30}
                            />
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold">
                                {t("registerPage.agentRecruitmentDetails")}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {t("registerPage.joinOurCommunity")}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Form fields */}
                            <div className="space-y-6">
                                {/* Referral ID */}
                                <div>
                                    <label className="text-sm text-gray-600">
                                        {t("registerPage.referralId")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="referralId"
                                            value={formData.referralId}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder={t("registerPage.enterReferralId")}
                                        />
                                        <Mail className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div>
                                    <label className="text-sm text-gray-600">
                                        {t("registerPage.fullName")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder={t("registerPage.enterFullName")}
                                            required
                                        />
                                        <User className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm text-gray-600">
                                        {t("registerPage.email")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder={t("registerPage.enterEmail")}
                                            required
                                        />
                                        <Mail className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Core Market */}
                                <div>
                                    <label className="text-sm text-gray-600">
                                        {t("registerPage.coreMarket")}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            name="coreMarket"
                                            value={formData.coreMarket}
                                            onChange={handleInputChange}
                                            className="mt-1"
                                            placeholder={t("registerPage.enterCoreMarket")}
                                            required
                                        />
                                        <Building className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Acknowledgement Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">
                                    {t("registerPage.agentAcknowledgement")}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {t("registerPage.acknowledgementPoints.bySubmitting")}
                                </p>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>{t("registerPage.acknowledgementPoints.accuracy")}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>{t("registerPage.acknowledgementPoints.verification")}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>{t("registerPage.acknowledgementPoints.misrepresentation")}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>{t("registerPage.acknowledgementPoints.privacy")}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span>•</span>
                                        <span>{t("registerPage.acknowledgementPoints.terms")}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked: boolean) =>
                                            setFormData(prev => ({ ...prev, agreeToTerms: checked }))
                                        }
                                        required
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm text-gray-600"
                                    >
                                        {t("registerPage.termsAgreement")}
                                    </label>
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
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
                                className="w-full bg-[#E31C5F] hover:bg-[#c4164f] text-white"
                                disabled={isLoading || !formData.agreeToTerms}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {t("registerPage.processing")}
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}