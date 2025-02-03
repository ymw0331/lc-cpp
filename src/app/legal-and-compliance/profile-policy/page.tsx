import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import ContentSection from "@/components/Sections/ContentSection"
import { legalContentData } from "@/lib/legal/data"

const ProfilePolicyPage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.profilePolicy.title}
                lastUpdated={legalContentData.profilePolicy.lastUpdated}
                sections={legalContentData.profilePolicy.sections}
            />

        </DefaultLayout>
    )
}

export default ProfilePolicyPage