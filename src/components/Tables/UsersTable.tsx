"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus, MoreHorizontal, Eye, UserPlus, Download } from "lucide-react";
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

interface Downstream {
    id: string;
    ownerProfileId: string;
    tierId: string;
    verificationId: null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        uuid: string;
        first_name: string;
        last_name: string;
        profileId: string;
        email: string;
        username: string;
        status: string;
        verified_at: string;
        cardId: number | null;
        ekycStatus: string | null;
        cardStatus: string | null;
        firstDeposit: boolean | null;
        phone_no: string | null;
        country_code: number | null;
        [key: string]: any;
    };
}

interface DirectReferral {
    user: {
        id: number;
        uuid: string;
        first_name: string;
        last_name: string;
        profileId: string;
        email: string;
        username: string;
        status: string;
        verified_at: string;
        cardId: number | null;
        ekycStatus: string | null;
        cardStatus: string | null;
        firstDeposit: boolean | null;
        phone_no: string | null;
        country_code: number | null;
        [key: string]: any;
    };
}

interface UsersTableProps {
    downstreams: Downstream[];
    directReferrals: DirectReferral[];
    dashboardTotalReferrals?: number;
    userTierPriority?: number;
}

// Format date to readable format
const formatDate = (dateString: string): { date: string; time: string } => {
    if (!dateString) return { date: "-", time: "-" };

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) return { date: "-", time: "-" };

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };

    // Format date like "NOVEMBER 04, 2024"
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase();

    // Format time like "14:21:21"
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return { date: formattedDate, time: formattedTime };
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

// Main Component
const UsersTable = ({
    downstreams,
    directReferrals = [],
    dashboardTotalReferrals = 0,
    userTierPriority = 0
}: UsersTableProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    // Check if user is Level 1
    const isLevelOne = userTierPriority === 1;

    // For Level 1 users, always force tab to "referred-users"
    const [activeTab, setActiveTab] = useState("referred-users");

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
    const [userProfiles, setUserProfiles] = useState<any[]>([]);
    const [agentProfiles, setAgentProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch user profiles from the API
    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                setLoading(true);

                // Process users (direct referrals)
                // Only use profileId from directReferrals to fetch detailed profiles
                const userProfilePromises = directReferrals.map(async (referral) => {
                    try {
                        if (referral.user && referral.user.profileId) {
                            // Make API call to get detailed profile data
                            const profileData = await resellerApi.getAgentProfile(referral.user.profileId);
                            return {
                                ...profileData,
                                id: referral.user.id.toString(), // Keep original id for React key
                                profileId: referral.user.profileId // Keep profileId for navigation
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error(`Error fetching profile for ${referral.user.profileId}:`, error);
                        return null;
                    }
                });

                // Process agents (downstreams)
                const agentProfilePromises = downstreams.map(async (downstream) => {
                    try {
                        if (downstream.ownerProfileId) {
                            // Make API call to get detailed profile data
                            const profileData = await resellerApi.getAgentProfile(downstream.ownerProfileId);
                            return {
                                ...profileData,
                                id: downstream.id, // Keep original id for React key
                                ownerProfileId: downstream.ownerProfileId // Keep ownerProfileId for navigation
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error(`Error fetching profile for ${downstream.ownerProfileId}:`, error);
                        return null;
                    }
                });

                // Resolve all promises
                const userResults = await Promise.all(userProfilePromises);
                const agentResults = await Promise.all(agentProfilePromises);

                // Filter out null results
                setUserProfiles(userResults.filter(profile => profile !== null));
                setAgentProfiles(agentResults.filter(profile => profile !== null));

                setLoading(false);
            } catch (error) {
                console.error("Error fetching profiles:", error);
                setLoading(false);
            }
        };

        fetchUserProfiles();
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

    // Define tabs for SplitTabs component
    const tabs = [
        { id: "referred-users", label: t("usersTable.users", "Referred Users") },
        { id: "agents", label: t("usersTable.agents", "Agents") }
    ];

    // Handle tab change - prevent changing to agents tab for Level 1 users
    const handleTabChange = (tabId: string) => {
        if (isLevelOne && tabId === "agents") {
            return; // Prevent tab change for Level 1 users
        }
        setActiveTab(tabId);
    };

    // Get the first letter of a name for the Avatar
    const getFirstLetter = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Handle row click to navigate to profile page
    const handleRowClick = (user: any) => {
        if (activeTab === "agents" && user.ownerProfileId) {
            router.push(`/referred-users/manage-user/agent/${user.ownerProfileId}`);
        } else if (activeTab === "referred-users") {
            router.push(`/referred-users/manage-user/user/${user.profileId}`);
        }
    };


    // Export to CSV function
    // const exportToCSV = () => {
    //     const headers = activeTab === "referred-users" ?
    //         ["Name", "Email", "Status", "Account Activation", "Physical Card", "Country"] :
    //         ["Name", "Email", "Ranking", "Status", "Account Activation", "Physical Card", "Country"];

    //     const data = filteredUsers.map((user: any) => {
    //         const baseData = [
    //             user.name,
    //             user.userId || user.emailAddress,
    //             user.status,
    //             `${user.accActivation.date} ${user.accActivation.time}`,
    //             user.physicalCard,
    //             user.country
    //         ];

    //         return activeTab === "referred-users" ? baseData : [baseData[0], baseData[1], user.ranking, ...baseData.slice(2)];
    //     });

    //     let csvContent = headers.join(",") + "\n";
    //     csvContent += data.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //     const link = document.createElement("a");
    //     const url = URL.createObjectURL(blob);

    //     link.setAttribute("href", url);
    //     link.setAttribute("download", `${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`);
    //     link.style.visibility = "hidden";

    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };

    return (
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-sm">
            {/* Only show tabs if user is not Level 1 */}
            {!isLevelOne && (
                <SplitTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
            )}

            <div className="p-3 md:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    {/* Search Input */}
                    <div className="flex w-full max-w-md items-center gap-3">
                        <Input
                            type="text"
                            placeholder={t("usersTable.searchUser")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray dark:bg-boxdark-2 border-stroke dark:border-strokedark pl-4 pr-6 outline-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="relative border-stroke bg-white dark:bg-boxdark hover:bg-gray-2 dark:hover:bg-meta-4"
                        >
                            <Filter className="h-5 w-5 text-body dark:text-bodydark" />
                            {hasActiveFilters && (
                                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                                    •
                                </span>
                            )}
                        </Button>
                        {/* 
                        <Button
                            variant="outline"
                            onClick={exportToCSV}
                            className="border-stroke bg-white dark:bg-boxdark hover:bg-gray-2 dark:hover:bg-meta-4"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t("usersTable.export")}
                        </Button> */}

                        {/* Only show Recruit button for non-Level 1 users */}
                        {/* {!isLevelOne && (
                            <Button
                                onClick={() => router.push("/referred-users/recruit-agent")}
                                className="bg-primary hover:bg-primary/90">
                                <UserPlus className="mr-2 h-5 w-5" />
                                {t("usersTable.recruit")}
                            </Button>
                        )} */}
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
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="max-w-full overflow-x-auto rounded-sm border border-stroke dark:border-strokedark">
                        <Table className="w-full">
                            <TableHeader className="bg-black text-white">
                                <TableRow>
                                    <TableHead className="py-4 px-4 text-left font-medium">
                                        {t("usersTable.name", "NAME")}
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-left font-medium">
                                        {t("usersTable.ranking", "RANKING")}
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-left font-medium">
                                        {t("usersTable.accActivation", "ACC ACTIVATION")}
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-left font-medium">
                                        {t("usersTable.totalDeposit", "TOTAL DEPOSIT")}
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-left font-medium">
                                        {t("usersTable.physicalCard", "PHYSICAL CARD")}
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-center font-medium">
                                        {t("usersTable.actions", "ACTIONS")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user: any) => {
                                        const formattedDate = formatDate(user.accountActivation);
                                        return (
                                            <TableRow
                                                key={user.id}
                                                className="hover:bg-gray-1 dark:hover:bg-meta-4 transition-colors border-b border-stroke dark:border-strokedark"
                                            >
                                                <TableCell className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {getFirstLetter(user.fullName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-black dark:text-white font-medium">
                                                            {user.fullName.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    {user.ranking === "N/A" ? "USER" : user.ranking.replace("Tier", "Level")}
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <div>
                                                        <div>{formattedDate.date}</div>
                                                        <div className="text-xs text-gray-500">{formattedDate.time}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    {formatCurrency(user.totalDeposit || 0)}
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    {user.physicalCard === true ? (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                            YES
                                                        </span>
                                                    ) : user.cardStatus === "approved" ? (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                            APPROVED
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRowClick(user)}
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
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

                {/* Pagination */}
                {paginatedUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                            {t("usersTable.showing", "Showing")} {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}-
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t("usersTable.of", "of")} {filteredUsers.length} {t("usersTable.entries", "entries")}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="border-stroke"
                            >
                                {t("usersTable.previous", "Previous")}
                            </Button>

                            <div className="text-body dark:text-bodydark px-2">
                                {currentPage}/{totalPages}
                            </div>

                            <Button
                                variant="outline"
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="border-stroke"
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