import { useAccessStore } from '@/data/access';
import { useModalStore } from '@/data/modal';
import type { AccessEventRequestResponse } from '@/domain/access';
import type { AccessEvent, Pass, Vehicle } from '@/framework/db/schema';
import { useToast } from '@/presentation/context/toast';
import { useAPI } from '@/presentation/hooks/useAPI';
import dayjs from 'dayjs';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from '../common';

const MAP_REASON_TO_MESSAGE: Record<string, string> = {
    vehicle_not_found: 'Автомобиль не зарегистрирован в системе',
    pass_not_found: 'Для автомобиля нет действительного пропуска',
};

export default function AccessModal() {
    const { requestClose, getProps } = useModalStore();
    const { add } = useAccessStore();
    const { plateNumber, checkpointId, isEmergency } = getProps('access') ?? {};
    const [initializing, setInitializing] = useState(true);
    const { post } = useAPI();
    const { showError, showSuccess, showWarn } = useToast();
    const [response, setResponse] = useState<AccessEventRequestResponse | null>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    useEffect(() => {
        if (!plateNumber || !checkpointId || isEmergency === undefined) return requestClose();

        async function execute() {
            const { status, data, reason } = await post<AccessEventRequestResponse>(
                '/access/request',
                {
                    plateNumber,
                    checkpointId,
                    isEmergency,
                },
            );
            if (!status && reason) {
                showError(reason);
                return requestClose();
            }

            if (data) {
                setResponse(data);
            } else {
                return requestClose();
            }
        }

        execute().then(() => setInitializing(false));

        return () => setInitializing(true);
    }, [plateNumber, checkpointId, isEmergency]);

    const renderVehicle = (v: Vehicle) => (
        <div className="flex flex-col text-center">
            <span>Рег. номер ТС: {v.plateNumber}</span>
            {v.model && <span>Марка/модель ТС: {v.model}</span>}
            <span>Имя владельца ТС: {v.ownerName}</span>
            <span>Телефон владельца ТС: {v.ownerPhone}</span>
        </div>
    );

    const renderPass = (p: Pass) => (
        <div className="flex flex-col text-center">
            <span>Пропуск действителен с: {dayjs(p.validFrom).format('DD.MM.YYYY HH:mm:ss')}</span>
            <span>Пропуск действителен до: {dayjs(p.validTo).format('DD.MM.YYYY HH:mm:ss')}</span>
        </div>
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    const allow = useCallback(
        async (event: NonNullable<AccessEvent['eventType']>) => {
            const { status, reason } = await post('/access/allow', {
                plateNumber,
                checkpointId,
                event,
            });

            if (!status && reason) {
                requestClose();
                return showError(reason);
            }

            if (status) {
                showSuccess(`${event === 'in' ? 'Въезд' : 'Выезд'} зафиксирован`);
                add({
                    eventType: event,
                    plateNumber: plateNumber ?? '',
                    timestamp: new Date(),
                    reason: isEmergency ? 'Экстренные службы' : undefined,
                });
                requestClose();
            }
        },
        [plateNumber, checkpointId],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: .
    const deny = useCallback(async () => {
        const { status, reason } = await post('/access/deny', {
            plateNumber,
            checkpointId,
        });
        if (!status && reason) {
            requestClose();
            return showError(reason);
        }

        if (status) {
            showWarn('Отказ зафиксирован');
            add({
                eventType: 'denied',
                plateNumber: plateNumber ?? '',
                timestamp: new Date(),
                reason: response?.reason ? MAP_REASON_TO_MESSAGE[response.reason] : undefined,
            });
            requestClose();
        }
    }, [plateNumber, checkpointId, response]);

    return (
        <Modal className="w-1/2 flex" name="access" header="Пропуск" closable={false}>
            {initializing && <ProgressSpinner />}
            {response && (
                <div className="min-h-52 flex flex-col items-center justify-around gap-6">
                    {response.isValid ? (
                        <i
                            className="pi pi-check-circle text-green-500"
                            style={{ fontSize: '3rem' }}
                        ></i>
                    ) : (
                        <i className="pi pi-ban text-red-500" style={{ fontSize: '3rem' }}></i>
                    )}
                    <p>
                        {response.reason
                            ? MAP_REASON_TO_MESSAGE[response.reason]
                            : 'Автомобиль имеет действительный пропуск'}
                    </p>
                    {response.vehicle && renderVehicle(response.vehicle)}
                    {response.pass && renderPass(response.pass)}
                    {!response.isValid ? (
                        <Button
                            severity="danger"
                            icon="pi pi-times"
                            label="Зафиксировать отказ"
                            onClick={deny}
                        />
                    ) : (
                        <div className="grid grid-flow-col gap-4">
                            <Button
                                severity="warning"
                                icon="pi pi-arrow-down"
                                label="Зафиксировать выезд"
                                onClick={() => allow('out')}
                            />
                            <Button
                                severity="success"
                                icon="pi pi-arrow-up"
                                label="Зафиксировать въезд"
                                onClick={() => allow('in')}
                            />
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}
