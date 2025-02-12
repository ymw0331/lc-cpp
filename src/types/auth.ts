export interface LoginRequest {
    email: string;
    password: string;
    fcmId?: string;
}

export interface AuthResponse {
    status: boolean;
    message: string;
    data: AuthUserData;
}

// This represents the exact response from backend
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
    cardId: string;
    cards: any[]; // TODO: Define card type when available
    ekycStatus: string;
    ekycReviewStatus: string;
    remarks: string;
    cardStatus: string;
}
