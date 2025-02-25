"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
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
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
    referralId: z.string(), // TODO: change to reseller id of the profile
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    market: z.string(),
    agreed: z
        .boolean()
        .refine((val) => val === true, "You must agree to the terms"),
});

interface Market {
    id: string;
    value: string;
    label: string;
    code?: string; // optional country code
    currency?: string; // optional currency code
    timezone?: string; // optional timezone
    active?: boolean; // to control availability
}

// Afghanistan  
// Albania  
// Algeria  
// Andorra  
// Angola  
// Antigua and Barbuda  
// Argentina  
// Armenia  
// Australia  
// Austria  
// Azerbaijan  
// Bahamas  
// Bahrain  
// Bangladesh  
// Barbados  
// Belarus  
// Belgium  
// Belize  
// Benin  
// Bhutan  
// Bolivia  
// Bosnia and Herzegovina  
// Botswana  
// Brazil  
// Brunei  
// Bulgaria  
// Burkina Faso  
// Burundi  
// Cabo Verde  
// Cambodia  
// Cameroon  
// Canada  
// Central African Republic  
// Chad  
// Chile  
// China  
// Colombia  
// Comoros  
// Congo (Congo-Brazzaville)  
// Congo (Democratic Republic of the)  
// Costa Rica  
// Croatia  
// Cuba  
// Cyprus  
// Czechia (Czech Republic)  
// Denmark  
// Djibouti  
// Dominica  
// Dominican Republic  
// Ecuador  
// Egypt  
// El Salvador  
// Equatorial Guinea  
// Eritrea  
// Estonia  
// Eswatini (Swaziland)  
// Ethiopia  
// Fiji  
// Finland  
// France  
// Gabon  
// Gambia  
// Georgia  
// Germany  
// Ghana  
// Greece  
// Grenada  
// Guatemala  
// Guinea  
// Guinea-Bissau  
// Guyana  
// Haiti  
// Honduras  
// Hong Kong
// Hungary  
// Iceland  
// India  
// Indonesia  
// Iran  
// Iraq  
// Ireland  
// Israel  
// Italy  
// Jamaica  
// Japan  
// Jordan  
// Kazakhstan  
// Kenya  
// Kiribati  
// Korea (North)  
// Korea (South)  
// Kuwait  
// Kyrgyzstan  
// Laos  
// Latvia  
// Lebanon  
// Lesotho  
// Liberia  
// Libya  
// Liechtenstein  
// Lithuania  
// Luxembourg  
// Madagascar  
// Malawi  
// Malaysia  
// Maldives  
// Mali  
// Malta  
// Marshall Islands  
// Mauritania  
// Mauritius  
// Mexico  
// Micronesia  
// Moldova  
// Monaco  
// Mongolia  
// Montenegro  
// Morocco  
// Mozambique  
// Myanmar (Burma)  
// Namibia  
// Nauru  
// Nepal  
// Netherlands  
// New Zealand  
// Nicaragua  
// Niger  
// Nigeria  
// North Macedonia (Macedonia)  
// Norway  
// Oman  
// Pakistan  
// Palau  
// Palestine State  
// Panama  
// Papua New Guinea  
// Paraguay  
// Peru  
// Philippines  
// Poland  
// Portugal  
// Qatar  
// Romania  
// Russia  
// Rwanda  
// Saint Kitts and Nevis  
// Saint Lucia  
// Saint Vincent and the Grenadines  
// Samoa  
// San Marino  
// Sao Tome and Principe  
// Saudi Arabia  
// Senegal  
// Serbia  
// Seychelles  
// Sierra Leone  
// Singapore  
// Slovakia  
// Slovenia  
// Solomon Islands  
// Somalia  
// South Africa  
// South Sudan  
// Spain  
// Sri Lanka  
// Sudan  
// Suriname  
// Sweden  
// Switzerland  
// Syria  
// Tajikistan  
// Taiwan
// Tanzania  
// Thailand  
// Timor-Leste  
// Togo  
// Tonga  
// Trinidad and Tobago  
// Tunisia  
// Turkey  
// Turkmenistan  
// Tuvalu  
// Uganda  
// Ukraine  
// United Arab Emirates  
// United Kingdom  
// United States of America  
// Uruguay  
// Uzbekistan  
// Vanuatu  
// Vatican City (Holy See)  
// Venezuela  
// Vietnam  
// Yemen  
// Zambia  
// Zimbabwe

const MARKETS: Market[] = [
    {
        id: "1",
        value: "hong-kong",
        label: "Hong Kong",
        code: "HK",
        currency: "HKD",
        timezone: "Asia/Hong_Kong",
        active: true,
    },
    {
        id: "2",
        value: "singapore",
        label: "Singapore",
        code: "SG",
        currency: "SGD",
        timezone: "Asia/Singapore",
        active: true,
    },
    {
        id: "3",
        value: "malaysia",
        label: "Malaysia",
        code: "MY",
        currency: "MYR",
        timezone: "Asia/Kuala_Lumpur",
        active: true,
    },
    {
        id: "4",
        value: "thailand",
        label: "Thailand",
        code: "TH",
        currency: "THB",
        timezone: "Asia/Bangkok",
        active: true,
    },
];

const RecruitAgentPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // Initial state values
    // const [initialValues] = useState({
    //     referralId: "AS7JDS38",
    //     fullName: "Joby Tan",
    //     email: "joby.tan@lookcard.io",
    //     market: MARKETS[0].value,
    //     agreed: false,
    // });

    // Verification states
    const [isVerified, setIsVerified] = useState(false);
    const [isMatched, setIsMatched] = useState(false);

    // Form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: initialValues,
        defaultValues: {
            referralId: user?.referralCode || '', // Populate referralId from auth context
            fullName: '',
            email: '',
            market: '',
            agreed: false,
        },
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

                        <div className="grid gap-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Referral ID */}
                                <FormField
                                    control={form.control}
                                    name="referralId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.referralId")}
                                            </FormLabel>
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
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.fullName")}*
                                            </FormLabel>
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
                                            <FormLabel className="text-black dark:text-bodydark">
                                                {t("recruitAgentPage.registeredEmail")}*
                                            </FormLabel>
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
                                    <FormLabel className="text-black dark:text-bodydark">
                                        {t("recruitAgentPage.memberVerification")}*
                                    </FormLabel>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isVerified
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-gray dark:bg-meta-4 text-body dark:text-bodydark"
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                {t("recruitAgentPage.emailVerified")}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isMatched
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-gray dark:bg-meta-4 text-body dark:text-bodydark"
                                                    }`}
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                {t("recruitAgentPage.matchedEmail")}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleVerify}
                                            variant="outline"
                                            className="border-stroke dark:border-strokedark hover:bg-gray dark:hover:bg-meta-4"
                                        >
                                            {t("recruitAgentPage.check")}
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
                                                    {MARKETS.filter((market) => market.active).map(
                                                        (market) => (
                                                            <SelectItem
                                                                key={market.id}
                                                                value={market.value}
                                                                className="focus:bg-gray dark:focus:bg-meta-4"
                                                            >
                                                                {market.label}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                !form.getValues("agreed") || !isVerified || !isMatched
                            }
                            className="bg-primary hover:bg-primary/90 text-white disabled:bg-primary/50"
                        >
                            {t("recruitAgentPage.recruitButton")}
                        </Button>
                    </div>
                </form>
            </Form>
        </DefaultLayout>
    );
};

export default RecruitAgentPage;
