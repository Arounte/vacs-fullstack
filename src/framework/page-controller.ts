import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    Redirect,
} from 'next';
import { serialize } from 'seroval';

export type StoreHydrationMap = Record<string, unknown>;

type ControllerResult<StoreProps, PageProps> =
    | { storeProps?: StoreProps; pageProps?: PageProps }
    | { redirect: Redirect }
    | { notFound: true };

export type Middleware<StoreMap extends StoreHydrationMap, PageProps> = (
    context: GetServerSidePropsContext,
) => Promise<ControllerResult<Partial<StoreMap>, PageProps>>;


export function withServerSidePageController<
    StoreMap extends StoreHydrationMap,
    PageProps extends object = object,
>(
    handler?: (
        context: GetServerSidePropsContext,
        accumulatedData: {
            storeProps: Partial<StoreMap>;
            pageProps: Partial<PageProps>;
        },
    ) => Promise<ControllerResult<Partial<StoreMap>, PageProps> | object>,
    middlewares?: Middleware<StoreMap, PageProps>[],
): GetServerSideProps<{ storeProps: StoreMap; pageProps: PageProps }> {
    return async function getServerSideProps(context: GetServerSidePropsContext): Promise<
        GetServerSidePropsResult<{
            storeProps: StoreMap;
            pageProps: PageProps;
        }>
    > {
        const accumulatedData: {
            storeProps: Partial<StoreMap>;
            pageProps: Partial<PageProps>;
        } = {
            storeProps: {},
            pageProps: {},
        };

        if (middlewares) {
            for (const middleware of middlewares) {
                const result = await middleware(context);

                if ('redirect' in result) {
                    return { redirect: result.redirect };
                }

                if ('notFound' in result) {
                    return { notFound: true };
                }

                if (result.storeProps) {
                    accumulatedData.storeProps = {
                        ...accumulatedData.storeProps,
                        ...result.storeProps,
                    };
                }

                if (result.pageProps) {
                    accumulatedData.pageProps = {
                        ...accumulatedData.pageProps,
                        ...result.pageProps,
                    };
                }
            }
        }

        const result = (await handler?.(context, accumulatedData)) as ControllerResult<
            Partial<StoreMap>,
            PageProps
        >;

        if (result && 'redirect' in result) {
            return { redirect: result.redirect };
        }

        if (result && 'notFound' in result) {
            return result;
        }

        if (result?.storeProps) {
            accumulatedData.storeProps = {
                ...accumulatedData.storeProps,
                ...result.storeProps,
            };
        }

        if (result?.pageProps) {
            accumulatedData.pageProps = {
                ...accumulatedData.pageProps,
                ...result.pageProps,
            };
        }

        return {
            props: {
                storeProps: serialize(accumulatedData.storeProps) as unknown as StoreMap,
                pageProps: serialize(accumulatedData.pageProps) as unknown as PageProps,
            },
        };
    };
}
