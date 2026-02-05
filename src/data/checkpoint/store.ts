import type { Checkpoint } from '@/framework/db/schema';
import { create } from 'zustand';
import type { HydratableStore } from '..';

type State = {
    checkpoints: Checkpoint[];
};

type Action = {
    setCheckpoints: (checkpoints: Checkpoint[]) => void;
};

type CheckpointState = State & Action & HydratableStore<State>;

export const useCheckpointStore = create<CheckpointState>()((set) => ({
    checkpoints: [],
    setCheckpoints: (checkpoints) => set({ checkpoints }),
    hydrate: (data) => set(data),
}));
