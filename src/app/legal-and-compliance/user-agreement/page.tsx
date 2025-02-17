"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { legalContentData } from "@/lib/data";
import { useTranslation } from "react-i18next";

const UserAgreementPage = () => {
    const { t } = useTranslation();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={t("legal.userAgreementTitle")}
                lastUpdated={legalContentData.userAgreement.lastUpdated}
                sections={legalContentData.userAgreement.sections}
            />
        </DefaultLayout>
    );
};

export default UserAgreementPage;
