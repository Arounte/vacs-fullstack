import { useModalStore } from '@/data/modal';
import type { ModalType } from '@/data/modal/types';
import { Dialog, type DialogProps } from 'primereact/dialog';
import { type FC, type PropsWithChildren, useEffect } from 'react';

type PropsT = Omit<DialogProps, 'visible' | 'onHide'> & {
    name: ModalType;
};

export const Modal: FC<PropsWithChildren<PropsT>> = (props) => {
    const { children, name, ...restProps } = props;
    const { modal, isClosing, requestClose, close } = useModalStore();
    const isOpen = modal.type === name;
    const visible = isOpen && !isClosing;

    useEffect(() => {
        if (isClosing && isOpen) {
            const timer = setTimeout(close, 250);
            return () => clearTimeout(timer);
        }
    }, [isClosing, isOpen, close]);

    return (
        <Dialog visible={visible} onHide={requestClose} {...restProps}>
            {children}
        </Dialog>
    );
};
