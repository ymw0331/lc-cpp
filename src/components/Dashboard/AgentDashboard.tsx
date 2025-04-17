"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { incentiveApi } from "@/api/incentive/incentive.api";
import { IncentiveData } from "@/api/incentive/incentive.types";
import { DashboardStatistics } from "@/api/dashboard/dashboard.types";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProfileCard from "@/components/Cards/ProfileCard";
import RecruitCard from "@/components/Cards/RecruitCard";
import ReferralCard from "@/components/Cards/ReferralCard";
import AgentStatCard from "@/components/Cards/AgentStatCard";
import IncomeSummaryTable from "@/components/Tables/IncomeSummaryTable";
import { DepositActivityTable } from "@/components/Tables/DepositActivityTable";
import { RewardWalletBalanceIcon, TotalDepositAmountIcon, DirectRecruitIncentiveIcon } from "@/components/Icons/dashboard";
import ProfileWithReferralCard from "@/components/Cards/ProfileWithReferralCard";
import AgentLevelIcon from "@/components/Icons/dashboard/AgentLevelIcon";
import RecruitAgentCard from "@/components/Cards/RecruitAgentCard";
import { AgentDashboardSkeleton } from "@/components/common/Skeletons";
import DepositOverviewChart from "@/components/Charts/DepositOverviewChart";
import ErrorDisplay from '@/components/common/ErrorDisplay';


const AgentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [incentiveData, setIncentiveData] = useState<IncentiveData | null>(null);
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
    return <AgentDashboardSkeleton />;
  }

  if (error || !dashboardData || !incentiveData) {
    return <ErrorDisplay errorMessage={error?.message} />;
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
                amount={dashboardData.rewardWallet.balance || 0}
              />

              <AgentStatCard
                icon={<DirectRecruitIncentiveIcon />}
                title={t('agentDashboard.referralFeeBonus')}
                amount={incentiveData?.summary?.directReferralFee || 0}
              />

              {/* Bottom Row */}
              <AgentStatCard
                icon={<TotalDepositAmountIcon />}
                title={t('agentDashboard.referralDepositVolume')}
                amount={dashboardData.referralDepositVolume.amount || 0}
              />

              <AgentStatCard
                icon={<AgentLevelIcon />}
                title={t('agentDashboard.depositAdminChargeRebate')}
                amount={incentiveData?.summary?.directTopupRebate || 0}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6 mb-6">
          <DepositOverviewChart lineColor="#7C74FF" />

          {/* <DepositActivityTable
            activities={dashboardData.depositActivities}
          /> */}
        </div>

        {/* Income Summary Table */}
        <div className="mb-6">
          <IncomeSummaryTable
            incentiveData={incentiveData || {
              activities: { activities: {} },
              summary: {
                total_incentive: 0,
                milestoneAchievement: {
                  activatedUsers: 0,
                  targetUsers: 0,
                  completeAt: null,
                  milestones: [],
                  milestone_bonus: 0
                },
                directReferralFee: 0,
                directTopupRebate: 0,
                downstreamReferralFee: 0,
                downstreamTopupRebate: 0,
                directRecruitLevelAdvancementBonus: 0,
                performance_bonus: { amount: 0, activeUsers: 0 }
              }
            }}
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
      amount: dashboardData.rewardWallet.balance || 0,
    },
    {
      icon: <TotalDepositAmountIcon />,
      title: t('agentDashboard.referralDepositVolume'),
      amount: dashboardData.referralDepositVolume.amount || 0,
    },
    canAccessIncentives && {
      icon: <DirectRecruitIncentiveIcon />,
      title: t('agentDashboard.referralFeeBonus'),
      amount: dashboardData.referralFeeBonus.earnings || 0,
    },
    canAccessIncentives && incentiveData?.summary?.milestoneAchievement?.milestone_bonus && incentiveData?.summary?.milestoneAchievement?.milestone_bonus > 0 && {
      icon: <AgentLevelIcon />,
      title: t('agentDashboard.milestoneBonus'),
      amount: incentiveData?.summary?.milestoneAchievement?.milestone_bonus ?? 0,
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
              activeDirectReferred={dashboardData.directReferredVolume.activeDirectReffered}
              totalNumberOfAccountsRegistered={dashboardData.directReferredVolume.totalNumberOfAccountsRegistered}
              agentsToPartner={{
                count: dashboardData.directReferredVolume.agentsToPartner
              }}
            />
          )}

          {/* Referral Card - Available to all tiers */}
          <ReferralCard code={dashboardData.referralCode} />
        </div>
      </div>


      <div className="mb-6">
        <RecruitAgentCard />
      </div>


      {/* Charts and Tables Section */}
      <div className="space-y-6 mb-6">
        <DepositOverviewChart lineColor="#7C74FF" />

        {/* <DepositActivityTable
          activities={dashboardData.depositActivities}
        /> */}
      </div>

      {/* Income Summary Table */}
      <div className="mb-6">
        <IncomeSummaryTable
          incentiveData={incentiveData || {
            activities: { activities: {} },
            summary: {
              total_incentive: 0,
              milestoneAchievement: {
                activatedUsers: 0,
                targetUsers: 0,
                completeAt: null,
                milestones: [],
                milestone_bonus: 0
              },
              directReferralFee: 0,
              directTopupRebate: 0,
              downstreamReferralFee: 0,
              downstreamTopupRebate: 0,
              directRecruitLevelAdvancementBonus: 0,
              performance_bonus: { amount: 0, activeUsers: 0 }
            }
          }}
          availableMonths={availableMonths}
        />
      </div>



    </>
  );
};

export default AgentDashboard;