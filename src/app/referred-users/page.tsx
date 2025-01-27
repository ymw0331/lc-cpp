import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart';

const ReferredUsersPage = () => {

    const generateChartData = (points: number, min: number, max: number) => {
        const data = [];

        // Generate data based on period
        if (points === 7) { // Week
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            for (let i = 0; i < points; i++) {
                data.push({
                    name: days[i],
                    value: Math.floor(Math.random() * (max - min) + min)
                });
            }
        } else if (points === 30) { // Month
            for (let i = 1; i <= points; i++) {
                data.push({
                    name: `${i}`,
                    value: Math.floor(Math.random() * (max - min) + min)
                });
            }
        } else { // Year
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 12; i++) {
                data.push({
                    name: months[i],
                    value: Math.floor(Math.random() * (max - min) + min)
                });
            }
        }

        return data;
    };

    // Mock data for the chart
    const chartData = {
        Week: generateChartData(7, 150, 300),
        Month: generateChartData(30, 150, 300),
        Year: generateChartData(12, 150, 300)
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Referred Users" />
            
            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                <div className="w-full md:w-2/4">
                    {/* Top Row */}
                    <RecruitCard
                        count={2146}
                        agentsToPartner={{
                            count: 22,
                            trend: 'up'  
                        }}
                    />
                </div>

                {/* Chart */}
                <AnalyticChart
                    title="Recruitment Summary"
                    chartData={chartData}
                    showLegend={true}
                    legendLabel="Total Direct Recruit"
                    legendPosition="top-right"
                    lineColor="#F69732"
                />
            </div>

        </DefaultLayout>
    )
}

export default ReferredUsersPage