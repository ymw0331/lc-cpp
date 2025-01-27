// components/Tables/UsersTable.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

// Types
interface FilterOptions {
    market: string;
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
    uniqueMarkets: string[];
    uniqueRankings: string[];
}

interface UserData {
    id: string;
    name: string;
    userId: string;
    ranking: string;
    keyMarket: string;
    joinedSince: string;
    lastActive: string;
}

interface UsersTableProps {
    users: UserData[];
}

// Filter Component
const FilterPopup = ({
    isOpen,
    onClose,
    filterOptions,
    setFilterOptions,
    uniqueMarkets,
    uniqueRankings
}: FilterPopupProps) => {
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOptions(prev => ({ ...prev, market: e.target.value }));
    };

    const handleRankingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOptions(prev => ({ ...prev, ranking: e.target.value }));
    };

    const handleDateChange = (field: 'from' | 'to', value: string) => {
        setFilterOptions(prev => ({
            ...prev,
            dateRange: { ...prev.dateRange, [field]: value }
        }));
    };

    return (
        <div
            ref={filterRef}
            className={`absolute right-0 top-12 w-[400px] rounded-sm border border-stroke bg-white dark:bg-boxdark p-5 shadow-default ${isOpen ? 'block' : 'hidden'
                }`}
        >
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Filters
            </h4>

            <div className="space-y-6">
                {/* Market Filter */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        Market
                    </label>
                    <div className="relative">
                        <select
                            value={filterOptions.market}
                            onChange={handleMarketChange}
                            className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                        >
                            <option value="all">All Markets</option>
                            {uniqueMarkets.map((market) => (
                                <option key={market} value={market}>
                                    {market}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16.8C11.8 16.8 11.6 16.75 11.4 16.65L5.4 12.65C5.15 12.45 5 12.15 5 11.8C5 11.45 5.15 11.15 5.4 10.95L11.4 6.95C11.75 6.7 12.25 6.7 12.6 6.95L18.6 10.95C18.85 11.15 19 11.45 19 11.8C19 12.15 18.85 12.45 18.6 12.65L12.6 16.65C12.4 16.75 12.2 16.8 12 16.8Z" fill="currentColor" className="text-body dark:text-bodydark" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Ranking Filter */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        Ranking
                    </label>
                    <div className="relative">
                        <select
                            value={filterOptions.ranking}
                            onChange={handleRankingChange}
                            className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                        >
                            <option value="all">All Rankings</option>
                            {uniqueRankings.map((ranking) => (
                                <option key={ranking} value={ranking}>
                                    {ranking}
                                </option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16.8C11.8 16.8 11.6 16.75 11.4 16.65L5.4 12.65C5.15 12.45 5 12.15 5 11.8C5 11.45 5.15 11.15 5.4 10.95L11.4 6.95C11.75 6.7 12.25 6.7 12.6 6.95L18.6 10.95C18.85 11.15 19 11.45 19 11.8C19 12.15 18.85 12.45 18.6 12.65L12.6 16.65C12.4 16.75 12.2 16.8 12 16.8Z" fill="currentColor" className="text-body dark:text-bodydark" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <label className="text-base text-body dark:text-bodydark">
                        Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-body dark:text-bodydark">From</label>
                            <input
                                type="date"
                                value={filterOptions.dateRange.from}
                                onChange={(e) => handleDateChange('from', e.target.value)}
                                className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-body dark:text-bodydark">To</label>
                            <input
                                type="date"
                                value={filterOptions.dateRange.to}
                                onChange={(e) => handleDateChange('to', e.target.value)}
                                className="w-full rounded-sm border border-stroke bg-white dark:bg-boxdark py-3 px-4 text-black dark:text-white outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
const UsersTable = ({ users }: UsersTableProps) => {
    // For single user view  
    const router = useRouter();
    const handleRowClick = (userId: string) => {
        router.push(`/referred-users/manage-user/${userId}`);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        market: 'all',
        ranking: 'all',
        dateRange: {
            from: '',
            to: ''
        }
    });

    // Get unique values for filters
    const uniqueMarkets = Array.from(new Set(users.map(user => user.keyMarket)));
    const uniqueRankings = Array.from(new Set(users.map(user => user.ranking)));

    // Filter logic
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userId.includes(searchTerm);
        const matchMarket = filterOptions.market === 'all' ? true : user.keyMarket === filterOptions.market;
        const matchRanking = filterOptions.ranking === 'all' ? true : user.ranking === filterOptions.ranking;

        let matchDate = true;
        if (filterOptions.dateRange.from || filterOptions.dateRange.to) {
            const userDate = new Date(user.joinedSince);
            if (filterOptions.dateRange.from) {
                matchDate = matchDate && userDate >= new Date(filterOptions.dateRange.from);
            }
            if (filterOptions.dateRange.to) {
                matchDate = matchDate && userDate <= new Date(filterOptions.dateRange.to);
            }
        }

        return matchSearch && matchMarket && matchRanking && matchDate;
    });

    const hasActiveFilters = filterOptions.market !== 'all' ||
        filterOptions.ranking !== 'all' ||
        filterOptions.dateRange.from ||
        filterOptions.dateRange.to;

    return (
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="p-4 md:p-6 xl:p-7.5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="flex w-full max-w-md items-center gap-3">
                        <Input
                            type="text"
                            placeholder="Search User"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray dark:bg-boxdark-2 border-stroke dark:border-strokedark pl-4 pr-6 outline-none"
                        />
                    </div>

                    {/* Filter and Recruit Buttons */}
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
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-5 w-5" />
                            Recruit
                        </Button>
                    </div>
                </div>

                {/* Filter Popup */}
                <FilterPopup
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    uniqueMarkets={uniqueMarkets}
                    uniqueRankings={uniqueRankings}
                />

                {/* Users Table */}
                <div className="max-w-full overflow-x-auto mt-6">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="py-4 px-4 text-left font-medium">Name</th>
                                <th className="py-4 px-4 text-left font-medium">User ID</th>
                                <th className="py-4 px-4 text-left font-medium">Ranking</th>
                                <th className="py-4 px-4 text-left font-medium">Key Market</th>
                                <th className="py-4 px-4 text-left font-medium">Joined Since</th>
                                <th className="py-4 px-4 text-left font-medium">Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    onClick={() => handleRowClick(user.userId)}
                                    className={`
                                        cursor-pointer hover:bg-gray-1 dark:hover:bg-meta-4 transition-colors
                                        border-b border-stroke dark:border-strokedark ${index % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-1 dark:bg-meta-4/30'
                                        }`}
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full"
                                            />
                                            <span className="text-black dark:text-white">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">{user.userId}</td>
                                    <td className="py-4 px-4">{user.ranking}</td>
                                    <td className="py-4 px-4">{user.keyMarket}</td>
                                    <td className="py-4 px-4">{user.joinedSince}</td>
                                    <td className="py-4 px-4">{user.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;