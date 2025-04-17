import { formatDateTimeWithHK } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { REWARD_TYPE } from "../Tables/IncentivePayoutTable";


interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        type: string;
        amount: number;
        datetime: string;
        from: {
            name: string;
            email: string;
        };
    } | null;
}

const RewardDetailDialog = ({ isOpen, onClose, data }: DetailModalProps) => {
    const { t } = useTranslation();

    // Translate reward types to user-friendly labels
    const getRewardTypeLabel = (type: string): string => {
        switch (type) {
            case REWARD_TYPE.REFERRAL:
                return t('incentiveManagementPage.referralFeeBonus');
            case REWARD_TYPE.TOPUP_REBATE:
                return t('incentiveManagementPage.depositAdminChargeRebate');
        case REWARD_TYPE.DOWNSTREAM_REFERRAL:
                return t('incentiveManagementPage.directRecruitReferralFeeOverrideBonus');
            case REWARD_TYPE.DOWNSTREAM_TOPUP_REBATE:
                return t('incentiveManagementPage.directRecruitDepositAdminChargeOverridingRebate');
            case REWARD_TYPE.PERFORMANCE_BONUS:
                return t('incentiveManagementPage.performanceBonus');
            case REWARD_TYPE.DIRECT_RECRUIT_LEVEL_ADVANCEMENT_BONUS:
                return t('incentiveManagementPage.directRecruitLevelAdvancementBonus');
            case REWARD_TYPE.MILESTONE_BONUS:
                return t('incentiveManagementPage.milestoneAchievementBonus');
            default:
                return type;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {t("incentivePayoutTable.incentiveDetails")}
                    </DialogTitle>
                </DialogHeader>
                {data && (
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("incentivePayoutTable.incentiveRecords")}
                                </p>
                                <p className="text-base font-medium">
                                    {getRewardTypeLabel(data.type)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("incentivePayoutTable.fromName")}
                                </p>
                                <p className="text-base font-medium">
                                    {data.from.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("incentivePayoutTable.fromEmail")}
                                </p>
                                <p className="text-base font-medium">
                                    {data.from.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("incentivePayoutTable.amount")}
                                </p>
                                <p className="text-base font-medium">
                                    ${data.amount.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {t("incentivePayoutTable.dateTime")}
                                </p>
                                <p className="text-base font-medium">
                                    {formatDateTimeWithHK(data.datetime)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RewardDetailDialog;