import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import AgentLevelCard from '@/components/Cards/AgentLevelCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import UsersTable from '@/components/Tables/UsersTable';

const ManageUserPage = () => {

    // Add this to your page file for dummy data:
    const generateDummyUsers = (count: number) => {
        const rankings = ['Partner 3', 'Agent 2', 'Agent 1', 'User'];
        const markets = ['Malaysia', 'Thailand', 'Singapore', 'HongKong'];
        const names = ['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Brown', 'Michael Wilson'];

        return Array.from({ length: count }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days

            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

            const formattedDateTime = `${formattedDate} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

            return {
                id: `user${i + 1}`,
                name: names[Math.floor(Math.random() * names.length)],
                userId: '10118237',
                ranking: rankings[Math.floor(Math.random() * rankings.length)],
                keyMarket: markets[Math.floor(Math.random() * markets.length)],
                joinedSince: formattedDate,
                lastActive: formattedDateTime
            };
        });
    };

    // In your page component:
    const MOCK_USERS = generateDummyUsers(30);
    const agentLevels = [
        { level: 'Level 1 Agent', count: 91 },
        { level: 'Level 2 Agent', count: 69 },
        { level: 'Level 3 Agent', count: 50 },
        { level: 'Level 4 Agent', count: 19 },
    ];

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Manage Users" />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Agent Level Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {agentLevels.map((agent, index) => (
                        <AgentLevelCard
                            key={index}
                            level={agent.level}
                            count={agent.count}
                            type="recruit"
                        />
                    ))}
                </div>

                <div className="mt-4">
                    <UsersTable users={MOCK_USERS} />
                </div>
            </div>

        </DefaultLayout>
    )
}

export default ManageUserPage