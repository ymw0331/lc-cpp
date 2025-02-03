import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import PreferenceSettingsForm from '@/components/Forms/PreferenceSettingsForm'
import DefaultLayout from '@/components/Layouts/DefaultLayout'

const PreferencePage = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Preference" />


            <PreferenceSettingsForm />

        </DefaultLayout>
    )
}

export default PreferencePage
