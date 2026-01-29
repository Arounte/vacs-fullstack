import { Role } from '@/domain/session';
import { userService } from '@/domain/user/service';
import type { AdminUser } from '@/framework/db/schema';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Users as UsersPage } from '@/presentation/page/users';

export const getServerSideProps = withServerSidePageController(
    async ({ req, res }, _) => {
        try {
            const users = await userService.getAllUsers(req, res);

            return {
                pageProps: {
                    users,
                },
            };
        } catch {
            return { pageProps: { users: [] } };
        }
    },
    [withAuth([Role.Admin])],
);

export default function Users(props: { users: AdminUser[] }) {
    return <UsersPage {...props} />;
}
