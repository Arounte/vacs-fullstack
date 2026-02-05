import type { Pass } from '@/framework/db/schema';
import dayjs from 'dayjs';
import type { ColumnProps } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';

export const COLUMNS = (
    setIsActive: (id: string, state: boolean) => Promise<void>,
    getCheckpointName: (id: string) => string | undefined,
    getPlateNumber: (id: string) => string | undefined,
): ColumnProps[] => [
    {
        field: 'vehicleId',
        header: 'Номер ТС',
        body: ({ vehicleId }: Pass) => getPlateNumber(vehicleId) ?? '–',
    },
    {
        field: 'checkpointId',
        header: 'Пропускной пункт',
        body: ({ checkpointId }: Pass) => getCheckpointName(checkpointId) ?? '–',
    },
    {
        field: 'validFrom',
        header: 'Начало действия',
        body: ({ validFrom }: Pass) => dayjs(validFrom).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'validTo',
        header: 'Окончание действия',
        body: ({ validTo }: Pass) => dayjs(validTo).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'isActive',
        header: 'Статус',
        body: ({ id, isActive }: Pass) => (
            <InputSwitch checked={isActive} onChange={(e) => setIsActive(id, e.value)} />
        ),
    },
    {
        field: 'createdAt',
        header: 'Дата создания',
        body: ({ createdAt }: Pass) => dayjs(createdAt).format('DD.MM.YYYY HH:mm:ss'),
    },
    {
        field: 'updatedAt',
        header: 'Дата изменения',
        body: ({ updatedAt }: Pass) => dayjs(updatedAt).format('DD.MM.YYYY HH:mm:ss'),
    },
];
