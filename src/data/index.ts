export type HydratableStore<T> = {
    hydrate: (data: T) => void;
};

export interface Status<Data = object> {
    status: boolean;
    reason?: string;
    data?: Data;
}