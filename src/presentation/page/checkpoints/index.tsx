import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import type { Checkpoint } from '@/framework/db/schema';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { COLUMNS } from './content';

export const Checkpoints = () => {
    const { checkpoints } = useCheckpointStore();
    const { open } = useModalStore();

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Список пропускных пунктов</h1>
                <Button label="Создать" icon="pi pi-plus" onClick={() => open('checkpoint', {})} />
            </div>
            <DataTable value={checkpoints}>
                {COLUMNS.map((col) => (
                    <Column key={col.field} {...col} />
                ))}
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
            </DataTable>
        </div>
    );
};
