"use client";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ProfileCard from "../Cards/ProfileCard";
import RecruitCard from "../Cards/RecruitCard";
import ReferralCard from "../Cards/ReferralCard";
import AgentStatCard from "../Cards/AgentStatCard";
import StatisticChart from "../Charts/StatisticChart";
import { DepositActivityTable } from "../Tables/DepositActivityTable";
import { RewardWalletBalanceIcon, TotalDepositAmountIcon, DirectRecruitIncentiveIcon } from "../Icons/dashboard";
import Loader from "../common/Loader";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { incentiveApi } from "@/api/incentive/incentive.api";
import { DashboardStatistics } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ProfileWithReferralCard from "../Cards/ProfileWithReferralCard";
import AgentLevelIcon from "../Icons/dashboard/AgentLevelIcon";

const AgentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [incentiveData, setIncentiveData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both dashboard and incentive data
        const [dashboardData, incentiveResult] = await Promise.all([
          dashboardApi.getDashboardData(),
          incentiveApi.getIncentiveData()
        ]);

        setDashboardData(dashboardData);
        setIncentiveData(incentiveResult);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (!user || loading) {
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
    user.tierPriority,
    TIER_PERMISSIONS.MIN_TIER_FOR_RECRUITMENT
  );

  const canAccessIncentives = checkTierPermission(
    user.tierPriority,
    TIER_PERMISSIONS.MIN_TIER_FOR_INCENTIVES
  );

  // For Level 1 agents
  if (user.tierPriority === TIER_PERMISSIONS.MILESTONE_BONUS_TIER) {
    return (
      <>
        <Breadcrumb pageName={t('agentDashboard.overview')} />

        {/* Main Dashboard Layout - Following Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Profile With Referral */}
          <div className="lg:col-span-2">
            <ProfileWithReferralCard
              name={dashboardData.agentProfile.name}
              level={dashboardData.agentProfile.level}
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
                amount={dashboardData.directRecruitment.earnings}
              />

              {/* Bottom Row */}
              <AgentStatCard
                icon={<TotalDepositAmountIcon />}
                title={t('agentDashboard.referredDepositAmount')}
                amount={dashboardData.totalDeposits.amount}
              />

              <AgentStatCard
                icon={<AgentLevelIcon />}
                title={t('agentDashboard.depositAdminChargeRebate')}
                amount={incentiveData.summary.direct_admin_charge}
              />
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        <div className="space-y-6">
          <StatisticChart
            title={t('agentDashboard.referredDepositVolume')}
            total={dashboardData.totalDeposits.amount}
            currency={dashboardData.totalDeposits.currency}
            chartData={dashboardData.totalDeposits.chartData}
          />

          <DepositActivityTable
            activities={dashboardData.depositActivities}
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
      title: t('agentDashboard.referredDepositAmount'),
      amount: dashboardData.totalDeposits.amount,
    },
    canAccessIncentives && {
      icon: <DirectRecruitIncentiveIcon />,
      title: t('agentDashboard.referralFeeBonus'),
      amount: dashboardData.directRecruitment.earnings,
    },
  ].filter(Boolean);

  return (
    <>
      <Breadcrumb pageName={t('agentDashboard.overview')} />

      {/* Stats Cards with dynamic grid */}
      <div className={clsx(
        "grid gap-4 md:gap-6 2xl:gap-7.5 mb-6",
        {
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
            name={dashboardData.agentProfile.name}
            level={dashboardData.agentProfile.level}
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
            />
          )}

          {/* Referral Card - Available to all tiers */}
          <ReferralCard code={dashboardData.referralCode} />
        </div>
      </div>

      {/* Incentive Card (for non-Level 1 agents) */}
      {/* {canAccessIncentives && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <IncentiveCard
            title={t("incentiveManagementPage.directDepositAdminChargeRebate")}
            amount={incentiveData.summary.direct_admin_charge}
          />
        </div>
      )} */}

      {/* Charts and Tables Section */}
      <div className="space-y-6">
        <StatisticChart
          title={t('agentDashboard.referredDepositVolume')}
          total={dashboardData.totalDeposits.amount}
          currency={dashboardData.totalDeposits.currency}
          chartData={dashboardData.totalDeposits.chartData}
        />

        <DepositActivityTable
          activities={dashboardData.depositActivities}
        />
      </div>
    </>
  );
};

export default AgentDashboard;