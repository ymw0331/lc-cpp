"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FacebookIcon, LinkedinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex justify-between py-4 border-b border-gray-100 last:border-0">
            <span className="text-gray-500 text-lg">{label}</span>
            <span className="text-black font-medium">{value}</span>
        </div>
    );

    return (
        <div className="space-y-4">
            <Card className="bg-[#F9FAFB] border-none">
                <CardContent className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-12">
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-20 h-20 rounded-full border-4 border-white">
                                <AvatarImage src={data.avatar} alt={data.name} />
                                <AvatarFallback>{data.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
                                <Badge
                                    variant="secondary"
                                    className="bg-[#FCD34D] hover:bg-[#FCD34D] text-black font-semibold px-4 py-1 rounded-full"
                                >
                                    {data.level}
                                </Badge>
                                <p className="text-gray-500">Promoted on -</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {data.socialLinks?.facebook && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90"
                                    asChild
                                >
                                    <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                        <FacebookIcon className="w-5 h-5 text-white" />
                                    </a>
                                </Button>
                            )}
                            {data.socialLinks?.linkedin && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-10 h-10 rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                                    asChild
                                >
                                    <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                        <LinkedinIcon className="w-5 h-5 text-white" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-0">
                        <TableRow label="User ID" value={data.details.userId} />
                        <TableRow label="Joined Since" value={data.details.joinedSince} />
                        <TableRow label="Last Active" value={data.details.lastActive} />
                        <TableRow label="Key Market" value={data.details.keyMarket} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#F9FAFB] border-none">
                <CardContent className="p-8">
                    <div className="space-y-0">
                        <TableRow label="Deposit" value={data.status.deposit ? "Yes" : "No"} />
                        <TableRow label="eKYC" value={data.status.eKYC ? "Yes" : "No"} />
                        <TableRow label="Activated Card" value={data.status.activatedCard ? "Yes" : "No"} />
                        <TableRow label="Physical Card" value={data.status.physicalCard ? "Yes" : "No"} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Usage Example:
const data: ProfileData = {
    name: "Adam Lam",
    level: "Level 2 Agent",
    avatar: "/path-to-avatar.jpg",
    details: {
        userId: "10118237",
        joinedSince: "Nov 07, 2024",
        lastActive: "Nov 07, 2024 18:37:32",
        keyMarket: "Malaysia"
    },
    status: {
        deposit: true,
        eKYC: true,
        activatedCard: true,
        physicalCard: true
    },
    socialLinks: {
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com"
    }
};

export default ProfileHeaderCard;