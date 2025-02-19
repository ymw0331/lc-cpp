export const useRememberCredentials = () => {
    const storageKey = 'lookcard_remembered_credentials';

    const saveCredentials = (email: string, password: string) => {
        localStorage.setItem(storageKey, JSON.stringify({ email, password }));
    };

    const clearCredentials = () => {
        localStorage.removeItem(storageKey);
    };

    const getCredentials = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                return JSON.parse(saved);
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