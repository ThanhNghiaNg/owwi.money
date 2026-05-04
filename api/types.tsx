export type TableResponse<T> = {
    data: T[];
    nextCursor: string | null,
    hasNextPage: boolean;
    limit?: number;
}

export type ProfileResponse = {
    _id: string;
    name: string;
    avatarUrl?: string;
    color?: string;
    isDefault: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export type AuthUserResponse = {
    _id: string;
    username: string;
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
    isAdmin: boolean;
}

export type AuthPayload = {
    user: AuthUserResponse;
    profiles: ProfileResponse[];
    activeProfileId: string | null;
    needsProfileSelection: boolean;
}

export interface TransactionResponse {
    _id: string;
    type: {
        _id: string;
        name: string;
    };
    category: {
        _id: string;
        name: string;
    };
    partner: {
        _id: string;
        name: string;
    };
    createdByProfile?: {
        _id: string;
        name: string;
        avatarUrl?: string;
        color?: string;
    };
    amount: number;
    description: string;
    isDone: boolean;
    date: string;
}

export type PartnerResponse = {
    _id: string;
    name: string;
    type: {
        _id: string;
        name: string;
    },
    description?: string;
}

export type TypeResponse = {
    _id: string;
    name: string;
    description?: string;
}

export type CategoryResponse = {
    _id: string;
    name: string;
    type: {
        _id: string;
        name: string;
    },
    description?: string;
}
