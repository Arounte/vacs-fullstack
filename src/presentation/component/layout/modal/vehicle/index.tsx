import { useModalStore } from '@/data/modal';
import { useVehicleStore } from '@/data/vehicle/store';
import { type CreateVehicleData, CreateVehicleSchema } from '@/domain/vehicle';
import type { Vehicle } from '@/framework/db/schema';
import { Input } from '@/presentation/component/form/input';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Modal } from '../common';

export default function VehicleModal() {
    const { requestClose, getProps } = useModalStore();
    const { setVehicles } = useVehicleStore();
    const { id } = getProps('vehicle') ?? {};
    const [initializing, setInitializing] = useState(true);
    const isCreate = !id;
    const { control, handleSubmit, reset, watch } = useForm<CreateVehicleData>({
        defaultValues: {
            plateNumber: '',
            ownerName: '',
            ownerPhone: '',
            model: '',
        },
        resolver: valibotResolver(CreateVehicleSchema),
    });
    const { isValid } = useFormState({ control });
    const { get, post, patch, isPending } = useAPI();
    const { showError } = useToast();
    const plateNumber = watch('plateNumber');

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    useEffect(() => {
        if (!id) return setInitializing(false);

        async function execute() {
            const { status, data, reason } = await get<Vehicle>(`/vehicles/${id}`);
            if (!status && reason) return showError(reason);

            reset({
                plateNumber: data?.plateNumber ?? '',
                ownerName: data?.ownerName ?? '',
                ownerPhone: data?.ownerPhone ?? '',
                model: data?.model ?? '',
            });
        }

        execute().then(() => setInitializing(false));

        return () => {
            setInitializing(true);
        };
    }, [id]);

    const fetchVehicles = async () => {
        const { status, data, reason } = await get<Vehicle[]>('/vehicles');
        if (!status && reason) return showError(reason);

        if (data) setVehicles(data);
    };

    const onSubmit = async (data: CreateVehicleData) => {
        const { status, reason } = isCreate
            ? await post('/vehicles', data)
            : await patch(`/vehicles/${id}`, data);
        if (status) {
            fetchVehicles();

            return requestClose();
        }

        if (reason) showError(reason);
    };

    return (
        <Modal
            className="w-1/2"
            name="vehicle"
            header={id ? `Редактирование ТС ${plateNumber}` : 'Добавление ТС'}
        >
            <form className="p-6 flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Рег. номер ТС"
                    name="plateNumber"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <Input
                    label="Имя владельца"
                    name="ownerName"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <Input
                    label="Номер телефона владельца"
                    name="ownerPhone"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <Input
                    label="Марка ТС"
                    name="model"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <Button
                    loading={isPending}
                    type="submit"
                    label="Сохранить"
                    disabled={!isValid || initializing}
                />
            </form>
        </Modal>
    );
}
