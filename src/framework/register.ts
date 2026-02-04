import { useAdminSessionStore } from '@/data/session/store';
import { useUserStore } from '@/data/user/store';
import { register } from './hydration';

register('adminSessionStore', useAdminSessionStore);
register('userStore', useUserStore);
