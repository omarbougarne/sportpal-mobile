export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    level: string,
    availability: string,
    accountStatus: string,
    isTrainer: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
}