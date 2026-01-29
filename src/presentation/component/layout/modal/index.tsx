import { useModalStore } from '@/data/modal';
import dynamic from 'next/dynamic';

const SessionModal = dynamic(() => import('./session'), { ssr: false });

export const ModalRoot = () => {
    const { modal } = useModalStore();

    return <>{modal.type === 'session' && <SessionModal />}</>;
};
