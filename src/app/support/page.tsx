"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, X } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SupportSkeleton } from '@/components/common/Skeletons';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "application/pdf"];

const supportFormSchema = z.object({
    category: z.string({
        required_error: "Please select a category",
    }),
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    attachments: z.array(z.any()).optional(),
});

const categories = [
    { value: "data-related", label: "Data Related" },
    { value: "technical", label: "Technical Issues" },
    { value: "account", label: "Account Related" },
    { value: "payment", label: "Payment Issues" },
    { value: "other", label: "Other" },
];

const SupportPage = () => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof supportFormSchema>>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            category: "",
            title: "",
            description: "",
            attachments: [],
        },
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList) {
            const filesArray = Array.from(fileList).filter((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    alert(t("supportPage.fileSizeExceeded"));
                    return false;
                }
                if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
                    alert(t("supportPage.invalidFileType"));
                    return false;
                }
                return true;
            });
            setFiles((prev) => [...prev, ...filesArray]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    async function onSubmit(values: z.infer<typeof supportFormSchema>) {
        try {
            const formData = new FormData();
            formData.append("category", values.category);
            formData.append("title", values.title);
            formData.append("description", values.description);
            files.forEach((file) => {
                formData.append("attachments", file);
            });

            // Add your API call here
            console.log("Form submitted:", values);
            console.log("Files:", files);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <DefaultLayout>
                <SupportSkeleton />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("supportPage.supportBreadcrumb")} />

            <div className="w-full">
                <div className="bg-white dark:bg-boxdark rounded-xl shadow-default p-4 md:p-6 space-y-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Category Selection */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-white">
                                                {t("supportPage.category")}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark">
                                                        <SelectValue placeholder={t("supportPage.selectCategory")} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white dark:bg-boxdark border-stroke dark:border-strokedark">
                                                    {categories.map((category) => (
                                                        <SelectItem
                                                            key={category.value}
                                                            value={category.value}
                                                            className="focus:bg-gray dark:focus:bg-meta-4"
                                                        >
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Title Input */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-white">
                                                {t("supportPage.title")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t("supportPage.titlePlaceholder")}
                                                    className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Description Textarea */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black dark:text-white">
                                            {t("supportPage.description")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("supportPage.descriptionPlaceholder")}
                                                className="min-h-[150px] bg-gray dark:bg-form-input border-stroke dark:border-strokedark"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <FormLabel className="text-body dark:text-white">
                                    {t("supportPage.supportingDocuments")} (JPG/PDF)
                                </FormLabel>

                                <div className="grid gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-gray dark:bg-meta-4 px-3 py-1 rounded-full"
                                            >
                                                <span className="text-sm text-body dark:text-bodydark truncate max-w-[200px]">
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="text-body dark:text-bodydark hover:text-danger"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="inline-flex cursor-pointer">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".jpg,.jpeg,.pdf"
                                                multiple
                                                onChange={handleFileUpload}
                                            />
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-boxdark-2 text-white rounded-full hover:bg-black/90 dark:hover:bg-boxdark-2/90 transition-colors">
                                                <Upload className="h-5 w-5" />
                                                {t("supportPage.uploadDocuments")}
                                            </span>
                                        </label>
                                        {/* <p className="text-sm text-body dark:text-bodydark mt-2">
                                        Maximum file size: 5MB. Accepted formats: JPG, PDF
                                    </p> */}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-white px-8"
                                >
                                    {t("supportPage.saveChanges")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SupportPage;
