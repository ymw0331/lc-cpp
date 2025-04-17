'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Loader from '@/components/common/Loader';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, Calendar, CreditCard, User, Globe, Users, UserPlus,
    Mail, Phone, Award, FileText, CheckCircle, DollarSign, Flag,
    Shield, BarChart4, Target
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { resellerApi } from '@/api/reseller/reseller.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentLevelCard from '@/components/Cards/AgentLevelCard';
import CircularProgressCard from '@/components/Cards/CircularProgressCard';
import { formatDateTimeWithHK } from '@/lib/dateUtils';
import { AgentProfileSkeleton } from '@/components/common/Skeletons';
import { UserOrResellerProfileResponse, ResellerResponse } from '@/api/reseller/reseller.types';

const AgentProfilePage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const profileId = params.ownerProfileId as string;

    const [agentData, setAgentData] = useState<UserOrResellerProfileResponse | null>(null);
    const [resellerData, setResellerData] = useState<ResellerResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                if (!profileId) {
                    throw new Error("Profile ID is required");
                }

                setLoading(true);

                try {
                    // Fetch the agent profile data
                    const profileData = await resellerApi.getUserOrResellerProfile(profileId);
                    setAgentData(profileData);

                    // Also fetch the reseller data to get downstreams and directReferrals
                    const resellerResponse = await resellerApi.getAgentData(profileId);
                    setResellerData(resellerResponse);
                    
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching agent data:", error);
                    setError(error instanceof Error ? error : new Error("Failed to fetch agent data"));
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error in fetchAgentData:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch agent data"));
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [profileId]);

    // Get color based on agent tier/level
    const getAgentColor = (ranking: string): string => {
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
        return name ? name.charAt(0).toUpperCase() : 'A';
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

    if (loading) return (
        <DefaultLayout>
            <AgentProfileSkeleton />
        </DefaultLayout>
    );

    if (error || !agentData) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName={t('agentProfile.title', 'Agent Profile')} />
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-boxdark rounded-xl">
                    <div className="text-red-500 mb-4">{t('agentProfile.failedToLoad', 'Failed to load agent profile')}</div>
                    <p className="text-bodydark mb-6">{error?.message}</p>
                    <Link href="/referred-users/manage-user">
                        <Button variant="ghost" className="group flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            {t('agentProfile.backToAgents', 'Back to Agents')}
                        </Button>
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    // Define the avatar color based on agent's ranking/level
    const avatarColor = getAgentColor(agentData.ranking);

    // Get data from ResellerResponse with safe fallbacks
    const directReferralsCount = resellerData?.directReferral?.length || 0;
    const agentRecruitmentCount = resellerData?.downstreams?.length || 0;
    
    // Get other performance data with fallbacks
    const activationVolumeTarget = agentData?.performance?.cardActivationVolume?.targetValue || 100;
    const activationVolumeCurrent = agentData?.performance?.cardActivationVolume?.currentValue || 0;
    const currentLevel = agentData?.performance?.userLevel?.currentLevel || 'N/A';
    const levelProgress = agentData?.performance?.userLevel?.progress || 0;
    const groupSales = agentData?.performance?.salesSummary?.groupSales || 0;

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t('agentProfile.title', 'Agent Profile')} />

            <Link href="/referred-users/manage-user?tab=agents">
                <Button variant="ghost" className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    {t('agentProfile.backToAgents', 'Back to Agents')}
                </Button>
            </Link>

            {/* Top Card - Agent Summary */}
            <Card className="mb-6 p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className={`${avatarColor} text-white text-2xl`}>
                                {getFirstLetter(agentData.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-black dark:text-white">
                                {agentData.fullName}
                            </h2>
                            <div className="flex items-center gap-2">
                                <Badge className={`${avatarColor} text-white`}>
                                    {agentData.ranking && agentData.ranking !== "N/A" ? agentData.ranking.replace("Tier", "Level") : "USER"}
                                </Badge>

                                {agentData.fromEvent !== 'N/A' && (
                                    <Badge variant="outline" className="border-primary/30 text-primary">
                                        {agentData.fromEvent === 'CPP_CAMPAIGN' ? 'Circle of Growth' : agentData.fromEvent}
                                    </Badge>
                                )}
                                {/* {agentData.digitalId !== "NA.look" && (
                                    <p className="text-gray-500 text-sm">{agentData.digitalId}</p>
                                )} */}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge className={agentData.totalDeposit > 0 ?
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}>
                            {agentData.totalDeposit > 0 && agentData.accountActivation ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Calendar className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('agentProfile.accountActivation', 'Account Activation')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {
                                agentData.accountActivation != null ?
                                    formatDate(agentData.accountActivation) :
                                    "-"
                            }
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('agentProfile.totalDeposit', 'Total Deposit')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {formatCurrency(agentData.totalDeposit)}
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('agentProfile.physicalCard', 'Physical Card')}</span>
                        </div>
                        <span className="text-black dark:text-white font-medium">
                            {agentData.physicalCard ?
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">YES</Badge> :
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">No</Badge>
                            }
                        </span>
                    </div>

                    <div className="flex flex-col p-4 bg-gray-50 dark:bg-boxdark-2 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Globe className="h-5 w-5 text-primary" />
                            <span className="text-sm">{t('agentProfile.country', 'Country')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-black dark:text-white font-medium">
                                {
                                    agentData.country != "N/A" ? agentData.country : "-"
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="w-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark p-1 rounded-md">
                    <TabsTrigger value="details" className="w-full">{t('agentProfile.details', 'PERSONAL DETAILS')}</TabsTrigger>
                    <TabsTrigger value="overview" className="w-full">{t('agentProfile.overview', 'OVERVIEW')}
                    </TabsTrigger>
                </TabsList>

                {/* Personal Details Tab */}
                <TabsContent value="details" className="mt-6">
                    <Card className="p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary" />
                            {t('agentProfile.personalDetails', 'Personal Details')}
                        </h3>

                        <div className="grid gap-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <User className="h-4 w-4 mr-2 text-primary" />
                                    {t('agentProfile.fullName', 'Full Name')}:
                                </span>
                                <span className="text-black dark:text-white font-medium">
                                    {agentData.fullName}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-primary" />
                                    {t('agentProfile.contactNo', 'Contact No')}:
                                </span>
                                <span className="text-black dark:text-white font-medium">
                                    {agentData.contactNo.includes("null") ? "-" : agentData.contactNo}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-primary" />
                                    {t('agentProfile.emailAddress', 'Email Address')}:
                                </span>
                                <span className="text-black dark:text-white font-medium">
                                    {agentData.emailAddress}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                    {t('agentProfile.digitalId', 'Digital ID')}:
                                </span>
                                <span className="text-black dark:text-white font-medium">
                                    {agentData.digitalId.includes("NA.look") ? "-" : agentData.digitalId}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-stroke dark:border-strokedark">
                                <span className="text-gray-500 mb-2 sm:mb-0 flex items-center">
                                    <Award className="h-4 w-4 mr-2 text-primary" />
                                    {t('agentProfile.campaign', 'Campaign')}:
                                </span>
                                <span className="text-black dark:text-white font-medium">
                                    {agentData.fromEvent === 'CPP_CAMPAIGN' ? 'Circle Of Growth Campaign' : agentData.fromEvent === 'N/A' ? '-' : agentData.fromEvent}
                                </span>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Custom Stat Card for Direct Referrals */}
                        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold">{t('agentProfile.directReferrals', 'Direct Referrals')}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Referred Users</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <UserPlus className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{directReferralsCount}</p>
                            <p className="text-xs text-gray-500 mt-1">Total Referred</p>
                        </Card>

                        {/* Circular Progress Card for Card Activation */}
                        <CircularProgressCard
                            title={t('agentProfile.cardActivationVolume', 'Card Activation Volume')}
                            current={activationVolumeCurrent}
                            total={activationVolumeTarget}
                            label={t('agentProfile.activeCards', 'Active Cards')}
                        />

                        {/* Custom Stat Card for Recruited Agents - Only show for non-Tier 1 */}
                        {!agentData.ranking.includes("Tier 1") && (
                            <>
                                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-base font-semibold">{t('agentProfile.recruitedAgents', 'Recruited Agents')}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Active Agents</p>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold">{agentRecruitmentCount}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total Agents</p>
                                </Card>

                                <CircularProgressCard
                                    title={t('agentProfile.totalAgentRecruitment', 'Total Agent Recruitment')}
                                    current={agentRecruitmentCount}
                                    total={agentData?.performance?.totalAgentRecruitment?.targetValue || 100}
                                    label={t('agentProfile.recruitedAgents', 'Recruited Agents')}
                                />
                            </>
                        )}
                    </div>

                    {/* User Level & Sales Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Level Card */}
                        <Card className="p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                            <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center">
                                <Award className="h-5 w-5 mr-2 text-primary" />
                                {t('agentProfile.currentLevelSection.title')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{t('agentProfile.currentLevelSection.title')}</span>
                                    <span className="text-black dark:text-white font-medium">
                                        {currentLevel.replace("Tier", "Level")}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">{t('agentProfile.progress', 'Progress')}</span>
                                        <span className="text-black dark:text-white font-medium">
                                            {levelProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                                    </div>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Max Level</span>
                                    <Badge className={isMaxLevel ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                        {isMaxLevel ? "Yes" : "No"}
                                    </Badge>
                                </div> */}
                            </div>
                        </Card>

                        {/* Sales Summary Card */}
                        <Card className="p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                            <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center">
                                <BarChart4 className="h-5 w-5 mr-2 text-primary" />
                                {t('agentProfile.salesSummarySection.title')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{t('agentProfile.groupSales', 'Group Sales')}</span>
                                    <span className="text-black dark:text-white font-medium">
                                        {formatCurrency(groupSales)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{t('agentProfile.personalSales', 'Personal Sales')}</span>
                                    <span className="text-black dark:text-white font-medium">
                                        {formatCurrency(directReferralsCount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">{t('agentProfile.totalSales', 'Total Sales')}</span>
                                    <span className="text-black dark:text-white font-semibold">
                                        {formatCurrency(groupSales + directReferralsCount)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Overall Status Overview */}
                    {/* <Card className="p-6 bg-white dark:bg-boxdark border-none shadow-sm">
                        <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-primary" />
                            {t('agentProfile.overview', 'OVERVIEW')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.accountActivationDate', 'Account Activation Date')}:</span>
                                <span className="text-black dark:text-white font-medium">
                                    {formatDate(agentData.accountActivation)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.ekycStatus', 'E-KYC STATUS')}:</span>
                                <span>
                                    <Badge className={
                                        agentData.ekycStatus === 'verified'
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    }>
                                        {agentData.ekycStatus || 'Pending'}
                                    </Badge>
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.cardStatus', 'CARD STATUS')}:</span>
                                <span>
                                    <Badge className={
                                        agentData.cardStatus === 'active'
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    }>
                                        {agentData.cardStatus || 'Pending'}
                                    </Badge>
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.firstDeposit', 'FIRST DEPOSIT')}:</span>
                                <span>
                                    {agentData.firstDeposit ?
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {t('agentProfile.completed', 'Completed')}
                                        </Badge> :
                                        <Badge variant="outline">
                                            {t('agentProfile.pending', 'Pending')}
                                        </Badge>
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.physicalCard', 'PHYSICAL CARD')}:</span>
                                <span>
                                    {agentData.physicalCard ?
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {t('agentProfile.issued', 'Issued')}
                                        </Badge> :
                                        <Badge variant="outline">
                                            {t('agentProfile.notIssued', 'Not Issued')}
                                        </Badge>
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-500">{t('agentProfile.campaignParticipant', 'CAMPAIGN PARTICIPANT')}:</span>
                                <span>
                                    {agentData.fromEvent ?
                                        <Badge className="bg-primary/20 text-primary">
                                            {agentData.fromEvent === 'CPP_CAMPAIGN' ? 'Circle of Growth' : agentData.fromEvent}
                                        </Badge> :
                                        <Badge variant="outline">{t('agentProfile.no', 'No')}</Badge>
                                    }
                                </span>
                            </div>
                        </div>
                    </Card> */}
                </TabsContent>
            </Tabs>
        </DefaultLayout>
    );
};

export default AgentProfilePage;