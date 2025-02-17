"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { legalContentData } from "@/lib/data";
import { useTranslation } from "react-i18next";

const TermsAndConditionsPage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={t("legal.termsAndConditionsTitle")}
                lastUpdated={legalContentData.termsConditions.lastUpdated}
                sections={legalContentData.termsConditions.sections}
            />
        </DefaultLayout>
    );
};

export default TermsAndConditionsPage;
