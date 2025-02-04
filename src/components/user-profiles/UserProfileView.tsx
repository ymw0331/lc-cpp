'use client';

import { ArrowLeft } from 'lucide-react';
import AgentLevelCard from '../Cards/AgentLevelCard';
import CircularProgressCard from '../Cards/CircularProgressCard';
import ProfileHeaderCard from '../Cards/ProfileHeaderCard';

interface UserProfileViewProps {
    user: {
        name: string;
        avatar: string;
        level: string;
        promotedDate?: string;
        userId: string;
        joinedSince: string;
        lastActive: string;
        keyMarket: string;
        stats: {
            directRecruit: number;
            directReferrals: number;
            cardActivation: {
                current: number;
                total: number;
                percentage: number;
            };
            agentRecruitment: {
                current: number;
                total: number;
                percentage: number;
            };
        };
        status: {
            deposit: boolean;
            eKYC: boolean;
            activatedCard: boolean;
            physicalCard: boolean;
        };
    };
}

export const UserProfileView = ({ user }: UserProfileViewProps) => {
    const profileData = {
        name: user.name,
        level: user.level,
        avatar: user.avatar,
        details: {
            userId: user.userId,
            joinedSince: user.joinedSince,
            lastActive: user.lastActive,
            keyMarket: user.keyMarket
        },
        status: user.status,
        socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com"
        }
    };

    return (
        <div className="p-6 bg-whiten dark:bg-boxdark-2">
            {/* Back Button */}
            <button className="flex items-center text-body dark:text-bodydark2 gap-2 mb-6 hover:text-black dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Profile Cards */}
                <div className="flex-1">
                    <ProfileHeaderCard data={profileData} />
                </div>

                {/* Right Column - Stats */}
                <div className="lg:w-5/12 space-y-6">
                    {/* Top Stats using AgentLevelCard */}
                    <div className="grid grid-cols-2 gap-6">
                        <AgentLevelCard
                            level="Total Direct Recruit"
                            count={user.stats.directRecruit}
                            type="recruit"
                        />
                        <AgentLevelCard
                            level="Total Direct Referrals"
                            count={user.stats.directReferrals}
                            type="referral"
                        />
                    </div>

                    {/* Progress Cards */}
                    <div className="grid grid-cols-2 gap-6">
                        <CircularProgressCard
                            title="Card Activation Volume"
                            current={user.stats.cardActivation.current}
                            total={user.stats.cardActivation.total}
                            label="Active Users"
                        />
                        <CircularProgressCard
                            title="Total Agent Recruitment"
                            current={user.stats.agentRecruitment.current}
                            total={user.stats.agentRecruitment.total}
                            label="Agents"
                        />
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default UserProfileView;