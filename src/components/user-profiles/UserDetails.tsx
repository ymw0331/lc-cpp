interface UserDetailsProps {
    userId: string;
    joinedDate: string;
    lastActive: string;
    keyMarket: string;
}

const UserDetails = ({ userId, joinedDate, lastActive, keyMarket }: UserDetailsProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-whiter dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <div className="flex justify-between items-center">
                <span className="text-body dark:text-bodydark">User ID</span>
                <span className="text-black dark:text-white font-medium">{userId}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-body dark:text-bodydark">Joined Since</span>
                <span className="text-black dark:text-white font-medium">{joinedDate}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-body dark:text-bodydark">Last Active</span>
                <span className="text-black dark:text-white font-medium">{lastActive}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-body dark:text-bodydark">Key Market</span>
                <span className="text-black dark:text-white font-medium">{keyMarket}</span>
            </div>
        </div>
    );
};

export default UserDetails
