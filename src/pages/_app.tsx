import { hydrate } from '@/framework/hydration';
import '@/framework/register';
import { Layout } from '@/presentation/component/layout';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import { useLayoutEffect } from 'react';

import type { Session } from '@/domain/session';
import '@/globals.css';
import { ToastProvider } from '@/presentation/context/toast';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import { deserialize } from 'seroval';

dayjs.extend(utc);

export default function App({ Component, pageProps: props }: AppProps) {
    const { storeProps, pageProps } = props;
    const deserializedPageProps = deserialize<object>(pageProps);
    const deserializedStoreProps = deserialize<{ adminSessionStore: Session } & unknown>(
        storeProps,
    );

    useLayoutEffect(() => {
        if (!storeProps) return;

        hydrate(deserialize(storeProps));
    }, [storeProps]);

    return (
        <PrimeReactProvider>
            <ToastProvider>
                <Layout isAuthorized={!!deserializedStoreProps?.adminSessionStore?.id}>
                    <Component {...deserializedPageProps} />
                </Layout>
            </ToastProvider>
        </PrimeReactProvider>
    );
}
