'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Loader from '@/components/common/Loader';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle, Check, X, Mail, Phone, Globe, User, Calendar, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { resellerApi } from '@/api/reseller/reseller.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfileData {
    id: string;
    fullName: string;
    userId: string;
    resellerId: string;
    ranking: string;
    contactNo: string;
    emailAddress: string;
    digitalId: string;
    country: string;
    accountActivation: string;
    totalDeposit: number;
    physicalCard: boolean;
    ekycStatus: string;
    cardStatus: string;
    firstDeposit: boolean;
    [key: string]: any;
}

const UserProfilePage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const profileId = params.profileId as string;

    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!profileId) {
                    throw new Error("Profile ID is required");
                }

                setLoading(true);

                // Only fetch data from the profile API endpoint
                try {
                    const profileData = await resellerApi.getAgentProfile(profileId);
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

    // Get the first letter of name for avatar
    const getFirstLetter = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Format date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";

        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return date.toLocaleDateString('en-US', options);
    };

    if (loading) return (
        <DefaultLayout>
            <Breadcrumb pageName={t('userProfile.title', 'User Profile')} />
            <Loader />
        </DefaultLayout>
    );

    if (error || !userData) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName={t('userProfile.title', 'User Profile')} />
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('userProfile.failedToLoad', 'Failed to load user profile')}</h3>
                    <p className="text-body dark:text-bodydark mb-6">{error?.message}</p>
                    <Link href="/referred-users/manage-user">
                        <Button variant="outline" className="group flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            {t('userProfile.backToUsers', 'Back to Users')}
                        </Button>
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

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
            <Card className="mb-6 p-6 bg-white dark:bg-boxdark">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                {getFirstLetter(userData.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-black dark:text-white">
                                {userData.fullName.toUpperCase()}
                            </h2>
                            <p className="text-red-500 font-medium">
                                {userData.ranking === "N/A" ? "USER" : userData.ranking}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* todo: clarify whether to use this metric to show Active or Inactive 
                        or using 
                        */}
                        <Badge className={userData.totalDeposit > 0 ?
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                            {userData.totalDeposit > 0 ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-gray-500 text-sm">{t('userProfile.accountActivation', 'Account Activation')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {formatDate(userData.accountActivation)}
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-gray-500 text-sm">{t('userProfile.physicalCard', 'Physical Card')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {userData.physicalCard === true ? "YES" : "-"}
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5 text-primary" />
                            <span className="text-gray-500 text-sm">{t('userProfile.totalDeposit', 'Total Deposit')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            $ {(userData.totalDeposit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-5 w-5 text-primary" />
                            <span className="text-gray-500 text-sm">{t('userProfile.country', 'Country')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {userData.country || "N/A"}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Personal Details Card */}
            <Card className="p-6 bg-white dark:bg-boxdark">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6">{t('userProfile.personalDetails', 'Personal Details')}</h3>

                <div className="grid gap-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">{t('userProfile.fullName', 'FULL NAME')}:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.fullName}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">{t('userProfile.contactNo', 'CONTACT NO')}:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.contactNo || 'N/A'}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">{t('userProfile.emailAddress', 'EMAIL ADDRESS')}:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.emailAddress}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">{t('userProfile.digitalId', 'DIGITAL ID')}:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.digitalId || 'N/A'}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                        <span className="text-gray-500 mb-2 sm:mb-0">{t('userProfile.country', 'COUNTRY')}:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.country || 'N/A'}
                        </span>
                    </div>
                </div>
            </Card>
        </DefaultLayout>
    );
};

export default UserProfilePage;