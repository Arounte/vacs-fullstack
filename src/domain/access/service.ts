import ApiError from '@/framework/backend/apiError';
import type { AccessEvent, Pass, Vehicle } from '@/framework/db/schema';
import dayjs from 'dayjs';
import * as v from 'valibot';
import {
    type AccessEventRequestResponse,
    AllowDataSchema,
    DenyDataSchema,
    type InvalidRequest,
    RequestDataSchema,
    type ValidRequest,
} from '.';
import { type CheckpointService, checkpointService } from '../checkpoint/service';
import { type PassService, passService } from '../pass/service';
import { type VehicleService, vehicleService } from '../vehicle/service';
import { type AccessEventRepository, accessEventRepository } from './repository';

export class AccessEventService {
    constructor(
        private readonly accessEventRepository: AccessEventRepository,
        private readonly vehicleService: VehicleService,
        private readonly checkpointService: CheckpointService,
        private readonly passService: PassService,
    ) {}

    private readonly validRequests = new Map<string, ValidRequest>();

    private readonly invalidRequests = new Map<string, InvalidRequest>();

    private createKey(plateNumber: string, checkpointId: string) {
        return `${plateNumber.toUpperCase()}:${checkpointId.toLowerCase()}`;
    }

    private createValidRequest(
        key: string,
        now: Date,
        checkpointName: string,
        vehicle: Vehicle | null,
        pass: Pass | null,
    ) {
        this.validRequests.set(key, {
            expires: dayjs(now).add(1, 'minute').toDate(),
            checkpointName: checkpointName,
            vehicle,
            pass,
        });
    }

    private createInvalidRequest(
        key: string,
        now: Date,
        checkpointName: string,
        vehicle: Vehicle | null,
        reason: string,
    ) {
        this.invalidRequests.set(key, {
            expires: dayjs(now).add(1, 'minute').toDate(),
            checkpointName: checkpointName,
            vehicle,
            reason,
        });
    }

    async request(data: unknown): Promise<AccessEventRequestResponse> {
        const parsed = v.parse(RequestDataSchema, data);
        const checkpoint = await this.checkpointService.getById(parsed.checkpointId);
        if (!checkpoint) throw new ApiError('checkpoint_not_found');

        const now = new Date();
        const key = this.createKey(parsed.plateNumber, parsed.checkpointId);
        const validRequest = this.validRequests.get(key);
        if (validRequest) {
            if (dayjs(validRequest.expires).isBefore(now)) {
                this.validRequests.delete(key);
            } else {
                return {
                    isValid: true,
                    reason: null,
                    vehicle: validRequest.vehicle,
                    pass: validRequest.pass,
                };
            }
        }

        const invalidRequest = this.invalidRequests.get(key);
        if (invalidRequest) {
            if (dayjs(invalidRequest.expires).isBefore(now)) {
                this.invalidRequests.delete(key);
            } else {
                return {
                    isValid: false,
                    reason: invalidRequest.reason,
                    vehicle: invalidRequest.vehicle,
                    pass: null,
                };
            }
        }

        if (parsed.plateNumber && !parsed.isEmergency) {
            const vehicle = await this.vehicleService.getByPlateNumber(parsed.plateNumber);
            if (!vehicle) {
                this.createInvalidRequest(key, now, checkpoint.name, null, 'vehicle_not_found');

                return {
                    isValid: false,
                    reason: 'vehicle_not_found',
                    vehicle: null,
                    pass: null,
                };
            }

            const pass = await this.passService.getValid(
                parsed.checkpointId,
                vehicle.id,
                new Date(),
            );
            if (!pass) {
                this.createInvalidRequest(key, now, checkpoint.name, vehicle, 'pass_not_found');

                return {
                    isValid: false,
                    reason: 'pass_not_found',
                    vehicle: vehicle,
                    pass: null,
                };
            }

            this.createValidRequest(key, now, checkpoint.name, vehicle, pass);

            return {
                isValid: true,
                reason: null,
                vehicle,
                pass,
            };
        }

        if (parsed.plateNumber && parsed.isEmergency) {
            this.createValidRequest(key, now, checkpoint.name, null, null);

            return {
                isValid: true,
                reason: null,
                vehicle: null,
                pass: null,
            };
        }

        return {
            isValid: false,
            reason: null,
            vehicle: null,
            pass: null,
        };
    }

    async allow(data: unknown): Promise<AccessEvent> {
        const parsed = v.parse(AllowDataSchema, data);
        const now = new Date();
        const key = this.createKey(parsed.plateNumber, parsed.checkpointId);
        const request = this.validRequests.get(key);
        if (!request) throw new ApiError('request_not_found');
        if (request) {
            if (dayjs(request.expires).isBefore(now)) {
                this.validRequests.delete(key);

                throw new ApiError('request_expired');
            }
        }

        const hasAccessEvents = await this.accessEventRepository.hasVehicleAccessEvents(
            parsed.checkpointId,
            parsed.plateNumber,
        );
        if (hasAccessEvents) {
            const lastEvent = await this.accessEventRepository.findLast(
                parsed.checkpointId,
                parsed.plateNumber,
            );
            if (lastEvent?.eventType === parsed.event) {
                throw new ApiError('last_event_matches_the_incoming_one');
            }
        }

        const result = await this.accessEventRepository.create({
            userId: parsed.userId,
            username: parsed.username,
            passId: request.pass?.id ?? null,
            vehicleId: request.vehicle?.id ?? null,
            checkpointId: parsed.checkpointId,
            plateNumber: parsed.plateNumber,
            vehicleModel: request.vehicle ? request.vehicle.model : 'Экстренные службы',
            checkpointName: request.checkpointName,
            eventType: parsed.event,
            timestamp: now,
            result: 'allowed',
        });

        this.validRequests.delete(key);

        return result;
    }

    async deny(data: unknown): Promise<AccessEvent> {
        const parsed = v.parse(DenyDataSchema, data);
        const now = new Date();
        const key = this.createKey(parsed.plateNumber, parsed.checkpointId);
        const request = this.invalidRequests.get(key);
        if (!request) throw new ApiError('request_not_found');
        if (request) {
            if (dayjs(request.expires).isBefore(now)) {
                this.invalidRequests.delete(key);

                throw new ApiError('request_expired');
            }
        }

        const result = await this.accessEventRepository.create({
            userId: parsed.userId,
            username: parsed.username,
            passId: null,
            vehicleId: request.vehicle?.id ?? null,
            checkpointId: parsed.checkpointId,
            plateNumber: parsed.plateNumber,
            vehicleModel: request.vehicle?.model ?? null,
            checkpointName: request.checkpointName,
            timestamp: now,
            result: 'denied',
        });

        this.invalidRequests.delete(key);

        return result;
    }
}

export const accessEventService = new AccessEventService(
    accessEventRepository,
    vehicleService,
    checkpointService,
    passService,
);
