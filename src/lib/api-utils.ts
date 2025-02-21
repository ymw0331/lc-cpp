export const fetchData = async <T>(
    apiCall: () => Promise<T>,
    setData: (data: T) => void,
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void,
    maxAttempts = 3,
    delayMs = 1000
) => {
    let attempts = 0;

    const makeAttempt = async (): Promise<T | null> => {
        try {
            const response = await apiCall();
            return response;
        } catch (error) {
            console.warn(`[API] Attempt ${attempts + 1} failed:`, error);
            return null;
        }
    };

    setLoading(true);

    while (attempts < maxAttempts) {
        const response = await makeAttempt();

        if (response) {
            setData(response);
            setError(null);
            setLoading(false);
            return;
        }

        attempts++;

        if (attempts < maxAttempts) {
            console.log(`[API] Retrying in ${delayMs}ms... (${attempts}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    // If all attempts fail, set empty/default data instead of error
    setData({} as T);
    setError(null);
    setLoading(false);
};