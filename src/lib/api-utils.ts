// src/lib/api-utils.ts
import { useState, useEffect } from 'react';

export const fetchData = async <T>(
    apiCall: () => Promise<T>,
    setData: (data: T) => void,
    setError: (error: Error | null) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const response = await apiCall();
        setData(response);
        setError(null);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('An error occurred'));
    } finally {
        setLoading(false);
    }
};