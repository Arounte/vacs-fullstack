import { useAdminSessionStore } from '@/data/session/store';
import { register } from './hydration';

register("adminSessionStore", useAdminSessionStore);
