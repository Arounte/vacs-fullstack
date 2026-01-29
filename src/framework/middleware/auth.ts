import { Role, type Session } from '@/domain/session';
import { sessionService } from '@/domain/session/service';
import type { Middleware } from '@/framework/page-controller';

const redirectToLogin = {
    redirect: {
        destination: '/login',
        permanent: false,
    },
};

const redirectToHome = {
    redirect: {
        destination: '/',
        permanent: false,
    },
};

export function withAuth(allowedRoles: Role[]): Middleware<{ adminSessionStore: Session }, object> {
    return async ({ req, res }) => {
        try {
            const session = await sessionService.getSession(req, res);
            if (allowedRoles.includes(Role.Guest) && session.role !== Role.Guest) {
                return redirectToHome;
            }

            if (!allowedRoles.includes(session.role)) {
                return redirectToLogin;
            }

            return {
                storeProps: {
                    adminSessionStore: session,
                },
            };
        } catch {
            if (allowedRoles.includes(Role.Guest)) {
                return {};
            }

            return redirectToLogin;
        }
    };
}
