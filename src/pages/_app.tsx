import type { Session } from '@/domain/session';
import { hydrate } from '@/framework/hydration';
import '@/framework/register';
import '@/globals.css';
import { Layout } from '@/presentation/component/layout';
import { ToastProvider } from '@/presentation/context/toast';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { AppProps } from 'next/app';
import 'primeicons/primeicons.css';
import { ru } from 'primelocale/js/ru.js';
import { addLocale, locale, PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import { useEffect, useLayoutEffect } from 'react';
import { deserialize } from 'seroval';

dayjs.extend(utc);

export default function App({ Component, pageProps: props }: AppProps) {
    const { storeProps, pageProps } = props;
    const deserializedPageProps = deserialize<object>(pageProps);
    const deserializedStoreProps = deserialize<{ adminSessionStore: Session } & unknown>(
        storeProps,
    );

    useEffect(() => {
        addLocale('ru', ru);
        locale('ru');
    }, []);

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
