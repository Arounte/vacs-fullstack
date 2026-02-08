import type { ReasonT } from '@/helper/reason';

export default class ApiError {
    constructor(public readonly reason: ReasonT) {}
}
