// ProfileHeaderCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Facebook, Linkedin } from "lucide-react";
import Image from "next/image";

interface ProfileData {
    name: string;
    level: string;
    avatar: string;
    details: {
        userId: string;
        joinedSince: string;
        lastActive: string;
        keyMarket: string;
    };
    status: {
        deposit: boolean;
        eKYC: boolean;
        activatedCard: boolean;
        physicalCard: boolean;
    };
    socialLinks?: {
        facebook?: string;
        linkedin?: string;
    };
}

const ProfileHeaderCard = ({ data }: { data: ProfileData }) => {
    const TableRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex justify-between py-2.5 border-b border-stroke dark:border-strokedark last:border-0">
            <span className="text-body dark:text-bodydark2">{label}</span>
            <span className="text-black dark:text-white font-medium">{value}</span>
        </div>
    );

    const detailLabels = {
        userId: "User ID",
        joinedSince: "Joined Since",
        lastActive: "Last Active",
        keyMarket: "Key Market"
    };

    const statusLabels = {
        deposit: "Deposit",
        eKYC: "eKYC",
        activatedCard: "Activated Card",
        physicalCard: "Physical Card"
    };

    // Add null checks
    if (!data || !data.details || !data.status) {
        return null; // Or a loading state
    }

    return (
        <div className="space-y-4">
            <Card className="bg-white dark:bg-boxdark border-none shadow-card">
                <div className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4 mb-6">
                        <Avatar className="h-16 w-16 rounded-full border-4 border-white dark:border-boxdark-2">
                            <Image 
                            src={data.avatar} 
                            alt={data.name} 
                            width={40}
                            height={40}
                            className="h-full w-full object-cover" />
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-title-sm text-black dark:text-white font-semibold mb-1">
                                        {data.name}
                                    </h2>
                                    <span className="inline-block px-3 py-0.5 bg-secondary dark:bg-secondary/80 text-black dark:text-white rounded-full text-sm font-medium">
                                        {data.level}
                                    </span>
                                </div>
                                {data.socialLinks && (
                                    <div className="flex gap-2">
                                        {data.socialLinks.facebook && (
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 transition-colors">
                                                <Facebook className="h-4 w-4 text-white" />
                                            </button>
                                        )}
                                        {data.socialLinks.linkedin && (
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/90 transition-colors">
                                                <Linkedin className="h-4 w-4 text-white" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-0">
                        {Object.entries(data.details).map(([key, value]) => (
                            <TableRow
                                key={key}
                                label={detailLabels[key as keyof typeof detailLabels]}
                                value={String(value)}
                            />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Status Card */}
            <Card className="bg-white dark:bg-boxdark border-none shadow-card">
                <div className="p-6">
                    <div className="space-y-0">
                        {Object.entries(data.status).map(([key, value]) => (
                            <TableRow
                                key={key}
                                label={statusLabels[key as keyof typeof statusLabels]}
                                value={value ? 'Yes' : 'No'}
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfileHeaderCard;