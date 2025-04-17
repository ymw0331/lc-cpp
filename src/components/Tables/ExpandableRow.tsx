import { ChevronDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateWithHKTime } from '@/lib/dateUtils';

interface ExpandableRowProps {
    user: any;
    level: number;
    hasDownstreams: boolean;
    onExpand: () => Promise<void>;
    isExpanded: boolean;
    formatCurrency: (amount: number) => string;
}

export const ExpandableRow = ({
    user,
    level,
    hasDownstreams,
    onExpand,
    isExpanded,
    formatCurrency
}: ExpandableRowProps) => {
    const formattedDate = formatDateWithHKTime(user.createdAt);
    const indentation = level * 20; // 20px indentation per level

    return (
        <tr className="hover:bg-gray-1 dark:hover:bg-meta-4 transition-colors border-b border-stroke dark:border-strokedark">
            <td className="py-3 px-4">
                <div className="flex items-center" style={{ paddingLeft: `${indentation}px` }}>
                    {hasDownstreams && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            onClick={onExpand}
                        >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {user.fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-black dark:text-white font-medium">
                                {user.fullName}
                            </span>
                            <span className="text-xs text-gray-500">
                                {user.emailAddress}
                            </span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">{user.ranking}</td>
            <td className="py-3 px-4">{user.keyMarket || '-'}</td>
            <td className="py-3 px-4">
                <div>
                    <div>{formattedDate.date}</div>
                    <div className="text-xs text-gray-500">{formattedDate.time}</div>
                </div>
            </td>
        </tr>
    );
}; 