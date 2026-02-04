import type { AdminUser } from '@/framework/db/schema';
import { create } from 'zustand';
import type { HydratableStore } from '..';

type State = {
    users: AdminUser[];
};

type Action = {
    setUsers: (users: AdminUser[]) => void;
};

type UserState = State & Action & HydratableStore<State>;

export const useUserStore = create<UserState>()((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    hydrate: (data) => set(data),
}));
