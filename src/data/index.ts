import type { ReasonT } from '@/helper/reason';

export type HydratableStore<T> = {
    hydrate: (data: T) => void;
};

export interface Status<Data = object> {
    status: boolean;
    reason?: ReasonT;
    data?: Data;
}
