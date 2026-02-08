import type { HydratableStore } from '@/data';
import { Role, type Session } from '@/domain/session';
import { create } from 'zustand';

type SessionState = Session & HydratableStore<Session>;

export const useAdminSessionStore = create<SessionState>()((set) => ({
    sid: '',
    id: '',
    username: '',
    role: Role.Guest,
    checkpointId: null,
    hydrate: (data) => set(data),
}));
