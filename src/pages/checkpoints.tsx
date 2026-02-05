import { checkpointService } from '@/domain/checkpoint/service';
import { Role } from '@/domain/session';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Checkpoints as CheckpointsPage } from '@/presentation/page/checkpoints';

export const getServerSideProps = withServerSidePageController(async () => {
    try {
        const checkpoints = await checkpointService.getAllCheckpoints();

        return {
            storeProps: {
                checkpointStore: {
                    checkpoints,
                },
            },
        };
    } catch {
        return {
            storeProps: {
                checkpointStore: {
                    checkpoints: [],
                },
            },
        };
    }
}, [withAuth([Role.Admin, Role.Operator])]);

export default function Checkpoints() {
    return <CheckpointsPage />;
}
