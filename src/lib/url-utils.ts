/**
 * Shortens a UUID by converting it to base64url format.
 * This is more efficient than using third-party services and preserves all information.
 */
export function shortenUUID(uuid: string): string {
    if (!uuid) return '';

    // Remove hyphens and convert to buffer
    const cleanUUID = uuid.replace(/-/g, '');

    // In browser environments, we need to use the Web API
    const bytes = new Uint8Array(cleanUUID.length / 2);
    for (let i = 0; i < cleanUUID.length; i += 2) {
        bytes[i / 2] = parseInt(cleanUUID.substring(i, i + 2), 16);
    }

    // Convert to base64 and make URL-safe
    let base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));

    // Make URL-safe by replacing '+' with '-', '/' with '_', and removing '='
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Expands a shortened UUID back to its original form
 */
export function expandUUID(shortId: string): string {
    if (!shortId) return '';

    try {
        // Make base64 standard by replacing URL-safe chars and adding padding
        let base64 = shortId.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        // Decode base64 to bytes
        const binary = atob(base64);

        // Convert bytes to hex
        let hex = '';
        for (let i = 0; i < binary.length; i++) {
            const byte = binary.charCodeAt(i).toString(16).padStart(2, '0');
            hex += byte;
        }

        // Add hyphens back to create UUID format
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } catch (error) {
        console.error('Error expanding shortened ID:', error);
        return shortId; // Return original in case of error
    }
}

/**
 * Creates a short invite URL from referral code and upstream ID
 */
export function createShortInviteUrl(baseUrl: string, referralCode: string, upstreamId: string): string {
    if (!referralCode || !upstreamId) {
        return `${baseUrl}/invite?referralCode=${referralCode || ''}&upstreamId=${upstreamId || ''}`;
    }

    // Option 1: Use the referral code as-is and shorten only the UUID
    const shortId = shortenUUID(upstreamId);
    return `${baseUrl}/i/${referralCode}/${shortId}`;

    // Option 2: Use just the referral code (if upstream ID can be looked up by code)
    // return `${baseUrl}/i/${referralCode}`;
}