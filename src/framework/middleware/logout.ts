import type { Session } from '@/domain/session';
import { sessionService } from '@/domain/session/service';
import type { Middleware } from '@/framework/page-controller';

export function withLogout(): Middleware<{ adminSessionStore: Session }, object> {
    return async ({ req, res }) => {
        try {
            await sessionService.getSession(req, res);
            await sessionService.destroySession(req, res);

            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        } catch {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
    };
}
