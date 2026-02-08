import type { AccessEvent } from '@/framework/db/schema';
import { create } from 'zustand';
import type { HydratableStore } from '..';

type State = {
    events: AccessEvent[];
};

type EventState = State & HydratableStore<State>;

export const useAccessEventStore = create<EventState>()((set) => ({
    events: [],
    hydrate: (data) => set(data),
}));
