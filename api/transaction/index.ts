import { axiosInstance } from "../axios"
import { TableResponse, TransactionResponse } from "../types";
import { ViewScope } from "@/contexts/profile-context";

export const getTransactionById = async (id: string, scope: ViewScope = "profile") => {
    return axiosInstance.get(`/transaction/${id}`, {
        params: { scope }
    })
}

export interface TableFilter {
    cursor?: string | null;
    limit?: number;
    filter?: string;
}

export interface GetTransactionParams extends TableFilter {
    page?: number;
    limit?: number;
    scope?: ViewScope;
    filters? : { [key: string]: string | number | boolean };
}

export const getTransactions = async (params: GetTransactionParams): Promise<TableResponse<TransactionResponse>> => {
    const { filters, ...rest } = params
    return axiosInstance.get<TableResponse<TransactionResponse>, any>('/v2/transactions', {
        params: {
            ...rest,
            ...filters
        }
    })
}

type BaseTransaction = {
    _id: string;
    type: string;
    category: string;
    partner: string;
    amount: number | string;
    description?: string;
    isDone?: boolean;
    date?: string;
}

type CreateTransaction = Omit<BaseTransaction, '_id'>
export const createTransaction = async (transaction: CreateTransaction) => {
    return axiosInstance.post('/v2/transactions', transaction)
}

type UpdateTransaction = BaseTransaction
export const updateTransaction = async (transaction: UpdateTransaction) => {
    return axiosInstance.put(`/v2/transactions/${transaction._id}`, transaction)
}

export const deleteTransaction = async (id: string) => {
    return axiosInstance.delete(`/v2/transactions/${id}`)
}

type StatisticWeeklyResponse = {
    scope: ViewScope;
    labels: string[];
    datasets: [
        {
            label: string;
            data: number[];
            backgroundColor: string;
        }
    ]
}
export const statisticWeekly = async (scope: ViewScope = "profile") => {
    return axiosInstance.get<any, StatisticWeeklyResponse>(`/v2/transactions/statistic/weekly`, {
        params: { scope }
    })
}

type StatisticMonthlyResponse = {
    scope: ViewScope;
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string;
    }>;
}
export const statisticMonthly = async (scope: ViewScope = "profile") => {
    return axiosInstance.get<any, StatisticMonthlyResponse>(`/v2/transactions/statistic/monthly`, {
        params: { scope }
    })
}

type StatisticMonthResponse = {
    scope: ViewScope;
    data: Array<{
        name: string;
        totalAmount: number;
        color?: string;
    }>;
}
export const statisticMonth = async (month: number, scope: ViewScope = "profile") => {
    return axiosInstance.get<any, StatisticMonthResponse>(`/v2/transactions/statistic/month`, {
        params: { month, scope }
    })
}
