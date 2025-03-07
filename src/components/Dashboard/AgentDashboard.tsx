"use client";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ProfileCard from "../Cards/ProfileCard";
import RecruitCard from "../Cards/RecruitCard";
import ReferralCard from "../Cards/ReferralCard";
import AgentStatCard from "../Cards/AgentStatCard";
import IncomeSummaryTable from "../Tables/IncomeSummaryTable";
import { DepositActivityTable } from "../Tables/DepositActivityTable";
import { RewardWalletBalanceIcon, TotalDepositAmountIcon, DirectRecruitIncentiveIcon } from "../Icons/dashboard";
import Loader from "../common/Loader";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { incentiveApi, IncentiveResponse } from "@/api/incentive/incentive.api";
import { DashboardStatistics } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ProfileWithReferralCard from "../Cards/ProfileWithReferralCard";
import AgentLevelIcon from "../Icons/dashboard/AgentLevelIcon";
import RecruitAgentCard from "../Cards/RecruitAgentCard";

const AgentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [incentiveData, setIncentiveData] = useState<IncentiveResponse | null>(null);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both dashboard and incentive data
        const [dashboardData, incentiveData] = await Promise.all([
          dashboardApi.getDashboardData(),
          incentiveApi.getIncentiveData()
        ]);

        setDashboardData(dashboardData);
        setIncentiveData(incentiveData);

        // Extract available months for the income summary component
        if (incentiveData && incentiveData.activities && incentiveData.activities.activities) {
          const months = Object.keys(incentiveData.activities.activities);

          // Sort months by date (most recent first)
          const sortedMonths = [...months].sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
          });

          setAvailableMonths(sortedMonths);
        }

        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error || !dashboardData || !incentiveData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{t('agentDashboard.failedToLoadData')}</p>
      </div>
    );
  }

  const canAccessRecruitment = checkTierPermission(
    user?.tierPriority ?? 0,
    TIER_PERMISSIONS.LEVEL_2_TIER
  );

  const canAccessIncentives = checkTierPermission(
    user?.tierPriority ?? 0,
    TIER_PERMISSIONS.LEVEL_2_TIER
  );

  // For Level 1 agents
  if (user?.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER) {
    return (
      <>
        <Breadcrumb pageName={t('agentDashboard.overview')} />

        {/* Main Dashboard Layout - Following Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Profile With Referral */}
          <div className="lg:col-span-2">
            <ProfileWithReferralCard
              name={user.fullName ?? user.email}
              level={user.tierPriority.toString()}
              activeUsers={dashboardData.agentProfile.activeUsers}
              referralCode={dashboardData.referralCode}
            />
          </div>

          {/* Right Column - 2x2 Grid of Cards */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Top Row */}
              <AgentStatCard
                icon={<RewardWalletBalanceIcon />}
                title={t('agentDashboard.rewardWalletBalance')}
                amount={dashboardData.rewardWallet.balance}
              />

              <AgentStatCard
                icon={<DirectRecruitIncentiveIcon />}
                title={t('agentDashboard.referralFeeBonus')}
                amount={incentiveData.summary.directReferralFee}
              />

              {/* Bottom Row */}
              <AgentStatCard
                icon={<TotalDepositAmountIcon />}
                title={t('agentDashboard.referralDepositVolume')}
                amount={dashboardData.totalDeposits.amount}
              />

              <AgentStatCard
                icon={<AgentLevelIcon />}
                title={t('agentDashboard.depositAdminChargeRebate')}
                amount={incentiveData.summary.directTopupRebate}
              />
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        {/* <div className="space-y-6">
          <StatisticChart
            title={t('agentDashboard.referralDepositVolume')}
            // title={t('agentDashboard.referredDepositVolume')}
            total={dashboardData.totalDeposits.amount}
            currency={dashboardData.totalDeposits.currency}
            chartData={dashboardData.totalDeposits.chartData}
          />

          <DepositActivityTable
            activities={dashboardData.depositActivities}
          />
        </div> */}
        {/* add  */}


        {/* Income Summary Table */}
        <div className="mb-6">
          <IncomeSummaryTable
            incentiveData={incentiveData}
            availableMonths={availableMonths}
          />
        </div>

      </>
    );
  }

  // For other agent tiers, maintain the original layout
  const visibleStatCards = [
    {
      icon: <RewardWalletBalanceIcon />,
      title: t('agentDashboard.rewardWalletBalance'),
      amount: dashboardData.rewardWallet.balance,
    },
    {
      icon: <TotalDepositAmountIcon />,
      title: t('agentDashboard.referralDepositVolume'),
      amount: dashboardData.totalDeposits.amount,
    },
    canAccessIncentives && {
      icon: <DirectRecruitIncentiveIcon />,
      title: t('agentDashboard.referralFeeBonus'),
      amount: incentiveData.summary.directReferralFee,
    },
  ].filter(Boolean);

  // For other agent tiers, maintain the original layout
  return (
    <>
      <Breadcrumb pageName={t('agentDashboard.overview')} />

      {/* Stats Cards with dynamic grid */}
      <div className={clsx(
        "grid gap-4 md:gap-6 2xl:gap-7.5 mb-6", {
        'grid-cols-1 md:grid-cols-2': visibleStatCards.length === 2,
        'grid-cols-1 md:grid-cols-2 xl:grid-cols-3': visibleStatCards.length === 3,
      }
      )}>
        {visibleStatCards.map((card, index) => (
          card && (
            <AgentStatCard
              key={index}
              icon={card.icon}
              title={card.title}
              amount={card.amount}
            />
          )
        ))}
      </div>

      {/* Profile and Referral/Recruitment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Card - Always spans first column */}
        <div className="lg:col-span-2">
          <ProfileCard
            name={user?.fullName ?? user?.email ?? ''}
            level={user?.tierPriority?.toString() ?? ''}
            activeUsers={dashboardData.agentProfile.activeUsers}
          />
        </div>

        {/* Right Column - Referral and Recruitment */}
        <div className="space-y-6">
          {/* Recruitment Card - Only for higher tiers */}
          {canAccessRecruitment && (
            <RecruitCard
              count={dashboardData.totalDirectRecruit.count}
              agentsToPartner={{
                count: dashboardData.totalDirectRecruit.agentsToPartner
              }}
            // totalReferral={dashboardData.totalReferral} 
            />
          )}

          {/* Referral Card - Available to all tiers */}
          <ReferralCard code={dashboardData.referralCode} />
        </div>
      </div>


      <div className="mb-6">
        <RecruitAgentCard />
      </div>


      {/* Income Summary Table */}
      <div className="mb-6">
        <IncomeSummaryTable
          incentiveData={incentiveData}
          availableMonths={availableMonths}
        />
      </div>


      {/* Charts and Tables Section */}
      {/* <div className="space-y-6">
        <StatisticChart
          title={t('agentDashboard.referralDepositVolume')}
          // title={t('agentDashboard.referredDepositVolume')}
          total={dashboardData.totalDeposits.amount}
          currency={dashboardData.totalDeposits.currency}
          chartData={dashboardData.totalDeposits.chartData}
        />

        <DepositActivityTable
          activities={dashboardData.depositActivities}
        />
      </div> */}
    </>
  );
};

export default AgentDashboard;