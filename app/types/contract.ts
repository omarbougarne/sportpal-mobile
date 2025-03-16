import { User } from './user';
import { Trainer } from './trainer';
import { Workout } from './workout/workout';

export enum ContractStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}

export interface Contract {
    _id: string | undefined;
    clientId: string | User;
    trainerId: string | Trainer;
    status: ContractStatus;
    startDate: string | Date;
    endDate?: string | Date;
    totalSessions: number;
    completedSessions: number;
    hourlyRate: number;
    notes?: string;
    workouts?: string[] | Workout[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateContractRequest {
    trainerId: string;
    startDate: Date | string;
    endDate?: Date | string;
    totalSessions: number;
    notes?: string;
}

export interface UpdateContractStatusRequest {
    status: ContractStatus;
}