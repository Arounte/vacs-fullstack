import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import { usePassStore } from '@/data/pass';
import { useAdminSessionStore } from '@/data/session/store';
import { useVehicleStore } from '@/data/vehicle/store';
import { Role } from '@/domain/session';
import type { Pass } from '@/framework/db/schema';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback } from 'react';
import { COLUMNS } from './content';

export const Passes = () => {
    const { passes, setPasses } = usePassStore();
    const { vehicles } = useVehicleStore();
    const { checkpoints } = useCheckpointStore();
    const { open } = useModalStore();
    const { get, patch } = useAPI();
    const { showError } = useToast();
    const { role } = useAdminSessionStore();
    const isAdmin = role === Role.Admin;

    const getPlateNumberById = useCallback(
        (id: string) => {
            return vehicles.find((v) => v.id === id)?.plateNumber;
        },
        [vehicles],
    );

    const getCheckpointNameById = useCallback(
        (id: string) => {
            return checkpoints.find((c) => c.id === id)?.name;
        },
        [checkpoints],
    );

    const fetchPasses = useCallback(async () => {
        const { data } = await get<Pass[]>('/passes');
        if (data) {
            setPasses(data);
        }
    }, [get, setPasses]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    const setIsActive = useCallback(
        async (id: string, state: boolean) => {
            const { status, reason } = await patch(`/passes/${id}`, {
                isActive: state,
            });
            if (!status && reason) {
                return showError(reason);
            }

            fetchPasses();
        },
        [patch, fetchPasses],
    );

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Список пропусков</h1>
                {isAdmin && (
                    <Button label="Создать" icon="pi pi-plus" onClick={() => open('pass', {})} />
                )}
            </div>
            <DataTable value={passes}>
                {COLUMNS(isAdmin, setIsActive, getCheckpointNameById, getPlateNumberById).map(
                    (col) => (
                        <Column key={col.field} {...col} />
                    ),
                )}
                {isAdmin && (
                    <Column
                        field="id"
                        header="Действие"
                        body={({ id }: Pass) => (
                            <Button
                                severity="secondary"
                                text
                                icon="pi pi-pencil"
                                onClick={() => open('pass', { id })}
                            />
                        )}
                    />
                )}
            </DataTable>
        </div>
    );
};
