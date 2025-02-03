import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import SupportForm from '@/components/Forms/SupportForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const SupportPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Support" />

            <SupportForm />
            
        </DefaultLayout>
    )
}

export default SupportPage