export type ModalPayload = {
    session: { id: string; sid: string };
    user: { id?: string };
    vehicle: { id?: string };
    checkpoint: { id?: string };
    pass: { id?: string };
    access: { plateNumber: string; checkpointId: string; isEmergency: boolean };
};

export type ModalType = keyof ModalPayload;

type ModalWithProps = {
    [K in ModalType]: ModalPayload[K] extends undefined ? never : K;
}[ModalType];

type ModalWithoutProps = {
    [K in ModalType]: ModalPayload[K] extends undefined ? K : never;
}[ModalType];

export type ModalState =
    | { type: null }
    | { [K in ModalWithProps]: { type: K; props: ModalPayload[K] } }[ModalWithProps]
    | { [K in ModalWithoutProps]: { type: K } }[ModalWithoutProps];

export type OpenModal = (<K extends ModalWithProps>(type: K, props: ModalPayload[K]) => void) &
    (<K extends ModalWithoutProps>(type: K) => void);

export interface ModalStore {
    modal: ModalState;
    isClosing: boolean;
    open: OpenModal;
    requestClose: () => void;
    close: () => void;
    getProps: <K extends ModalType>(type: K) => ModalPayload[K] | undefined;
}
