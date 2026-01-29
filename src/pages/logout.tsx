import { withLogout } from '@/framework/middleware/logout';
import { withServerSidePageController } from '@/framework/page-controller';

export const getServerSideProps = withServerSidePageController(undefined, [withLogout()]);

export default function Logout() {
    return null;
}
