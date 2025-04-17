"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Mail, User, Phone, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { resellerApi } from "@/api/reseller/reseller.api";
import { useToast } from "@/hooks/useToast";
import { countries } from "@/lib/countries";
import Link from "next/link";

// Type definition for Country translations
type TranslationLanguage = 'zh' | 'zh-hk';

interface CountryTranslation {
    zh: string;
    "zh-hk": string;
}

interface CountriesData {
    [country: string]: CountryTranslation;
}

interface VerifyUserResponse {
    status: boolean;
    data?: {
        emailVerified: boolean;
        fullname: string;
        phoneNo: string;
        cardActive: boolean;
    };
}

const formSchema = z.object({
    upstreamId: z.string(),
    fullName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    contactNo: z.string().optional(),
    market: z.string(),
    agreed: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
});

const RecruitAgentPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { toast } = useToast();
    const { i18n } = useTranslation();

    // Verification states
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Function to clear auto-filled fields
    const clearAutoFilledFields = () => {
        form.setValue("fullName", '');
        form.setValue("contactNo", '');
        setIsEmailVerified(false);
    };

    // Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            upstreamId: user?.resellerId || '',
            fullName: '',
            email: '',
            contactNo: '',
            market: '',
            agreed: false,
        },
    });

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

    // Function to verify user email
    const verifyUserEmail = async () => {
        const email = form.getValues("email");
        if (!email) return;

        // Clear previous messages
        setError("");
        setSuccessMessage("");

        try {
            setIsVerifyingEmail(true);
            console.log('[RecruitAgent] Verifying email:', email);

            const response: VerifyUserResponse = await resellerApi.verifyUser(email);
            console.log('[RecruitAgent] Verification response:', response);

            if (response.status && response.data) {
                // Clear previous data if email is not verified
                if (!response.data.emailVerified) {
                    clearAutoFilledFields();
                    const errorMsg = t("recruitAgentPage.emailRegistrationRequired");
                    setError(errorMsg);
                    toast({
                        variant: "destructive",
                        title: t("recruitAgentPage.error"),
                        description: errorMsg,
                        duration: 5000,
                    });
                    return;
                }

                // Only set verification status and populate fields if email is verified
                setIsEmailVerified(response.data.emailVerified);
                
                // Auto-populate fields without validation since they're optional
                form.setValue("fullName", response.data.fullname || '');
                form.setValue("contactNo", response.data.phoneNo || '');

                // Clear any previous error messages
                setError("");
                const successMsg = t("recruitAgentPage.emailVerifiedSuccess");
                setSuccessMessage(successMsg);
                toast({
                    title: t("recruitAgentPage.emailVerified"),
                    description: successMsg,
                    duration: 3000,
                });
            }
        } catch (err: any) {
            console.error('[RecruitAgent] Email verification error:', err);
            clearAutoFilledFields();
            const errorMsg = t("recruitAgentPage.verificationFailed");
            setError(errorMsg);
            setSuccessMessage("");
            toast({
                variant: "destructive",
                title: t("recruitAgentPage.error"),
                description: errorMsg,
                duration: 5000,
            });
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    // Reset messages when email changes
    useEffect(() => {
        const subscription = form.watch((value, info) => {
            if (info.name === "email") {
                clearAutoFilledFields();
                setError("");
                setSuccessMessage("");
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Clear previous messages
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        console.log('[RecruitAgent] Starting recruitment process:', values);

        try {
            // Validate email verification
            if (!isEmailVerified) {
                const errorMsg = t("recruitAgentPage.emailVerificationRequired");
                setError(errorMsg);
                throw new Error(errorMsg);
            }

            // Validate required fields
            if (!values.market) {
                const errorMsg = t("recruitAgentPage.selectMarket");
                setError(errorMsg);
                throw new Error(errorMsg);
            }

            if (!values.agreed) {
                const errorMsg = t("recruitAgentPage.termsAgreement");
                setError(errorMsg);
                throw new Error(errorMsg);
            }

            // Prepare the request payload
            const requestData = {
                upstreamId: values.upstreamId,
                keyMarket: values.market,
                email: values.email,
                fullName: form.getValues("fullName"),
                contactNo: form.getValues("contactNo")
            };

            console.log('[RecruitAgent] Sending recruitment request with data:', requestData);

            // Call the API to register the agent
            const response = await resellerApi.registerReseller(requestData);
            console.log('[RecruitAgent] Recruitment response:', response);

            // Handle successful recruitment
            if (response && response.status === true) {
                console.log('[RecruitAgent] Recruitment successful');

                // const successMsg = t("recruitAgentPage.successfullyRecruited");
                
                const successMsg = `${values.email} ${t("recruitAgentPage.successfullyRecruited")}`;
                // Set success message
                setSuccessMessage(successMsg);
                setError(""); // Clear any previous error

                // Show success toast
                toast({
                    title: t("recruitAgentPage.success"),
                    description: successMsg,
                    duration: 3000,
                });

                // Reset form
                form.reset({
                    upstreamId: user?.resellerId || '',
                    fullName: '',
                    email: '',
                    contactNo: '',
                    market: '',
                    agreed: false,
                });
                setIsEmailVerified(false);
            } else {
                // Status not true means recruitment failed
                console.error('[RecruitAgent] Recruitment failed: Response status not true', response);
                const errorMsg = t("recruitAgentPage.error");
                setError(errorMsg);
                setSuccessMessage(""); // Clear any previous success
                throw new Error(errorMsg);
            }
        } catch (err: any) {
            console.error('[RecruitAgent] Recruitment failed:', err);
            setSuccessMessage(""); // Clear any previous success

            // Safely extract error message with fallbacks
            let errorMessage = t("recruitAgentPage.error");

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
                errorMessage = t("recruitAgentPage.resellerAlreadyExists");
            }

            // Set the error message state
            setError(errorMessage);

            // Show toast with appropriate styling based on message type
            toast({
                variant: isSystemMessage ? "default" : "destructive",
                title: isSystemMessage ? t("recruitAgentPage.notice") : t("recruitAgentPage.error"),
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("recruitAgentPage.recruitAgentBreadcrumb")} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 bg-white dark:bg-boxdark p-8 rounded-xl shadow-default dark:shadow-8"
                >
                    <div className="space-y-6">
                        <h2 className="text-title-sm text-black dark:text-white font-bold">
                            {t("recruitAgentPage.agentRecruitmentDetails")}
                        </h2>
                        <p className="text-body dark:text-bodydark">
                            {t("recruitAgentPage.enterEmail")}
                        </p>

                        <div className="grid gap-6">
                            {/* Referral ID and Email in same row */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Upstream ID */}
                                <FormField
                                    control={form.control}
                                    name="upstreamId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.referralId")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.registeredEmail")}*
                                            </FormLabel>
                                            <div className="relative flex space-x-2">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary"
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    onClick={verifyUserEmail}
                                                    className="bg-primary hover:bg-primary/90 text-white"
                                                    disabled={isVerifyingEmail || !field.value}
                                                >
                                                    {isVerifyingEmail ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        t("recruitAgentPage.verify")
                                                    )}
                                                </Button>
                                            </div>
                                            <FormMessage className="text-meta-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Full Name and Member Verification in same row */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Full Name */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.fullName")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className={`bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary ${isEmailVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                    readOnly
                                                    disabled={!isEmailVerified}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Member Verification */}
                                <FormItem>
                                    <FormLabel className="text-black dark:text-bodydark">
                                        {t("recruitAgentPage.memberVerification")}*
                                    </FormLabel>
                                    <div className="flex mt-1">
                                        <div className={`flex-1 border rounded-md px-4 py-2 flex items-center justify-center space-x-2 ${isEmailVerified ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                                            <span className="text-sm">{t("registerPage.emailVerified")}</span>
                                            {isEmailVerified ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                </FormItem>
                            </div>

                            {/* Market Selection and Contact Number in same row */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Market Selection */}
                                <FormField
                                    control={form.control}
                                    name="market"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.proposedKeyMarket")}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus:ring-primary">
                                                        <SelectValue placeholder={t("recruitAgentPage.selectMarket")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white dark:bg-boxdark border-stroke dark:border-strokedark">
                                                    {Object.keys(countries).map((country) => (
                                                        <SelectItem
                                                            key={country}
                                                            value={country}
                                                            className="focus:bg-gray dark:focus:bg-meta-4"
                                                        >
                                                            {getLocalizedCountryName(country)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Contact Number */}
                                <FormField
                                    control={form.control}
                                    name="contactNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.contactNo")}*
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    className={`bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary ${isEmailVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                                    readOnly
                                                    disabled={!isEmailVerified}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-meta-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-stroke dark:border-strokedark" />

                    {/* Acknowledgement Section */}
                    <div className="space-y-6">
                        <h2 className="text-title-sm text-black dark:text-white font-bold">
                            {t("recruitAgentPage.acknowledgement")}
                        </h2>

                        <div className="space-y-6 bg-gray dark:bg-meta-4 p-6 rounded-lg">
                            <ul className="space-y-3 text-body dark:text-bodydark">
                                <li>
                                    • {t("recruitAgentPage.acknowledgementItem1")}
                                </li>
                                <li>
                                    • {t("recruitAgentPage.acknowledgementItem2")}
                                </li>
                                <li>
                                    • {t("recruitAgentPage.acknowledgementItem3")}
                                </li>
                                <li>
                                    • {t("recruitAgentPage.acknowledgementItem4")}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Error and Success Message Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                            {error}
                        </div>
                    )}
                    {successMessage && !error && (
                        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="agreed"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-stroke dark:border-strokedark dark:bg-white dark:text-black data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-body dark:text-bodydark">
                                        {t("recruitAgentPage.agreementLabel")}
                                    </FormLabel>
                                    <FormMessage className="text-meta-1" />
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={
                                !form.getValues("agreed") || !isEmailVerified || isLoading
                            }
                            className="bg-primary hover:bg-primary/90 text-white disabled:bg-primary/50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("recruitAgentPage.processing")}
                                </>
                            ) : (
                                t("recruitAgentPage.recruitButton")
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </DefaultLayout>
    );
};

export default RecruitAgentPage;
