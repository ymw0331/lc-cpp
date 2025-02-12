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
<<<<<<< HEAD
            0: { style: "bg-[#6E7A8A]", title: "Master" },
            1: { style: "bg-[#BD8048]", title: "Agent" },
            2: { style: "bg-[#9BA5B7]", title: "Agent" },
            3: { style: "bg-[#DEB668]", title: "Agent" },
            4: { style: "bg-[#4A89DC]", title: "Partner" },
            5: { style: "bg-gradient-to-r from-[#DEB668] to-[#9C4FD6]", title: "Partner" }
=======
            0: { 
                style: "bg-[#6E7A8A] border-2 border-[#8a98aa]", 
                title: "Master",
                containerStyle: "bg-[#5d697a] rounded-xl p-[2px]"
            },
            1: { 
                style: "bg-[#BD8048] border-2 border-[#d49a64]", 
                title: "Agent",
                containerStyle: "bg-[#a36c3c] rounded-xl p-[2px]"
            },
            2: { 
                style: "bg-[#9BA5B7] border-2 border-[#b7c1d3]", 
                title: "Agent",
                containerStyle: "bg-[#8691a3] rounded-xl p-[2px]"
            },
            3: { 
                style: "bg-[#DEB668] border-2 border-[#f2ca7c]", 
                title: "Partner",
                containerStyle: "bg-[#c9a15d] rounded-xl p-[2px]"
            },
            4: { 
                style: "bg-[#4A89DC] border-2 border-[#6aa1f4]", 
                title: "Partner",
                containerStyle: "bg-[#3d74c0] rounded-xl p-[2px]"
            },
            5: { 
                style: "bg-gradient-to-r from-[#f59632] to-[#d31968] border-2 border-[#ffa64d]", 
                title: "Partner",
                containerStyle: "bg-gradient-to-r from-[#ffae4d] to-[#ff2d7f] rounded-xl p-[2px]"
            }
>>>>>>> 1236bef (latest update)
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