import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import ContentSection from "@/components/Sections/ContentSection"
import { legalContentData } from "@/lib/legal/data"

const ProgramGuidelinePage = () => {
    return (
        <DefaultLayout>

            <Breadcrumb pageName="Legal and Compliance" />

            <ContentSection
                title={legalContentData.programGuideline.title}
                lastUpdated={legalContentData.programGuideline.lastUpdated}
                sections={legalContentData.programGuideline.sections}
            />

        </DefaultLayout>
    )
}

export default ProgramGuidelinePage