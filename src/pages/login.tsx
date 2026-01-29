import { Role } from '@/domain/session';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { AdminLogin } from '@/presentation/page/login';

export const getServerSideProps = withServerSidePageController(async (_, props) => {
    const { storeProps } = props;

    if (storeProps.adminSessionStore?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {};
}, [withAuth([Role.Guest])]);

export default function Login() {
    return <AdminLogin />
}
