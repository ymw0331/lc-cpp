'use client';

interface ContentSectionProps {
    title: string;
    lastUpdated: string;
    sections: {
        heading?: string;
        content: string[];
    }[];
}


const ContentLayout: React.FC<ContentSectionProps> = ({ title, lastUpdated, sections }) => {
    return (
        <div className="rounded-xl border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-2 p-4 sm:p-6 xl:p-7.5">
                {/* Title and Last Updated */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h2 className="text-2xl font-semibold text-black dark:text-white">
                        {title}
                    </h2>
                    <span className="text-sm text-body dark:text-bodydark">
                        Last Updated: {lastUpdated}
                    </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">
                    {sections.map((section, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            {section.heading && (
                                <h3 className="text-xl font-semibold text-black dark:text-white">
                                    {section.heading}
                                </h3>
                            )}
                            {section.content.map((paragraph, pIndex) => (
                                <p
                                    key={pIndex}
                                    className="text-base text-body dark:text-bodydark leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ContentLayout;