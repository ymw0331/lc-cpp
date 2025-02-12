"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ProfileCard from "../Cards/ProfileCard";
import RecruitCard from "../Cards/RecruitCard";
import ReferralCard from "../Cards/ReferralCard";
import AgentStatCard from "../Cards/AgentStatCard";
import StatisticChart from "../Charts/StatisticChart";
import { DepositActivityTable } from "../Tables/DepositActivityTable";
<<<<<<< HEAD
import { RewardWalletBalanceIcon, TotalDepositAmountIcon, DirectRecruitIncentiveIcon } from "../Icons/dashboard";
import { useState } from "react";
import { dashboardData, DashboardStatistics } from "@/lib/data";

=======
import {
  RewardWalletBalanceIcon,
  TotalDepositAmountIcon,
  DirectRecruitIncentiveIcon,
} from "../Icons/dashboard";
import { dashboardService } from "@/lib/services/dashboard.service";
import { DashboardStatistics } from "@/lib/data";
import Loader from "@/components/common/Loader";
>>>>>>> 1236bef (latest update)

const AgentDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
  const [data] = useState<DashboardStatistics>(dashboardData);
=======
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('📡 Fetching dashboard data in AgentDashboard...');
      try {
        const dashboardData = await dashboardService.getDashboardData();
        console.log('✅ Dashboard data received in AgentDashboard:', dashboardData);
        setData(dashboardData);
      } catch (error) {
        console.error('❌ Failed to fetch dashboard data in AgentDashboard:', error);
      } finally {
        setIsLoading(false);
        console.log('⏳ Dashboard data loading complete.');
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    console.log('⏳ Loading dashboard data...');
    return <Loader />;
  }

  if (!data) {
    console.error('❌ No dashboard data available.');
    return <div>Error loading dashboard data.</div>;
  }

  console.log('✅ Rendering AgentDashboard with data:', data);
>>>>>>> 1236bef (latest update)

  return (
    <>
      <Breadcrumb pageName="Overview" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-6">
        <AgentStatCard
          icon={<RewardWalletBalanceIcon />}
          title="Reward Wallet Balance"
          amount={data.rewardWallet.balance}
        />

        <AgentStatCard
          icon={<TotalDepositAmountIcon />}
          title="Total Deposit Amount"
          amount={data.totalDeposits.amount}
        />

        <AgentStatCard
          icon={<DirectRecruitIncentiveIcon />}
          title="Direct Recruit Incentive Earnings"
          amount={data.directRecruitment.earnings}
        />
      </div>

      {/* Profile and Recruitment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProfileCard
          name={data.agentProfile.name}
          level={data.agentProfile.level}
          activeUsers={data.agentProfile.activeUsers}
        />
        <div className="grid gap-6">
          <RecruitCard
            count={data.totalDirectRecruit.count}
            agentsToPartner={{
              count: data.totalDirectRecruit.agentsToPartner,
            }}
          />
          <ReferralCard code={data.referralCode} />
        </div>
      </div>

      <div className="mt-6">
        <StatisticChart
          title="Deposit Summary"
          total={data.totalDeposits.amount}
          currency={data.totalDeposits.currency}
        />
      </div>

      <div className="mt-6">
        <DepositActivityTable activities={data.depositActivities} />
      </div>
    </>
  );
};

export default AgentDashboard;
