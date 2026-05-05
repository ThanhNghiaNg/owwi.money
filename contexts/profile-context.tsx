"use client"

import { mutation } from "@/api/mutate";
import { query, keys as queryKeys } from "@/api/query";
import queryClient from "@/api/queryClient";
import { ProfileResponse } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useMemo, useState } from "react";

export type ViewScope = "profile" | "account";

type ProfileContextType = {
  profiles: ProfileResponse[];
  activeProfileId: string | null;
  activeProfile: ProfileResponse | null;
  isLoading: boolean;
  viewScope: ViewScope;
  setViewScope: React.Dispatch<React.SetStateAction<ViewScope>>;
  selectProfile: (profileId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: auth, isFetching } = useQuery(query.user.whoami());
  const { mutateAsync: selectProfileMutation } = mutation.profile.select();
  const [viewScope, setViewScope] = useState<ViewScope>("profile");

  const profiles = auth?.profiles || [];
  const activeProfileId = auth?.activeProfileId || null;
  const activeProfile = profiles.find((profile) => profile._id === activeProfileId) || null;

  const value = useMemo<ProfileContextType>(() => ({
    profiles,
    activeProfileId,
    activeProfile,
    isLoading: isFetching,
    viewScope,
    setViewScope,
    selectProfile: async (profileId: string) => {
      await selectProfileMutation(profileId);
      setViewScope("profile");
      await queryClient.refetchQueries({ queryKey: queryKeys.userWhoami() });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.activeProfile() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions_statistic_weekly() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.transactions_statistic_monthly() }),
        queryClient.invalidateQueries({ queryKey: [...queryKeys.transactions(), 'statistic'] }),
      ]);
    },
  }), [profiles, activeProfileId, activeProfile, isFetching, viewScope, selectProfileMutation]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}
