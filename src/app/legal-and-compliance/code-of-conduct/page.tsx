"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { legalContentData } from "@/lib/data";
import ContentSection from "@/components/Sections/ContentSection";
import { useTranslation } from "react-i18next";

const CodeOfConductPage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={t("legal.codeOfConductTitle")}
                lastUpdated={legalContentData.codeOfConduct.lastUpdated}
                sections={legalContentData.codeOfConduct.sections}
            />
        </DefaultLayout>
    );
};

export default CodeOfConductPage;
