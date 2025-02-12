import { AgentLevel, KeyMarket, Role } from '@/lib/constants/enums';

export interface ISocialMedia {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

// Frontend user model
export interface IUser {
    id: string;            // Mapped from userId
    name: string;          // Mapped from fullName or username
    email: string;
    contactNumber: string; // Mapped from phoneNumber
    keyMarket: KeyMarket; // Not in API response - needs to be fetched/set separately
    role: Role;           // Not in API response - needs to be fetched/set separately
    avatarUrl?: string;   // Not in API response - needs to be fetched/set separately
    level?: AgentLevel;   // Not in API response - needs to be fetched/set separately
    referralCode: string; // Not in API response - needs to be fetched/set separately
    socialMedia?: ISocialMedia; // Not in API response - needs to be fetched/set separately
    token: string;
}