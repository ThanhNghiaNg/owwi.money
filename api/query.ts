import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getTransactionById, GetTransactionParams, getTransactions, statisticMonth, statisticMonthly, statisticWeekly } from "./transaction";
import { getAllTypes, whoami } from "./user";
import { Transaction } from "@/lib/types";
import { getAllCategories } from "./category";
import { getAllPartners } from "./partners";
import { createProfile, deleteProfile, getActiveProfile, getProfiles, selectProfile, updateProfile } from "./profile";
import { FIVE_MINUTE_MILL, ONE_HOUR_MILL } from "@/utils/constants/variables";
import { TableResponse } from "./types";
import { ViewScope } from "@/contexts/profile-context";

export const keys = {
    all: ['all'],
    user: ['user'],
    userWhoami: () => [...keys.all, 'user', 'whoami'],
    transaction: (id: string, scope: ViewScope = "profile") => [...keys.all, 'transaction', id, scope],
    transactions: (query?: GetTransactionParams) => [...keys.all, 'transactions', JSON.stringify(query || {})],
    transactions_statistic_weekly: (scope: ViewScope = "profile") => [...keys.all, 'transactions', 'statistic', 'weekly', scope],
    transactions_statistic_monthly: (scope: ViewScope = "profile") => [...keys.all, 'transactions', 'statistic', 'monthly', scope],
    transactions_statistic_month: (month: number, scope: ViewScope = "profile") => [...keys.all, 'transactions', 'statistic', 'month', month, scope],
    category: (id: string) => [...keys.all, 'category', id],
    partner: (id: string) => [...keys.all, 'partner', id],
    types: () => [...keys.all, 'types'],
    categories: () => [...keys.all, 'categories'],
    partners: () => [...keys.all, 'partners'],
    profiles: () => [...keys.all, 'profiles'],
    activeProfile: () => [...keys.all, 'profiles', 'active'],
}

export const query = {
    user: {
        whoami: () => queryOptions({
            queryKey: keys.userWhoami(),
            queryFn: whoami,
        })
    },
    type: {
        getAll: () => queryOptions({
            queryKey: keys.types(),
            queryFn: getAllTypes,
            staleTime: ONE_HOUR_MILL,
        })
    },
    category: {
        getAll: () => queryOptions({
            queryKey: keys.categories(),
            queryFn: getAllCategories,
            staleTime: ONE_HOUR_MILL,
        })
    },
    partner: {
        getAll: () => queryOptions({
            queryKey: keys.partners(),
            queryFn: getAllPartners,
            staleTime: ONE_HOUR_MILL,
        })
    },
    profile: {
        getAll: () => queryOptions({
            queryKey: keys.profiles(),
            queryFn: getProfiles,
        }),
        active: () => queryOptions({
            queryKey: keys.activeProfile(),
            queryFn: getActiveProfile,
        }),
    },
    transaction: {
        getById: (id: string, scope: ViewScope = "profile") =>
            queryOptions({
                queryKey: keys.transaction(id, scope),
                queryFn: () => getTransactionById(id, scope),
            }),
        getAllTransaction: (queryParams: GetTransactionParams) => infiniteQueryOptions({
            queryKey: keys.transactions(queryParams),
            queryFn: ({ pageParam }: { pageParam: string | null }) => getTransactions({ cursor: pageParam, ...queryParams }),
            initialPageParam: null,
            staleTime: FIVE_MINUTE_MILL,
            getNextPageParam: (lastPage: TableResponse<Transaction> | any) => {
                return lastPage?.nextCursor || null
            },
        }),
        statistic: {
            weekly: (scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_weekly(scope),
                    queryFn: () => statisticWeekly(scope),
                }),
            monthly: (scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_monthly(scope),
                    queryFn: () => statisticMonthly(scope),
                }),
            month: (month: number, scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_month(month, scope),
                    queryFn: () => statisticMonth(month, scope),
                }),
        }
    },
};

export const profileApi = {
    getProfiles,
    getActiveProfile,
    selectProfile,
    createProfile,
    updateProfile,
    deleteProfile,
}
