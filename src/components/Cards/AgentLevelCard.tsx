"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Lock, Users, Award, BadgeCheck } from "lucide-react";

interface AgentLevelCardProps {
    level: string;
    count: number;
    icon: ReactNode;
    tierLevel: string; // 'tier 0', 'tier 1', etc.
    isClickable?: boolean;
    onCardClick?: (tier: string, tabId: string) => void;
}

const AgentLevelCard = ({
    level,
    count,
    icon,
    tierLevel,
    isClickable = true,
    onCardClick
}: AgentLevelCardProps) => {
    const { t } = useTranslation();

    // Determine if this is a user card or agent card
    const isUserCard = tierLevel === 'tier 0';
    const isLevel3Card = tierLevel === 'tier 3';

    // Determine visual attributes based on tier
    const getCardStyles = () => {
        if (isLevel3Card) {
            return {
                background: "bg-gray-100/50 dark:bg-gray-800/50",
                border: "border-gray-200 dark:border-gray-700 border-dashed",
                cursor: "cursor-not-allowed",
                hoverEffect: "",
                label: "Upranked Agents",
                description: "Agents promoted to Level 3"
            };
        }

        if (!isClickable) {
            return {
                background: "bg-gray-100 dark:bg-gray-800",
                border: "border-gray-200 dark:border-gray-700",
                cursor: "cursor-default",
                hoverEffect: "",
                label: isUserCard ? "Referred Users" : "Recruited Agents",
                description: isUserCard ? "Total Referred" : "Active"
            };
        }

        // Custom colors for clickable cards
        switch (tierLevel) {
            case 'tier 0':
                return {
                    background: "bg-blue-50 dark:bg-blue-900/20",
                    border: "border-blue-200 dark:border-blue-800",
                    cursor: "cursor-pointer",
                    hoverEffect: "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all",
                    // label: "Referred Users",
                    // description: "Total Referred"
                };
            case 'tier 1':
                return {
                    background: "bg-green-50 dark:bg-green-900/20",
                    border: "border-green-200 dark:border-green-800",
                    cursor: "cursor-pointer",
                    hoverEffect: "hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all",
                    // label: "Recruited Agents",
                    // description: "Active"
                };
            case 'tier 2':
                return {
                    background: "bg-purple-50 dark:bg-purple-900/20",
                    border: "border-purple-200 dark:border-purple-800",
                    cursor: "cursor-pointer",
                    hoverEffect: "hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all",
                    // label: "Recruited Agents",
                    // description: "Active"
                };
            default:
                return {
                    background: "bg-orange-50 dark:bg-orange-900/20",
                    border: "border-orange-200 dark:border-orange-800",
                    cursor: "cursor-default",
                    hoverEffect: "",
                    // label: "Recruited Agents",
                    // description: "Active"
                };
        }
    };

    const styles = getCardStyles();

    const handleClick = () => {
        if (!isClickable || !onCardClick || isLevel3Card) return;

        // If it's the user card, activate the referred-users tab
        // Otherwise, activate the agents tab with the appropriate filter
        onCardClick(
            tierLevel,
            isUserCard ? "referred-users" : "agents"
        );
    };

    return (
        <Card
            className={`${styles.background} border ${styles.border} relative overflow-hidden ${styles.cursor} ${styles.hoverEffect}`}
            onClick={handleClick}
        >
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center">
                            <h3 className={`text-base font-semibold ${isLevel3Card ? 'text-gray-500' : ''}`}>{level}</h3>
                            {(isLevel3Card || !isClickable) && (
                                <Lock className="h-4 w-4 ml-2 text-gray-500" />
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {styles.label}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isLevel3Card ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                        {isLevel3Card ? <Award className="h-6 w-6 text-gray-500" /> : icon}
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className={`text-3xl font-bold ${isLevel3Card ? 'text-gray-500' : ''}`}>{count}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {styles.description}
                        </p>
                    </div>

                    {isClickable && !isLevel3Card && (
                        <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Special labels for Level 3 card */}
                {isLevel3Card && (
                    <div className="absolute top-2 right-2 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full flex items-center">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        {t("agentLevelCard.promoted", "Upranked")}
                    </div>
                )}

                {/* Visual indicator for non-clickable cards that aren't Level 3 */}
                {!isClickable && !isLevel3Card && (
                    <div className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {t("agentLevelCard.viewOnly", "View Only")}
                    </div>
                )}

                {/* More prominent visual for Level 3 to show it's not clickable */}
                {isLevel3Card && (
                    <div className="absolute inset-0 bg-gray-100/30 dark:bg-gray-800/30 pointer-events-none">
                        <div className="absolute bottom-3 right-3 text-xs text-gray-500 italic">
                            {t("agentLevelCard.displayOnly", "Display only")}
                        </div>
                    </div>
                )}

                {/* Diagonal stripe for Level 3 */}
                {isLevel3Card && (
                    <div className="absolute -right-14 -top-2 w-[140px] h-8 bg-red-200/50 dark:bg-red-900/20 transform rotate-45"></div>
                )}
            </CardContent>
        </Card>
    );
};

export default AgentLevelCard;