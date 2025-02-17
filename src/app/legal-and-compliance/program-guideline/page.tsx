"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { legalContentData } from "@/lib/data";
import { useTranslation } from "react-i18next";

const ProgramGuidelinePage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={t("legal.programGuidelineTitle")}
                lastUpdated={legalContentData.programGuideline.lastUpdated}
                sections={legalContentData.programGuideline.sections}
            />
        </DefaultLayout>
    );
};

export default ProgramGuidelinePage;
