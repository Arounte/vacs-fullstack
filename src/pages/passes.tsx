import { checkpointService } from '@/domain/checkpoint/service';
import { passService } from '@/domain/pass/service';
import { Role } from '@/domain/session';
import { vehicleService } from '@/domain/vehicle/service';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Passes as PassesPage } from '@/presentation/page/passes';

export const getServerSideProps = withServerSidePageController(async () => {
    try {
        const passes = await passService.getAllPasses();
        const vehicles = await vehicleService.getAllVehicles();
        const checkpoints = await checkpointService.getAllCheckpoints();

        return {
            storeProps: {
                passStore: {
                    passes,
                },
                vehicleStore: {
                    vehicles,
                },
                checkpointStore: {
                    checkpoints,
                },
            },
        };
    } catch {
        return {
            storeProps: {
                passStore: {
                    passes: [],
                },
                vehicleStore: {
                    vehicles: [],
                },
                checkpointStore: {
                    checkpoints: [],
                },
            },
        };
    }
}, [
    withAuth([Role.Admin, Role.Operator]),
]);

export default function Passes() {
    return <PassesPage />;
}
