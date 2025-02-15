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
import { DashboardStatistics } from "@/types/dashboard";
import { fetchData } from "@/lib/api-utils";
import { useAuth } from "@/contexts/AuthContext";
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import clsx from 'clsx'; // Make sure to install clsx if not already installed

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData(
      dashboardApi.getDashboardData,
      setData,
      setError,
      setLoading
    );
  }, []);

  if (!user || loading) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load dashboard data</p>
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

  const visibleStatCards = [
    {
      icon: <RewardWalletBalanceIcon />,
      title: "Reward Wallet Balance",
      amount: data.rewardWallet.balance,
    },
    {
      icon: <TotalDepositAmountIcon />,
      title: "Total Deposit Amount",
      amount: data.totalDeposits.amount,
    },
    canAccessIncentives && {
      icon: <DirectRecruitIncentiveIcon />,
      title: "Direct Recruit Incentive Earnings",
      amount: data.directRecruitment.earnings,
    },
  ].filter(Boolean);

  return (
    <>
      <Breadcrumb pageName="Overview" />

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

      {/* Profile, Referral, and Recruitment Section */}
      <div className={clsx(
        "grid gap-6 mb-6",
        {
          'grid-cols-1 lg:grid-cols-3': canAccessRecruitment,
          'grid-cols-1 lg:grid-cols-2': !canAccessRecruitment,
        }
      )}>
        {/* Profile Card - Always spans first column */}
        <div className={clsx(
          canAccessRecruitment ? 'lg:col-span-2' : 'lg:col-span-1'
        )}>
          <ProfileCard
            name={data.agentProfile.name}
            level={data.agentProfile.level}
            activeUsers={data.agentProfile.activeUsers}
          />
        </div>

        {/* Right Column - Referral and Recruitment */}
        <div className="space-y-6">
          {/* Referral Card - Available to all tiers */}
          <ReferralCard code={data.referralCode} />

          {/* Recruitment Card - Only for higher tiers */}
          {canAccessRecruitment && (
            <RecruitCard
              count={data.totalDirectRecruit.count}
              agentsToPartner={{
                count: data.totalDirectRecruit.agentsToPartner
              }}
            />
          )}
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="space-y-6">
        <StatisticChart
          title="Deposit Summary"
          total={data.totalDeposits.amount}
          currency={data.totalDeposits.currency}
          chartData={data.totalDeposits.chartData}
        />

        <DepositActivityTable
          activities={data.depositActivities}
        />
      </div>
    </>
  );
};

export default AgentDashboard;