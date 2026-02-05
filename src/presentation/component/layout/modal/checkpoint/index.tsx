import { useCheckpointStore } from '@/data/checkpoint/store';
import { useModalStore } from '@/data/modal';
import { type CreateCheckpointData, CreateCheckpointSchema } from '@/domain/checkpoint';
import type { Checkpoint } from '@/framework/db/schema';
import { Input } from '@/presentation/component/form/input';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { Modal } from '../common';

export default function CheckpointModal() {
    const { requestClose, getProps } = useModalStore();
    const { setCheckpoints } = useCheckpointStore();
    const { id } = getProps('checkpoint') ?? {};
    const isCreate = !id;
    const [initializing, setInitializing] = useState(true);
    const { control, handleSubmit, reset, watch } = useForm<CreateCheckpointData>({
        defaultValues: {
            name: '',
        },
        resolver: valibotResolver(CreateCheckpointSchema),
    });
    const { isValid } = useFormState({ control });
    const { get, post, patch, del, isPending } = useAPI();
    const { showError } = useToast();
    const name = watch('name');

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    useEffect(() => {
        if (!id) return setInitializing(false);

        async function execute() {
            const { status, data, reason } = await get<Checkpoint>(`/checkpoints/${id}`);
            if (!status && reason) return showError(reason);

            reset({
                name: data?.name ?? '',
            });
        }

        execute().then(() => setInitializing(false));

        return () => setInitializing(true);
    }, [id]);

    const fetchCheckpoints = async () => {
        const { status, data, reason } = await get<Checkpoint[]>('/checkpoints');
        if (!status && reason) return showError(reason);

        if (data) setCheckpoints(data);
    };

    const onSubmit = async (data: CreateCheckpointData) => {
        const { status, reason } = isCreate
            ? await post('/checkpoints', data)
            : await patch(`/checkpoints/${id}`, data);
        if (status) {
            fetchCheckpoints();
            return requestClose();
        }

        if (reason) showError(reason);
    };

    const onDelete = async (id: string) => {
        const { status, reason } = await del(`/checkpoints/${id}`);
        if (!status && reason) return showError(reason);

        if (status) {
            fetchCheckpoints();
            
            return requestClose();
        }
    };

    return (
        <Modal
            className="w-1/2"
            name="checkpoint"
            header={id ? `Редактирование КПП ${name}` : 'Добавление КПП'}
        >
            <form className="p-6 flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Наименование"
                    name="name"
                    control={control}
                    initializing={initializing}
                    autoComplete="off"
                />
                <div className="grid gap-4 grid-flow-col">
                    {!isCreate && (
                        <Button
                            type="button"
                            loading={isPending}
                            severity="danger"
                            label="Удалить"
                            icon="pi pi-trash"
                            disabled={initializing}
                            onClick={() => onDelete(id)}
                        />
                    )}
                    <Button
                        loading={isPending}
                        type="submit"
                        label="Сохранить"
                        icon="pi pi-check-circle"
                        disabled={!isValid || initializing}
                    />
                </div>
            </form>
        </Modal>
    );
}
