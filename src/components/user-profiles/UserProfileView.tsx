'use client';

import { ArrowLeft } from 'lucide-react';
import AgentLevelCard from '../Cards/AgentLevelCard';
import { Facebook, Linkedin } from 'lucide-react';
import Image from 'next/image';
import CircularProgressCard from '../Cards/CircularProgressCard';
import ProfileHeader from './ProfileHeader';
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
    return (
        <div className="space-y-4">
            {/* Back Button */}
            <button className="flex items-center text-body dark:text-bodydark gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>


            <ProfileHeaderCard
                data={{
                    name: "Adam Lam",
                    level: "Level 2 Agent",
                    avatar: "/path-to-avatar.jpg",
                    joinedDate: "Nov 07, 2024",
                    lastActive: "Nov 07, 2024 18:37:32",
                    keyMarket: "Malaysia",
                    promotedDate: "2024-01-01",
                    socialLinks: {
                        facebook: "https://facebook.com/adamlam",
                        linkedin: "https://linkedin.com/in/adamlam"
                    },
                    status: {
                        deposit: true,
                        eKYC: true,
                        activatedCard: true,
                        physicalCard: true
                    }
                }}
            />


            <div className="grid grid-cols-12 gap-4">
                {/* Main Profile Card - Spans 7 columns */}

                {/* <div className="col-span-7 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
                    <div className="flex gap-4">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            className="w-20 h-20 rounded-full"
                            width={80}
                            height={80}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-black dark:text-white">{user.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-warning text-white rounded-full text-sm mt-1">
                                        {user.level}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-meta-5 hover:text-primary">
                                        <Facebook className="w-5 h-5" />
                                    </button>
                                    <button className="text-meta-5 hover:text-primary">
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            {user.promotedDate && (
                                <p className="text-sm text-body dark:text-bodydark mt-2">
                                    Promoted on - {user.promotedDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-body dark:text-bodydark">User ID</span>
                            <span className="text-black dark:text-white">{user.userId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body dark:text-bodydark">Joined Since</span>
                            <span className="text-black dark:text-white">{user.joinedSince}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body dark:text-bodydark">Last Active</span>
                            <span className="text-black dark:text-white">{user.lastActive}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-body dark:text-bodydark">Key Market</span>
                            <span className="text-black dark:text-white">{user.keyMarket}</span>
                        </div>
                    </div>
                </div> */}

                {/* Stats Cards - Each spans 5 columns */}
                <div className="col-span-5 grid grid-cols-2 gap-4">
                    <AgentLevelCard
                        level="Total Direct Recruit"
                        count={user.stats.directRecruit}
                    />
                    <AgentLevelCard
                        level="Total Direct Referrals"
                        count={user.stats.directReferrals}
                    />
                </div>

                {/* Status Grid - Spans 7 columns */}
                <div className="col-span-7 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark p-6">
                    <div className="space-y-3">
                        {Object.entries(user.status).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-body dark:text-bodydark">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="text-success">{value ? 'Yes' : 'No'}</span>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="col-span-5 grid grid-cols-2 gap-4">
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
    );
};