// File: src/api/reseller/reseller.types.ts

// Core types that represent the main data structures
export interface Tier {
    id: string;
    priority: number;
    name: string;
    status: string;
    incentive?: {
        id: number;
        directReferralFee: string;
        directTopupRebatePercentage: string;
        downstreamReferralFee: string;
        downstreamTopupRebatePercentage: string;
        upgradeBonus: string;
        performanceBonus: string;
    };
    downstreamLimit: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    profileId: string;
    email: string;
    username: string;
    credit_limit: string;
    additional_credit_limit: string;
    available_balance: string;
    tier: string;
    sso_provider: string;
    sso_id: string;
    email_notifications: boolean;
    activity_log: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    status: string;
    verified_at: string;
    created_at: string;
    deleted_at: string;
    deleted_by: string;
    updated_at: string;
    twofa_complete: boolean;
    otp: string | null;
    phone_no: string | null;
    is_admin: boolean;
    first_login: boolean;
    mobile_2fa: boolean;
    email_2fa: boolean;
    wallet_creation: boolean;
    mob_otp: string;
    firebase_id: string | null;
    last_2fa_used: string | null;
    country_code: number | null;
    fcm_id: string | null;
    cardId: number | null;
    ekycStatus: string | null;
    cardStatus: string | null;
    firstDeposit: boolean | null;
}

export interface Downstream {
    id: string;
    ownerProfileId: string;
    tierId: string;
    tier?: Tier;
    verificationId: string | null;
    fromEvent: string | null;
    createdAt: string;
    updatedAt: string;
    user?: User;
    totalDeposit?: number;
    physicalCard?: boolean;
    ekycStatus?: string;
    cardStatus?: string;
    firstDeposit?: boolean;
    accountActivation?: string | null;
}

export interface DirectReferral {
    id?: number;
    code?: {
        code: string;
        ownerProfileId: string;
        createdAt: string;
    };
    consumerProfileId?: string;
    ref?: string | null;
    metadata?: any | null;
    createdAt?: string;
    user: {
        id: number;
        uuid: string;
        first_name: string;
        last_name: string;
        profileId: string;
        email: string;
        username: string;
        credit_limit?: string;
        additional_credit_limit?: string;
        available_balance?: string;
        tier: string;
        status: string;
        verified_at: string;
        created_at: string;
        updated_at: string;
        deleted_at?: string;
        phone_no: string | null;
        country_code: number | null;
        cardId: number | null;
        ekycStatus: string | null;
        cardStatus: string | null;
        firstDeposit: boolean | null;
        [key: string]: any;
    };
    totalDeposit?: number;
    physicalCard?: boolean;
    ekycStatus?: string;
    cardStatus?: string;
    firstDeposit?: boolean;
    accountActivation?: string | null;
}

export interface PerformanceData {
    cardActivationVolume: {
        currentValue: number;
        targetValue: number;
    };
    totalAgentRecruitment: {
        currentValue: number;
        targetValue: number;
    };
    userLevel: {
        currentLevel: string;
        progress: number;
        isMaxLevel: boolean;
    };
    salesSummary: {
        groupSales: number;
        personalSales: number;
    };
    demographicData: Record<string, any>;
    salesVolumeData: {
        monthlyData2024: any[];
        monthlyData2023: any[];
        weeklyData: any[];
    };
}

// Response types
export interface UserOrResellerProfileResponse {
    id: string;
    fullName: string;
    userId: string;
    resellerId: string;
    ranking: string;
    contactNo: string;
    emailAddress: string;
    digitalId: string;
    country: string;
    accountActivation: string | null;
    totalDeposit: number;
    physicalCard: boolean;
    ekycStatus: string;
    cardStatus: string;
    firstDeposit: boolean;
    performance: PerformanceData;
    fromEvent: string | null;
    keyMarket: string;
}

export interface ResellerResponse {
    id: string;
    ownerProfileId: string;
    tierId: string;
    tier: Tier;
    verificationId: string | null;
    upstream: Downstream | null;
    fromEvent: string | null;
    downstreams: Downstream[];
    createdAt: string;
    updatedAt: string;
    code: string;
    directReferral: DirectReferral[];
}

export interface ResellerByIdResponse {
    id: string;
    ownerProfileId: string;
    tierId: string;
    tier: Tier;
    verificationId: string | null;
    upstream: Downstream | null;
    fromEvent: string | null;
    downstreams: Downstream[];
    createdAt: string;
    updatedAt: string;
    code: string;
    directReferral: DirectReferral[];
}

// Request types
export interface BatchProfileRequest {
    profileIds: string[];
}

export interface RegisterResellerRequest {
    upstreamId: string;
    keyMarket: string;
}

export interface UserVerificationRequest {
    email: string;
}

export interface UserVerificationResponse {
    status: boolean;
    data: {
        emailVerified: boolean;
        fullname: string;
        phoneNo: string;
        cardActive: boolean;
    };
}

export interface RegisterResellerResponse {
    status: boolean;
    data: ResellerResponse;
}

export interface TierCounts {
    'tier 0': number;
    'tier 1': number;
    'tier 2': number;
    'tier 3': number;
    'tier 4': number;
    'tier 5': number;
}

export type TierLevel = 'tier 0' | 'tier 1' | 'tier 2' | 'tier 3' | 'tier 4' | 'tier 5';