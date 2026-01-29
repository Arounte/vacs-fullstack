import { Role } from '@/domain/session';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';

export const getServerSideProps = withServerSidePageController(undefined, [withAuth([Role.Admin])]);

export default function Settings() {
    return <p>settings</p>;
}
