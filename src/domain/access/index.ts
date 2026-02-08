import type { Pass, Vehicle } from '@/framework/db/schema';
import {
    getPlateNumberValidationSchema,
    getStringValidationSchema,
} from '@/helper/validation/rules';
import * as v from 'valibot';

export const RequestDataSchema = v.object({
    isEmergency: v.boolean(),
    checkpointId: getStringValidationSchema(),
    plateNumber: getPlateNumberValidationSchema(),
});

export const AllowDataSchema = v.object({
    userId: getStringValidationSchema(),
    username: getStringValidationSchema(),
    checkpointId: getStringValidationSchema(),
    plateNumber: getPlateNumberValidationSchema(),
    event: v.union([v.literal('in'), v.literal('out')]),
});

export const DenyDataSchema = v.object({
    userId: getStringValidationSchema(),
    username: getStringValidationSchema(),
    checkpointId: getStringValidationSchema(),
    plateNumber: getPlateNumberValidationSchema(),
});

export type AccessEventRequestResponse = {
    isValid: boolean;
    reason: string | null;
    vehicle: Vehicle | null;
    pass: Pass | null;
};

export type ValidRequest = {
    expires: Date;
    checkpointName: string;
    vehicle: Vehicle | null;
    pass: Pass | null;
};

export type InvalidRequest = {
    expires: Date;
    checkpointName: string;
    vehicle: Vehicle | null;
    reason: string;
};
