import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitAgentForm from '@/components/Forms/RecruitAgentForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const RecruitAgentPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Recruit Agent" />
            <RecruitAgentForm />
        </DefaultLayout>
    )
}

export default RecruitAgentPage
