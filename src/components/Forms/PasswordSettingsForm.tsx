"use client";

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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "@/hooks/useToast";
import { Eye, EyeOff } from "lucide-react";

const passwordSchema = z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const PasswordSettingsForm = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Your password has been updated successfully",
                duration: 3000,
            });

            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update password. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        }
    }

    const handle2FAToggle = (checked: boolean) => {
        setIs2FAEnabled(checked);
        toast({
            title: checked ? "2FA Enabled" : "2FA Disabled",
            description: checked
                ? "Two-factor authentication has been enabled"
                : "Two-factor authentication has been disabled",
            duration: 3000,
        });
    };

    return (
        <div className="w-full">

            <div className="rounded-sm border border-stroke bg-white px-7.5 py-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="mb-5.5 text-title-sm text-black dark:text-white">Change Password</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5.5">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Old Password Field */}
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                            Old Password
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showOldPassword ? "text" : "password"}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute right-4 top-2 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary"
                                            >
                                                {showOldPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage className="mt-1 text-xs text-meta-1" />
                                    </FormItem>
                                )}
                            />

                            {/* New Password Field */}
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                            New Password
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showNewPassword ? "text" : "password"}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-2 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage className="mt-1 text-xs text-meta-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                            Confirm Password
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary pr-10"
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-2 text-body hover:text-primary dark:text-bodydark dark:hover:text-primary"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <FormMessage className="mt-1 text-xs text-meta-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 2FA Toggle Section */}
                        <div className="flex items-center justify-between border-t border-stroke py-5 dark:border-strokedark">
                            <div>
                                <h4 className="text-title-sm2 font-semibold text-black dark:text-white">
                                    Two Factor Authentication (2FA)
                                </h4>
                                <p className="mt-1 text-sm text-body dark:text-bodydark">
                                    Enable to receive alerts and updates related to your two-factor authentication activity.
                                </p>
                            </div>
                            <Switch
                                checked={is2FAEnabled}
                                onCheckedChange={handle2FAToggle}
                                className="bg-stroke data-[state=checked]:bg-primary"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-95 dark:bg-primary dark:text-white dark:hover:bg-opacity-90"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default PasswordSettingsForm;