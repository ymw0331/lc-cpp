'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, Calendar, CreditCard, User, Globe,
    DollarSign,
    Phone,
    Mail,
    FileText
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { resellerApi } from '@/api/reseller/reseller.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateTimeWithHK } from '@/lib/dateUtils';
import { ManageUserProfileSkeleton } from '@/components/common/Skeletons';
import { UserOrResellerProfileResponse } from '@/api/reseller/reseller.types';

const UserProfilePage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const profileId = params.profileId as string;

    const [userData, setUserData] = useState<UserOrResellerProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!profileId) {
                    throw new Error("Profile ID is required");
                }

                setLoading(true);

                try {
                    const profileData = await resellerApi.getUserOrResellerProfile(profileId);
                    setUserData(profileData);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setError(error instanceof Error ? error : new Error("Failed to fetch user profile"));
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error in fetchUserData:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
                setLoading(false);
            }
        };

        fetchUserData();
    }, [profileId]);

    // Get color based on agent tier/level
    const getUserColor = (ranking: string): string => {
        if (ranking === "N/A" || !ranking) {
            return 'bg-blue-500'; // Tier 0 - Blue (for users)
        } else if (ranking.includes("Tier 1")) {
            return 'bg-green-500'; // Tier 1 - Green
        } else if (ranking.includes("Tier 2")) {
            return 'bg-purple-500'; // Tier 2 - Purple
        } else if (ranking.includes("Tier 3")) {
            return 'bg-orange-500'; // Tier 3 - Orange
        } else if (ranking.includes("Tier 4")) {
            return 'bg-pink-500'; // Tier 4 - Pink
        } else if (ranking.includes("Tier 5")) {
            return 'bg-red-500'; // Tier 5 - Red
        }
        return 'bg-blue-500'; // Fallback - Blue
    };


    // Get the first letter of name for avatar
    const getFirstLetter = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Format date
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "N/A";
        return formatDateTimeWithHK(dateString);
    };

    // Format currency
    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return "$0.00";
        return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <DefaultLayout>
                <ManageUserProfileSkeleton />
            </DefaultLayout>
        );
    }

    if (error || !userData) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName={t('userProfile.title', 'User Profile')} />
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-boxdark rounded-xl">
                    <div className="text-red-500 mb-4">{t('userProfile.failedToLoad', 'Failed to load user profile')}</div>
                    <p className="text-bodydark mb-6">{error?.message}</p>
                    <Link href="/referred-users/manage-user">
                        <Button variant="ghost" className="group flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            {t('userProfile.backToUsers', 'Back to Users')}
                        </Button>
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    // Define the avatar color based on agent's ranking/level
    const avatarColor = getUserColor(userData.ranking);

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('userProfile.title', 'User Profile')} />

            <Link href="/referred-users/manage-user">
                <Button variant="ghost" className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    {t('userProfile.backToUsers', 'Back to Users')}
                </Button>
            </Link>

            {/* Top Card - User Summary */}
            <Card className="mb-6 p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className={`${avatarColor} text-white text-2xl`}>
                                {getFirstLetter(userData.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-black dark:text-white">
                                {userData.fullName}
                            </h2>
                            <div className="flex items-center gap-2">
                                <Badge className={`${avatarColor} text-white`}>
                                    {userData.ranking && userData.ranking !== "N/A" ? userData.ranking.replace("Tier", "Level") : "USER"}
                                </Badge>

                                {/* {userData.digitalId !== "NA.look" && (
                                <p className="text-gray-500 text-sm">{userData.digitalId}</p>
                            )} */}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge className={userData.totalDeposit > 0 ?
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                            {userData.totalDeposit > 0 && userData.accountActivation
                                ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('userProfile.accountActivation', 'Account Activation')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {
                                userData.accountActivation != null ?
                                    formatDate(userData.accountActivation) :
                                    "-"
                            }
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('userProfile.totalDeposit', 'Total Deposit')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {formatCurrency(userData.totalDeposit)}
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('userProfile.physicalCard', 'Physical Card')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {userData.physicalCard ?
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">YES</Badge> :
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">No</Badge>
                            }
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Globe className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('userProfile.country', 'Country')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white font-medium">
                                {
                                    userData.country != "N/A" ?
                                        userData.country : "-"
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="w-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark p-1 rounded-md">
                    <TabsTrigger value="details" className="w-full">{t('userProfile.personalDetails', 'PERSONAL DETAILS')}</TabsTrigger>
                </TabsList>

                {/* Personal Details Tab */}
                <TabsContent value="details" className="mt-6">
                    <Card className="p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary" />
                            {t('userProfile.personalDetails', 'Personal Details')}
                        </h3>

                        <div className="grid gap-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <User className="h-4 w-4 mr-2 text-primary" />{t('userProfile.fullName', 'Full Name')}:</span>
                                <span className="text-black dark:text-white font-medium">
                                    {userData.fullName}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-primary" />{t('userProfile.contactNo', 'Contact No')}:</span>
                                <span className="text-black dark:text-white font-medium">
                                    {userData.contactNo.includes("null") ? "-" : userData.contactNo}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-primary" />
                                    {t('userProfile.emailAddress', 'Email Address')}:</span>
                                <span className="text-black dark:text-white font-medium">
                                    {userData.emailAddress}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                    {t('userProfile.digitalId', 'Digital ID')}:</span>
                                <span className="text-black dark:text-white font-medium">
                                    {userData.digitalId.includes("NA.look") ? "-" : userData.digitalId}
                                </span>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </DefaultLayout >
    );
};

export default UserProfilePage;