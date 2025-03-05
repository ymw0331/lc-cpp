"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import useColorMode from "@/hooks/useColorMode";

const preferenceSchema = z.object({
    language: z.enum(["en", "zh", "zh-hk"]),
    notifications: z.boolean(),
    darkMode: z.boolean(),
});

const languages = [
    { value: "en", label: "English" },
    { value: "zh", label: "简体中文" },
    { value: "zh-hk", label: "繁體中文" },
];

const PreferencePage = () => {
    const { i18n, t } = useTranslation();
    const [colorMode, setColorMode] = useColorMode();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialLoadRef = useRef(true);

    const form = useForm<z.infer<typeof preferenceSchema>>({
        resolver: zodResolver(preferenceSchema),
        defaultValues: {
            language: "en",
            notifications: false,
            darkMode: colorMode === "dark",
        },
    });

    // Load saved preferences on mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                // Load language preference from localStorage
                const savedLanguage = localStorage.getItem("preferredLanguage") || "en";

                // Set form value
                form.setValue("language", savedLanguage as "en" | "zh" | "zh-hk");

                // Change language if needed without showing toast on initial load
                if (i18n.language !== savedLanguage) {
                    await i18n.changeLanguage(savedLanguage);
                }

            } catch (error) {
                console.error("Failed to load preferences:", error);
            } finally {
                // After initial load is complete
                initialLoadRef.current = false;
            }
        };

        loadPreferences();
    }, [form, i18n]);

    async function onSubmit(values: z.infer<typeof preferenceSchema>) {
        setIsSubmitting(true);
        try {
            // Update language
            await i18n.changeLanguage(values.language);

            // Store in localStorage
            localStorage.setItem("preferredLanguage", values.language);

            toast({
                title: t("preferences.success.title"),
                description: t("preferences.success.description"),
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: t("preferences.error.title"),
                description: t("preferences.error.description"),
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleLanguageChange = async (language: string) => {
        try {
            // Skip toast if it's the same language
            if (form.getValues("language") === language) {
                return;
            }

            // Update form value
            form.setValue("language", language as "en" | "zh" | "zh-hk");

            // Change language
            await i18n.changeLanguage(language);

            // Store in localStorage
            localStorage.setItem("preferredLanguage", language);

            // Only show toast when language actually changes (not on initial load)
            if (!initialLoadRef.current) {
                toast({
                    title: t("preferences.language.changed"),
                    description: t("preferences.language.restart"),
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error('Language change failed:', error);
        }
    };

    const handleDarkModeToggle = (checked: boolean) => {
        if (typeof setColorMode === "function") {
            setColorMode(checked ? "dark" : "light");
            form.setValue("darkMode", checked);

            toast({
                title: checked
                    ? t("preferences.darkMode.enabled")
                    : t("preferences.darkMode.disabled"),
                description: checked
                    ? t("preferences.darkMode.enabledDesc")
                    : t("preferences.darkMode.disabledDesc"),
                duration: 3000,
            });
        }
    };

    const handleNotificationToggle = async (checked: boolean) => {
        setIsNotificationsEnabled(checked);
        form.setValue("notifications", checked);

        try {
            toast({
                title: checked
                    ? t("preferences.notifications.enabled")
                    : t("preferences.notifications.disabled"),
                description: checked
                    ? t("preferences.notifications.enabledDesc")
                    : t("preferences.notifications.disabledDesc"),
                duration: 3000,
            });
        } catch (error) {
            console.error("Failed to update notification preference:", error);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("preferences.title")} />

            <div className="w-full">
                <div className="rounded-sm border border-stroke bg-white px-7.5 py-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* Language Section */}
                            <div className="flex items-center justify-between py-5 ">
                                <div>
                                    <h4 className="text-title-sm2 font-semibold text-black dark:text-white">
                                        {t("preferences.language.title")}
                                    </h4>
                                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                                        {t("preferences.language.description")}
                                    </p>
                                </div>
                                <Select
                                    value={form.getValues("language")}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger className="w-[180px] rounded-lg border border-stroke bg-whiter py-2 px-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-form-input dark:text-white">
                                        <SelectValue placeholder={t("preferences.language.select")}>
                                            <div className="flex items-center">

                                                {languages.find(lang => lang.value === form.getValues("language"))?.label}
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <SelectGroup>
                                            {languages.map((language) => (
                                                <SelectItem
                                                    key={language.value}
                                                    value={language.value}
                                                    className="cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 flex items-center"
                                                >
                                                    {language.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Dark Mode Section */}
                            <div className="flex items-center justify-between border-t border-stroke py-5 dark:border-strokedark">
                                <div>
                                    <h4 className="text-title-sm2 font-semibold text-black dark:text-white">
                                        {t("preferences.darkMode.title")}
                                    </h4>
                                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                                        {t("preferences.darkMode.description")}
                                    </p>
                                </div>
                                <Switch
                                    checked={colorMode === "dark"}
                                    onCheckedChange={handleDarkModeToggle}
                                    className="bg-stroke data-[state=checked]:bg-primary"
                                />
                            </div>

                            {/* Notification Section - Commented out */}
                            {/* <div className="flex items-center justify-between border-t border-stroke py-5 dark:border-strokedark">
                                <div>
                                    <h4 className="text-title-sm2 font-semibold text-black dark:text-white">
                                        {t("preferences.notifications.title")}
                                    </h4>
                                    <p className="mt-1 text-sm text-body dark:text-bodydark">
                                        {t("preferences.notifications.description")}
                                    </p>
                                </div>
                                <Switch
                                    checked={isNotificationsEnabled}
                                    onCheckedChange={handleNotificationToggle}
                                    className="bg-stroke data-[state=checked]:bg-primary"
                                />
                            </div> */}
                        </form>
                    </Form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PreferencePage;