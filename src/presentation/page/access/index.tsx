import { useAccessStore } from '@/data/access';
import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import type { Checkpoint } from '@/framework/db/schema';
import { Select } from '@/presentation/component/common/select';
import { Clock } from '@/presentation/component/feature/clock';
import { Input } from '@/presentation/component/form/input';
import { Switch } from '@/presentation/component/form/switch';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { COLUMNS } from './content';
import { type AccessFormData, AccessFormSchema } from './types';

export const Access = () => {
    const { checkpoints } = useCheckpointStore();
    const { open } = useModalStore();
    const { accessLogs } = useAccessStore();
    const [currentCheckpoint, setCurrentCheckpoint] = useState<Checkpoint | null>(null);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint['id']>('');
    const { control, handleSubmit } = useForm<AccessFormData>({
        defaultValues: {
            plateNumber: '',
            isEmergency: false,
        },
        resolver: valibotResolver(AccessFormSchema),
    });
    const checkpointOptions = useMemo(
        () =>
            checkpoints.map(({ id, name }) => ({
                value: id,
                label: name,
            })),
        [checkpoints],
    );
    const getCheckpointById = useCallback(
        (id: string) => checkpoints.find((c) => c.id === id),
        [checkpoints],
    );

    const onSubmit = async ({ plateNumber, isEmergency }: AccessFormData) => {
        open('access', {
            plateNumber,
            checkpointId: currentCheckpoint?.id ?? '',
            isEmergency,
        });
    };

    return !currentCheckpoint ? (
        <div className="h-full flex items-center justify-center">
            <Card className="w-1/3" title="Выбор пропускного пункта">
                <div className="gap-10 mt-2 flex flex-col">
                    <Select
                        label="КПП"
                        options={checkpointOptions}
                        value={selectedCheckpoint}
                        onChange={(e) => setSelectedCheckpoint(e.value)}
                    />
                    <Button
                        label="Выбрать"
                        icon="pi pi-check-circle"
                        onClick={() =>
                            setCurrentCheckpoint(getCheckpointById(selectedCheckpoint) ?? null)
                        }
                    />
                </div>
            </Card>
        </div>
    ) : (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-4 items-center justify-between">
                <Button
                    label="Назад"
                    severity="secondary"
                    text
                    icon="pi pi-arrow-left"
                    onClick={() => setCurrentCheckpoint(null)}
                />
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-xl text-end">КПП: {currentCheckpoint.name}</h1>
                    <Clock className="tabular-nums" />
                </div>
            </div>
            <div className="flex-1 flex min-h-0">
                <div className="w-1/2 h-full flex px-10">
                    <Card className="w-full h-fit" title="Ввод рег. номера ТС">
                        <form
                            className="gap-10 mt-2 flex flex-col"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Input name="plateNumber" control={control} label="Номер" />
                            <Switch
                                name="isEmergency"
                                label="Экстренные службы"
                                control={control}
                            />
                            <Button type="submit" label="Проверить" icon="pi pi-check-circle" />
                        </form>
                    </Card>
                </div>
                <div className="flex-1 min-h-0 w-1/2 rounded-md border border-gray-200 bg-white overflow-auto">
                    <DataTable
                        scrollable
                        scrollHeight="flex"
                        value={[...accessLogs].sort(
                            (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
                        )}
                    >
                        {COLUMNS.map((col) => (
                            <Column key={col.field} {...col} />
                        ))}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
