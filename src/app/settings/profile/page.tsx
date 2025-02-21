'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PencilIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VerificationDialog } from '@/components/Dialogs/VerificationDialog';
import { toast } from "@/hooks/useToast";
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/common/Loader';
// import { profileApi, ProfileResponse } from '@/apiOld/profile';
import { profileApi, ProfileResponse } from '@/api';

const formSchema = z.object({
    userId: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    contactNo: z.string(),
    referralCode: z.string(),
    keyMarket: z.string(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
});


const ProfilePage = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [fieldToVerify, setFieldToVerify] = useState<"email" | "phone" | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            fullName: "",
            email: "",
            contactNo: "",
            referralCode: "",
            keyMarket: "",
            linkedin: "",
            facebook: "",
            instagram: "",
            twitter: "",
        },
    });


    // Fetch profile data
    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await profileApi.getProfile();
            setProfileData(data);
            form.reset({
                userId: data.id,
                fullName: data.name || '',
                email: data.email || '',
                contactNo: data.contactNumber || '',
                referralCode: data.referralCode || '',
                keyMarket: data.keyMarket || '',
                linkedin: data.linkedin || '',
                facebook: data.facebook || '',
                instagram: data.instagram || '',
                twitter: data.twitter || '',
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            toast({
                title: "Error",
                description: "Failed to load profile data",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }, [form]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            await profileApi.updateProfile({
                name: values.fullName,
                email: values.email,
                contactNumber: values.contactNo,
                keyMarket: values.keyMarket,
                linkedin: values.linkedin || null,
                facebook: values.facebook || null,
                instagram: values.instagram || null,
                twitter: values.twitter || null,
            });

            toast({
                title: "Success",
                description: "Profile updated successfully",
                duration: 3000,
            });

            // Optionally refresh the profile data
            await fetchProfile();
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleVerify = (code: string) => {
        console.log("Verifying code:", code);
        // Handle verification logic
        setIsOpen(false);
    };

    const handleResend = () => {
        console.log("Resending OTP");
        // Handle resend logic
    };

    const handleVerificationSuccess = () => {
        if (fieldToVerify === "email") {
            setIsEmailVerified(true);
            setIsEmailEditable(true);
            toast({
                title: "Email Verified",
                description: "You can now edit your email address",
                duration: 3000,
            });
        } else if (fieldToVerify === "phone") {
            setIsPhoneVerified(true);
            setIsPhoneEditable(true);
            toast({
                title: "Phone Verified",
                description: "You can now edit your phone number",
                duration: 3000,
            });
        }
        setIsOpen(false);
    };

    const handleCopyReferralCode = () => {
        const referralCode = form.getValues("referralCode");
        navigator.clipboard.writeText(referralCode);
        toast({
            title: "Copied!",
            description: "Referral code copied to clipboard",
            duration: 2000,
        });
    };

    if (isLoading) {
        return <Loader />;
    }

    // Helper function to check if social media exists
    const hasSocialMedia = (social: string) => {
        if (!profileData) return false;
        return profileData[social as keyof typeof profileData] !== null;
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Profile" />

            <div className="w-full">

                <div className="rounded-sm border border-stroke bg-white px-7.5 py-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h3 className="mb-5.5 text-title-sm text-black dark:text-white">Profile Detail</h3>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5.5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* User ID Field */}
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">User ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">Email</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isEmailEditable}
                                                        className={`w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${isEmailVerified ? 'border-success' : ''
                                                            }`}
                                                    />
                                                </FormControl>
                                                <PencilIcon
                                                    onClick={() => {
                                                        if (!isEmailVerified) {
                                                            setFieldToVerify("email");
                                                            setIsOpen(true);
                                                        }
                                                    }}
                                                    className={`absolute right-4 top-2 h-5 w-5 ${isEmailVerified
                                                        ? 'text-success cursor-not-allowed'
                                                        : 'text-body hover:text-primary dark:text-bodydark dark:hover:text-primary cursor-pointer'
                                                        }`}
                                                />
                                            </div>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />


                                {/* Contact Number Field */}
                                <FormField
                                    control={form.control}
                                    name="contactNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">Contact No.</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={!isPhoneEditable}
                                                        className={`w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${isPhoneVerified ? 'border-success' : ''
                                                            }`}
                                                    />
                                                </FormControl>
                                                <PencilIcon
                                                    onClick={() => {
                                                        if (!isPhoneVerified) {
                                                            setFieldToVerify("phone");
                                                            setIsOpen(true);
                                                        }
                                                    }}
                                                    className={`absolute right-4 top-2 h-5 w-5 ${isPhoneVerified
                                                        ? 'text-success cursor-not-allowed'
                                                        : 'text-body hover:text-primary dark:text-bodydark dark:hover:text-primary cursor-pointer'
                                                        }`}
                                                />
                                            </div>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />


                                {/* Verification Dialog */}
                                <VerificationDialog
                                    isOpen={isOpen}
                                    onOpenChange={setIsOpen}
                                    type={fieldToVerify || "email"}
                                    onVerify={(code) => {
                                        // Handle verification success
                                        if (fieldToVerify === "email") {
                                            setIsEmailVerified(true);
                                            setIsEmailEditable(true);
                                            toast({
                                                title: "Email Verified",
                                                description: "You can now edit your email address",
                                                duration: 3000,
                                            });
                                        } else if (fieldToVerify === "phone") {
                                            setIsPhoneVerified(true);
                                            setIsPhoneEditable(true);
                                            toast({
                                                title: "Phone Verified",
                                                description: "You can now edit your phone number",
                                                duration: 3000,
                                            });
                                        }
                                        setIsOpen(false);
                                    }}
                                    onResend={() => {
                                        toast({
                                            title: "OTP Resent",
                                            description: `A new OTP has been sent to your ${fieldToVerify}`,
                                            duration: 3000,
                                        });
                                    }}
                                    contactDetail={fieldToVerify === "phone"
                                        ? form.getValues("contactNo").slice(-4)
                                        : undefined
                                    }
                                />


                                {/* Referral Code Field */}
                                <FormField
                                    control={form.control}
                                    name="referralCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">Referral Code</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />
                                                </FormControl>
                                                <CopyIcon
                                                    onClick={handleCopyReferralCode}
                                                    className="absolute right-4 top-2 h-5 w-5 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary cursor-pointer"
                                                />
                                            </div>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />


                                {/* Key Market */}
                                <FormField
                                    control={form.control}
                                    name="keyMarket"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                Key Market
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Social Media Section */}
                            {profileData &&
                                (profileData.linkedin || profileData.facebook || profileData.instagram || profileData.twitter) && (
                                    <div className="mt-8">
                                        <h4 className="mb-5.5 text-title-sm text-black dark:text-white">
                                            Social Media Profiles
                                        </h4>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {['linkedin', 'facebook', 'instagram', 'twitter']
                                                .filter(social => hasSocialMedia(social))
                                                .map((social) => (
                                                    <FormField
                                                        key={social}
                                                        control={form.control}
                                                        name={social as any}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="mb-2.5 block font-medium capitalize text-black dark:text-white">
                                                                    {social}
                                                                </FormLabel>
                                                                <div className="relative">
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                                        />
                                                                    </FormControl>
                                                                    <PencilIcon className="absolute right-4 top-2 h-5 w-5 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary cursor-pointer" />
                                                                </div>
                                                                <FormMessage className="mt-1 text-xs text-meta-1" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )}

                            <div className="flex justify-end mt-6 pt-5 border-t border-stroke dark:border-strokedark">
                                <Button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-95 dark:bg-primary dark:text-white dark:hover:bg-opacity-90 transition-all duration-300"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </DefaultLayout>
    )
}

export default ProfilePage
