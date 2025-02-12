import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart';
import { recruitData } from '@/lib/data';

const ReferredUsersPage = () => {

    const { count, agentsToPartner, chartData } = recruitData; // Destructure the imported data


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Referred Users" />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                <div className="w-full md:w-2/4">
                    {/* Top Row */}
                    <RecruitCard
<<<<<<< HEAD
                        count={agentsToPartner.count}
=======
                        count={count}
>>>>>>> 1236bef (latest update)
                        agentsToPartner={{
                            count: agentsToPartner.count,
                            trend: agentsToPartner.trend as 'up' | 'down'
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