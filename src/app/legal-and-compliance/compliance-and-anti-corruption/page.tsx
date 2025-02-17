"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { legalContentData } from "@/lib/data";
import { useTranslation } from "react-i18next";

const ComplianceAndAntiCorruptionPage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={t("legal.complianceAndAntiCorruptionTitle")}
                lastUpdated={legalContentData.complianceAndAntiCorruption.lastUpdated}
                sections={legalContentData.complianceAndAntiCorruption.sections}
            />
        </DefaultLayout>
    );
};

export default ComplianceAndAntiCorruptionPage;
