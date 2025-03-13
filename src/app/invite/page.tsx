'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import Loader from '@/components/common/Loader';

export default function InvitePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Extract referral parameters from URL
        const referralCode = searchParams.get('referralCode');
        const upstreamId = searchParams.get('upstreamId');

        console.log('[Invite] Processing invitation with params:', {
            referralCode,
            upstreamId
        });

        // Clear any existing auth to prevent using the current user's session
        storage.clearAuth();

        // Build login URL with referral parameters
        const loginParams = new URLSearchParams();

        // Use URL params if available, otherwise don't include them
        // (Login page will use defaults when needed)
        if (referralCode) loginParams.set('referralCode', referralCode);
        if (upstreamId) loginParams.set('upstreamId', upstreamId);

        const loginUrl = `/auth/login${loginParams.toString() ? `?${loginParams.toString()}` : ''}`;

        console.log('[Invite] Redirecting to login page:', loginUrl);
        router.push(loginUrl);

        setLoading(false);

    }, [router, searchParams]);

    // Simple loading screen while processing
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader />
            </div>
        </div>
    );
}