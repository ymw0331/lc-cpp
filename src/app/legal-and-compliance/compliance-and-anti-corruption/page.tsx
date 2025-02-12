import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import ContentSection from "@/components/Sections/ContentSection"
import { legalContentData } from "@/lib/data"

const ComplianceAndAntiCorruptionPage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.complianceAndAntiCorruption.title}
                lastUpdated={legalContentData.codeOfConduct.lastUpdated}
                sections={legalContentData.codeOfConduct.sections}
            />

        </DefaultLayout>
    )
}

export default ComplianceAndAntiCorruptionPage