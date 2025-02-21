// hooks/useRememberCredentials.ts
export const useRememberCredentials = () => {
    const storageKey = 'lookcard_remembered_credentials';

    // Simple encryption function (you can use a more robust encryption if needed)
    const encryptPassword = (password: string) => {
        return btoa(password.split('').reverse().join('')); // Base64 encode + reverse
    };

    // Decryption function
    const decryptPassword = (encrypted: string) => {
        try {
            return atob(encrypted).split('').reverse().join('');
        } catch {
            return '';
        }
    };

    const saveCredentials = (email: string, password: string) => {
        const encryptedPassword = encryptPassword(password);
        localStorage.setItem(storageKey, JSON.stringify({
            email,
            password: encryptedPassword,
            _masked: true // Flag to indicate password is encrypted
        }));
    };

    const clearCredentials = () => {
        localStorage.removeItem(storageKey);
    };

    const getCredentials = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed._masked) {
                    return {
                        email: parsed.email,
                        password: decryptPassword(parsed.password)
                    };
                }
                // If found old format, clear it
                clearCredentials();
                return null;
            } catch {
                clearCredentials();
                return null;
            }
        }
        return null;
    };

    return {
        saveCredentials,
        clearCredentials,
        getCredentials,
    };
};