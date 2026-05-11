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
import { createSnapshotKey, readSnapshot, writeSnapshot } from "@/lib/query-snapshot";
import { getSixJarsConfig, getSixJarsMonthStatistic } from "./six-jars";

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
    sixJarsConfig: () => [...keys.all, 'six-jars', 'config'],
    sixJarsMonthStatistic: (month: number, year: number) => [...keys.all, 'six-jars', 'statistic', 'month', month, year],
};

const snapshotKeys = {
    types: () => createSnapshotKey(['types']),
    categories: () => createSnapshotKey(['categories']),
    partners: () => createSnapshotKey(['partners']),
    transactionsStatisticWeekly: (scope: ViewScope) => createSnapshotKey(['transactions-statistic', 'weekly', scope]),
    transactionsStatisticMonthly: (scope: ViewScope) => createSnapshotKey(['transactions-statistic', 'monthly', scope]),
    transactionsStatisticMonth: (month: number, scope: ViewScope) => createSnapshotKey(['transactions-statistic', 'month', month, scope]),
};

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
            queryFn: async () => {
                const data = await getAllTypes();
                writeSnapshot(snapshotKeys.types(), data);
                return data;
            },
            placeholderData: () => readSnapshot(snapshotKeys.types()),
            staleTime: ONE_HOUR_MILL,
        })
    },
    category: {
        getAll: () => queryOptions({
            queryKey: keys.categories(),
            queryFn: async () => {
                const data = await getAllCategories();
                writeSnapshot(snapshotKeys.categories(), data);
                return data;
            },
            placeholderData: () => readSnapshot(snapshotKeys.categories()),
            staleTime: ONE_HOUR_MILL,
        })
    },
    partner: {
        getAll: () => queryOptions({
            queryKey: keys.partners(),
            queryFn: async () => {
                const data = await getAllPartners();
                writeSnapshot(snapshotKeys.partners(), data);
                return data;
            },
            placeholderData: () => readSnapshot(snapshotKeys.partners()),
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
    sixJars: {
        config: () => queryOptions({
            queryKey: keys.sixJarsConfig(),
            queryFn: getSixJarsConfig,
        }),
        monthStatistic: (month: number, year: number) => queryOptions({
            queryKey: keys.sixJarsMonthStatistic(month, year),
            queryFn: () => getSixJarsMonthStatistic(month, year),
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
                return lastPage?.nextCursor || null;
            },
        }),
        statistic: {
            weekly: (scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_weekly(scope),
                    queryFn: async () => {
                        const data = await statisticWeekly(scope);
                        writeSnapshot(snapshotKeys.transactionsStatisticWeekly(scope), data);
                        return data;
                    },
                    placeholderData: () => readSnapshot(snapshotKeys.transactionsStatisticWeekly(scope)),
                }),
            monthly: (scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_monthly(scope),
                    queryFn: async () => {
                        const data = await statisticMonthly(scope);
                        writeSnapshot(snapshotKeys.transactionsStatisticMonthly(scope), data);
                        return data;
                    },
                    placeholderData: () => readSnapshot(snapshotKeys.transactionsStatisticMonthly(scope)),
                }),
            month: (month: number, scope: ViewScope = "profile") =>
                queryOptions({
                    queryKey: keys.transactions_statistic_month(month, scope),
                    queryFn: async () => {
                        const data = await statisticMonth(month, scope);
                        writeSnapshot(snapshotKeys.transactionsStatisticMonth(month, scope), data);
                        return data;
                    },
                    placeholderData: () => readSnapshot(snapshotKeys.transactionsStatisticMonth(month, scope)),
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
};
