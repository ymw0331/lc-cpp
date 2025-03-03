"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/storage";

const TermsAndConditionsPage = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState('en');
    interface Section {
        heading: string;
        content: string[];
    }

    interface TermsContent {
        title: string;  
        lastUpdated: string;
        sections: Section[];
    }

    const [termsContent, setTermsContent] = useState<TermsContent>({
        title: "",
        lastUpdated: "15 Nov, 2024",
        sections: []
    });

    useEffect(() => {
        // Get language preference from storage
        const userLang = storage.getLanguagePreference();
        setLanguage(userLang);

        // Set the content based on language
        setTermsContent(getTermsContentByLanguage(userLang));
    }, []);

    const getTermsContentByLanguage = (lang: string): TermsContent => {
        if (lang === 'zh') {
            return {
                title: "條款與條件",
                lastUpdated: "2024年11月15日",
                sections: [
                    {
                        heading: "1. 簡介",
                        content: [
                            "社區合作計劃（「本計劃」）是由 Lookcard Limited（「本公司」）發起的一項倡議，旨在與符合條件的參與者（「參與者」）建立合作關係，以共同實現社區發展的目標。本條款與細則規範了參與本計劃的條件，並明確雙方的角色、義務及責任。參與者一旦註冊或參與本計劃，即表示同意遵守本條款與細則。"
                        ]
                    },
                    {
                        heading: "2. 資格標準",
                        content: [
                            "申請參與本計劃者須符合以下條件：",
                            "• 為 Lookcard.io 平台的註冊用戶",
                            "• 符合本計劃的目標",
                            "• 遵守當地法律與法規",
                            "• 不得涉及與公共利益、道德標準或本公司價值觀相衝突的活動或計劃",
                            "本公司保留審核參與資格的權利，並可自行決定取消任何參與者的資格。"
                        ]
                    },
                    {
                        heading: "3. 申請流程",
                        content: [
                            "• 申請人須透過官方網站指定的申請表填寫並提交申請。",
                            "• 申請將根據以下標準進行審核：",
                            "   - 是否符合本計劃目標。",
                            "   - 目標市場的可行性與可持續性。",
                            "本公司保留批准或拒絕申請的最終決定權，且無需提供理由。"
                        ]
                    },
                    {
                        heading: "4. 合作夥伴協議",
                        content: [
                            "4.1. 參與者責任",
                            "參與者須履行以下義務：",
                            "• 成功完成本公司指定的培訓課程，以全面了解產品、項目目標及運營指導方針。",
                            "• 嚴格遵守經批准的計劃、時間表及本公司提供的關鍵績效指標（KPI）。達成KPI是獲得獎勵或額外福利的必要條件。",
                            "• 全力投入合作計劃，按時完成所有約定事項，保持專業標準，並確保最高程度的責任感。",
                            "• 公司提供的所有資源僅限於協議內規定的用途，不得擅自亂用。",
                            "• 詳細記錄所有活動及項目里程碑，並確保這些記錄可隨時接受審查。",
                            "• 定期提交進度更新、影響評估及詳細財務報告，內容須清晰準確，並於規定期限內提交。",
                            "• 嚴格遵守所有適用的地方法律、國家法規及國際法，包括但不限於安全規範、反貪腐準則及道德規範。如有違規行為，將被立即取消合作資格。",
                            "• 參與公司定期評估，以檢討項目表現、解決挑戰並優化執行方案。",

                            "4.2. 公司責任",
                            "公司承諾履行以下責任：",
                            "• 提供全面的諮詢與技術支持，確保參與者獲得必要的指導，以有效執行其職責。",
                            "• 持續監督項目進展，確保與商定的交付成果、時間表及KPI保持一致。",
                            "• 提供建設性反饋與建議，協助參與者應對挑戰並優化項目成果。",
                            "• 積極促進交流合作，幫助參與者與關鍵利益相關者建立聯繫，並提供資源，如培訓、工作坊及導師計劃，以提升項目執行力。",
                            "• 尊重參與者的自主權，允許其自行管理與實施目標，同時保持順暢的溝通管道，以便在需要時提供支持。"
                        ]
                    },
                    {
                        heading: "5. 知識產權（IP）",
                        content: [
                            "任何於合作期間創建的知識產權將按照以下方式管理：",
                            "• 參與者將擁有該知識產權的完整所有權。",
                            "• 公司保留非獨家、免版稅的使用許可權，可用於推廣、教育或報告用途，並確保適當地標註參與者的貢獻。"
                        ]
                    },
                    {
                        heading: "6. 保密條款",
                        content: [
                            "• 雙方同意對於在計畫期間披露的專有或敏感資訊予以保密。",
                            "• 除非法律要求或雙方書面同意，否則不得披露此類資訊。"
                        ]
                    },
                    {
                        heading: "7. 報告與責任",
                        content: [
                            "參與者須遵守以下規定：",
                            "• 定期提交進度報告，詳列關鍵績效指標（KPIs）、專案里程碑及面臨的挑戰，以確保計畫透明度與可追蹤性。",
                            "• 積極參與公司組織的計畫評估與審查，確保合作成果符合預期標準並持續優化執行策略。",
                            "未能履行報告義務可能導致計畫暫停或終止。"
                        ]
                    },
                    {
                        heading: "8. 合作終止",
                        content: [
                            "本合作關係可在以下情況下終止：",
                            "a) 任何一方終止",
                            "任何一方可提前至少30天以書面通知另一方，單方面終止合作關係。",

                            "b) 公司單方面終止",
                            "公司保留立即終止合作的權利，條件如下：",
                            "• 違反條款：參與者違反本條款與條件，或未遵守合作協議中的具體規定。",
                            "• 資源濫用：對本合作提供的資金、物資或其他資源進行管理不善、濫用或未經授權使用。",
                            "• 聲譽風險：參與者的行為或活動可能損害主辦方的聲譽、誠信或營運利益。",
                            "合作終止後，所有提供的資源須歸還，並提交最終報告，詳述已完成的活動內容。"
                        ]
                    },
                    {
                        heading: "9. 責任限制",
                        content: [
                            "• 公司概不負責參與者在專案執行期間遭受的任何損失、損害或法律責任。",
                            "• 參與者同意賠償並保護公司，使其免受因參與本專案而產生的任何索賠、訴訟或損害。"
                        ]
                    },
                    {
                        heading: "10. 爭議解決",
                        content: [
                            "• 任何因本條款與細則（T&Cs）產生的爭議，應優先透過誠信協商解決。",
                            "• 如協商未能達成共識，爭議應提交香港調解中心進行調解。",
                            "• 調解員或仲裁員的決定將為最終裁決，並對雙方具有約束力。"
                        ]
                    },
                    {
                        heading: "11. 修訂",
                        content: [
                            "本公司保留隨時修訂本條款與細則（T&Cs）的權利。修訂內容將以書面形式通知參與者，參與者若持續參與本計劃，則視為同意並接受修訂後的條款與細則。"
                        ]
                    },
                    {
                        heading: "12. 準據法",
                        content: [
                            "本條款與細則（T&Cs）應依據香港特別行政區（HKSAR）法律解釋並受其管轄。"
                        ]
                    },
                    {
                        heading: "13. 條款接受",
                        content: [
                            "參與本計劃即表示參與者已閱讀、理解並同意遵守本條款與細則。"
                        ]
                    }
                ]
            };
        } else {
            // Default English content
            return {
                title: "Terms and Conditions",
                lastUpdated: "15 Nov, 2024",
                sections: [
                    {
                        heading: "1. Introduction",
                        content: [
                            "The Community Partnership Program (the \"Program\") is an initiative by Lookcard Limited (the \"Company\") designed to promote collaboration with eligible participants (the \"Participants\") to achieve mutual goals for community enrichment. These Terms and Conditions govern participation in the Program and outline the roles, obligations, and responsibilities of both parties. By enrolling in or participating in the Program, Participants agree to abide by these terms and conditions."
                        ]
                    },
                    {
                        heading: "2. Eligibility Criteria",
                        content: [
                            "To participate in the Program, applicants must meet the following criteria:",
                            "• A registered user of lookcard.io platform",
                            "• Align with the Program's objectives",
                            "• Demonstrate compliance with local laws and regulations",
                            "• Exclude activities or initiatives that may conflict with public interest, ethical standards, or the Company's values.",
                            "The Company reserves the right to verify eligibility and disqualify any Participant at its sole discretion."
                        ]
                    },
                    {
                        heading: "3. Application Process",
                        content: [
                            "• Applicants are required to complete and submit their applications exclusively through the designated application form available on the official website.",
                            "• Applications will be reviewed based on:",
                            "   - Alignment with Program objectives.",
                            "   - Feasibility and sustainability of the proposed target market.",
                            "The Company reserves the right to approve or reject applications at its discretion without providing a reason."
                        ]
                    },
                    {
                        heading: "4. Partnership Obligations",
                        content: [
                            "4.1. Participant Responsibilities",
                            "Participants are required to:",
                            "• Participants must successfully complete the Company's designated training program to gain a comprehensive understanding of the product, project objectives, and operational guidelines.",
                            "• All tasks must be executed in strict adherence to the approved proposal, timeline, and the Key Performance Indicators (KPIs) provided by the Company. Adherence to these KPIs is mandatory to qualify for incentives or additional benefits.",
                            "• Participants are expected to demonstrate full commitment to the partnership program by meeting all agreed deadlines, maintaining professional standards, and ensuring the highest level of accountability.",
                            "• All resources provided by the Company must be used exclusively for the purposes outlined in the agreement.",
                            "• Detailed and accurate records of all activities and project milestones must be maintained. These records should be readily available for review upon request.",
                            "• Participants must provide regular progress update, impact evaluations, and detailed financial statements as specified by the Company. Reports should be clear, accurate, and submitted within the required deadline.",
                            "• Participants must comply with all applicable local, national and international laws, including but not limited to safely regulations, anti-corruption standards, and ethical practices. Non-compliance will result in termination of the partnership.",
                            "• Periodic assessments and evaluations conducted by the Company must be attended to review project performance, address challenges, and implement improvements.",

                            "4.2. Company Responsibilities",
                            "The Company commits to:",
                            "• Offer comprehensive advisory and technical support as outlined in the agreement ensuring that Participants have necessary guidance to execute their task effectively.",
                            "• Continuously monitor the progress against agreed deliverables, timelines, and KPIs.",
                            "• Provide constructive feedback and recommendations to address challenges and optimize project outcomes.",
                            "• Actively facilitate networking opportunities, connecting Participants with key stakeholders, and offering access to capacity-building resources such as training, workshops or mentorship programs to enhance project implementation.",
                            "• Recognize and respect the autonomy of Participants in managing and delivering their goals, while maintaining open lines of communication to provide support as needed."
                        ]
                    },
                    {
                        heading: "5. Intellectual Property (IP)",
                        content: [
                            "Any intellectual property created during the partnership shall be managed as follows:",
                            "• The IP created as a result of the partnership will remain the sole property of the Participant.",
                            "• However, the Company retains a non-exclusive, royalty free license to use the IP for promotional, educational, or reporting purposes, ensuring a proper credit is given to the Participants."
                        ]
                    },
                    {
                        heading: "6. Confidentiality",
                        content: [
                            "• Both parties agree to maintain the confidentiality of proprietary or sensitive information disclosed during the Program.",
                            "• Disclosure of such information is prohibited unless required by law or mutually agreed in writing."
                        ]
                    },
                    {
                        heading: "7. Reporting and Accountability",
                        content: [
                            "Participants are required to:",
                            "• Submit periodic progress reports, including key performance indicators (KPIs), project milestones, and challenges encountered.",
                            "• Participate in Program evaluations and audits conducted by the Company.",
                            "Failure to comply with reporting requirements may result in suspension or termination."
                        ]
                    },
                    {
                        heading: "8. Termination of Partnership",
                        content: [
                            "This partnership may be terminated under the following conditions:",
                            "a) Termination by Either Party:",
                            "Either party may terminate the partnership by providing at least 30 days' written notice to the other party.",

                            "b) Termination by the Company:",
                            "The Company reserves the right to terminate the partnership immediately under the following circumstances:",
                            "• Breach of Terms: Any breach of these Terms and Conditions or the specific provisions outlined in the partnership agreement.",
                            "• Misuse of Resources: Mismanagement, misuse, or unauthorized use of funds, materials, or other resources provided under this partnership.",
                            "• Reputation Risk: Any actions or activities undertaken by the Participant that could potentially harm the reputation, integrity, or operational interests of the Organizer.",
                            "Upon termination, all resources must be returned, and a final report detailing completed activities must be submitted."
                        ]
                    },
                    {
                        heading: "9. Limitation of Liability",
                        content: [
                            "• The Company is not liable for any losses, damages, or liabilities incurred by Participants during project implementation.",
                            "• Participants agree to indemnify and hold the Company harmless from any claims, actions, or damages arising from their participation."
                        ]
                    },
                    {
                        heading: "10. Dispute Resolution",
                        content: [
                            "• Any disputes arising under these T&Cs shall first be resolved through good-faith negotiations.",
                            "• If unresolved, disputes shall be submitted to the Hong Kong Mediation Centre.",
                            "• The decision of the mediator/arbitrator will be final and binding."
                        ]
                    },
                    {
                        heading: "11. Amendments",
                        content: [
                            "The Company reserves the right to amend these T&Cs at any time. Participants will be notified of changes in writing, and continued participation in the Program constitutes acceptance of the revised T&Cs."
                        ]
                    },
                    {
                        heading: "12. Governing Law",
                        content: [
                            "These T&Cs shall be governed by the laws of Hong Kong Special Administrative Region (HKSAR)."
                        ]
                    },
                    {
                        heading: "13. Acceptance of Terms",
                        content: [
                            "By participating in the Program, Participants confirm that they have read, understood, and agreed to these Terms and Conditions."
                        ]
                    }
                ]
            };
        }
    };

    // Listen for language changes
    useEffect(() => {
        const handleLanguageChange = () => {
            const newLang = storage.getLanguagePreference();
            if (newLang !== language) {
                setLanguage(newLang);
                setTermsContent(getTermsContentByLanguage(newLang));
            }
        };

        // Check for language changes every 2 seconds
        const intervalId = setInterval(handleLanguageChange, 2000);

        return () => clearInterval(intervalId);
    }, [language]);

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.legalAndComplianceBreadcrumb")} />

            <ContentSection
                title={termsContent.title}
                lastUpdated={termsContent.lastUpdated}
                sections={termsContent.sections}
            />
        </DefaultLayout>
    );
};

export default TermsAndConditionsPage;