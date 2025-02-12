import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import ContentSection from "@/components/Sections/ContentSection"
import { legalContentData } from "@/lib/data"

const TermsAndConditionsPage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.termsConditions.title}
                lastUpdated={legalContentData.termsConditions.lastUpdated}
                sections={legalContentData.termsConditions.sections}
            />

        </DefaultLayout>
    )
}

export default TermsAndConditionsPage
