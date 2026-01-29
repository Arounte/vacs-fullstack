import { Role } from '@/domain/session';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';

export const getServerSideProps = withServerSidePageController(undefined, [
    withAuth([Role.Admin, Role.Operator]),
]);

export default function Access() {
    return <p>access</p>;
}
