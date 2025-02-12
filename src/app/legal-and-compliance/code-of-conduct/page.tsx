import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import ContentSection from "@/components/Sections/ContentSection"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { legalContentData } from "@/lib/data"

const CodeOfConductPage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.codeOfConduct.title}
                lastUpdated={legalContentData.codeOfConduct.lastUpdated}
                sections={legalContentData.codeOfConduct.sections}
            />

        </DefaultLayout>
    )
}

export default CodeOfConductPage