// LevelBadge.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
    className?: string;
}

const LevelBadge = ({ className }: LevelBadgeProps) => {
    const { user } = useAuth();
    // console.log('Current user in LevelBadge:', user); // Debug log

    const level = user?.level || 0;

    const getLevelConfig = (level: number) => {
        const configs = {
            0: { style: "bg-[#6E7A8A]", title: "Master" },
            1: { style: "bg-[#BD8048]", title: "Agent" },
            2: { style: "bg-[#9BA5B7]", title: "Agent" },
            3: { style: "bg-[#DEB668]", title: "Agent" },
            4: { style: "bg-[#4A89DC]", title: "Partner" },
            5: { style: "bg-gradient-to-r from-[#DEB668] to-[#9C4FD6]", title: "Partner" }
        };

        return configs[level as keyof typeof configs] || configs[0];
    };

    const { style, title } = getLevelConfig(level);

    // Debug logs
    // console.log('Level:', level);
    // console.log('Style:', style);
    // console.log('Title:', title);

    return (
        <div
            className={cn(
                "px-3 py-1 rounded-md text-white text-sm font-medium transition-all",
                style,
                className
            )}
        >
            Level {level} {title}
        </div>
    );
};

export default LevelBadge;