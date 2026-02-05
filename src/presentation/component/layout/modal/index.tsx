import { useModalStore } from '@/data/modal';
import dynamic from 'next/dynamic';

const SessionModal = dynamic(() => import('./session'), { ssr: false });
const UserModal = dynamic(() => import('./user'), { ssr: false });
const VehicleModal = dynamic(() => import('./vehicle'), { ssr: false });

export const ModalRoot = () => {
    const { modal } = useModalStore();

    return (
        <>
            {modal.type === 'session' && <SessionModal />}
            {modal.type === 'user' && <UserModal />}
            {modal.type === 'vehicle' && <VehicleModal />}
        </>
    );
};
