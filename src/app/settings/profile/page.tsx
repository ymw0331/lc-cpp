'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/useToast";
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSkeleton } from '@/components/common/Skeletons';

const formSchema = z.object({
    agentLevel: z.string(),
    // userId: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    contactNo: z.string(),
    referralCode: z.string(),
    keyMarket: z.string(),
});

// Country data types and constants remain the same
type CountryCode = keyof typeof countryData;
type CallingCode = keyof typeof callingCodes;

// Comprehensive country data
const countryData: Record<string, string> = {
    "AF": "Afghanistan", "AL": "Albania", "DZ": "Algeria", "AD": "Andorra", "AO": "Angola",
    "AR": "Argentina", "AM": "Armenia", "AU": "Australia", "AT": "Austria", "AZ": "Azerbaijan",
    "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados", "BY": "Belarus",
    "BE": "Belgium", "BZ": "Belize", "BJ": "Benin", "BT": "Bhutan", "BO": "Bolivia",
    "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BR": "Brazil", "BN": "Brunei",
    "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "CV": "Cabo Verde",
    "KH": "Cambodia", "CM": "Cameroon", "CA": "Canada", "CF": "Central African Republic",
    "TD": "Chad", "CL": "Chile", "CN": "China", "CO": "Colombia", "KM": "Comoros",
    "CG": "Congo", "CD": "Congo (Democratic Republic)", "CR": "Costa Rica", "CI": "Côte d'Ivoire",
    "HR": "Croatia", "CU": "Cuba", "CY": "Cyprus", "CZ": "Czech Republic", "DK": "Denmark",
    "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador",
    "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea",
    "EE": "Estonia", "SZ": "Eswatini", "ET": "Ethiopia", "FJ": "Fiji", "FI": "Finland",
    "FR": "France", "GA": "Gabon", "GM": "Gambia", "GE": "Georgia", "DE": "Germany",
    "GH": "Ghana", "GR": "Greece", "GD": "Grenada", "GT": "Guatemala", "GN": "Guinea",
    "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti", "HN": "Honduras", "HU": "Hungary",
    "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran", "IQ": "Iraq",
    "IE": "Ireland", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan",
    "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "North Korea",
    "KR": "South Korea", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Laos", "LV": "Latvia",
    "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libya", "LI": "Liechtenstein",
    "LT": "Lithuania", "LU": "Luxembourg", "MG": "Madagascar", "MW": "Malawi", "MY": "Malaysia",
    "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands", "MR": "Mauritania",
    "MU": "Mauritius", "MX": "Mexico", "FM": "Micronesia", "MD": "Moldova", "MC": "Monaco",
    "MN": "Mongolia", "ME": "Montenegro", "MA": "Morocco", "MZ": "Mozambique", "MM": "Myanmar",
    "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands", "NZ": "New Zealand",
    "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "MK": "North Macedonia", "NO": "Norway",
    "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestine", "PA": "Panama",
    "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines",
    "PL": "Poland", "PT": "Portugal", "QA": "Qatar", "RO": "Romania", "RU": "Russia",
    "RW": "Rwanda", "KN": "Saint Kitts and Nevis", "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines", "WS": "Samoa", "SM": "San Marino",
    "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal", "RS": "Serbia",
    "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia",
    "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa",
    "SS": "South Sudan", "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname",
    "SE": "Sweden", "CH": "Switzerland", "SY": "Syria", "TW": "Taiwan", "TJ": "Tajikistan",
    "TZ": "Tanzania", "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TO": "Tonga",
    "TT": "Trinidad and Tobago", "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan",
    "TV": "Tuvalu", "UG": "Uganda", "UA": "Ukraine", "AE": "United Arab Emirates",
    "GB": "United Kingdom", "US": "United States", "UY": "Uruguay", "UZ": "Uzbekistan",
    "VU": "Vanuatu", "VA": "Vatican City", "VE": "Venezuela", "VN": "Vietnam",
    "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe"
};

// Country calling codes mapping
const callingCodes: Record<string, string> = {
    "AF": "+93", "AL": "+355", "DZ": "+213", "AD": "+376", "AO": "+244",
    "AR": "+54", "AM": "+374", "AU": "+61", "AT": "+43", "AZ": "+994",
    "BS": "+1", "BH": "+973", "BD": "+880", "BB": "+1", "BY": "+375",
    "BE": "+32", "BZ": "+501", "BJ": "+229", "BT": "+975", "BO": "+591",
    "BA": "+387", "BW": "+267", "BR": "+55", "BN": "+673", "BG": "+359",
    "BF": "+226", "BI": "+257", "CV": "+238", "KH": "+855", "CM": "+237",
    "CA": "+1", "CF": "+236", "TD": "+235", "CL": "+56", "CN": "+86",
    "CO": "+57", "KM": "+269", "CG": "+242", "CD": "+243", "CR": "+506",
    "CI": "+225", "HR": "+385", "CU": "+53", "CY": "+357", "CZ": "+420",
    "DK": "+45", "DJ": "+253", "DM": "+1", "DO": "+1", "EC": "+593",
    "EG": "+20", "SV": "+503", "GQ": "+240", "ER": "+291", "EE": "+372",
    "SZ": "+268", "ET": "+251", "FJ": "+679", "FI": "+358", "FR": "+33",
    "GA": "+241", "GM": "+220", "GE": "+995", "DE": "+49", "GH": "+233",
    "GR": "+30", "GD": "+1", "GT": "+502", "GN": "+224", "GW": "+245",
    "GY": "+592", "HT": "+509", "HN": "+504", "HU": "+36", "IS": "+354",
    "IN": "+91", "ID": "+62", "IR": "+98", "IQ": "+964", "IE": "+353",
    "IL": "+972", "IT": "+39", "JM": "+1", "JP": "+81", "JO": "+962",
    "KZ": "+7", "KE": "+254", "KI": "+686", "KP": "+850", "KR": "+82",
    "KW": "+965", "KG": "+996", "LA": "+856", "LV": "+371", "LB": "+961",
    "LS": "+266", "LR": "+231", "LY": "+218", "LI": "+423", "LT": "+370",
    "LU": "+352", "MG": "+261", "MW": "+265", "MY": "+60", "MV": "+960",
    "ML": "+223", "MT": "+356", "MH": "+692", "MR": "+222", "MU": "+230",
    "MX": "+52", "FM": "+691", "MD": "+373", "MC": "+377", "MN": "+976",
    "ME": "+382", "MA": "+212", "MZ": "+258", "MM": "+95", "NA": "+264",
    "NR": "+674", "NP": "+977", "NL": "+31", "NZ": "+64", "NI": "+505",
    "NE": "+227", "NG": "+234", "MK": "+389", "NO": "+47", "OM": "+968",
    "PK": "+92", "PW": "+680", "PS": "+970", "PA": "+507", "PG": "+675",
    "PY": "+595", "PE": "+51", "PH": "+63", "PL": "+48", "PT": "+351",
    "QA": "+974", "RO": "+40", "RU": "+7", "RW": "+250", "KN": "+1",
    "LC": "+1", "VC": "+1", "WS": "+685", "SM": "+378", "ST": "+239",
    "SA": "+966", "SN": "+221", "RS": "+381", "SC": "+248", "SL": "+232",
    "SG": "+65", "SK": "+421", "SI": "+386", "SB": "+677", "SO": "+252",
    "ZA": "+27", "SS": "+211", "ES": "+34", "LK": "+94", "SD": "+249",
    "SR": "+597", "SE": "+46", "CH": "+41", "SY": "+963", "TW": "+886",
    "TJ": "+992", "TZ": "+255", "TH": "+66", "TL": "+670", "TG": "+228",
    "TO": "+676", "TT": "+1", "TN": "+216", "TR": "+90", "TM": "+993",
    "TV": "+688", "UG": "+256", "UA": "+380", "AE": "+971", "GB": "+44",
    "US": "+1", "UY": "+598", "UZ": "+998", "VU": "+678", "VA": "+39",
    "VE": "+58", "VN": "+84", "YE": "+967", "ZM": "+260", "ZW": "+263"
};

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            agentLevel: "",
            // userId: "",
            fullName: "",
            email: "",
            contactNo: "",
            referralCode: "",
            keyMarket: "",
        },
    });

    // Memoize these functions with useCallback
    const getCountryName = useCallback((countryCode: string | undefined | null): string => {
        if (!countryCode || typeof countryCode !== 'string') return t("common.unknown");
        const code = countryCode.toUpperCase();
        return countryData[code] || countryCode;
    }, [t]);

    const getCallingCode = useCallback((countryCode: string | undefined | null): string => {
        if (!countryCode || typeof countryCode !== 'string') return "";
        const code = countryCode.toUpperCase();
        return callingCodes[code] || "";
    }, []);

    const formatPhoneWithCountryCode = useCallback((
        phoneNumber: string | undefined | null,
        countryCode: string | undefined | null
    ): string => {
        if (!phoneNumber) return "";
        const callingCode = getCallingCode(countryCode);
        if (phoneNumber.startsWith('+')) return phoneNumber;
        if (!callingCode) return phoneNumber;
        const cleanedPhone = phoneNumber.replace(/^0+/, '');
        return `${callingCode} ${cleanedPhone}`;
    }, [getCallingCode]);

    // Determine agent level based on tierPriority
    const determineAgentLevel = useCallback((tierPriority: number | undefined): string => {
        if (tierPriority === undefined) return t("profilePage.notAvailable");

        switch (tierPriority) {
            case 1:
                return t("profilePage.agentLevels.level1");
            case 2:
                return t("profilePage.agentLevels.level2");
            case 3:
                return t("profilePage.agentLevels.level3");
            case 4:
                return t("profilePage.agentLevels.level4");
            case 5:
                return t("profilePage.agentLevels.level5");
            default:
                return `${t("profilePage.agentLevels.level")} ${tierPriority}`;
        }
    }, [t]);

    // Initialize form data once when user data is available
    useEffect(() => {
        if (user && isLoading) {
            const countryCode = user.country_code;
            const countryName = getCountryName(countryCode);
            const formattedPhone = formatPhoneWithCountryCode(user.phoneNumber, countryCode);
            const agentLevel = determineAgentLevel(user.tierPriority);

            form.reset({
                agentLevel,
                // userId: user.userId || "",
                fullName: user.fullName || "",
                email: user.email || "",
                contactNo: formattedPhone,
                referralCode: user.referralCode || "",
                keyMarket: countryName,
            });
            setIsLoading(false);
        }
    }, [user, form, getCountryName, formatPhoneWithCountryCode, determineAgentLevel, isLoading]);

    const handleCopyReferralCode = useCallback(() => {
        const referralCode = form.getValues("referralCode");
        navigator.clipboard.writeText(referralCode);
        toast({
            title: t("profilePage.copy.success.title"),
            description: t("profilePage.copy.success.description"),
            duration: 2000,
        });
    }, [form, t]);


    if (isLoading) {
        return <DefaultLayout><ProfileSkeleton /></DefaultLayout>;
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("profilePage.profileBreadcrumb")} />

            <div className="w-full">
                <div className="rounded-xl border border-stroke bg-white px-7.5 py-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                    <h3 className="mb-5.5 text-title-sm text-black dark:text-white">
                        {t("profilePage.profileDetail")}
                    </h3>

                    <Form {...form}>
                        <form className="space-y-5.5">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Account Ranking Field */}
                                <FormField
                                    control={form.control}
                                    name="agentLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.accountRanking")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* User ID Field */}
                                {/* <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.userId")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                /> */}

                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.fullName")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                    readOnly
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
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.email")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                    readOnly
                                                />
                                            </FormControl>
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
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.contactNo")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    disabled
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />

                                {/* Referral Code Field */}
                                <FormField
                                    control={form.control}
                                    name="referralCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.referralCode")}
                                            </FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        readOnly
                                                        disabled
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
                                            <FormLabel className="mb-2.5 block font-medium text-black dark:text-white">
                                                {t("profilePage.keyMarket")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    disabled
                                                    className="w-full rounded-lg border border-stroke bg-whiter py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1 text-xs text-meta-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </DefaultLayout>

    )
}

export default ProfilePage