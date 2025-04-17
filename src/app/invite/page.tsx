'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { expandUUID } from '@/lib/url-utils';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

// This component supports both formats:
// 1. /i/[referralCode]/[shortId]  (new short format)
// 2. /invite?referralCode=xxx&upstreamId=xxx  (original format)

export default function InvitePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        // Clear any existing auth to prevent using the current user's session
        storage.clearAuth();
        
        // Check if we're using the new shortened format ([referralCode]/[shortId])
        const referralCode = params?.referralCode as string;
        const shortId = params?.shortId as string;
        
        if (referralCode && shortId) {
            console.log('[Invite] Processing short invitation format:', { referralCode, shortId });
            
            // Convert the shortened ID back to full UUID
            const upstreamId = expandUUID(shortId);
            console.log('[Invite] Expanded upstreamId:', upstreamId);
            
            // Build login URL with full parameters
            const loginParams = new URLSearchParams();
            loginParams.set('referralCode', referralCode);
            loginParams.set('upstreamId', upstreamId);
            
            const loginUrl = `/auth/login?${loginParams.toString()}`;
            console.log('[Invite] Redirecting to login page:', loginUrl);
            router.push(loginUrl);
        } else {
            // For backwards compatibility, handle the old URL format with searchParams
            // This would be window.location.search in this case since we need to manually parse
            const searchParams = new URLSearchParams(window.location.search);
            const oldReferralCode = searchParams.get('referralCode');
            const oldUpstreamId = searchParams.get('upstreamId');
            
            console.log('[Invite] Processing classic invitation format:', {
                referralCode: oldReferralCode,
                upstreamId: oldUpstreamId
            });
            
            // Build login URL
            const loginParams = new URLSearchParams();
            if (oldReferralCode) loginParams.set('referralCode', oldReferralCode);
            if (oldUpstreamId) loginParams.set('upstreamId', oldUpstreamId);
            
            const loginUrl = `/auth/login${loginParams.toString() ? `?${loginParams.toString()}` : ''}`;
            console.log('[Invite] Redirecting to login page:', loginUrl);
            router.push(loginUrl);
        }
        
        setLoading(false);
    }, [router, params]);

    // Enhanced loading screen with welcome message and logo
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-boxdark">
            <div className="text-center space-y-6 p-8 rounded-xl bg-white dark:bg-boxdark-2 shadow-lg max-w-lg w-full mx-4">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/logo/loockard-logo-color.svg"
                        alt="LookCard Logo"
                        width={200}
                        height={60}
                        className="dark:hidden"
                    />
                    <Image
                        src="/images/logo/lookcard-logo-white.svg"
                        alt="LookCard Logo"
                        width={200}
                        height={60}
                        className="hidden dark:block"
                    />
                </div>
                
                <h1 className="text-2xl font-bold text-black dark:text-white">
                    {t('invitePage.welcomeTitle')}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400">
                    {t('invitePage.redirectMessage')}
                </p>
                
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('invitePage.processingInvitation')}
                    </p>
                </div>
            </div>
        </div>
    );
}