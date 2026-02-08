import { useAccessEventStore } from '@/data/event';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useColumns } from './content';

export const Events = () => {
    const { events } = useAccessEventStore();
    const columns = useColumns();

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-xl font-bold">Список событий</h1>
            </div>
            <div className="flex-1 min-h-0 rounded-md border border-gray-200 bg-white overflow-auto">
                <DataTable value={events} paginator rows={10} scrollable scrollHeight="flex">
                    {columns.map((col) => (
                        <Column key={col.field} {...col} />
                    ))}
                </DataTable>
            </div>
        </div>
    );
};
