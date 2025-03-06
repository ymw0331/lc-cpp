'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Loader from '@/components/common/Loader';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { resellerApi } from '@/api/reseller/reseller.api';

interface UserProfile {
    id?: number;
    uuid?: string;
    first_name?: string | null;
    last_name?: string | null;
    profileId?: string | null;
    email?: string | null;
    username?: string | null;
    status?: string | null;
    verified_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    phone_no?: string | null;
    country_code?: number | null;
    cardId?: number | null;
    ekycStatus?: string | null;
    cardStatus?: string | null;
    firstDeposit?: boolean | null;
}

const UserProfilePage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) {
                    throw new Error("User ID is required");
                }

                setLoading(true);

                // Fetch the reseller data to get direct referrals
                const resellerData = await resellerApi.getResellerInfo();

                // Check if directReferral exists and is an array
                if (!resellerData.directReferral || !Array.isArray(resellerData.directReferral)) {
                    throw new Error("Direct referral data not available");
                }

                const userReferral = resellerData.directReferral.find(
                    (ref) =>
                        ref.user.profileId === userId ||
                        ref.user.uuid === userId
                );

                if (!userReferral) {
                    throw new Error("User not found in direct referrals");
                }

                setUserData(userReferral.user);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

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

    // Get country name from country code
    const getCountryName = (countryCode: number | undefined) => {
        if (!countryCode) return "N/A";

        const countries: Record<number, string> = {
            60: "MALAYSIA",
            65: "SINGAPORE",
            66: "THAILAND",
            156: "CHINA",
            840: "UNITED STATES",
            // Add more as needed
        };

        return countries[countryCode] || "UNKNOWN";
    };

    if (loading) return (
        <DefaultLayout>
            <Breadcrumb pageName='User Profile' />
            <Loader />
        </DefaultLayout>
    );

    if (error || !userData) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName='User Profile' />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-red-500 mb-4">Failed to load user profile</div>
                    <p className="text-bodydark mb-6">{error?.message}</p>
                    <Link href="/referred-users/manage-user">
                        <button className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            Back
                        </button>
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    // Get display name from available fields
    const displayName = userData.first_name && userData.last_name
        ? `${userData.first_name} ${userData.last_name}`
        : userData.username || userData.email?.split('@')[0] || "User";

    return (
        <DefaultLayout>
            <Breadcrumb pageName='User Profile' />

            <Link href="/referred-users/manage-user">
                <button className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>
            </Link>

            {/* Top Card - User Summary */}
            <Card className="mb-6 p-6 bg-white dark:bg-boxdark">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                {getFirstLetter(displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-black dark:text-white">{displayName.toUpperCase()}</h2>
                            <p className="text-red-500 font-medium">User</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div>
                            <span className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-md">
                                {userData.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Account Activation:</span>
                        <span className="text-black dark:text-white font-medium">
                            {formatDate(userData.verified_at || 'N/A')}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">Physical Card:</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.cardStatus === 'active' ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Bottom Card - Personal Details */}
            <Card className="p-6 bg-white dark:bg-boxdark">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6">PERSONAL DETAILS:</h3>

                <div className="grid gap-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">FULL NAME :</span>
                        <span className="text-black dark:text-white font-medium">{displayName}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">CONTACT NO :</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.phone_no ? `+${userData.country_code} ${userData.phone_no}` : 'N/A'}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">EMAIL ADDRESS :</span>
                        <span className="text-black dark:text-white font-medium">{userData.email}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                        <span className="text-gray-500 mb-2 sm:mb-0">DIGITAL ID :</span>
                        <span className="text-black dark:text-white font-medium">
                            {userData.profileId || userData.uuid || 'N/A'}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                        <span className="text-gray-500 mb-2 sm:mb-0">COUNTRY:</span>
                        <span className="text-black dark:text-white font-medium">
                            {getCountryName(userData.country_code || undefined)}
                        </span>
                    </div>
                </div>
            </Card>
        </DefaultLayout>
    );
};

export default UserProfilePage;