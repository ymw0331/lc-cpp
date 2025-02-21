"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/api-utils';
import { recruitApi } from '@/api/referral/referral.api';
import Loader from '@/components/common/Loader';


const ReferredUsersPage = () => {

    const { t } = useTranslation();

    const [recruitData, setRecruitData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {
        fetchData(
            recruitApi.getRecruitData,
            setRecruitData,
            setError,
            setLoading
        );
    }, []);

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('referredUsersPage.failedToLoadData')}</p>
            </div>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("referredUsersPage.referredUsersBreadcrumb")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                <div className="w-full md:w-2/4">
                    {/* Top Row */}
                    <RecruitCard
                        count={recruitData.count}
                        agentsToPartner={{
                            count: recruitData.agentsToPartner.count ?? 0,
                            trend: recruitData.agentsToPartner.trend
                        }}
                    />
                </div>

                {/* Chart */}
                <AnalyticChart
                    title={t("referredUsersPage.recruitmentSummary")}
                    chartData={recruitData.chartData}
                    showLegend={true}
                    legendLabel={t("referredUsersPage.totalDirectRecruit")}
                    legendPosition="top-right"
                    lineColor="#F69732"
                    comingSoon={true} 
                />
            </div>

        </DefaultLayout>
    )
}

export default ReferredUsersPage
