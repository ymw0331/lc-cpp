import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NextLevelCard from "@/components/Cards/NextLevelCard";
import ProgressCard from "@/components/Cards/ProgressCard";
import DemographicSalesChart from "@/components/Charts/DemographicSalesChart";
import SalesSummaryCard from "@/components/Charts/SalesSummaryCard";
import SalesVolumeBarChart from "@/components/Charts/SalesVolumeBarChart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { performanceData } from "@/lib/data"; // Adjusted import to match the export

const PerformancePage = () => {
    const { progressCards, nextLevelCard, salesSummary, salesVolumeData, } = performanceData;

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
                        {progressCards.map((card, index) => (
                            <ProgressCard
                                key={index}
                                title={card.title}
                                currentValue={card.currentValue}
                                targetValue={card.targetValue}
                                suffix={card.suffix}
                                progressColor={card.progressColor}
                            />
                        ))}
                    </div>

                    {/* Next Level Card */}
                    <NextLevelCard
                        currentLevel={nextLevelCard.currentLevel}
                        progress={nextLevelCard.progress}
                        isMaxLevel={nextLevelCard.isMaxLevel}
                        avatarUrl={nextLevelCard.avatarUrl}
                        name={nextLevelCard.name}
                    />
                </div>

                {/* Right Column - Takes 4 columns (1/3 of space) */}
                <div className="col-span-12 xl:col-span-4">
                    <SalesSummaryCard
                        className="h-full"
                        groupSales={salesSummary.groupSales}
                        personalSales={salesSummary.personalSales}
                    />
                </div>
            </div>

            <div className="mt-4">
                <SalesVolumeBarChart
                    salesVolumeData={salesVolumeData} // Pass the entire data object
                />
            </div>

            <div className="mt-4">
                <DemographicSalesChart />
            </div>
        </DefaultLayout>
    );
}

export default PerformancePage;
