import type { Vehicle } from '@/framework/db/schema';
import { create } from 'zustand';
import type { HydratableStore } from '..';

type State = {
    vehicles: Vehicle[];
};

type Action = {
    setVehicles: (vehicles: Vehicle[]) => void;
};

type VehicleState = State & Action & HydratableStore<State>;

export const useVehicleStore = create<VehicleState>()((set) => ({
    vehicles: [],
    setVehicles: (vehicles) => set({ vehicles }),
    hydrate: (data) => set(data),
}));
