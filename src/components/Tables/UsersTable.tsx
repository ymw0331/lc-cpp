"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import SplitTabs from "@/components/ui/split-tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FilterOptions {
    ranking: string;
    dateRange: {
        from: string;
        to: string;
    };
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
    userTierPriority?: number; // Added to check user level
}

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

    return (
        <div
            ref={filterRef}
            className={`absolute right-0 top-12 w-[400px] rounded-sm border border-stroke bg-white dark:bg-boxdark p-5 shadow-default ${isOpen ? "block" : "hidden"
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
            </div>
        </div>
    );
};

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



// Main Component
const UsersTable = ({ downstreams, directReferrals = [], dashboardTotalReferrals = 0, userTierPriority = 0 }: UsersTableProps) => {
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
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset pagination when changing tabs
    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm("");
    }, [activeTab]);

    // Process API data for agents (downstreams)
    const processedAgents = downstreams.map(downstream => {
        const user = downstream.user;
        const formattedDate = formatDate(user.verified_at || downstream.createdAt);

        return {
            id: downstream.id,
            ownerProfileId: downstream.ownerProfileId,
            name: user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`.toUpperCase()
                : user.username.toUpperCase(),
            userId: user.email,
            uuid: user.uuid,
            profileId: user.profileId,
            ranking: downstream.tierId.toUpperCase().replace("TIER", "LEVEL").trim(),
            tierId: downstream.tierId,
            accActivation: formattedDate,
            physicalCard: user.cardStatus === "active" ? "YES" : "-",
            contactNo: user.phone_no ? `+${user.country_code} ${user.phone_no}` : "-",
            country: user.country_code ? getCountryName(user.country_code) : "-",
            created: downstream.createdAt,
            updated: downstream.updatedAt
        };
    });

    // Process API data for direct referrals
    const processedReferrals = directReferrals.map((referral) => {
        const user = referral.user;
        const formattedDate = formatDate(user.verified_at || user.created_at);
    
        return {
            id: user.id.toString(),
            uuid: user.uuid,
            profileId: user.profileId,
            name: user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`.toUpperCase()
                : user.username.toUpperCase(),
            userId: user.email,
            emailAddress: user.email,
            ranking: "LEVEL 0", // Add this property for referred users
            accActivation: formattedDate,
            physicalCard: user.cardStatus === "active" ? "YES" : "-",
            contactNo: user.phone_no ? `+${user.country_code} ${user.phone_no}` : "-",
            country: user.country_code ? getCountryName(user.country_code) : "-",
            created: user.created_at,
            updated: user.updated_at
        };
    });

    // Helper function to get country name from country code
    function getCountryName(countryCode: number) {
        const countryCodes: Record<number, string> = {
            156: "CHINA",
            702: "SINGAPORE",
            458: "MALAYSIA",
            764: "THAILAND",
            840: "UNITED STATES",
            // Add more as needed
        };
        return countryCodes[countryCode] || "UNKNOWN";
    }

    // Choose the active dataset based on tab
    const activeData = activeTab === "referred-users"
        ? processedReferrals
        : processedAgents;

    // Get unique values for filters from the active dataset
    const uniqueRankings = Array.from(new Set(activeData
        .filter(user => user.ranking)
        .map(user => user.ranking as string)));

    // Filter logic
    const filteredUsers = activeData.filter((user: any) => {
        const matchSearch =
            (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false);

        const matchRanking =
            filterOptions.ranking === "all" ? true : user.ranking === filterOptions.ranking;

        let matchDate = true;
        if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
            const userDate = user.accountActivation
                ? new Date(user.accountActivation)
                : user.accActivation?.date
                    ? new Date(user.accActivation.date)
                    : new Date(user.created);

            if (filterOptions.dateRange.from) {
                matchDate = matchDate && userDate >= new Date(filterOptions.dateRange.from);
            }
            if (filterOptions.dateRange.to) {
                matchDate = matchDate && userDate <= new Date(filterOptions.dateRange.to);
            }
        }

        return matchSearch && matchRanking && matchDate;
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
        } else if (activeTab === "referred-users" && (user.profileId || user.uuid)) {
            router.push(`/referred-users/manage-user/user/${user.profileId || user.uuid}`);
        }
    };

    // Render the appropriate table based on active tab
    const renderActiveTable = () => {
        if (activeTab === "referred-users") {
            return (
                <div className="max-w-full overflow-x-auto mt-3">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.name")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.email")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.accActivation")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.physicalCard")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user: any, index) => (
                                <tr
                                    key={user.id}
                                    className="cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-4 transition-colors
                                    border-b border-stroke dark:border-strokedark"
                                    onClick={() => handleRowClick(user)}
                                >
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getFirstLetter(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-black dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">{user.userId || user.emailAddress}</td>
                                    <td className="py-3 px-3">
                                        {user.accActivation ? (
                                            <div>
                                                <div>{user.accActivation.date}</div>
                                                <div>{user.accActivation.time}</div>
                                            </div>
                                        ) : user.accountActivation ? (
                                            <div>
                                                <div>{formatDate(user.accountActivation.toString()).date}</div>
                                                <div>{formatDate(user.accountActivation.toString()).time}</div>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="py-3 px-3">
                                        {typeof user.physicalCard === 'boolean'
                                            ? user.physicalCard ? "YES" : "-"
                                            : user.physicalCard}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="max-w-full overflow-x-auto mt-3">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.name", "Name")}
                                </th>
                                <th className="py-3 px-3 text-center font-medium">
                                    {t("usersTable.userEmail", "User Email")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.ranking", "Ranking")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.keyMarket", "Key Market")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.joinedSince", "Joined Since")}
                                </th>
                                <th className="py-3 px-3 text-left font-medium">
                                    {t("usersTable.lastActive", "Last Active")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user: any) => (
                                <tr
                                    key={user.id}
                                    className="cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-4 transition-colors
                                    border-b border-stroke dark:border-strokedark"
                                    onClick={() => handleRowClick(user)}
                                >
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getFirstLetter(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-black dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div>{user.userId || user.emailAddress || user.email}</div>
                                        <div className="text-gray-500">{user.id.substring(0, 8)}</div>
                                    </td>
                                    <td className="py-3 px-3">{user.ranking}</td>
                                    <td className="py-3 px-3">{user.country}</td>
                                    <td className="py-3 px-3">
                                        {user.accActivation?.date || formatDate(user.created).date}
                                    </td>
                                    <td className="py-3 px-3">
                                        {user.accActivation ?
                                            `${user.accActivation.date} ${user.accActivation.time}` :
                                            `${formatDate(user.updated).date} ${formatDate(user.updated).time}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            {/* Only show tabs if user is not Level 1 */}
            {!isLevelOne && (
                <SplitTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                />
            )}

            <div className="p-3 md:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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

                    {/* Filter and Recruit Buttons - Hide recruit button for Level 1 users */}
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

                        {/* Only show Recruit button for non-Level 1 users */}
                        {!isLevelOne && (
                            <Button
                                onClick={() => router.push("/referred-users/recruit-agent")}
                                className="bg-primary hover:bg-primary/90">
                                <Plus className="mr-2 h-5 w-5" />
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

                {/* Render the active table based on selected tab */}
                {renderActiveTable()}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-3">
                    <Button
                        variant="outline"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="border-stroke"
                    >
                        {t("usersTable.previous", "Previous")}
                    </Button>

                    <div className="text-body dark:text-bodydark">
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
        </div>
    );
};

export default UsersTable;