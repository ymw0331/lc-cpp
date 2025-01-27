import Image from "next/image";

interface ProfileCardProps {
    name: string;
    level: string;
    activeUsers: {
        current: number;
        target: number;
        percentage: number;
        remaining: number;
    };
    avatar?: string;
}

const ProfileCard = ({ name, level, activeUsers, avatar }: ProfileCardProps) => {
    return (
        <div className="p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <div className="flex flex-col">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">{name}</h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">{level}</p>
                    </div>
                    <div className="relative w-20 h-20 rounded-full bg-[#F3F3F3] dark:bg-meta-4 overflow-hidden">
                        {avatar ? (
                            <Image
                                src={avatar}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#7C74FF]">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Count Section */}
                <div className="mt-8">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-black dark:text-white">
                            {activeUsers.current.toLocaleString()}
                        </span>
                        <span className="text-2xl text-gray-500 dark:text-gray-400">
                            / {activeUsers.target.toLocaleString()} Active Users
                        </span>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-[#E9E7FD] dark:bg-meta-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#7C74FF] rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${activeUsers.percentage}%` }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-[#7C74FF]">
                        {activeUsers.percentage}%
                    </span>
                </div>

                {/* Remaining Count */}
                <div className="mt-4 flex items-center">
                    <span className="text-3xl font-bold text-black dark:text-white">
                        {activeUsers.remaining.toLocaleString()}
                    </span>
                    <span className="text-2xl text-gray-500 dark:text-gray-400 ml-2">
                        Left
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;