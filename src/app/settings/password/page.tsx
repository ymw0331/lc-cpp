import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import PasswordSettingsForm from '@/components/Forms/PasswordSettingsForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const PasswordPage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Password" />
            <PasswordSettingsForm />
        </DefaultLayout>
    )
}

export default PasswordPage
