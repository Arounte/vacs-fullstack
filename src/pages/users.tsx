import { checkpointService } from '@/domain/checkpoint/service';
import { Role } from '@/domain/session';
import { userService } from '@/domain/user/service';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Users as UsersPage } from '@/presentation/page/users';

export const getServerSideProps = withServerSidePageController(async () => {
    try {
        const users = await userService.getAllUsers();
        const checkpoints = await checkpointService.getAllCheckpoints();

        return {
            storeProps: {
                userStore: {
                    users,
                },
                checkpointStore: {
                    checkpoints,
                },
            },
        };
    } catch {
        return { storeProps: { userStore: { users: [] } } };
    }
}, [withAuth([Role.Admin])]);

export default function Users() {
    return <UsersPage />;
}
