import { useModalStore } from '@/data/modal';
import { useAdminSessionStore } from '@/data/session/store';
import { useVehicleStore } from '@/data/vehicle/store';
import { Role } from '@/domain/session';
import type { Vehicle } from '@/framework/db/schema';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { COLUMNS } from './content';

export const Vehicles = () => {
    const { vehicles } = useVehicleStore();
    const { open } = useModalStore();
    const { role } = useAdminSessionStore();
    const isAdmin = role === Role.Admin;

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Список автомобилей</h1>
                {isAdmin && (
                    <Button label="Создать" icon="pi pi-plus" onClick={() => open('vehicle', {})} />
                )}
            </div>
            <DataTable value={vehicles}>
                {COLUMNS.map((col) => (
                    <Column key={col.field} {...col} />
                ))}
                {isAdmin && (
                    <Column
                        field="id"
                        header="Действие"
                        body={({ id }: Vehicle) => (
                            <Button
                                severity="secondary"
                                text
                                icon="pi pi-pencil"
                                onClick={() => open('vehicle', { id })}
                            />
                        )}
                    />
                )}
            </DataTable>
        </div>
    );
};
