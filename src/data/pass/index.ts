import type { Pass } from '@/framework/db/schema';
import { create } from 'zustand';
import type { HydratableStore } from '..';

type State = {
    passes: Pass[];
};

type Action = {
    setPasses: (passes: Pass[]) => void;
};

type PassState = State & Action & HydratableStore<State>;

export const usePassStore = create<PassState>()((set) => ({
    passes: [],
    setPasses: (passes) => set({ passes }),
    hydrate: (data) => set(data),
}));
