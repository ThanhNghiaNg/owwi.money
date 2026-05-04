export type TableResponse<T> = {
    data: T[];
    nextCursor: string | null,
    hasNextPage: boolean;
    limit?: number;
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
    amount: number;
    description: string;
    isDone: boolean;
    date: string;
    createdByProfile?: {
        profileId: string;
        name: string;
    };
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
