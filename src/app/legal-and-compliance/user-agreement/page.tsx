import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import ContentSection from "@/components/Sections/ContentSection"
import { legalContentData } from "@/lib/legal/data"

const UserAgreementPage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.userAgreement.title}
                lastUpdated={legalContentData.userAgreement.lastUpdated}
                sections={legalContentData.userAgreement.sections}
            />

        </DefaultLayout>
    )
}

export default UserAgreementPage
