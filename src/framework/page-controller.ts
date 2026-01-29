import type {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    Redirect,
} from 'next';
import { serialize } from 'seroval';

type ControllerResult<StoreProps, PageProps> =
    | { storeProps?: StoreProps; pageProps?: PageProps }
    | { redirect: Redirect }
    | { notFound: true };

export type Middleware<StoreProps, PageProps> = (
    context: GetServerSidePropsContext,
) => Promise<ControllerResult<StoreProps, PageProps>>;

export function withServerSidePageController<
    StoreProps extends object = object,
    PageProps extends object = object,
>(
    handler?: (
        context: GetServerSidePropsContext,
        accumulatedData: {
            storeProps: Partial<StoreProps>;
            pageProps: Partial<PageProps>;
        },
    ) => Promise<ControllerResult<StoreProps, PageProps> | object>,
    middlewares?: Middleware<StoreProps, PageProps>[],
): GetServerSideProps<{ storeProps: StoreProps; pageProps: PageProps }> {
    return async function getServerSideProps(context: GetServerSidePropsContext): Promise<
        GetServerSidePropsResult<{
            storeProps: StoreProps;
            pageProps: PageProps;
        }>
    > {
        const accumulatedData: {
            storeProps: Partial<StoreProps>;
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
            StoreProps,
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
                storeProps: accumulatedData.storeProps as StoreProps,
                pageProps: serialize(accumulatedData.pageProps) as unknown as PageProps,
            },
        };
    };
}
