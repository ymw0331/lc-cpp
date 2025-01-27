"use client";

import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import ProfileCard from "../Cards/ProfileCard";
import RecruitCard from "../Cards/RecruitCard";
import ReferralCard from "../Cards/ReferralCard";
import AgentStatCard from "../Cards/AgentStatCard";
import StatisticChart from "../Charts/StatisticChart";
import { DepositActivityTable } from "../Tables/DepositActivityTable";
import { RewardWalletBalanceIcon, TotalDepositAmountIcon, DirectRecruitIncentiveIcon } from "../Icons/dashboard";
import { dashboardStat } from "@/lib/dashboard/data";
import { DashboardStatistics } from "@/types/dashboard/data";
import { useState } from "react";


const AgentDashboard: React.FC = () => {

  const [data] = useState<DashboardStatistics>(dashboardStat);

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
          // activeUsers={{
          //   current: 42208,
          //   target: 50000,
          //   percentage: 84.5,
          //   remaining: 7792
          // }}
          activeUsers={data.agentProfile.activeUsers}
        />
        <div className="grid gap-6">
          <RecruitCard
            count={1234}
            agentsToPartner={{
              count: data.totalDirectRecruit.agentsToPartner
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
        <DepositActivityTable
          activities={data.depositActivities}
        />
      </div>
    </>
  );
};

export default AgentDashboard;