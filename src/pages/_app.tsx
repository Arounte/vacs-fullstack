import { hydrate } from '@/framework/hydration';
import '@/framework/register';
import { Layout } from '@/presentation/component/layout';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import { useLayoutEffect } from 'react';

import '@/globals.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-purple/theme.css';
import { deserialize } from 'seroval';

dayjs.extend(utc);

export default function App({ Component, pageProps: props }: AppProps) {
    const { storeProps, pageProps } = props;
    const deserializedPageProps = deserialize<object>(pageProps);

    useLayoutEffect(() => {
        if (!storeProps) return;

        hydrate(storeProps);
    }, [storeProps]);

    return (
        <PrimeReactProvider>
            <Layout isAuthorized={storeProps?.adminSessionStore?.id}>
                <Component {...deserializedPageProps} />
            </Layout>
        </PrimeReactProvider>
    );
}
