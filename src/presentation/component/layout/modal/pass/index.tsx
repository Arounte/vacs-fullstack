import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import { usePassStore } from '@/data/pass';
import { useAdminSessionStore } from '@/data/session/store';
import { useVehicleStore } from '@/data/vehicle/store';
import { Role } from '@/domain/session';
import type { Pass } from '@/framework/db/schema';
import { Calendar } from '@/presentation/component/form/calendar';
import { Select } from '@/presentation/component/form/select';
import { Switch } from '@/presentation/component/form/switch';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { valibotResolver } from '@hookform/resolvers/valibot';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Modal } from '../common';
import { type PassFormData, PassFormSchema } from './types';

export default function PassModal() {
    const { requestClose, getProps } = useModalStore();
    const { role } = useAdminSessionStore();
    const { setPasses } = usePassStore();
    const { checkpoints } = useCheckpointStore();
    const { vehicles } = useVehicleStore();
    const { id } = getProps('pass') ?? {};
    const isCreate = !id;
    const isAdmin = role === Role.Admin;
    const [initializing, setInitializing] = useState(true);
    const { control, handleSubmit, reset } = useForm<PassFormData>({
        defaultValues: {
            checkpointId: '',
            vehicleId: '',
            isActive: true,
            validFrom: dayjs().toDate(),
            validTo: dayjs().toDate(),
        },
        resolver: valibotResolver(PassFormSchema),
    });
    const { isValid } = useFormState({ control });
    const { get, post, patch, del, isPending } = useAPI();
    const { showError } = useToast();
    const checkpointOptions = useMemo(
        () =>
            checkpoints.map(({ id, name }) => ({
                value: id,
                label: name,
            })),
        [checkpoints],
    );
    const vehicleOptions = useMemo(
        () =>
            vehicles.map(({ id, plateNumber }) => ({
                value: id,
                label: plateNumber,
            })),
        [vehicles],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    useEffect(() => {
        if (!id) return setInitializing(false);

        async function execute() {
            const { status, data, reason } = await get<Pass>(`/passes/${id}`);
            if (!status && reason) {
                return showError(reason);
            }

            reset({
                checkpointId: data?.checkpointId,
                vehicleId: data?.vehicleId,
                isActive: data?.isActive,
                validFrom: data?.validFrom ? new Date(data.validFrom) : undefined,
                validTo: data?.validTo ? new Date(data.validTo) : undefined,
            });
        }

        execute().then(() => setInitializing(false));

        return () => setInitializing(true);
    }, [id]);

    const fetchPasses = async () => {
        const { status, data, reason } = await get<Pass[]>('/passes');
        if (!status && reason) {
            return showError(reason);
        }

        if (data) {
            setPasses(data);
        }
    };

    const onSubmit = async (data: PassFormData) => {
        const { status, reason } = isCreate
            ? await post(`/passes`, data)
            : await patch(`/passes/${id}`, data);
        if (status) {
            fetchPasses();

            return requestClose();
        }

        if (reason) showError(reason);
    };

    const onDelete = async (id: string) => {
        const { status, reason } = await del(`/passes/${id}`);
        if (!status && reason) return showError(reason);

        if (status) {
            fetchPasses();

            return requestClose();
        }
    };

    return (
        <Modal
            className="w-1/2"
            name="pass"
            header={id ? 'Редактирование пропуска' : 'Создание пропуска'}
        >
            <form className="p-6 flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
                <Select
                    name="vehicleId"
                    control={control}
                    label="Номер ТС"
                    initializing={initializing}
                    options={vehicleOptions}
                    disabled={!isAdmin}
                />
                <Select
                    name="checkpointId"
                    control={control}
                    label="Пропускной пункт"
                    initializing={initializing}
                    options={checkpointOptions}
                    disabled={!isAdmin}
                />
                <Calendar
                    name="validFrom"
                    control={control}
                    label="Начало действия"
                    initializing={initializing}
                    disabled={!isAdmin}
                />
                <Calendar
                    name="validTo"
                    control={control}
                    label="Окончание действия"
                    initializing={initializing}
                    disabled={!isAdmin}
                />
                {!isCreate && (
                    <Switch
                        label="Активен"
                        name="isActive"
                        control={control}
                        disabled={initializing || !isAdmin}
                    />
                )}
                <div className="grid gap-4 grid-flow-col">
                    {!isCreate && (
                        <Button
                            type="button"
                            loading={isPending}
                            severity="danger"
                            label="Удалить"
                            icon="pi pi-trash"
                            disabled={initializing || !isAdmin}
                            onClick={() => onDelete(id)}
                        />
                    )}
                    <Button
                        loading={isPending}
                        type="submit"
                        label="Сохранить"
                        disabled={!isValid || initializing || !isAdmin}
                    />
                </div>
            </form>
        </Modal>
    );
}
