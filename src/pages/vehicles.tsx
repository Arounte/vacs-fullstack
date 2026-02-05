import { Role } from '@/domain/session';
import { vehicleService } from '@/domain/vehicle/service';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Vehicles as VehiclesPage } from '@/presentation/page/vehicles';

export const getServerSideProps = withServerSidePageController(async () => {
    try {
        const vehicles = await vehicleService.getAllVehicles();

        return {
            storeProps: {
                vehicleStore: {
                    vehicles,
                },
            },
        };
    } catch { return { storeProps: { vehicleStore: { vehicles: []}} }}
}, [
    withAuth([Role.Admin, Role.Operator]),
]);

export default function Vehicles() {
    return <VehiclesPage />;
}
