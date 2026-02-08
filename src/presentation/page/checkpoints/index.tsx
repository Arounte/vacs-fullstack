import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import { useAdminSessionStore } from '@/data/session/store';
import { Role } from '@/domain/session';
import type { Checkpoint } from '@/framework/db/schema';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { COLUMNS } from './content';

export const Checkpoints = () => {
    const { checkpoints } = useCheckpointStore();
    const { open } = useModalStore();
    const { role } = useAdminSessionStore();
    const isAdmin = role === Role.Admin;

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-xl font-bold">Список пропускных пунктов</h1>
                {isAdmin && (
                    <Button
                        label="Создать"
                        icon="pi pi-plus"
                        onClick={() => open('checkpoint', {})}
                    />
                )}
            </div>
            <div className="flex-1 min-h-0 rounded-md border border-gray-200 bg-white overflow-auto">
                <DataTable value={checkpoints} scrollable scrollHeight="flex">
                    {COLUMNS.map((col) => (
                        <Column key={col.field} {...col} />
                    ))}
                    {isAdmin && (
                        <Column
                            field="id"
                            header="Действие"
                            body={({ id }: Checkpoint) => (
                                <Button
                                    severity="secondary"
                                    text
                                    icon="pi pi-pencil"
                                    onClick={() => open('checkpoint', { id })}
                                />
                            )}
                        />
                    )}
                </DataTable>
            </div>
        </div>
    );
};
