import { accessEventService } from '@/domain/access/service';
import { checkpointService } from '@/domain/checkpoint/service';
import { Role } from '@/domain/session';
import { vehicleService } from '@/domain/vehicle/service';
import { withAuth } from '@/framework/middleware/auth';
import { withServerSidePageController } from '@/framework/page-controller';
import { Events as EventsPage } from '@/presentation/page/events';

export const getServerSideProps = withServerSidePageController(async () => {
    try {
        const events = await accessEventService.getAllEvents();
        const checkpoints = await checkpointService.getAllCheckpoints();
        const vehicles = await vehicleService.getAllVehicles();

        return {
            storeProps: {
                accessEventStore: {
                    events: events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
                },
                checkpointStore: {
                    checkpoints,
                },
                vehicleStore: {
                    vehicles,
                },
            },
        };
    } catch {
        return {
            storeProps: {
                accessEventStore: {
                    events: [],
                },
            },
        };
    }
}, [withAuth([Role.Admin, Role.Operator])]);

export default function Events() {
    return <EventsPage />;
}
