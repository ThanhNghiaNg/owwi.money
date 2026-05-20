import { useMutation } from "@tanstack/react-query";
import { forgotPassword, googleLogin, linkGoogle, resetPassword, unlinkGoogle, userLogin, userLogout, userRegister } from "./user";
import { createTransaction, deleteTransaction, updateTransaction } from "./transaction";
import queryClient from "./queryClient";
import { keys as queryKeys } from "./query";
import { createPartner, deletePartner, updatePartner } from "./partners";
import { createCategory, deleteCategory, updateCategory } from "./category";
import { createProfile, deleteProfile, selectProfile, updateProfile } from "./profile";
import { updateSixJarsConfig } from "./six-jars";
import { createQuickTransactionSetup, deleteQuickTransactionSetup, updateQuickTransactionSetup } from "./quick-transaction-setup";

const clearTransactionStatisticCaches = async () => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }

  const cacheKeys = await window.caches.keys();
  await Promise.all(
    cacheKeys
      .filter((cacheName) => cacheName.startsWith("transaction-statistics-"))
      .map((cacheName) => window.caches.delete(cacheName))
  );
};

const invalidateTransactionQueries = async (queryKey?: object) => {
  await clearTransactionStatisticCaches();

  await Promise.all([
    queryClient.removeQueries({
      queryKey: [...queryKeys.all, "transactions", "statistic"]
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.transactions(queryKey)
    }),
    queryClient.invalidateQueries({
      queryKey: [...queryKeys.all, "transactions"]
    }),
    queryClient.invalidateQueries({
      queryKey: [...queryKeys.all, "transaction"]
    }),
    queryClient.invalidateQueries({
      queryKey: [...queryKeys.all, "transactions", "statistic"]
    }),
  ]);
};

export const MutationKey = {
  user: {
    mutation: ["user-mutation"],
    login: () => [...MutationKey.user.mutation, "login"],
    logout: () => [...MutationKey.user.mutation, "logout"],
    register: () => [...MutationKey.user.mutation, "register"],
    forgotPassword: () => [...MutationKey.user.mutation, "forgot-password"],
    resetPassword: () => [...MutationKey.user.mutation, "reset-password"],
    googleLogin: () => [...MutationKey.user.mutation, "google-login"],
    linkGoogle: () => [...MutationKey.user.mutation, "link-google"],
    unlinkGoogle: () => [...MutationKey.user.mutation, "unlink-google"],
  },
  transaction: {
    mutation: ["transaction-mutation"],
    create: () => [...MutationKey.transaction.mutation, "create"],
    update: () => [...MutationKey.transaction.mutation, "update"],
    delete: () => [...MutationKey.transaction.mutation, "delete"],
  },
  partner: {
    mutation: ["partner-mutation"],
    create: () => [...MutationKey.partner.mutation, "create"],
    update: () => [...MutationKey.partner.mutation, "update"],
    delete: () => [...MutationKey.partner.mutation, "delete"],
  },
  category: {
    mutation: ["category-mutation"],
    create: () => [...MutationKey.category.mutation, "create"],
    update: () => [...MutationKey.category.mutation, "update"],
    delete: () => [...MutationKey.category.mutation, "delete"],
  },
  profile: {
    mutation: ["profile-mutation"],
    create: () => [...MutationKey.profile.mutation, "create"],
    update: () => [...MutationKey.profile.mutation, "update"],
    delete: () => [...MutationKey.profile.mutation, "delete"],
    select: () => [...MutationKey.profile.mutation, "select"],
  },
  sixJars: {
    mutation: ["six-jars-mutation"],
    updateConfig: () => [...MutationKey.sixJars.mutation, "update-config"],
  },
  quickTransactionSetup: {
    mutation: ["quick-transaction-setup-mutation"],
    create: () => [...MutationKey.quickTransactionSetup.mutation, "create"],
    update: () => [...MutationKey.quickTransactionSetup.mutation, "update"],
    delete: () => [...MutationKey.quickTransactionSetup.mutation, "delete"],
  },
};

export const mutation = {
  user: {
    login: () =>
      useMutation({
        mutationKey: MutationKey.user.login(),
        mutationFn: userLogin,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.userWhoami(),
          });
        }
      }),
    logout: (onSuccess: () => void, onError: () => void) =>
      useMutation({
        mutationKey: MutationKey.user.logout(),
        mutationFn: userLogout,
        onSuccess,
        onError,
      }),
    register: () =>
      useMutation({
        mutationKey: MutationKey.user.register(),
        mutationFn: userRegister,
      }),
    forgotPassword: () =>
      useMutation({
        mutationKey: MutationKey.user.forgotPassword(),
        mutationFn: forgotPassword,
      }),
    resetPassword: () =>
      useMutation({
        mutationKey: MutationKey.user.resetPassword(),
        mutationFn: resetPassword,
      }),
    googleLogin: () =>
      useMutation({
        mutationKey: MutationKey.user.googleLogin(),
        mutationFn: googleLogin,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() })
      }),
    linkGoogle: () =>
      useMutation({
        mutationKey: MutationKey.user.linkGoogle(),
        mutationFn: linkGoogle,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() })
      }),
    unlinkGoogle: () =>
      useMutation({
        mutationKey: MutationKey.user.unlinkGoogle(),
        mutationFn: unlinkGoogle,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() })
      }),
  },
  transaction: {
    create: (queryKey?: object) => useMutation({
      mutationKey: MutationKey.transaction.create(),
      mutationFn: createTransaction,
      onSuccess: async () => {
        await invalidateTransactionQueries(queryKey);
      }
    }),
    update: (queryKey?: object) => useMutation({
      mutationKey: MutationKey.transaction.update(),
      mutationFn: updateTransaction,
      onSuccess: async () => {
        await invalidateTransactionQueries(queryKey);
      }
    }),
    delete: (queryKey?: object) => useMutation({
      mutationKey: MutationKey.transaction.delete(),
      mutationFn: deleteTransaction,
      onSuccess: async () => {
        await invalidateTransactionQueries(queryKey);
      }
    })
  },
  partner: {
    create: () => useMutation({
      mutationKey: MutationKey.partner.create(),
      mutationFn: createPartner,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.partners()
        });
      }
    }),
    update: () => useMutation({
      mutationKey: MutationKey.partner.update(),
      mutationFn: updatePartner,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.partners()
        });
      }
    }),
    delete: () => useMutation({
      mutationKey: MutationKey.partner.delete(),
      mutationFn: deletePartner,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.partners()
        });
      }
    })
  },
  category: {
    create: () => useMutation({
      mutationKey: MutationKey.category.create(),
      mutationFn: createCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories()
        });
      }
    }),
    update: () => useMutation({
      mutationKey: MutationKey.category.update(),
      mutationFn: updateCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories()
        });
      }
    }),
    delete: () => useMutation({
      mutationKey: MutationKey.category.delete(),
      mutationFn: deleteCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories()
        });
      }
    })
  },
  profile: {
    create: () => useMutation({
      mutationKey: MutationKey.profile.create(),
      mutationFn: createProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles() });
        queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() });
      }
    }),
    update: () => useMutation({
      mutationKey: MutationKey.profile.update(),
      mutationFn: updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles() });
        queryClient.invalidateQueries({ queryKey: queryKeys.activeProfile() });
        queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() });
      }
    }),
    delete: () => useMutation({
      mutationKey: MutationKey.profile.delete(),
      mutationFn: deleteProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profiles() });
        queryClient.invalidateQueries({ queryKey: queryKeys.activeProfile() });
        queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() });
      }
    }),
    select: () => useMutation({
      mutationKey: MutationKey.profile.select(),
      mutationFn: selectProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeProfile() });
        queryClient.invalidateQueries({ queryKey: queryKeys.userWhoami() });
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions() });
      }
    }),
  },
  quickTransactionSetup: {
    create: () => useMutation({
      mutationKey: MutationKey.quickTransactionSetup.create(),
      mutationFn: createQuickTransactionSetup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.quickTransactionSetups() })
    }),
    update: () => useMutation({
      mutationKey: MutationKey.quickTransactionSetup.update(),
      mutationFn: updateQuickTransactionSetup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.quickTransactionSetups() })
    }),
    delete: () => useMutation({
      mutationKey: MutationKey.quickTransactionSetup.delete(),
      mutationFn: deleteQuickTransactionSetup,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.quickTransactionSetups() })
    }),
  },
  sixJars: {
    updateConfig: (month: number, year: number) => useMutation({
      mutationKey: [...MutationKey.sixJars.updateConfig(), month, year],
      mutationFn: updateSixJarsConfig,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.sixJarsConfig(month, year) }),
          queryClient.invalidateQueries({ queryKey: queryKeys.sixJarsMonthStatistic(month, year) }),
        ]);
      }
    }),
  },
};
