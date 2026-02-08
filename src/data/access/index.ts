import { create } from 'zustand';
import type { AccessLog } from './types';

type State = {
    accessLogs: AccessLog[];
};

type Action = {
    add: (item: AccessLog) => void;
};

type AccessLogsState = State & Action;

export const useAccessStore = create<AccessLogsState>((set) => ({
    accessLogs: [],
    add: (item) =>
        set((state) => ({
            accessLogs: [...state.accessLogs, item],
        })),
}));
