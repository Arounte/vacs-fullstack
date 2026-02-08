export type AccessLog = {
    plateNumber: string;
    eventType: 'in' | 'out' | 'denied';
    reason?: string;
    timestamp: Date;
};
