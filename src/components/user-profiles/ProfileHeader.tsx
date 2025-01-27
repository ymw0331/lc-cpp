interface ProfileHeaderProps {
    name: string;
    level: string;
    avatar: string;
    socialLinks: {
        facebook?: string;
        linkedin?: string;
    };
    promotedDate?: string;
}

const ProfileHeader = ({ name, level, avatar, socialLinks, promotedDate }: ProfileHeaderProps) => {
    return (
        <div className="flex items-start gap-4 p-6 bg-whiter dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <div className="w-20 h-20 rounded-full overflow-hidden">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-title-md text-black dark:text-white font-bold">{name}</h3>
                        <span className="inline-block px-4 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
                            {level}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {socialLinks.facebook && (
                            <a href={socialLinks.facebook} className="text-meta-5 hover:text-primary">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    {/* Facebook icon path */}
                                </svg>
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} className="text-meta-5 hover:text-primary">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    {/* LinkedIn icon path */}
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
                {promotedDate && (
                    <p className="text-sm text-body dark:text-bodydark mt-2">
                        Promoted on - {promotedDate}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader