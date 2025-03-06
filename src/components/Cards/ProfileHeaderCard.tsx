"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileData {
    name: string;
    level: string;
    avatar?: string;
    details: {
        resellerId: string;
        joinedSince: string;
        lastActive: string;
        keyMarket: string;
    };
    status: {
        deposit: boolean;
        eKYC: boolean;
        accountActivation: boolean;
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
        resellerId: "Reseller ID",
        joinedSince: "Joined Since",
        lastActive: "Last Active",
        keyMarket: "Key Market"
    };

    const statusLabels = {
        deposit: "Deposit",
        eKYC: "eKYC",
        accountActivation: "Account Activation",
        physicalCard: "Physical Card"
    };

    // Get the first letter of the name for the avatar
    const getFirstLetter = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'A';
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
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                                {getFirstLetter(data.name)}
                            </AvatarFallback>
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

            {/* Status Card - Commented out as requested */}
            {/* <Card className="bg-white dark:bg-boxdark border-none shadow-card">
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
            </Card> */}
        </div>
    );
};

export default ProfileHeaderCard;