import { useModalStore } from '@/data/modal';
import type { OpenModal } from '@/data/modal/types';
import type { AccessEvent } from '@/framework/db/schema';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import type { ColumnProps } from 'primereact/column';
import type { ReactNode } from 'react';

const MAP_EVENT_TYPE_TO_MESSAGE: Record<NonNullable<AccessEvent['eventType']>, ReactNode> = {
    in: <span className="font-medium text-emerald-600">Въезд</span>,
    out: <span className="font-medium text-amber-600">Выезд</span>,
};

const MAP_RESULT_TO_MESSAGE: Record<NonNullable<AccessEvent['result']>, ReactNode> = {
    allowed: <i className="pi pi-check text-emerald-600"></i>,
    denied: <i className="pi pi-ban text-red-600"></i>,
};

const MAP_REASON_TO_MESSAGE: Record<string, string> = {
    pass_not_found: 'Пропуск не зарегистрирован',
    vehicle_not_found: 'ТС не зарегистрировано',
};

const getColumns = (open: OpenModal): ColumnProps[] => [
    {
        field: 'username',
        header: 'Оператор',
    },
    {
        field: 'checkpointName',
        header: 'КПП',
    },
    {
        field: 'passId',
        header: 'Пропуск',
        body: ({ passId }: AccessEvent) =>
            passId ? (
                <Button
                    text
                    severity="secondary"
                    icon="pi pi-external-link"
                    onClick={() => open('pass', { id: passId })}
                />
            ) : (
                '–'
            ),
    },
    {
        field: 'vehicleId',
        header: 'ТС',
        body: ({ vehicleId }: AccessEvent) =>
            vehicleId ? (
                <Button
                    text
                    severity="secondary"
                    icon="pi pi-external-link"
                    onClick={() => open('vehicle', { id: vehicleId })}
                />
            ) : (
                '–'
            ),
    },
    {
        field: 'vehicleModel',
        header: 'Марка/модель ТС',
        body: ({ vehicleModel }: AccessEvent) => vehicleModel ?? '–',
    },
    {
        field: 'plateNumber',
        header: 'Рег. номер ТС',
    },
    {
        field: 'eventType',
        header: 'Событие',
        body: ({ eventType }: AccessEvent) =>
            eventType ? MAP_EVENT_TYPE_TO_MESSAGE[eventType] : '–',
    },
    {
        field: 'result',
        header: 'Результат',
        body: ({ result }: AccessEvent) => MAP_RESULT_TO_MESSAGE[result],
    },
    {
        field: 'reason',
        header: 'Причина',
        body: ({ reason }: AccessEvent) => (reason ? MAP_REASON_TO_MESSAGE[reason] : '–'),
    },
    {
        field: 'timestamp',
        header: 'Дата и время',
        body: ({ timestamp }: AccessEvent) => dayjs(timestamp).format('DD.MM.YYYY HH:mm:ss'),
    },
];

export const useColumns = () => {
    const { open } = useModalStore();
    const columns = getColumns(open);

    return columns;
};
