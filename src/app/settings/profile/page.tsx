import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import ProfileSettingsForm from '@/components/Forms/ProfileSettingsForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const ProfilePage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Profile" />

            <ProfileSettingsForm />

        </DefaultLayout>
    )
}

export default ProfilePage
