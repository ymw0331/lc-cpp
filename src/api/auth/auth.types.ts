export interface LoginRequest {
    email: string;
    password: string;
    fcmId: string;
}

export interface AuthUserData {
    userId: number;
    uid: string;
    phoneNumber: string | null;
    country_code: string | null;
    firstLogin: boolean;
    username: string;
    email: string;
    fullName: string;
    registered: boolean;
    kind: string;
    localId: string;
    token: string;
    refreshToken: string;
    walletCreationStatus: boolean;
    fcmId: string | null;
    cardId: number;
    cards: number[];
    ekycStatus: 'completed' | 'pending' | 'failed';
    ekycReviewStatus: 'verified' | 'unverified' | 'rejected';
    remarks: string;
    cardStatus: 'active' | 'inactive' | 'pending';
}

export interface AuthResponse {
    status: boolean;
    message: string;
    data: AuthUserData;
}

// This is what we'll store in context/localStorage
export interface AuthUser {
    userId: number;
    uid: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    country_code: string | null;
    fullName: string;
    token: string;
    refreshToken: string;
    cardId: number;
    cards: number[];
    ekycStatus: string;
    ekycReviewStatus: string;
    cardStatus: string;
    firstLogin: boolean;
}