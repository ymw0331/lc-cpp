interface StatusGridProps {
    items: {
        label: string;
        status: boolean;
    }[];
}

const StatusGrid = ({ items }: StatusGridProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-6 bg-whiter dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                    <span className="text-body dark:text-bodydark">{item.label}</span>
                    <span className={`font-medium ${item.status ? 'text-success' : 'text-danger'
                        }`}>
                        {item.status ? 'Yes' : 'No'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default StatusGrid
