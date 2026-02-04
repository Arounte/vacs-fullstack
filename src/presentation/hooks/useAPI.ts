import type { Status } from '@/data';
import { api } from '@/framework/api-client';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

export const useAPI = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string>();

    const handleError = useCallback((err: unknown) => {
        const data = (err as AxiosError).response?.data;
        const reason = (data as Status).reason;
        setError((data as Status).reason ?? 'internal_server_error');

        return { status: false, reason };
    }, []);

    const get = useCallback(
        // biome-ignore lint/suspicious/noExplicitAny: .
        async <T>(url: string, headers?: AxiosRequestConfig<any>): Promise<Status<T>> => {
            setIsPending(true);

            try {
                const { data } = await api.get<Status<T>>(url, headers);

                if (!data.status && data.reason) {
                    setError(data.reason);
                }

                return data;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsPending(false);
            }
        },
        [handleError],
    );

    const post = useCallback(
        async <T>(
            url: string,
            body?: unknown,
            // biome-ignore lint/suspicious/noExplicitAny: .
            headers?: AxiosRequestConfig<any>,
        ): Promise<Status<T>> => {
            setIsPending(true);

            try {
                const { data } = await api.post<Status<T>>(url, body, headers);

                if (!data.status && data.reason) {
                    setError(data.reason);
                }

                return data;
            } catch (err) {
                console.log(err);
                return handleError(err);
            } finally {
                setIsPending(false);
            }
        },
        [handleError],
    );

    const patch = useCallback(
        async <T>(
            url: string,
            body?: unknown,
            // biome-ignore lint/suspicious/noExplicitAny: .
            headers?: AxiosRequestConfig<any>,
        ): Promise<Status<T>> => {
            setIsPending(true);

            try {
                const { data } = await api.patch<Status<T>>(url, body, headers);

                if (!data.status && data.reason) {
                    setError(data.reason);
                }

                return data;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsPending(false);
            }
        },
        [handleError],
    );

    const del = useCallback(
        async <T>(
            url: string,
            // biome-ignore lint/suspicious/noExplicitAny: .
            headers?: AxiosRequestConfig<any>,
        ): Promise<Status<T>> => {
            setIsPending(true);

            try {
                const { data } = await api.delete<Status<T>>(url, headers);

                if (!data.status && data.reason) {
                    setError(data.reason);
                }

                return data;
            } catch (err) {
                return handleError(err);
            } finally {
                setIsPending(false);
            }
        },
        [handleError],
    );

    return {
        isPending,
        error,
        post,
        patch,
        get,
        del,
    };
};
