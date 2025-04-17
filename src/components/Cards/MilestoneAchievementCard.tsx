"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Award, Star, Trophy, Gift, Clock, Check, PartyPopper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface MilestoneAchievementCardProps {
    activatedUsers: number;
    targetUsers: number;
    milestones: {
        months: number;
        reward: number;
        isCompleted?: boolean;
        isCurrent?: boolean;
    }[];
    className?: string;
    // Mock props for demonstrating success scenarios
    mockSuccessMonth?: 3 | 4 | 6 | null;
}

// Define types for our timeline items
type MilestoneItem = {
    months: number;
    reward: number;
    isCompleted?: boolean;
    isCurrent?: boolean;
};

type StartPointItem = {
    months: number;
    reward: number;
    isStart: boolean;
};

type TimelineItem = MilestoneItem | StartPointItem;

const MilestoneAchievementCard = ({
    activatedUsers,
    targetUsers,
    milestones,
    className = "",
    mockSuccessMonth = null
}: MilestoneAchievementCardProps) => {
    const { t } = useTranslation();
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [windowDimensions, setWindowDimensions] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    // Update window dimensions when resizing
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Determine which milestone was achieved (only one gets the celebration)
    const achievedMilestoneMonth = mockSuccessMonth;

    // Create a new array that includes month 0 as the starting point
    const timelineWithStart: TimelineItem[] = [
        { months: 0, reward: 0, isStart: true },
        ...milestones.map(milestone => {
            // If target is reached at a specific month, only mark that specific month as completed
            // All earlier months should be shown as "in progress" and all later months as "greyed out/unavailable"
            let isCompleted = false;
            let isCurrent = false;
            
            if (mockSuccessMonth) {
                if (milestone.months === mockSuccessMonth) {
                    isCompleted = true;
                    isCurrent = true;
                } else if (milestone.months < mockSuccessMonth) {
                    // Earlier months are "in progress" but not the achieved one
                    isCompleted = false;
                }
                // Later months remain false (greyed out)
            } else {
                // Use API data when not in mock mode
                isCompleted = milestone.isCompleted || false;
                isCurrent = milestone.isCurrent || false;
            }
            
            return {
                ...milestone,
                isCompleted,
                isCurrent
            };
        })
    ];

    // Calculate progress percentage for the animation
    useEffect(() => {
        const targetPercentage = Math.min(100, (activatedUsers / targetUsers) * 100);

        // Animate the progress bar
        let animatedPercentage = 0;
        const interval = setInterval(() => {
            if (animatedPercentage >= targetPercentage) {
                clearInterval(interval);
                return;
            }
            animatedPercentage += 1;
            setProgressPercentage(animatedPercentage);
        }, 20);

        return () => clearInterval(interval);
    }, [activatedUsers, targetUsers]);

    // Confetti celebration effect when target is reached
    useEffect(() => {
        if (activatedUsers >= targetUsers && achievedMilestoneMonth) {
            setShowConfetti(true);
            setIsGlowing(true);

            // Stop confetti after 5 seconds
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 5000);

            // Glow pulse animation
            const glowInterval = setInterval(() => {
                setIsGlowing(prev => !prev);
            }, 800);

            return () => {
                clearTimeout(timer);
                clearInterval(glowInterval);
            };
        }
    }, [activatedUsers, targetUsers, achievedMilestoneMonth]);

    // Helper function to check if item is a milestone (not start point)
    const isMilestoneItem = (item: TimelineItem): item is MilestoneItem => {
        return !('isStart' in item);
    };

    // Helper function to check if item is a start point
    const isStartPointItem = (item: TimelineItem): item is StartPointItem => {
        return 'isStart' in item;
    };

    // Calculate milestone positions based on months in a 0-6 month timeline
    const getPosition = (index: number) => {
        const milestone = timelineWithStart[index];
        const maxMonth = 6; // Timeline goes from 0 to 6 months
        return (milestone.months / maxMonth) * 100;
    };

    // Target reached status
    const targetReached = activatedUsers >= targetUsers;

    // Get the appropriate milestone that was reached
    const getAchievedMilestone = () => {
        if (!targetReached) return null;

        // If mocking success, return the milestone at that month
        if (mockSuccessMonth) {
            return milestones.find(m => m.months === mockSuccessMonth) || null;
        }

        // Find the most recent completed milestone
        const completedMilestonesList = milestones
            .filter(m => m.isCompleted)
            .sort((a, b) => a.months - b.months);

        return completedMilestonesList.length ? completedMilestonesList[0] : null;
    };

    const achievedMilestone = getAchievedMilestone();

    // Calculate remaining cards needed
    const remainingCardsNeeded = Math.max(0, targetUsers - activatedUsers);

    return (
        <Card 
            ref={cardRef}
            className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full relative ${className} ${isGlowing ? 'glow-pulse' : ''}`}
        >
            {showConfetti && cardRef.current && (
                <ReactConfetti 
                    recycle={false}
                    numberOfPieces={1000}
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
                />
            )}

            <CardHeader className="p-8">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-primary to-amber-500 p-4 w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <Award className="text-white" />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-bold text-black dark:text-white">
                            {t("milestoneAchievementCard.milestoneAchievementBonus")}
                            <span className="text-base text-gray-600 dark:text-gray-400 font-normal italic ml-2">
                                [{t("milestoneAchievementCard.exclusivelyForLevel1")}]
                            </span>
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                            {`${t("milestoneAchievementCard.achieveActivationsMessage").replace("{targetUsers}", targetUsers.toString())}`}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-0">
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold text-primary flex items-center gap-2">
                            {activatedUsers}
                            <span className="text-xl text-gray-600 dark:text-gray-400 font-normal ml-1">
                                {t("milestoneAchievementCard.activatedUsers")}
                            </span>
                            {targetReached && (
                                <span className="animate-bounce inline-flex ml-2">
                                    <PartyPopper className="text-amber-500" size={24} />
                                </span>
                            )}
                        </div>

                        {targetReached ? (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-600 rounded-md font-medium flex items-center gap-1.5">
                                <Check size={16} className="text-green-600" />
                                {t("milestoneAchievementCard.targetReached")}
                            </div>
                        ) : (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-600 rounded-md font-medium flex items-center gap-1.5">
                                <Clock size={16} className="text-amber-600" />
                                {remainingCardsNeeded} {t("milestoneAchievementCard.cardsToGo")}
                            </div>
                        )}
                    </div>

                    {/* Animated Progress bar */}
                    <div className="mt-4 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full relative"
                            style={{ width: `${progressPercentage}%` }}
                        >
                            {/* Animated wave effect */}
                            <div className="absolute inset-0 bg-white opacity-20 wave-animation"></div>
                        </div>
                    </div>
                </div>

                {/* Desktop Timeline View */}
                <div className="mt-14 relative px-4 hidden md:block">
                    {/* Timeline journey map with path visualization */}
                    <div className="relative h-64">
                        {/* Journey path background */}
                        <div className="absolute h-2 bg-gray-200 dark:bg-meta-4 w-full rounded-full top-20"></div>

                        {/* The journey path that's been traveled */}
                        {achievedMilestoneMonth && (
                            <div
                                className={`absolute h-2 rounded-full top-20 bg-gradient-to-r
                                    ${achievedMilestoneMonth === 3 ? 'from-emerald-400 to-amber-500' : 
                                     achievedMilestoneMonth === 4 ? 'from-blue-400 to-indigo-500' : 
                                     'from-purple-400 to-pink-500'}`}
                                style={{
                                    width: `${(achievedMilestoneMonth / 6) * 100}%`
                                }}
                            >
                                {/* Animated pulse at the achievement point */}
                                <div className={`absolute -right-2 -top-1.5 w-5 h-5 rounded-full animate-ping
                                    ${achievedMilestoneMonth === 3 ? 'bg-amber-500' : 
                                     achievedMilestoneMonth === 4 ? 'bg-indigo-500' : 
                                     'bg-pink-500'}`}></div>
                            </div>
                        )}

                        {/* Milestone stations */}
                        {timelineWithStart.map((item, index) => {
                            // Skip rendering month 0 marker but keep it for positioning calculations
                            if (isStartPointItem(item)) return null;
                            
                            const milestone = item as MilestoneItem;
                            const position = getPosition(index);
                            
                            // Determine milestone status
                            const isCurrentMilestone = milestone.months === mockSuccessMonth;
                            const isPastMilestone = mockSuccessMonth !== null && milestone.months < mockSuccessMonth;
                            const isFutureMilestone = mockSuccessMonth !== null && milestone.months > mockSuccessMonth;
                            
                            // Color schemes for different milestone states
                            const getMilestoneStyles = () => {
                                // This milestone was achieved
                                if (isCurrentMilestone) {
                                    if (milestone.months === 3) return {
                                        circle: "w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-amber-500 shadow-xl shadow-amber-200 animate-shimmer",
                                        icon: <Trophy className="text-white" size={28} />,
                                        pulseColor: "border-amber-300",
                                        monthColor: "text-amber-700 font-bold",
                                        rewardColor: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500 font-bold",
                                        badge: "bg-amber-100 text-amber-800"
                                    };
                                    if (milestone.months === 4) return {
                                        circle: "w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-xl shadow-indigo-200 animate-shimmer",
                                        icon: <Star className="text-white" size={28} />,
                                        pulseColor: "border-indigo-300",
                                        monthColor: "text-indigo-700 font-bold",
                                        rewardColor: "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 font-bold",
                                        badge: "bg-indigo-100 text-indigo-800"
                                    };
                                    return {
                                        circle: "w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-xl shadow-pink-200 animate-shimmer",
                                        icon: <Gift className="text-white" size={28} />,
                                        pulseColor: "border-pink-300",
                                        monthColor: "text-pink-700 font-bold",
                                        rewardColor: "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold",
                                        badge: "bg-pink-100 text-pink-800"
                                    };
                                }
                                
                                // Past milestones
                                if (mockSuccessMonth && isPastMilestone) {
                                    return {
                                        circle: "w-12 h-12 rounded-full bg-gray-300 border-4 border-white shadow-md",
                                        icon: <Award className="text-gray-500" size={20} />,
                                        pulseColor: "border-gray-300",
                                        monthColor: "text-gray-600",
                                        rewardColor: "text-gray-500",
                                        badge: "bg-gray-200 text-gray-600"
                                    };
                                }
                                
                                // Future milestones that will never be achieved (since a milestone was already reached)
                                if (mockSuccessMonth && isFutureMilestone) {
                                    return {
                                        circle: "w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 opacity-40",
                                        icon: <Award className="text-gray-400" size={20} />,
                                        pulseColor: "",
                                        monthColor: "text-gray-400",
                                        rewardColor: "text-gray-400",
                                        badge: "bg-gray-100 text-gray-400"
                                    };
                                }
                                
                                // Default state
                                return {
                                    circle: "w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-sm",
                                    icon: <Award className="text-gray-500" size={20} />,
                                    pulseColor: "",
                                    monthColor: "text-gray-700",
                                    rewardColor: "text-gray-600",
                                    badge: "bg-gray-100 text-gray-600"
                                };
                            };
                            
                            const styles = getMilestoneStyles();

                            return (
                                <div
                                    key={index}
                                    className="absolute text-center"
                                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                >
                                    {/* Station marker */}
                                    <div className={`flex items-center justify-center relative mx-auto ${styles.circle}`}>
                                        {styles.icon}
                                        {isCurrentMilestone && (
                                            <div className={`absolute -inset-2 border-2 ${styles.pulseColor} rounded-full animate-pulse`}></div>
                                        )}
                                    </div>

                                    <div className="mt-6 space-y-1.5">
                                        <div className={`text-lg font-medium ${styles.monthColor}`}>
                                            {milestone.months} {t("milestoneAchievementCard.months")}
                                        </div>
                                        <div className={`text-lg ${styles.rewardColor}`}>
                                            USD {milestone.reward}
                                        </div>
                                        
                                        {isCurrentMilestone && (
                                            <div className={`mt-2 px-3 py-1 rounded-full text-xs inline-block ${styles.badge}`}>
                                                {t("milestoneAchievementCard.targetReached")}!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Achievement explanation */}
                    {achievedMilestoneMonth && (
                        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-lg p-4 text-center text-sm shadow-sm">
                            <span className="font-semibold">{t("milestoneAchievementCard.congratulations")}!</span> {t("milestoneAchievementCard.youveReachedYourTarget")} 
                            <span className="font-medium"> {achievedMilestoneMonth} {t("milestoneAchievementCard.months")}</span>.
                            {targetReached && 
                                <span className="ml-1">{t("milestoneAchievementCard.earnedBonus")} <span className="font-bold">USD {getAchievedMilestone()?.reward}</span>.</span>
                            }
                        </div>
                    )}
                    
                    {/* Achievement celebration card */}
                    {achievedMilestone && achievedMilestoneMonth && (
                        <div className="mt-5 mx-auto max-w-2xl overflow-hidden">
                            <div className={`relative rounded-lg p-5 flex items-center gap-4 transform transition-all duration-500 
                                ${achievedMilestoneMonth === 3 ? 'bg-gradient-to-r from-emerald-50 to-amber-50 border border-amber-200' : 
                                 achievedMilestoneMonth === 4 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200' : 
                                 'bg-gradient-to-r from-purple-50 to-pink-50 border border-pink-200'}`}
                            >
                                {/* Celebratory background elements */}
                                <div className="absolute right-0 top-0 w-40 h-40 opacity-5">
                                    <PartyPopper size={160} />
                                </div>
                                
                                {/* Icon container */}
                                <div className={`rounded-full p-3 flex-shrink-0 
                                    ${achievedMilestoneMonth === 3 ? 'bg-gradient-to-br from-emerald-400 to-amber-500' : 
                                     achievedMilestoneMonth === 4 ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 
                                     'bg-gradient-to-br from-purple-400 to-pink-500'}`}
                                >
                                    <Trophy className="text-white" size={28} />
                                </div>
                                
                                {/* Content */}
                                <div className="z-10">
                                    <h4 className={`text-xl font-bold mb-1 
                                        ${achievedMilestoneMonth === 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-600' : 
                                         achievedMilestoneMonth === 4 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : 
                                         'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'}`}
                                    >
                                        🎉 {t("milestoneAchievementCard.congratulations")}!
                                    </h4>
                                    <p className={`
                                        ${achievedMilestoneMonth === 3 ? 'text-amber-700' : 
                                         achievedMilestoneMonth === 4 ? 'text-indigo-700' : 
                                         'text-pink-700'}`}
                                    >
                                        {t("milestoneAchievementCard.youveActivated")} <span className="font-bold">{activatedUsers}</span> {t("milestoneAchievementCard.cardsWithin")} <span className="font-bold">{achievedMilestone.months}</span> {t("milestoneAchievementCard.monthsAndReceived")} <span className={`font-bold 
                                            ${achievedMilestoneMonth === 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500' : 
                                             achievedMilestoneMonth === 4 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500' : 
                                             'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500'}`}
                                        >USD {achievedMilestone.reward}</span>!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile View - Milestone Journey */}
                <div className="mt-6 md:hidden">
                    <div className="font-medium text-gray-700 mb-3">{t("milestoneAchievementCard.milestoneTimeline")}:</div>

                    <div className="relative rounded-lg bg-gray-50 p-4">
                        {/* Journey path background */}
                        <div className="absolute left-7 top-0 bottom-0 w-1 bg-gray-200"></div>

                        {/* Active journey progress */}
                        {achievedMilestoneMonth && (
                            <div
                                className={`absolute left-7 top-0 w-1
                                    ${achievedMilestoneMonth === 3 ? 'bg-gradient-to-b from-emerald-400 to-amber-500' : 
                                     achievedMilestoneMonth === 4 ? 'bg-gradient-to-b from-blue-400 to-indigo-500' : 
                                     'bg-gradient-to-b from-purple-400 to-pink-500'}`}
                                style={{
                                    height: achievedMilestoneMonth === 3 ? '33%' :
                                        achievedMilestoneMonth === 4 ? '66%' :
                                            '100%'
                                }}
                            ></div>
                        )}

                        {/* Timeline milestones */}
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => {
                                // Determine milestone status
                                const isCurrentMilestone = milestone.months === mockSuccessMonth;
                                const isPastMilestone = mockSuccessMonth !== null && milestone.months < mockSuccessMonth;
                                const isFutureMilestone = mockSuccessMonth !== null && milestone.months > mockSuccessMonth;
                                
                                // Mobile style variants
                                const getMobileStyles = () => {
                                    // Current (achieved) milestone
                                    if (isCurrentMilestone) {
                                        if (milestone.months === 3) return {
                                            circle: "w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-amber-500 shadow-lg",
                                            icon: <Trophy className="text-white" size={22} />,
                                            border: "border-l-4 border-amber-500",
                                            titleColor: "text-amber-700 font-bold",
                                            badgeBg: "bg-amber-100 text-amber-700",
                                            month: "text-gray-800 font-bold",
                                            reward: "bg-amber-100 text-amber-800"
                                        };
                                        if (milestone.months === 4) return {
                                            circle: "w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg",
                                            icon: <Star className="text-white" size={22} />,
                                            border: "border-l-4 border-indigo-500",
                                            titleColor: "text-indigo-700 font-bold",
                                            badgeBg: "bg-indigo-100 text-indigo-700",
                                            month: "text-gray-800 font-bold",
                                            reward: "bg-indigo-100 text-indigo-800"
                                        };
                                        return {
                                            circle: "w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg",
                                            icon: <Gift className="text-white" size={22} />,
                                            border: "border-l-4 border-pink-500",
                                            titleColor: "text-pink-700 font-bold",
                                            badgeBg: "bg-pink-100 text-pink-700",
                                            month: "text-gray-800 font-bold",
                                            reward: "bg-pink-100 text-pink-800"
                                        };
                                    }
                                    
                                    // Past milestones
                                    if (mockSuccessMonth && isPastMilestone) {
                                        return {
                                            circle: "w-12 h-12 rounded-full bg-gray-300 border-4 border-white",
                                            icon: <Award className="text-gray-500" size={18} />,
                                            border: "border-l-4 border-gray-300",
                                            titleColor: "text-gray-600",
                                            badgeBg: "bg-gray-200 text-gray-600",
                                            month: "text-gray-700",
                                            reward: "bg-gray-200 text-gray-600"
                                        };
                                    }
                                    
                                    // Future milestones (unreachable)
                                    if (mockSuccessMonth && isFutureMilestone) {
                                        return {
                                            circle: "w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 opacity-40",
                                            icon: <Award className="text-gray-400" size={16} />,
                                            border: "",
                                            titleColor: "text-gray-400",
                                            badgeBg: "bg-gray-100 text-gray-400",
                                            month: "text-gray-400",
                                            reward: "bg-gray-100 text-gray-400"
                                        };
                                    }
                                    
                                    // Default state
                                    return {
                                        circle: "w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-sm",
                                        icon: <Award className="text-gray-500" size={18} />,
                                        border: "",
                                        titleColor: "text-gray-700",
                                        badgeBg: "bg-gray-100 text-gray-600",
                                        month: "text-gray-700",
                                        reward: "bg-gray-100 text-gray-600"
                                    };
                                };
                                
                                const styles = getMobileStyles();

                                return (
                                    <div key={index} className="relative flex items-start gap-5">
                                        {/* Milestone marker */}
                                        <div className="relative z-10 flex-shrink-0 mt-1">
                                            <div className={`flex items-center justify-center ${styles.circle}`}>
                                                {styles.icon}
                                                {isCurrentMilestone && (
                                                    <div className="absolute -inset-1 border-2 border-amber-300 rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Milestone details */}
                                        <div className={`flex-1 bg-white rounded-lg shadow-sm p-4 ${styles.border}`}>
                                            {/* Title and badge */}
                                            <div className="flex justify-between items-center mb-2">
                                                <div className={`font-medium ${styles.month}`}>
                                                    {milestone.months} {t("milestoneAchievementCard.months")}
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded-full font-medium ${styles.reward}`}>
                                                    USD {milestone.reward}
                                                </div>
                                            </div>
                                            
                                            {/* Achievement badge for current milestone */}
                                            {isCurrentMilestone && (
                                                <div className={`mt-2 inline-flex items-center text-sm gap-1.5 px-2 py-1 rounded-md ${styles.badgeBg}`}>
                                                    <PartyPopper size={14} />
                                                    <span className="font-medium">{t("milestoneAchievementCard.targetReached")}!</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile achievement summary */}
                    {achievedMilestone && achievedMilestoneMonth && (
                        <div className={`mt-4 p-4 rounded-lg border flex gap-3 items-center
                            ${achievedMilestoneMonth === 3 ? 'bg-gradient-to-r from-emerald-50 to-amber-50 border-amber-200' : 
                             achievedMilestoneMonth === 4 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200' : 
                             'bg-gradient-to-r from-purple-50 to-pink-50 border-pink-200'}`}
                        >
                            <div className={`rounded-full p-2 flex-shrink-0
                                ${achievedMilestoneMonth === 3 ? 'bg-gradient-to-br from-emerald-400 to-amber-500' : 
                                 achievedMilestoneMonth === 4 ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 
                                 'bg-gradient-to-br from-purple-400 to-pink-500'}`}
                            >
                                <Trophy className="text-white" size={16} />
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">
                                    {t("milestoneAchievementCard.earnedBonus")}
                                </div>
                                <div className={`font-bold text-lg
                                    ${achievedMilestoneMonth === 3 ? 'text-amber-700' : 
                                     achievedMilestoneMonth === 4 ? 'text-indigo-700' : 
                                     'text-pink-700'}`}
                                >
                                    USD {achievedMilestone.reward}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            
            <style jsx global>{`
                .glow-pulse {
                    animation: glow 1.5s ease-in-out infinite alternate;
                    box-shadow: 0 0 10px 1px rgba(246, 151, 50, 0.2);
                }
                
                @keyframes glow {
                    0% {
                        box-shadow: 0 0 15px 1px rgba(246, 151, 50, 0.3);
                    }
                    100% {
                        box-shadow: 0 0 25px 5px rgba(246, 151, 50, 0.5);
                    }
                }
                
                .wave-animation {
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.5) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    width: 100%;
                    height: 100%;
                    animation: wave 2s infinite linear;
                    transform: translateX(-100%);
                }
                
                @keyframes wave {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite linear;
                }
                
                @keyframes shimmer {
                    0% {
                        background-position: -100% 0;
                    }
                    100% {
                        background-position: 100% 0;
                    }
                }
            `}</style>
        </Card>
    );
};

export default MilestoneAchievementCard;