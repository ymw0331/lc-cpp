"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { toast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import useColorMode from "@/hooks/useColorMode";

const preferenceSchema = z.object({
    language: z.enum(["en", "zh"]),
    notifications: z.boolean(),
    darkMode: z.boolean(),
});

const languages = [
    { value: "en", label: "English (Default)" },
    { value: "zh", label: "中文" },
];

// Custom hook for managing language preference
const useLanguagePreference = () => {
    const { i18n } = useTranslation();

    const setLanguagePreference = async (language: string) => {
        // Update i18n
        await i18n.changeLanguage(language);

        // Store in localStorage
        localStorage.setItem("preferredLanguage", language);

        // Store in database
        // try {
        //     await axios.post('/api/preferences/language', { language });
        // } catch (error) {
        //     console.error('Failed to save language preference to database:', error);
        // }
    };

    return { setLanguagePreference };
};

const PreferencePage = () => {
    const { t } = useTranslation();
    const { setLanguagePreference } = useLanguagePreference();
    const [colorMode, setColorMode] = useColorMode();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                form.setValue("language", savedLanguage as "en" | "zh");

                // Load preferences from database
                // const response = await axios.get('/api/preferences');
                // const dbPreferences = response.data;

                // if (dbPreferences) {
                //     setIsNotificationsEnabled(dbPreferences.notifications);
                //     form.setValue('notifications', dbPreferences.notifications);
                // }
            } catch (error) {
                console.error("Failed to load preferences:", error);
            }
        };

        loadPreferences();
    }, [form]);

    async function onSubmit(values: z.infer<typeof preferenceSchema>) {
        setIsSubmitting(true);
        try {
            // Update language
            await setLanguagePreference(values.language);

            // Update preferences in database
            // await axios.post('/api/preferences', values);

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
        form.setValue("language", language as "en" | "zh");
        await setLanguagePreference(language);

        toast({
            title: t("preferences.language.changed"),
            description: t("preferences.language.restart"),
            duration: 3000,
        });
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
            // await axios.post('/api/preferences/notifications', { enabled: checked });

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
                            <div className="space-y-2">
                                <h3 className="text-title-sm2 font-semibold text-black dark:text-white">
                                    {t("preferences.language.title")}
                                </h3>
                                <Select
                                    defaultValue={form.getValues("language")}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger className="w-[200px] rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-form-input dark:text-white">
                                        <SelectValue placeholder={t("preferences.language.select")} />
                                    </SelectTrigger>
                                    <SelectContent className="border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                        <SelectGroup>
                                            {languages.map((language) => (
                                                <SelectItem
                                                    key={language.value}
                                                    value={language.value}
                                                    className="cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10"
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

                            {/* Notification Section */}
                            <div className="flex items-center justify-between border-t border-stroke py-5 dark:border-strokedark">
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
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex justify-center rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-95 dark:bg-primary dark:text-white dark:hover:bg-opacity-90"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin">⏳</span>
                                            {t("preferences.saving")}
                                        </span>
                                    ) : (
                                        t("preferences.saveChanges")
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PreferencePage
