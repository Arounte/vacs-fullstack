import { create } from 'zustand';
import type { ModalPayload, ModalState, ModalStore, ModalType, OpenModal } from './types';

export const useModalStore = create<ModalStore>((set, get) => ({
    modal: { type: null },
    isClosing: false,

    open: ((type: ModalType, props?: unknown) => {
        set({
            modal: props === undefined ? { type } : { type, props },
            isClosing: false,
        } as { modal: ModalState; isClosing: boolean });
    }) as OpenModal,

    requestClose: () => set({ isClosing: true }),

    close: () => set({ modal: { type: null }, isClosing: false }),

    getProps: <K extends ModalType>(type: K): ModalPayload[K] | undefined => {
        const { modal } = get();
        if (modal.type !== type) return undefined;

        if (!('props' in modal)) {
            return undefined as ModalPayload[K] | undefined;
        }

        return modal.props as ModalPayload[K];
    },
}));
