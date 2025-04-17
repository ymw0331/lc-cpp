"use client";

import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Plus, MoreHorizontal, Eye, UserPlus, Download, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import SplitTabs from "@/components/ui/split-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { resellerApi } from "@/api/reseller/reseller.api";
import { useAuth } from '@/contexts/AuthContext';
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import { formatDateWithHKTime } from '@/lib/dateUtils';
import {
    Downstream,
    DirectReferral,
    ResellerResponse,
    User,
    Tier
} from "@/api/reseller/reseller.types";
import { exportToCSV } from '@/utils/exportToCSV';

const getColorFromString = (str: string | undefined, ranking?: string): string => {
    if (!str) return 'bg-gray-500'; // Fallback color if string is undefined/null

    // Determine color based on ranking/tier level
    if (ranking) {
        if (ranking === "USER") {
            return 'bg-blue-500'; // Tier 0 - Users
        } else if (ranking.includes("Level 1")) {
            return 'bg-green-500'; // Tier 1
        } else if (ranking.includes("Level 2")) {
            return 'bg-purple-500'; // Tier 2
        } else if (ranking.includes("Level 3")) {
            return 'bg-orange-500'; // Tier 3
        }
    }

    return 'bg-gray-500'; // Fallback color
};

interface FilterOptions {
    ranking: string;
    dateRange: {
        from: string;
        to: string;
    };
    status: string;
    hasCard: string;
}

interface FilterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    filterOptions: FilterOptions;
    setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
    uniqueRankings: string[];
}

type TabType = "agents" | "referred-users";

interface UsersTableProps {
    downstreams: Downstream[];
    directReferrals: DirectReferral[];
    dashboardTotalReferrals?: number;
    userTierPriority?: number;
    initialActiveTab?: TabType;
}


interface UserTableData {
    id: string;
    fullName: string;
    ranking: string;
    accountActivation: string | null;
    totalDeposit: number;
    physicalCard: boolean;
    ekycStatus: string;
    cardStatus: string;
    firstDeposit: boolean;
    profileId?: string;
    ownerProfileId?: string;
    emailAddress: string;
    fromEvent?: string | null;
}

// Format date to readable format
const formatDate = (dateString: string | null | undefined): { date: string; time: string } => {
    if (!dateString) {
        return { date: "-", time: "-" };
    }

    try {
        return formatDateWithHKTime(dateString);
    } catch (error) {
        return { date: "-", time: "-" };
    }
};

// Filter Component
const FilterPopup = ({
    isOpen,
    onClose,
    filterOptions,
    setFilterOptions,
    uniqueRankings,
}: FilterPopupProps) => {
    const { t } = useTranslation();
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleRankingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOptions((prev) => ({ ...prev, ranking: e.target.value }));
    };

    const handleDateChange = (field: "from" | "to", value: string) => {
        setFilterOptions((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [field]: value },
        }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOptions((prev) => ({ ...prev, status: e.target.value }));
    };

    const handleCardStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOptions((prev) => ({ ...prev, hasCard: e.target.value }));
    };

    return (
        <div
            ref={filterRef}
            className={`absolute right-0 top-12 w-[400px] rounded-sm border border-stroke bg-white dark:bg-boxdark p-5 shadow-default z-50 ${isOpen ? "block" : "hidden"
                }`}
        >
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                {t("usersTable.filters")}
            </h4>

            <div className="space-y-6">
                {/* Ranking Filter */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        {t("usersTable.ranking")}
                    </label>
                    <div className="relative">
                        <select
                            value={filterOptions.ranking}
                            onChange={handleRankingChange}
                            className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                        >
                            <option value="all">{t("usersTable.allRankings")}</option>
                            {uniqueRankings.map((ranking) => (
                                <option key={ranking} value={ranking}>
                                    {ranking}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 16.8C11.8 16.8 11.6 16.75 11.4 16.65L5.4 12.65C5.15 12.45 5 12.15 5 11.8C5 11.45 5.15 11.15 5.4 10.95L11.4 6.95C11.75 6.7 12.25 6.7 12.6 6.95L18.6 10.95C18.85 11.15 19 11.45 19 11.8C19 12.15 18.85 12.45 18.6 12.65L12.6 16.65C12.4 16.75 12.2 16.8 12 16.8Z"
                                    fill="currentColor"
                                    className="text-body dark:text-bodydark"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        {t("usersTable.status")}
                    </label>
                    <div className="relative">
                        <select
                            value={filterOptions.status}
                            onChange={handleStatusChange}
                            className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                        >
                            <option value="all">{t("usersTable.allStatus")}</option>
                            <option value="active">{t("usersTable.active")}</option>
                            <option value="pending_verification">{t("usersTable.pendingVerification")}</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 16.8C11.8 16.8 11.6 16.75 11.4 16.65L5.4 12.65C5.15 12.45 5 12.15 5 11.8C5 11.45 5.15 11.15 5.4 10.95L11.4 6.95C11.75 6.7 12.25 6.7 12.6 6.95L18.6 10.95C18.85 11.15 19 11.45 19 11.8C19 12.15 18.85 12.45 18.6 12.65L12.6 16.65C12.4 16.75 12.2 16.8 12 16.8Z"
                                    fill="currentColor"
                                    className="text-body dark:text-bodydark"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Card Status Filter */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        {t("usersTable.physicalCard")}
                    </label>
                    <div className="relative">
                        <select
                            value={filterOptions.hasCard}
                            onChange={handleCardStatusChange}
                            className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                        >
                            <option value="all">{t("usersTable.allCards")}</option>
                            <option value="yes">{t("usersTable.hasCard")}</option>
                            <option value="no">{t("usersTable.noCard")}</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 16.8C11.8 16.8 11.6 16.75 11.4 16.65L5.4 12.65C5.15 12.45 5 12.15 5 11.8C5 11.45 5.15 11.15 5.4 10.95L11.4 6.95C11.75 6.7 12.25 6.7 12.6 6.95L18.6 10.95C18.85 11.15 19 11.45 19 11.8C19 12.15 18.85 12.45 18.6 12.65L12.6 16.65C12.4 16.75 12.2 16.8 12 16.8Z"
                                    fill="currentColor"
                                    className="text-body dark:text-bodydark"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        {t("usersTable.dateRange")}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-body dark:text-bodydark">
                                {t("usersTable.from")}
                            </label>
                            <input
                                type="date"
                                value={filterOptions.dateRange.from}
                                onChange={(e) => handleDateChange("from", e.target.value)}
                                className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-body dark:text-bodydark">
                                {t("usersTable.to")}
                            </label>
                            <input
                                type="date"
                                value={filterOptions.dateRange.to}
                                onChange={(e) => handleDateChange("to", e.target.value)}
                                className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFilterOptions({
                                ranking: "all",
                                dateRange: { from: "", to: "" },
                                status: "all",
                                hasCard: "all"
                            });
                        }}
                    >
                        {t("usersTable.clearAll")}
                    </Button>
                    <Button onClick={onClose}>
                        {t("usersTable.applyFilters")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Add new interfaces for expanded data
interface ExpandedRowData {
    id: string;
    fullName: string;
    ranking: string;
    accountActivation: string | null;
    totalDeposit: number;
    physicalCard: boolean;
    ekycStatus: string;
    cardStatus: string;
    firstDeposit: boolean;
    emailAddress: string;
    profileId?: string;
    fromEvent?: string | null;
}

// Main Component
const UsersTable = ({
    downstreams,
    directReferrals = [],
    dashboardTotalReferrals = 0,
    userTierPriority = 0,
    initialActiveTab = "referred-users" // Default value
}: UsersTableProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useAuth();
    const actualTierPriority = user?.tierPriority || userTierPriority;
    const searchParams = useSearchParams();

    // Check if user is Level 1 - if so, always force tab to "referred-users"
    const isLevelOne = actualTierPriority === 1;
    const [activeTab, setActiveTab] = useState<TabType>(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl === 'agents' && !isLevelOne) {
            return 'agents';
        }
        return initialActiveTab || "referred-users";
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        ranking: "all",
        dateRange: {
            from: "",
            to: "",
        },
        status: "all",
        hasCard: "all"
    });

    // State for processed user profiles
    const [userProfiles, setUserProfiles] = useState<UserTableData[]>([]);
    const [agentProfiles, setAgentProfiles] = useState<UserTableData[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Add state for expanded rows
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [expandedData, setExpandedData] = useState<{ [key: string]: ExpandedRowData[] }>({});
    const [loadingExpandedData, setLoadingExpandedData] = useState<{ [key: string]: boolean }>({});

    // Add new state to track which users have expandable data
    const [expandableUsers, setExpandableUsers] = useState<{ [key: string]: boolean }>({});

    const isAgentsTab = (tab: TabType): tab is "agents" => tab === "agents";

    useEffect(() => {
        if (initialActiveTab) {
            setActiveTab(initialActiveTab);
        }
    }, [initialActiveTab]);


    // Fetch user profiles from the API
    useEffect(() => {
        try {
            setLoading(true);

            // Process users (direct referrals) and sort by createdAt
            const processedUsers: UserTableData[] = directReferrals
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Sort in descending order (newest first)
                })
                .map(referral => ({
                    id: referral?.id?.toString() || 'unknown',
                    fullName: `${referral.user?.first_name || ''} ${referral.user?.last_name || ''}`.trim() || referral.user?.username || 'Unknown',
                    ranking: 'USER',
                    accountActivation: referral.accountActivation || null,
                    totalDeposit: referral.totalDeposit || 0,
                    physicalCard: referral.physicalCard || false,
                    ekycStatus: referral.ekycStatus || 'N/A',
                    cardStatus: referral.cardStatus || 'N/A',
                    firstDeposit: referral.firstDeposit || false,
                    profileId: referral.user?.profileId,
                    emailAddress: referral.user?.email || 'Unknown',
                }));

            // Process agents (downstreams) and sort by createdAt
            const processedAgents: UserTableData[] = downstreams
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA; // Sort in descending order (newest first)
                })
                .map(downstream => ({
                    id: downstream.id,
                    fullName: `${downstream.user?.first_name || ''} ${downstream.user?.last_name || ''}`.trim() || downstream.user?.username || 'Unknown',
                    ranking: downstream.tier?.priority ? `Level ${downstream.tier.priority}` : 'Unknown',
                    accountActivation: downstream.accountActivation || null,
                    totalDeposit: downstream.totalDeposit || 0,
                    physicalCard: downstream.physicalCard || false,
                    ekycStatus: downstream.ekycStatus || 'N/A',
                    cardStatus: downstream.cardStatus || 'N/A',
                    firstDeposit: downstream.firstDeposit || false,
                    ownerProfileId: downstream.ownerProfileId,
                    emailAddress: downstream.user?.email || 'Unknown',
                    fromEvent: downstream.fromEvent || 'Unknown'
                }));

            setUserProfiles(processedUsers.filter(user => user !== null));
            setAgentProfiles(processedAgents.filter(agent => agent !== null));
            setLoading(false);
        } catch (error) {
            console.error("Error processing profiles:", error);
            setLoading(false);
        }
    }, [directReferrals, downstreams]);

    // Reset pagination when changing tabs
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm("");
    }, [activeTab]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return `$ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Handle CSV export
    const handleExportToCSV = () => {
        const dataToExport = activeTab === "referred-users" ? userProfiles : agentProfiles;
        
        // Transform data for export
        const exportData = dataToExport.map(user => ({
            'Full Name': user.fullName,
            'Email': user.emailAddress,
            'Ranking': user.ranking === "N/A" ? "USER" : user.ranking.replace("Tier", "Level"),
            'Account Activation': formatDate(user.accountActivation).date + " " + formatDate(user.accountActivation).time,
            'Total Deposit': formatCurrency(user.totalDeposit),
            'Physical Card': user.physicalCard ? "YES" : "-",
            'eKYC Status': user.ekycStatus,
            'Card Status': user.cardStatus
        }));

        exportToCSV(exportData, {
            filename: `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
        });
    };

    // Choose the active dataset based on tab
    const activeData = activeTab === "referred-users"
        ? userProfiles
        : agentProfiles;

    // Get unique values for filters from the active dataset
    const uniqueRankings = Array.from(new Set(activeData
        .filter(user => user.ranking)
        .map(user => user.ranking as string)));

    // Filter logic
    const filteredUsers = activeData.filter((user: any) => {
        const matchSearch =
            (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false);

        const matchRanking =
            filterOptions.ranking === "all" ? true : user.ranking === filterOptions.ranking;

        const matchStatus =
            filterOptions.status === "all" ? true : user.status === filterOptions.status;

        const matchCardStatus =
            filterOptions.hasCard === "all" ? true :
                (filterOptions.hasCard === "yes" ? user.physicalCard === true :
                    user.physicalCard !== true);

        let matchDate = true;
        if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
            const userDate = new Date(user.accountActivation);

            if (filterOptions.dateRange.from) {
                matchDate = matchDate && userDate >= new Date(filterOptions.dateRange.from);
            }
            if (filterOptions.dateRange.to) {
                matchDate = matchDate && userDate <= new Date(filterOptions.dateRange.to);
            }
        }

        return matchSearch && matchRanking && matchStatus && matchCardStatus && matchDate;
    });

    // Paginate users
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate total pages
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

    const hasActiveFilters =
        filterOptions.ranking !== "all" ||
        filterOptions.status !== "all" ||
        filterOptions.hasCard !== "all" ||
        filterOptions.dateRange.from ||
        filterOptions.dateRange.to;

    // Handle pagination
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Define tabs for SplitTabs component - only show both tabs for Level 2+
    const tabs = [
        { id: "referred-users", label: t("usersTable.users", "Referred Users") },
        ...(isLevelOne ? [] : [{ id: "agents", label: t("usersTable.agents", "Agents") }])
    ];

    // Handle tab change - prevent changing to agents tab for Level 1 users
    const handleTabChange = (tabId: string) => {
        if (isLevelOne && tabId === "agents") {
            return; // Prevent tab change for Level 1 users
        }
        setActiveTab(tabId as TabType);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tabId);
        router.push(`/referred-users/manage-user?${params.toString()}`);
    };

    // Get the first letter of a name for the Avatar
    const getFirstLetter = (name: string | undefined): string => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Handle row click to navigate to profile page
    const handleRowClick = (user: UserTableData) => {
        if (activeTab === "agents" && user.ownerProfileId) {
            router.push(`/referred-users/manage-user/agent/${user.ownerProfileId}`);
        } else if (activeTab === "referred-users" && user.profileId) {
            router.push(`/referred-users/manage-user/user/${user.profileId}`);
        }
    };

    // Function to toggle row expansion with permission checks
    const toggleRowExpansion = async (user: UserTableData) => {
        const rowId = user.id;
        console.log(`Toggling expansion for row ${rowId}, user: ${user.fullName}, current user tier: ${actualTierPriority}`);

        // If already expanded, just collapse
        if (expandedRows[rowId]) {
            console.log(`Collapsing row ${rowId}`);
            setExpandedRows(prev => ({ ...prev, [rowId]: false }));
            return;
        }

        // Start loading
        setLoadingExpandedData(prev => ({ ...prev, [rowId]: true }));

        try {
            // Get the profile ID
            const profileId = user.ownerProfileId || user.profileId;

            if (!profileId) {
                console.error('No profile ID available for user:', user);
                setLoadingExpandedData(prev => ({ ...prev, [rowId]: false }));
                return;
            }

            console.log(`Fetching expanded data for profileId: ${profileId}`);

            try {
                // Fetch the reseller info
                const resellerInfo = await resellerApi.getAgentData(profileId) as ResellerResponse;
                console.log("Expanded data received:", resellerInfo);

                if (!resellerInfo) {
                    console.error(`No data received for profileId: ${profileId}`);
                    setLoadingExpandedData(prev => ({ ...prev, [rowId]: false }));
                    return;
                }

                const expandedUsers: ExpandedRowData[] = [];

                // Handle downstreams based on permission rules
                if (resellerInfo.downstreams && resellerInfo.downstreams.length > 0) {
                    console.log(`Found ${resellerInfo.downstreams.length} downstreams`);

                    resellerInfo.downstreams.forEach(downstream => {
                        // Apply permission rules based on downstream tier level
                        const downstreamTierPriority = downstream.tier?.priority || 0;

                        // Check if current user can see this downstream based on override rules
                        const canSeeDownstream =
                            // OVERRIDE RULE 1: Level 2+ agents receive override bonus from Level 1 agents
                            // So they need visibility of these agents
                            (actualTierPriority >= 2 && downstreamTierPriority === 1) ||
                            // OVERRIDE RULE 2: Level 3+ agents receive override bonus from Level 2 agents
                            // So they need visibility of these agents
                            (actualTierPriority >= 3 && downstreamTierPriority === 2) ||
                            // OVERRIDE RULE 3: No override is earned from Level 3+ agents
                            // But higher level agents (L4+) still need to see L3 for management purposes
                            // Note: This is visibility only, not override-related
                            (actualTierPriority >= 4 && downstreamTierPriority === 3);

                        if (canSeeDownstream) {
                            console.log(`User tier ${actualTierPriority} can see downstream tier ${downstreamTierPriority}`);
                            expandedUsers.push({
                                id: downstream.id,
                                fullName: `${downstream.user?.first_name || ''} ${downstream.user?.last_name || ''}`.trim() || downstream.user?.username || 'Unknown',
                                ranking: downstream.tier?.priority ? `Level ${downstream.tier.priority}` : 'Unknown',
                                accountActivation: downstream.accountActivation || null,
                                totalDeposit: downstream.totalDeposit || 0,
                                physicalCard: downstream.physicalCard || false,
                                ekycStatus: downstream.ekycStatus || 'N/A',
                                cardStatus: downstream.cardStatus || 'N/A',
                                firstDeposit: downstream.firstDeposit || false,
                                emailAddress: downstream.user?.email || 'Unknown'
                            });
                        } else {
                            console.log(`User tier ${actualTierPriority} cannot see downstream tier ${downstreamTierPriority} (no override)`);
                        }
                    });
                }

                // All levels can see their direct referrals (users)
                if (resellerInfo.directReferral && resellerInfo.directReferral.length > 0) {
                    console.log(`Found ${resellerInfo.directReferral.length} direct referrals (users)`);

                    resellerInfo.directReferral.forEach((referral, index) => {
                        if (!referral?.user) {
                            console.warn(`Direct referral at index ${index} has no user data`);
                            return;
                        }

                        expandedUsers.push({
                            id: referral.user.profileId,
                            fullName: `${referral.user.first_name || ''} ${referral.user.last_name || ''}`.trim() || referral.user.username || 'Unknown',
                            ranking: 'USER',
                            accountActivation: referral.accountActivation || null,
                            totalDeposit: referral.totalDeposit || 0,
                            physicalCard: Boolean(referral.physicalCard),
                            ekycStatus: referral.user.ekycStatus || 'N/A',
                            cardStatus: referral.user.cardStatus || 'N/A',
                            firstDeposit: Boolean(referral.user.firstDeposit),
                            emailAddress: referral.user.email || 'Unknown',
                            profileId: referral.user.profileId
                        });
                    });
                }

                console.log(`Total filtered expanded users to display after pwermission checks: ${expandedUsers.length}`);

                // Update state
                setExpandedData(prev => ({ ...prev, [rowId]: expandedUsers }));
                setExpandedRows(prev => ({ ...prev, [rowId]: true }));
            } catch (error) {
                console.error(`Error fetching data for ${profileId}:`, error);
            }
        } catch (error) {
            console.error('Error in toggleRowExpansion:', error);
        } finally {
            setLoadingExpandedData(prev => ({ ...prev, [rowId]: false }));
        }
    };

    // Check if a row is expandable with permission consideration
    const checkIfExpandable = async (user: UserTableData) => {
        if (activeTab !== "agents") return false;

        console.log("Checking expandable for agent:", user.emailAddress, "with tier priority:", actualTierPriority);

        try {
            const profileId = user.ownerProfileId || user.profileId;

            if (!profileId) {
                console.error('No profile ID available for agent:', user.emailAddress);
                return false;
            }

            try {
                const resellerInfo = await resellerApi.getAgentData(profileId) as ResellerResponse;

                // Check if this agent has VISIBLE downstreams or direct referrals
                // based on the override bonus rules
                const hasVisibleDownstreams = resellerInfo?.downstreams?.some(downstream => {
                    const downstreamTierPriority = downstream.tier?.priority || 0;

                    // Override Bonus Rules:
                    // 1. L3-L5 can see L2 (they get override from L2's direct referrals)
                    // 2. L4-L5 can see L3 for management purposes (no override)
                    // 3. L5 can see L4 for management purposes (no override)
                    return (actualTierPriority >= 3 && downstreamTierPriority === 2) ||
                        (actualTierPriority >= 4 && downstreamTierPriority === 3) ||
                        (actualTierPriority === 5 && downstreamTierPriority === 4);
                });

                // For L2 and above, they can see their direct referrals
                const hasDirectReferrals = actualTierPriority >= 2 &&
                    (resellerInfo?.directReferral?.length ?? 0) > 0;

                if (hasVisibleDownstreams || hasDirectReferrals) {
                    console.log(`Agent ${user.emailAddress} is expandable - has downstreams: ${hasVisibleDownstreams}, has direct referrals: ${hasDirectReferrals}`);
                }

                return hasVisibleDownstreams || hasDirectReferrals;
            } catch (error) {
                console.error(`Error fetching reseller info for agent ${user.emailAddress}:`, error);
                return false;
            }
        } catch (error) {
            console.error('Error checking if agent is expandable:', error);
            return false;
        }
    };

    // In useEffect, improve the check for expandable users with better error handling
    useEffect(() => {
        const checkExpandableUsers = async () => {
            if (activeTab !== "agents") return;

            try {
                console.log("Checking expandable agents for:",
                    agentProfiles.length, "agents");

                const userChecks = agentProfiles.map(async (user) => {
                    try {
                        const isExpandable = await checkIfExpandable(user);
                        if (isExpandable) {
                            console.log(`Agent ${user.emailAddress} is expandable`);
                        }
                        return { id: user.id, isExpandable };
                    } catch (error) {
                        console.error(`Error checking expandability for agent ${user.emailAddress}:`, error);
                        return { id: user.id, isExpandable: false };
                    }
                });

                const results = await Promise.all(userChecks);
                const expandableMap = results.reduce((acc, { id, isExpandable }) => {
                    acc[id] = isExpandable;
                    return acc;
                }, {} as { [key: string]: boolean });

                setExpandableUsers(expandableMap);
            } catch (error) {
                console.error("Error in checkExpandableUsers:", error);
            }
        };

        if (agentProfiles.length > 0) {
            checkExpandableUsers();
        }
    }, [agentProfiles, activeTab]);

    // Only show expandable UI in the Agents tab
    const shouldShowExpandable = (user: UserTableData) => {
        return activeTab === "agents" && expandableUsers[user.id];
    };

    return (
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-sm">
            {/* Only render tabs if we have more than one tab */}
            {tabs.length > 1 && (
                <SplitTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
            )}

            <div className="p-2 sm:p-3 md:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                    {/* Search Input */}
                    <div className="flex w-full max-w-md items-center gap-2 sm:gap-3">
                        <Input
                            type="text"
                            placeholder={t("usersTable.searchUser")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray dark:bg-boxdark-2 border-stroke dark:border-strokedark pl-3 sm:pl-4 pr-4 sm:pr-6 outline-none text-sm sm:text-base"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="relative border-stroke bg-white dark:bg-boxdark hover:bg-gray-2 dark:hover:bg-meta-4 h-8 w-8 sm:h-10 sm:w-10"
                        >
                            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-body dark:text-bodydark" />
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-primary text-[10px] sm:text-xs text-white flex items-center justify-center">
                                    •
                                </span>
                            )}
                        </Button>
                        
                        <Button
                            variant="outline"
                            onClick={handleExportToCSV}
                            className="border-stroke bg-white dark:bg-boxdark hover:bg-gray-2 dark:hover:bg-meta-4 h-8 sm:h-10 text-xs sm:text-sm"
                        >
                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {t("usersTable.export")}
                        </Button>

                        {/* Only show Recruit button for non-Level 1 users */}
                        {!isLevelOne && (
                            <Button
                                onClick={() => router.push("/referred-users/recruit-agent")}
                                className="bg-primary hover:bg-primary/90 h-8 sm:h-10 text-xs sm:text-sm">
                                <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                {t("usersTable.recruit")}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filter Popup */}
                <FilterPopup
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    uniqueRankings={uniqueRankings}
                />

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center items-center p-4 sm:p-8">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="max-w-full overflow-x-auto rounded-sm border border-stroke dark:border-strokedark">
                        <Table className="w-full">
                            <TableHeader className="bg-black text-white dark:bg-meta-4">
                                <TableRow>
                                    <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm">
                                        {t("usersTable.name", "NAME")}
                                    </TableHead>
                                    {/* <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm">
                                        {t("usersTable.ranking", "RANKING")}
                                    </TableHead> */}
                                    <TableHead
                                        className={`py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm ${activeTab === "referred-users" ? "hidden" : ""
                                            }`}
                                    >
                                        {t("usersTable.ranking", "RANKING")}
                                    </TableHead>
                                    <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm">
                                        {t("usersTable.accActivation", "ACC ACTIVATION")}
                                    </TableHead>
                                    <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm">
                                        {t("usersTable.totalDeposit", "TOTAL DEPOSIT")}
                                    </TableHead>
                                    <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-left font-medium text-xs xs:text-sm">
                                        {t("usersTable.physicalCard", "PHYSICAL CARD")}
                                    </TableHead>
                                    <TableHead className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-center font-medium text-xs xs:text-sm">
                                        {t("usersTable.actions", "ACTIONS")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user, index) => {
                                        const formattedDate = formatDate(user.accountActivation);
                                        return (
                                            <React.Fragment key={index}>
                                                <TableRow
                                                    className={`border-b border-stroke dark:border-strokedark ${
                                                        activeTab === "referred-users" 
                                                            ? "hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                                                            : user.ranking === "Level 1" 
                                                                ? "hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                : user.ranking === "Level 2"
                                                                    ? "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                                    : "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                    }`}
                                                >
                                                    <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4">
                                                        <div className="flex items-center gap-2 xs:gap-3">
                                                            <div className="w-6 flex justify-center">
                                                                {isAgentsTab(activeTab) && shouldShowExpandable(user) ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleRowExpansion(user);
                                                                        }}
                                                                        className="h-6 w-6 p-0"
                                                                        disabled={loadingExpandedData[user.id]}
                                                                    >
                                                                        {loadingExpandedData[user.id] ? (
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                                                                        ) : (
                                                                            expandedRows[user.id] ? (
                                                                                <Minus className="h-4 w-4" />
                                                                            ) : (
                                                                                <Plus className="h-4 w-4" />
                                                                            )
                                                                        )}
                                                                    </Button>
                                                                ) : (
                                                                    <span className="w-6"></span>
                                                                )}
                                                            </div>
                                                            <Avatar className="h-7 w-7 xs:h-8 xs:w-8">
                                                                <AvatarFallback className={`${getColorFromString(user.fullName || user.id, user.ranking)} text-white`}>
                                                                    {getFirstLetter(user.fullName)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-sm xs:text-base font-medium text-black dark:text-white truncate">
                                                                    {user.fullName}
                                                                </span>
                                                                <span className="text-xs text-gray-500 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-full">
                                                                    {user.emailAddress}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    {/* <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-xs xs:text-sm">
                                                        {user.ranking === "N/A" ? "USER" : user.ranking.replace("Tier", "Level")}
                                                    </TableCell> */}
                                                    <TableCell
                                                        className={`py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-xs xs:text-sm ${activeTab === "referred-users" ? "hidden" : ""
                                                            }`}
                                                    >
                                                        {user.ranking === "N/A" ? "USER" : (
                                                            <>
                                                                {user.ranking.replace("Tier", "Level")}
                                                                {user.fromEvent && user.fromEvent !== "Unknown" && <span className="text-primary font-bold">*</span>}
                                                            </>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-xs xs:text-sm">
                                                        <div>
                                                            <div>{formattedDate.date}</div>
                                                            <div className="text-xs text-gray-500">{formattedDate.time}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-xs xs:text-sm">
                                                        {formatCurrency(user.totalDeposit)}
                                                    </TableCell>
                                                    <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-xs xs:text-sm">
                                                        {user.physicalCard === true ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                YES
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                -
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-2 xs:py-3 sm:py-4 px-2 xs:px-4 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRowClick(user)}
                                                            className="h-7 w-7 xs:h-8 xs:w-8 p-0"
                                                        >
                                                            <span className="sr-only">View</span>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                {isAgentsTab(activeTab) && expandedRows[user.id] && expandedData[user.id]?.map((expandedUser, expandedIndex) => (
                                                    <TableRow
                                                        key={`${user.id}-${expandedUser.id}`}
                                                        className={`bg-gray-50 dark:bg-gray-800 border-b border-stroke dark:border-strokedark ${
                                                            isAgentsTab(activeTab) 
                                                                ? expandedUser.ranking === "Level 1" 
                                                                    ? "hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                    : expandedUser.ranking === "Level 2"
                                                                        ? "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                                        : "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                            : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        }`}
                                                    >
                                                        <TableCell className="py-2 px-4">
                                                            <div className="flex items-center gap-3 ml-12">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarFallback className={`${getColorFromString(expandedUser.fullName || expandedUser.id, expandedUser.ranking)} text-white`}>
                                                                        {getFirstLetter(expandedUser.fullName || '')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm text-black dark:text-white">
                                                                        {expandedUser.fullName}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {expandedUser.emailAddress}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        {/* <TableCell className="py-2 px-4">
                                                            {expandedUser.ranking}
                                                        </TableCell> */}
                                                        <TableCell className={`py-2 px-4 ${!isAgentsTab(activeTab) ? "hidden" : ""}`}>
                                                            {expandedUser.ranking === "USER" ? "USER" : (
                                                                <>
                                                                    {expandedUser.ranking.replace("Tier", "Level")}
                                                                    {expandedUser.fromEvent && expandedUser.fromEvent !== "Unknown" && <span className="text-primary font-bold">*</span>}
                                                                </>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-2 px-4">
                                                            <div>
                                                                <div>{formatDate(expandedUser.accountActivation)?.date}</div>
                                                                <div className="text-xs text-gray-500">{formatDate(expandedUser.accountActivation)?.time}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-2 px-4">
                                                            {formatCurrency(expandedUser.totalDeposit)}
                                                        </TableCell>
                                                        <TableCell className="py-2 px-4">
                                                            {expandedUser.physicalCard === true ? (
                                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                    YES
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                    -
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-2 px-4 text-center">
                                                            {/* Removed eye icon button */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-4 px-4 text-center text-gray-500"
                                        >
                                            {loading ? t("usersTable.loading", "Loading...") : t("usersTable.noResults", "No results found")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Legend for asterisk - only show in agents tab */}
                {activeTab === "agents" && (
                    <div className="flex items-center gap-1 mt-2 sm:mt-3 mb-2 text-xs text-gray-500">
                        <span className="text-primary font-bold text-sm">*</span>
                        <span>{t("usersTable.fromEventLegend", "Indicates agent recruited through special campaign")}</span>
                    </div>
                )}

                {/* Pagination */}
                {paginatedUsers.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-3 sm:mt-4">
                        <div className="text-xs sm:text-sm text-gray-500">
                            {t("usersTable.showing", "Showing")} {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}-
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t("usersTable.of", "of")} {filteredUsers.length} {t("usersTable.entries", "entries")}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="border-stroke h-8 sm:h-10 text-xs sm:text-sm"
                            >
                                {t("usersTable.previous", "Previous")}
                            </Button>

                            <div className="text-xs sm:text-sm text-body dark:text-bodydark px-2">
                                {currentPage}/{totalPages}
                            </div>

                            <Button
                                variant="outline"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="border-stroke h-8 sm:h-10 text-xs sm:text-sm"
                            >
                                {t("usersTable.next", "Next")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTable;