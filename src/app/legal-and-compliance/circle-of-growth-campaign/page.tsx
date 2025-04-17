"use client";

import { useEffect, useState, useCallback } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContentSection from "@/components/Sections/ContentSection";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/storage";
import { CircleOfGrowthSkeleton } from '@/components/common/Skeletons';

const CircleOfGrowthPage = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState('en');
    const [loading, setLoading] = useState(true);

    interface Section {
        heading: string;
        content: string[];
    }

    interface CampaignContent {
        title: string;
        lastUpdated: string;
        sections: Section[];
    }

    const [campaignContent, setCampaignContent] = useState<CampaignContent>({
        title: "",
        lastUpdated: "14 Feb, 2025",
        sections: []
    });

    // Using useCallback to memoize the function so it can be safely included in dependency arrays
    const getCampaignContentByLanguage = useCallback((lang: string): CampaignContent => {
        switch (lang) {
            case 'zh':
                return {
                    title: "LookCard 共赢圈活动计划 条款与条件",
                    lastUpdated: "2025年2月14日",
                    sections: [
                        {
                            heading: "活动期限",
                            content: [
                                "2025年2月14日 20:00 (GMT+8) 至 2025年5月14日 23:59 (GMT+8)（含起止日期）"
                            ]
                        },
                        {
                            heading: "1. 条款",
                            content: [
                                "LookCard 共赢圈活动计划（下称\"本活动\"）是 Lookcard Limited（下称\"本公司\"）社区合作计划的一部分，仅向一级代理开放。参与本活动即表示参与者同意遵守本条款与条件以及本公司的一般政策与规定。"
                            ]
                        },
                        {
                            heading: "2. 资格与注册",
                            content: [
                                "2.1 本活动仅限活动期间注册为社区合作计划一级代理的新用户参与。",
                                "2.2 参与者必须完成 lookcard.io 平台账户注册，并提供真实、准确且可验证的信息。",
                                "2.3 注册需经本公司审核批准，本公司保留拒绝任何申请的最终决定权。"
                            ]
                        },
                        {
                            heading: "3. 活动权益",
                            content: [
                                "3.1 免除最低存款要求及激活费",
                                "参与者可豁免账户激活所需的初始存款及标准激活费，此权益旨在提升金融服务的普惠性。",
                                "",
                                "3.2 信用额度解锁",
                                "成功注册后，参与者将获得 5 美元初始信用额度：",
                                "• 该额度可用于平台服务及交易功能体验",
                                "• 可根据需求申请提高信用额度",
                                "• 不可转让或兑换现金"
                            ]
                        },
                        {
                            heading: "4. 推荐要求与保留政策",
                            content: [
                                "4.1 权益保留要求",
                                "参与者需在注册后 6 个月内达成以下目标：",
                                "• 成功推荐至少 60 名新用户完成注册及信用卡申请",
                                "• 被推荐用户需完成完整入职流程（含身份验证）并激活账户",
                                "每成功推荐一名用户将计入绩效目标，并可能获得额外奖励。",
                                "",
                                "4.2 未达标后果",
                                "若未能在规定期限内达成目标：",
                                "• 已获 5 美元信用额度将被收回",
                                "• 需补缴豁免的激活费用",
                                "• 取消特殊激励计划参与资格"
                            ]
                        },
                        {
                            heading: "5. 奖励机制",
                            content: [
                                "5.1 一级代理招募",
                                "通过本活动招募一级代理的现有合作伙伴：",
                                "• 不享受该层级的推荐奖励或存款回扣",
                                "• 此限制仅适用于社区合作计划的直接招募",
                                "",
                                "5.2 覆盖佣金",
                                "招募人可享受以下权益：",
                                "• 获得所荐代理未来推荐的覆盖激励",
                                "• 佣金比例按现行合作伙伴奖励政策执行",
                                "• 激励方案与计划战略增长目标保持一致"
                            ]
                        },
                        {
                            heading: "6. 通用条款",
                            content: [
                                "6.1 公平使用政策",
                                "本公司保留审核所有推荐活动的权利，以下行为将导致立即取消资格：",
                                "• 使用虚假账户或重复自我推荐",
                                "• 任何形式的欺骗性操作",
                                "",
                                "6.2 修改与终止",
                                "本公司保留以下权利：",
                                "• 随时修改、暂停或终止本活动",
                                "• 通过官方渠道发布变更通知",
                                "",
                                "6.3 责任限制",
                                "本公司不对以下情况承担责任：",
                                "• 参与活动导致的财务损失或损害",
                                "• 因参与活动产生的第三方索赔",
                                "",
                                "6.4 争议解决",
                                "争议处理流程：",
                                "• 优先通过友好协商解决",
                                "• 协商未果提交香港调解中心处理",
                                "• 本公司保留最终决定权"
                            ]
                        },
                        {
                            heading: "7. 适用法律",
                            content: [
                                "本条款受香港特别行政区法律管辖，中英文版本冲突时以英文版为准。"
                            ]
                        },
                        {
                            heading: "8. 联系支持",
                            content: [
                                "如需协助，请联系计划支持团队：",
                                "电邮: cpprogram@lookcard.io",
                                "",
                                "注册即表示您已阅读、理解并同意本条款与条件。"
                            ]
                        }
                    ]
                };

            case 'zh-hk':
                return {
                    title: "LookCard 共赢圈活动计划 条款与条件",
                    lastUpdated: "2025年2月14日",
                    sections: [
                        {
                            heading: "活动期限",
                            content: [
                                "2025年2月14日 20:00 (GMT+8) 至 2025年5月14日 23:59 (GMT+8)（含起止日期）"
                            ]
                        },
                        {
                            heading: "1. 条款",
                            content: [
                                `LookCard 共赢圈活动计划（简称 "活动"）是 LookCard 社区合作伙伴计划的一部分，仅向初级经销商代理的新用户开放。参与本活动即表示用户同意遵守本条款与条件，以及 LookCard 的一般政策与规定。`
                            ]
                        },
                        {
                            heading: "2. 参与资格与注册",
                            content: [
                                "2.1 本计划仅向活动期间注册为 LookCard 社区合作伙伴计划初级经销商代理的新用户开放。",
                                "2.2 参与者须注册 lookcard.io 平台账户，并在注册时提供真实、准确且可核实的信息。",
                                "2.3 注册需经 LookCard Limited 审核批准，并保留审核并决定接受或拒绝任何申请的最终权利。"
                            ]
                        },
                        {
                            heading: "3. 活动权益",
                            content: [
                                "3.1 无需最低充值与激活费",
                                "在活动期间注册的初级经销商代理无需支付任何初始充值或激活费用，让用户能够零成本加入该计划，促进金融普惠性。",
                                "",
                                "3.2 解锁 5美元 试用信用额度",
                                "成功注册的初级经销商代理将获得 5 美元的试用信用额度。该额度能让用户使用 lookcard.io 平台的服务并体验交易功能，无需任何初始资金投入。",
                                "用户可根据自身需求申请提高信用额度。该额度仅限用于平台交易，不可转让或兑换现金。"
                            ]
                        },
                        {
                            heading: "4. 推荐要求与保留政策",
                            content: [
                                "4.1 维持活动利益的要求",
                                "参与者需在注册后 6 个月内，成功推荐至少 60 名新用户注册 lookcard.io 平台账户，并成功申请信用卡。六 (6) 个月从入学日期起。",
                                "推荐成功的定义：被推荐人完成注册流程，包括 KYC 验证，并成功激活 lookcard.io 账户以解锁信用卡。每一名成功推荐的用户均计入代理的业绩目标，可获得额外的绩效奖励。",
                                "",
                                "4.2 未达到推荐目标的后果",
                                "若代理商在六 (6) 个月内未能达到激活 60 张卡的目标，其活动权益将被取消。这包括收回 5 美元的信用额度、恢复并收取已豁免的激活费，以及取消其参与特殊激励计划的资格。"
                            ]
                        },
                        {
                            heading: "5. 推荐奖励与佣金结构",
                            content: [
                                "5.1 通过本次活动招募的初级销商代理",
                                "通过本活动招募初级代理的现有代理或合作伙伴，不享有推荐奖励或充值返还。此限制仅适用于针对初级经销商代理的首次招募。此规则是激活费用结构的一部分，旨在确保活动的公平性和可持续性。",
                                "",
                                "5.2 上层覆盖奖励",
                                "招募人可获得其所招募初级经销商代理在未来推荐活动中产生的上层覆盖奖励。佣金比例将按照LookCard 现行的合作伙伴奖励政策执行，以确保推荐人的长期收益，并与该计划的战略增长目标保持一致。"
                            ]
                        },
                        {
                            heading: "6. 一般条款与合规要求",
                            content: [
                                "6.1 公平使用与反欺诈政策",
                                "LookCard Limited 保留审核所有推荐活动的权利，以防止欺诈或不道德行为。任何试图通过虚假账户、多重自我推荐或其他欺骗手段操控推荐活动的行为，将导致用户被立即取消资格，并丧失所有已获得的权益。",
                                "",
                                "6.2 条款修改与活动终止",
                                "LookCard Limited 保留随时修改、暂停或终止该活动的权利，且无需事先通知。任何变更将通过官方渠道发布。",
                                "",
                                "6.3 责任限制",
                                "LookCard Limited 对于因参与本活动而引发的任何财务损失、损害或索赔，不承担任何责任。",
                                "",
                                "6.4 法律适用与争议解决",
                                "如有争议，LookCard Limited 拥有最终决定权，且其决定具有法律约束力。本活动条款适用 LookCard Limited 所在司法管辖区的相关法律。如本条款与条件的英文与中文版本存在任何不一致或歧义，以英文版本为准。"
                            ]
                        },
                        {
                            heading: "7. 联系和支持",
                            content: [
                                "对于与本次活动相关的疑问，参与者可以通过电子邮件 cpprogram@lookcard.io 联系计划支持团队。",
                                "",
                                "注册成为本计划下的初级经销商代理，即表示您已阅读、理解并同意这些条款和条件。"
                            ]
                        }
                    ]
                };
            default:
                // Default English content
                return {
                    title: "LOOKCARD CIRCLE OF GROWTH CAMPAIGN TERMS AND CONDITIONS",
                    lastUpdated: "14 Feb, 2025",
                    sections: [
                        {
                            heading: "Campaign Period",
                            content: [
                                "February 14, 2025 @ 20:00 GMT+8 -- May 14, 2025 @ 23:59 GMT+8 (both dates inclusive)."
                            ]
                        },
                        {
                            heading: "1. TERMS",
                            content: [
                                "The LookCard Circle of Growth Campaign (\"Campaign\") is part of the LookCard Community Partnership Program and is exclusively available to Level 1 Agents. By participating in this Campaign, users agree to abide by these Terms and Conditions, along with LookCard's general policies and regulations."
                            ]
                        },
                        {
                            heading: "2. ELIGIBILITY & ENROLLMENT",
                            content: [
                                "2.1 This Campaign is open to new users who register as Level 1 Agent under the Community Partnership Program during the campaign period.",
                                "",
                                "2.2 Participants must registered for a lookcard.io platform account and to provide accurate and verifiable information during registration.",
                                "",
                                "2.3 Enrollment is subject to approval by LookCard, which reserves the right to reject any application at its sole discretion."
                            ]
                        },
                        {
                            heading: "3. CAMPAIGN BENEFITS",
                            content: [
                                "3.1 Exemption from Minimum Deposit Requirement and Activation Fee",
                                "",
                                "Participants in this Campaign are exempted from initial deposit for account activation. Additionally, the standard activation fee is waived, allowing users to join without incurring upfront costs. This benefit is designed to make financial access more inclusive and accessible.",
                                "",
                                "3.2 Unlock LookCard+ Credit Limit with $5 Credit Limit",
                                "",
                                "Upon successful enrollment, participants will unlocked their credit card with a credit limit of USD5. This credit limit allows users to engage with lookcard.io platform services and explore transaction features without any initial financial commitment.",
                                "",
                                "Participants have the option to increase their credit limit based on their desired amount. The USD5 credit limit is non-transferable. It is strictly for transactional use and cannot be withdrawn or converted to cash."
                            ]
                        },
                        {
                            heading: "4. REFERRAL REQUIREMENT & RETENTION",
                            content: [
                                "4.1 Requirement to Maintain Campaign Benefits",
                                "",
                                "Participating agents must successfully referred a minimum of sixty (60) lookcard.io platform account and card application within six (6) months from their enrollment date.",
                                "",
                                "A referral is considered successful when the referred user complete the full onboarding process, including identity verification, and activate their lookcard.io platform account and unlock credit card. Each successful referral contributes toward the Agent's activation target and may qualify for additional performance-based rewards.",
                                "",
                                "4.2 Failure to Meet Referral Target",
                                "",
                                "Agents who fail to meet the required 60-cards activation target within six (6) months will have their campaign benefits revoked. This includes the forfeiture of the USD5 credit limit, the reinstatement of any previously exempted activation fee, and removal from special incentive programs"
                            ]
                        },
                        {
                            heading: "5. REFERRAL INCENTIVE & OVERRIDING COMMISSION STRUCTURE",
                            content: [
                                "5.1 Recruitment of Level 1 Agents via this Campaign",
                                "",
                                "Existing agents/partners who recruit new Level 1 Agent under this campaign will not be eligible to receive a referral fee or deposit rebate for that recruitment. This restriction applies exclusively to the direct recruitment of Level 1 Agents under the Community Partnership Program. The exemption is part of the activation fee structure and is designed to maintain the integrity and sustainability of the campaign.",
                                "",
                                "5.2 Overriding Commission",
                                "",
                                "Recruiters will be entitled to overriding incentives on all future referrals made by the recruited Level 1 Agents. Overriding incentives rates will be in accordance with the exiting program structure. these incentives ensure long-term value for recruiters and align with the strategic growth of the program."
                            ]
                        },
                        {
                            heading: "6. GENERAL TERMS AND COMPLIANCE",
                            content: [
                                "6.1 Fair Use and Anti-Fraud Policy",
                                "",
                                "Lookcard Limited reserves the right to review all referral activities to prevent fraudulent or unethical behavior. Any attempt to manipulate referrals through fake accounts, multiple self-referrals or other deceptive means will result in immediate disqualification form the program and forfeiture of all benefits.",
                                "",
                                "6.2 Modification and Termination",
                                "",
                                "Lookcard Limited reserves the right to modify, suspend, or terminate the Community Partnership Program Campaign at any time without prior notice. Any changes will be communicated via official channels.",
                                "",
                                "6.3 Limitation of Liability",
                                "",
                                "Lookcard Limited shall not be held liable for any financial losses, damages or claims arising from participation in the Campaign.",
                                "",
                                "6.4 Legal and Dispute Resolution",
                                "",
                                "In the event of a dispute, Lookcard Limited decision shall be final and binding. The terms of this campaign shall be governed by the applicable laws in LookCard's jurisdiction. In the event of any discrepancy or inconsistency between the English and Mandarin versions of these terms and conditions, the English version shall prevail."
                            ]
                        },
                        {
                            heading: "7. CONTACT AND SUPPORT",
                            content: [
                                "For inquiries related to this Campaign, participants may contact the Program support team via email at cpprogram@lookcard.io.",
                                "",
                                "By registering as a Level 1 Agent under this program, you confirm that you have read, understood, and agreed to these Terms & Conditions."
                            ]
                        }
                    ]
                };
        }
    }, []);

    // Initialize content based on user's language preference
    useEffect(() => {
        // Get language preference from storage
        const userLang = storage.getLanguagePreference();
        setLanguage(userLang);

        // Set the content based on language
        setCampaignContent(getCampaignContentByLanguage(userLang));
        setLoading(false);
    }, [getCampaignContentByLanguage]);

    // Listen for language changes
    useEffect(() => {
        const handleLanguageChange = () => {
            const newLang = storage.getLanguagePreference();
            if (newLang !== language) {
                setLanguage(newLang);
                setCampaignContent(getCampaignContentByLanguage(newLang));
                setLoading(true);
            }
        };

        // Check for language changes every 2 seconds
        const intervalId = setInterval(handleLanguageChange, 2000);

        return () => clearInterval(intervalId);
    }, [language, getCampaignContentByLanguage]);

    if (loading) {
        return (
            <DefaultLayout>
                <CircleOfGrowthSkeleton />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("legal.circleOfGrowthBreadcrumb")} />

            <ContentSection
                title={campaignContent.title}
                lastUpdated={campaignContent.lastUpdated}
                sections={campaignContent.sections}
            />
        </DefaultLayout>
    );
};

export default CircleOfGrowthPage;