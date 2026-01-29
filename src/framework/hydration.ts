import type { StoreApi, UseBoundStore } from "zustand";

type GenericStore = UseBoundStore<
    StoreApi<object & { hydrate?: (data: unknown) => void }>
>;

export interface HydrationState {
    [store: string]: unknown;
}

const registry = new Map<string, unknown>();

export function register(name: string, store: unknown) {
    registry.set(name, store);
}

export function hydrate(initialState: HydrationState) {
    Object.entries(initialState).forEach(([name, state]) => {
        const store = registry.get(name);
        const newState = (store as GenericStore).getState();

        if (newState.hydrate) {
            newState.hydrate(state);
        }
    });
}
