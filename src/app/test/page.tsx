'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import SalesSummaryCard from "@/components/Charts/SalesSummaryCard";
import SalesVolumeBarChart from "@/components/Charts/SalesVolumeBarChart";
import DefaultLayout from "@/components/Layouts/DefaultLayout"


const TestPage = () => {

    const salesVolumeData = {
        monthlyData2024: [
            { name: 'Jan', value: 3741 },
            { name: 'Feb', value: 1587 },
            { name: 'Mar', value: 2085 },
            { name: 'Apr', value: 1664 },
            { name: 'May', value: 1809 },
            { name: 'Jun', value: 2536 },
            { name: 'Jul', value: 2303 },
            { name: 'Aug', value: 1718 },
            { name: 'Sep', value: 2354 },
            { name: 'Oct', value: 1914 },
            { name: 'Nov', value: 1848 },
            { name: 'Dec', value: 1831 },
        ],
        monthlyData2023: [
            { name: 'Jan', value: 2841 },
            { name: 'Feb', value: 1987 },
            { name: 'Mar', value: 2785 },
            { name: 'Apr', value: 1964 },
            { name: 'May', value: 2109 },
            { name: 'Jun', value: 2736 },
            { name: 'Jul', value: 2503 },
            { name: 'Aug', value: 1918 },
            { name: 'Sep', value: 2554 },
            { name: 'Oct', value: 2114 },
            { name: 'Nov', value: 2048 },
            { name: 'Dec', value: 2031 },
        ],
        weeklyData: {
            Jan2024: [
                { name: 'Week 1', value: 941 },
                { name: 'Week 2', value: 887 },
                { name: 'Week 3', value: 985 },
                { name: 'Week 4', value: 928 },
            ],
            Feb2024: [
                { name: 'Week 1', value: 441 },
                { name: 'Week 2', value: 387 },
                { name: 'Week 3', value: 485 },
                { name: 'Week 4', value: 274 },
            ],
        },
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Testing" />
            
            <div className="mt-4">
                <SalesVolumeBarChart
                    salesVolumeData={salesVolumeData} // Pass the entire data object
                />
            </div>

        </DefaultLayout>
    )
}

export default TestPage