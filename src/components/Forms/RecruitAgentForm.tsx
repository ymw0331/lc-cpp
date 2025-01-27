"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check } from "lucide-react";
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

const formSchema = z.object({
    referralId: z.string(),
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    market: z.string(),
    agreed: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

interface Market {
    id: string;
    value: string;
    label: string;
    code?: string;  // optional country code
    currency?: string;  // optional currency code
    timezone?: string;  // optional timezone
    active?: boolean;  // to control availability
}

const MARKETS: Market[] = [
    {
        id: '1',
        value: 'hong-kong',
        label: 'Hong Kong',
        code: 'HK',
        currency: 'HKD',
        timezone: 'Asia/Hong_Kong',
        active: true
    },
    {
        id: '2',
        value: 'singapore',
        label: 'Singapore',
        code: 'SG',
        currency: 'SGD',
        timezone: 'Asia/Singapore',
        active: true
    },
    {
        id: '3',
        value: 'malaysia',
        label: 'Malaysia',
        code: 'MY',
        currency: 'MYR',
        timezone: 'Asia/Kuala_Lumpur',
        active: true
    },
    {
        id: '4',
        value: 'thailand',
        label: 'Thailand',
        code: 'TH',
        currency: 'THB',
        timezone: 'Asia/Bangkok',
        active: true
    }
];

export const RecruitAgentForm = () => {
    // Initial state values
    const [initialValues] = useState({
        referralId: "AS7JDS38",
        fullName: "Joby Tan",
        email: "joby.tan@lookcard.io",
        market: MARKETS[0].value,
        agreed: false,
    });

    // Verification states
    const [isVerified, setIsVerified] = useState(false);
    const [isMatched, setIsMatched] = useState(false);

    // Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    const handleVerify = () => {
        // todo: verification
        setIsVerified(true);
        setIsMatched(true);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 bg-white dark:bg-boxdark p-8 rounded-xl shadow-default dark:shadow-8">
                <div className="space-y-6">
                    <h2 className="text-title-sm text-black dark:text-white font-bold">
                        Agent Recruitment Details
                    </h2>

                    <div className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Referral ID */}
                            <FormField
                                control={form.control}
                                name="referralId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black dark:text-bodydark">Referral ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                // readOnly
                                                className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-meta-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black dark:text-bodydark">Full Name*</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-meta-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black dark:text-bodydark">Registered Email*</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus-visible:ring-primary"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-meta-1" />
                                    </FormItem>
                                )}
                            />

                            {/* Verification */}
                            <FormItem>
                                <FormLabel className="text-black dark:text-bodydark">Member Verification*</FormLabel>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isVerified ? 'bg-primary/10 text-primary' : 'bg-gray dark:bg-meta-4 text-body dark:text-bodydark'
                                            }`}>
                                            <Check className="w-4 h-4 mr-1" /> Email Verified
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isMatched ? 'bg-primary/10 text-primary' : 'bg-gray dark:bg-meta-4 text-body dark:text-bodydark'
                                            }`}>
                                            <Check className="w-4 h-4 mr-1" /> Matched Email
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleVerify}
                                        variant="outline"
                                        className="border-stroke dark:border-strokedark hover:bg-gray dark:hover:bg-meta-4"
                                    >
                                        Check
                                    </Button>
                                </div>
                            </FormItem>
                        </div>

                        {/* Market Selection */}
                        <div className="grid gap-4 md:grid-cols-2">

                            <FormField
                                control={form.control}
                                name="market"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black dark:text-bodydark">Proposed Key Market</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus:ring-primary">
                                                    <SelectValue placeholder="Select market" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white dark:bg-boxdark border-stroke dark:border-strokedark">
                                                {MARKETS.filter(market => market.active).map((market) => (
                                                    <SelectItem
                                                        key={market.id}
                                                        value={market.value}
                                                        className="focus:bg-gray dark:focus:bg-meta-4"
                                                    >
                                                        {market.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                        Acknowledgement
                    </h2>

                    <div className="space-y-6 bg-gray dark:bg-meta-4 p-6 rounded-lg">
                        <ul className="space-y-3 text-body dark:text-bodydark">
                            <li>• I confirm that all information provided in this form is accurate and true to the best of my knowledge.</li>
                            <li>• I acknowledge that the person I am referring has given their consent to be contacted by Lookcard Limited regarding this program.</li>
                            <li>• I understand that submitting a referral does not guarantee acceptance into the program for the referred individual.</li>
                            <li>• I acknowledge that any benefits or rewards for this referral are subject to the referred individual meeting the program's eligibility and joining requirement.</li>
                        </ul>


                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="agreed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-stroke dark:border-strokedark data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-body dark:text-bodydark">
                                    I agree to all the terms stated above, including compliance with the program requirements, ethical conduct, and privacy policies.
                                    I confirm that I understand and accept these terms for both my application and any referrals I submit.
                                </FormLabel>
                                <FormMessage className="text-meta-1" />
                            </div>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!form.getValues("agreed") || !isVerified || !isMatched}
                        className="bg-primary hover:bg-primary/90 text-white disabled:bg-primary/50"
                    >
                        Recruit
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default RecruitAgentForm;