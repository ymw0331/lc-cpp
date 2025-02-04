import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import NextLevelCard from "@/components/Cards/NextLevelCard"
import ProgressCard from "@/components/Cards/ProgressCard"
import DemographicSalesChart from "@/components/Charts/DemographicSalesChart"
import MetricsChart from "@/components/Charts/MetricsChart"
import SalesSummaryCard from "@/components/Charts/SalesSummaryCard"
import SalesVolumeBarChart from "@/components/Charts/SalesVolumeBarChart"
import DefaultLayout from "@/components/Layouts/DefaultLayout"

const PerformancePage = () => {


    const chartData = {
        depositSummary: {
            "2023": {
                Year: [
                    { label: 'Jan', value: 605 },
                    { label: 'Feb', value: 1156 },
                    { label: 'Mar', value: 1038 },
                    { label: 'Apr', value: 1789 },
                    { label: 'May', value: 1503 },
                    { label: 'Jun', value: 904 },
                    { label: 'Jul', value: 974 },
                    { label: 'Aug', value: 1414 },
                    { label: 'Sep', value: 1355 },
                    { label: 'Oct', value: 1594 },
                    { label: 'Nov', value: 1762 },
                    { label: 'Dec', value: 2089 }
                ],
                Month: [
                    { label: 'Week 1', value: 5200 },
                    { label: 'Week 2', value: 6100 },
                    { label: 'Week 3', value: 4800 },
                    { label: 'Week 4', value: 7300 }
                ],
                Week: [
                    { label: 'Mon', value: 1200 },
                    { label: 'Tue', value: 1800 },
                    { label: 'Wed', value: 1400 },
                    { label: 'Thu', value: 2200 },
                    { label: 'Fri', value: 1900 },
                    { label: 'Sat', value: 2400 },
                    { label: 'Sun', value: 2100 }
                ]
            },
            "2022": {
                Year: [
                    { label: 'Jan', value: 502 },
                    { label: 'Feb', value: 985 },
                    { label: 'Mar', value: 892 },
                    { label: 'Apr', value: 1456 },
                    { label: 'May', value: 1298 },
                    { label: 'Jun', value: 856 },
                    { label: 'Jul', value: 789 },
                    { label: 'Aug', value: 1256 },
                    { label: 'Sep', value: 1189 },
                    { label: 'Oct', value: 1456 },
                    { label: 'Nov', value: 1589 },
                    { label: 'Dec', value: 1856 }
                ],
                Month: [
                    { label: 'Week 1', value: 4800 },
                    { label: 'Week 2', value: 5600 },
                    { label: 'Week 3', value: 4200 },
                    { label: 'Week 4', value: 6800 }
                ],
                Week: [
                    { label: 'Mon', value: 1100 },
                    { label: 'Tue', value: 1600 },
                    { label: 'Wed', value: 1300 },
                    { label: 'Thu', value: 2000 },
                    { label: 'Fri', value: 1700 },
                    { label: 'Sat', value: 2200 },
                    { label: 'Sun', value: 1900 }
                ]
            }
        },

        cardActivation: {
            "2023": {
                Year: [
                    { label: 'Jan', value: 150 },
                    { label: 'Feb', value: 450 },
                    { label: 'Mar', value: 380 },
                    { label: 'Apr', value: 560 },
                    { label: 'May', value: 270 },
                    { label: 'Jun', value: 490 },
                    { label: 'Jul', value: 120 },
                    { label: 'Aug', value: 590 },
                    { label: 'Sep', value: 310 },
                    { label: 'Oct', value: 430 },
                    { label: 'Nov', value: 580 },
                    { label: 'Dec', value: 530 }
                ],
                Month: [
                    { label: 'Week 1', value: 320 },
                    { label: 'Week 2', value: 480 },
                    { label: 'Week 3', value: 290 },
                    { label: 'Week 4', value: 510 }
                ],
                Week: [
                    { label: 'Mon', value: 85 },
                    { label: 'Tue', value: 120 },
                    { label: 'Wed', value: 95 },
                    { label: 'Thu', value: 140 },
                    { label: 'Fri', value: 110 },
                    { label: 'Sun', value: 65 }
                ]
            },
            "2022": {
                Year: [
                    { label: 'Jan', value: 120 },
                    { label: 'Feb', value: 380 },
                    { label: 'Mar', value: 320 },
                    { label: 'Apr', value: 480 },
                    { label: 'May', value: 230 },
                    { label: 'Jun', value: 420 },
                    { label: 'Jul', value: 90 },
                    { label: 'Aug', value: 510 },
                    { label: 'Sep', value: 280 },
                    { label: 'Oct', value: 390 },
                    { label: 'Nov', value: 520 },
                    { label: 'Dec', value: 480 }
                ],
                Month: [
                    { label: 'Week 1', value: 280 },
                    { label: 'Week 2', value: 420 },
                    { label: 'Week 3', value: 250 },
                    { label: 'Week 4', value: 460 }
                ],
                Week: [
                    { label: 'Mon', value: 75 },
                    { label: 'Tue', value: 110 },
                    { label: 'Wed', value: 85 },
                    { label: 'Thu', value: 130 },
                    { label: 'Fri', value: 100 },
                    { label: 'Sat', value: 65 },
                    { label: 'Sun', value: 55 }
                ]
            }
        },

        salesVolume: {
            "2023": {
                Year: [
                    { label: 'Jan', value: 3741 },
                    { label: 'Feb', value: 1587 },
                    { label: 'Mar', value: 2085 },
                    { label: 'Apr', value: 1684 },
                    { label: 'May', value: 1809 },
                    { label: 'Jun', value: 2536 },
                    { label: 'Jul', value: 2303 },
                    { label: 'Aug', value: 1718 },
                    { label: 'Sep', value: 2354 },
                    { label: 'Oct', value: 1914 },
                    { label: 'Nov', value: 1848 },
                    { label: 'Dec', value: 1831 }
                ],
                Month: [
                    { label: 'Week 1', value: 12500 },
                    { label: 'Week 2', value: 14800 },
                    { label: 'Week 3', value: 11200 },
                    { label: 'Week 4', value: 15600 }
                ]
            },
            "2022": {
                Year: [
                    { label: 'Jan', value: 3256 },
                    { label: 'Feb', value: 1423 },
                    { label: 'Mar', value: 1896 },
                    { label: 'Apr', value: 1523 },
                    { label: 'May', value: 1654 },
                    { label: 'Jun', value: 2345 },
                    { label: 'Jul', value: 2156 },
                    { label: 'Aug', value: 1589 },
                    { label: 'Sep', value: 2189 },
                    { label: 'Oct', value: 1789 },
                    { label: 'Nov', value: 1723 },
                    { label: 'Dec', value: 1689 }
                ],
                Month: [
                    { label: 'Week 1', value: 11200 },
                    { label: 'Week 2', value: 13500 },
                    { label: 'Week 3', value: 10800 },
                    { label: 'Week 4', value: 14200 }
                ]
            }
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Performance" />

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-4 h-full">

                {/* Left Column - Takes 8 columns (2/3 of space) */}
                <div className="col-span-12 xl:col-span-8 h-full">
                    {/* Top Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Card Activation Volume */}
                        <ProgressCard
                            title="Card Activation Volume"
                            currentValue={42208}
                            targetValue={50000}
                            suffix="Active Users"
                            progressColor="primary"
                        />

                        {/* Total Agent Recruitment */}
                        <ProgressCard
                            title="Total Agent Recruitment"
                            currentValue={2146}
                            targetValue={3000}
                            suffix="Agents"
                            progressColor="primary"
                        />
                    </div>

                    {/* Next Level Card */}
                    <NextLevelCard
                        currentLevel="LEVEL 5 PARTNER"
                        progress={84.5}
                        isMaxLevel={true}
                        avatarUrl='/images/user/user-07.png'
                    />
                </div>

                {/* Right Column - Takes 4 columns (1/3 of space) */}
                <div className="col-span-12 xl:col-span-4">
                    <SalesSummaryCard
                        className="h-full"
                        groupSales={73.2}
                        personalSales={27.8}
                    />
                </div>
            </div>



            <div className="mt-4">
                <SalesVolumeBarChart />
            </div>



            <div className="mt-4">
                <DemographicSalesChart />
            </div>



        </DefaultLayout>
    )
}

export default PerformancePage
