import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getTransactionById, GetTransactionParams, getTransactions, statisticMonth, statisticMonthly, statisticWeekly } from "./transaction";
import { getAllTypes, getProfiles, whoami } from "./user";
import { Transaction } from "@/lib/types";
import { getAllCategories } from "./category";
import { getAllPartners } from "./partners";
import { FIVE_MINUTE_MILL, ONE_HOUR_MILL } from "@/utils/constants/variables";
import { TableResponse } from "./types";
export const keys = {
  all: ["all"],
  user: ["user"],
  userWhoami: () => [...keys.all, "user", "whoami"],
  userProfiles: () => [...keys.all, "user", "profiles"],
  transaction: (id: string) => [...keys.all, "transaction", id],
  transactions: (query?: GetTransactionParams) => [...keys.all, "transactions", JSON.stringify(query || {})],
  transactions_statistic_weekly: () => [...keys.transactions(), "statistic", "weekly"],
  transactions_statistic_monthly: () => [...keys.transactions(), "statistic", "monthly"],
  transactions_statistic_month: (month: number) => [...keys.transactions(), "statistic", "month", month],
  category: (id: string) => [...keys.all, "category", id],
  partner: (id: string) => [...keys.all, "partner", id],
  types: () => [...keys.all, "types"],
  categories: () => [...keys.all, "categories"],
  partners: () => [...keys.all, "partners"],
};

export const query = {
  user: {
    whoami: () =>
      queryOptions({
        queryKey: keys.userWhoami(),
        queryFn: whoami,
      }),
    profiles: () =>
      queryOptions({
        queryKey: keys.userProfiles(),
        queryFn: getProfiles,
      }),
  },
  type: {
    getAll: () =>
      queryOptions({
        queryKey: keys.types(),
        queryFn: getAllTypes,
        staleTime: ONE_HOUR_MILL,
      }),
  },
  category: {
    getAll: () =>
      queryOptions({
        queryKey: keys.categories(),
        queryFn: getAllCategories,
        staleTime: ONE_HOUR_MILL,
      }),
  },
  partner: {
    getAll: () =>
      queryOptions({
        queryKey: keys.partners(),
        queryFn: getAllPartners,
        staleTime: ONE_HOUR_MILL,
      }),
  },
  transaction: {
    getById: (id: string) =>
      queryOptions({
        queryKey: keys.transaction(id),
        queryFn: () => getTransactionById(id),
      }),
    getAllTransaction: (query: GetTransactionParams) =>
      infiniteQueryOptions({
        queryKey: keys.transactions(query),
        queryFn: ({ pageParam }: { pageParam: string | null }) => getTransactions({ cursor: pageParam, ...query }),
        initialPageParam: null,
        staleTime: FIVE_MINUTE_MILL,
        getNextPageParam: (lastPage: TableResponse<Transaction> | any) => {
          return lastPage?.nextCursor || null;
        },
      }),
    statistic: {
      weekly: () =>
        queryOptions({
          queryKey: keys.transactions_statistic_weekly(),
          queryFn: () => statisticWeekly(),
        }),
      monthly: () =>
        queryOptions({
          queryKey: keys.transactions_statistic_monthly(),
          queryFn: () => statisticMonthly(),
        }),
      month: (month: number) =>
        queryOptions({
          queryKey: keys.transactions_statistic_month(month),
          queryFn: () => statisticMonth(month),
        }),
    },
  },
};
