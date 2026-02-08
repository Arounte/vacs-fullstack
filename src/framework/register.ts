import { useCheckpointStore } from '@/data/checkpoint/store';
import { useAccessEventStore } from '@/data/event';
import { usePassStore } from '@/data/pass';
import { useAdminSessionStore } from '@/data/session/store';
import { useUserStore } from '@/data/user/store';
import { useVehicleStore } from '@/data/vehicle/store';
import { register } from './hydration';

register('adminSessionStore', useAdminSessionStore);
register('userStore', useUserStore);
register('vehicleStore', useVehicleStore);
register('checkpointStore', useCheckpointStore);
register('passStore', usePassStore);
register('accessEventStore', useAccessEventStore);
