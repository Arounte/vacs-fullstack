import { useModalStore } from '@/data/modal';
import dynamic from 'next/dynamic';

const SessionModal = dynamic(() => import('./session'), { ssr: false });
const UserModal = dynamic(() => import('./user'), { ssr: false });
const VehicleModal = dynamic(() => import('./vehicle'), { ssr: false });
const CheckpointModal = dynamic(() => import('./checkpoint'), { ssr: false });
const PassModal = dynamic(() => import('./pass'), { ssr: false });
const AccessModal = dynamic(() => import('./access'), { ssr: false });

export const ModalRoot = () => {
    const { modal } = useModalStore();

    return (
        <>
            {modal.type === 'session' && <SessionModal />}
            {modal.type === 'user' && <UserModal />}
            {modal.type === 'vehicle' && <VehicleModal />}
            {modal.type === 'checkpoint' && <CheckpointModal />}
            {modal.type === 'pass' && <PassModal />}
            {modal.type === 'access' && <AccessModal />}
        </>
    );
};
