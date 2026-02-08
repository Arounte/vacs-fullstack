import type { AccessLog } from '@/data/access/types';
import dayjs from 'dayjs';
import type { ColumnProps } from 'primereact/column';

const MAP_EVENT_TYPE_TO_TEXT: Record<AccessLog['eventType'], string> = {
    in: 'Въезд',
    out: 'Выезд',
    denied: 'Отказ',
};

export const COLUMNS: ColumnProps[] = [
    {
        field: 'plateNumber',
        header: 'Номер ТС',
    },
    {
        field: 'eventType',
        header: 'Событие',
        body: ({ eventType }: AccessLog) => MAP_EVENT_TYPE_TO_TEXT[eventType],
    },
    {
        field: 'reason',
        header: 'Причина',
        body: ({ reason }: AccessLog) => reason ?? '',
    },
    {
        field: 'timestamp',
        header: 'Время',
        body: ({ timestamp }: AccessLog) => dayjs(timestamp).format('HH:mm:ss'),
    },
];
