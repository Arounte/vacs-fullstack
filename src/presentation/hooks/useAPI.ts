import type { Status } from '@/data';
import { api } from '@/framework/api-client';
import type { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

export const useAPI = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string>();

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
                const msg = (err as Error).message;
                console.error(msg);
                setError(msg);

                return { status: false };
            } finally {
                setIsPending(false);
            }
        },
        [],
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
                const msg = (err as Error).message;
                console.error(msg);
                setError(msg);

                return { status: false };
            } finally {
                setIsPending(false);
            }
        },
        [],
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
                const msg = (err as Error).message;
                console.error(msg);
                setError(msg);

                return { status: false };
            } finally {
                setIsPending(false);
            }
        },
        [],
    );

    return {
        isPending,
        error,
        post,
        get,
        del,
    };
};
