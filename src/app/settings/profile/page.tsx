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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PencilIcon, ClipboardIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { VerificationDialog } from '@/components/Dialogs/VerificationDialog';
import { toast } from "@/hooks/useToast";

const formSchema = z.object({
    userId: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    contactNo: z.string(),
    referralCode: z.string(),
    keyMarket: z.string(),
    linkedin: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
});




const ProfilePage = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "John Smith",
            fullName: "John Smith Ademan",
            email: "johnsmith@gmail.com",
            contactNo: "+60 11 4086 926",
            referralCode: "7HKS56H5",
            keyMarket: "Hong Kong",
            linkedin: "https://www.linkedin.com/",
            facebook: "https://www.facebook.com/",
            instagram: "https://www.instagram.com/",
            twitter: "https://www.x.com/",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Submitting values:", values);
    }

    const [isOpen, setIsOpen] = useState(false);
    const [fieldToVerify, setFieldToVerify] = useState<"email" | "phone" | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isPhoneEditable, setIsPhoneEditable] = useState(false);


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



                                {/* Key Market Field */}
                                <FormField
                                    control={form.control}
                                    name="keyMarket"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">Key Market</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                                                        <SelectValue placeholder="Select market" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                    <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                                                    <SelectItem value="Singapore">Singapore</SelectItem>
                                                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Social Media Section */}
                            <div className="mt-8">
                                <h4 className="mb-5.5 text-title-sm text-black dark:text-white">Social Media Profiles</h4>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {['linkedin', 'facebook', 'instagram', 'twitter'].map((social) => (
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


                            <div className="flex justify-end mt-6 pt-5 border-t border-stroke dark:border-strokedark">
                                <Button
                                    type="submit"
                                    className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-95 dark:bg-primary dark:text-white dark:hover:bg-opacity-90 transition-all duration-300"
                                >
                                    Save Changes
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
