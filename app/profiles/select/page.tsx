"use client";

import { mutation } from "@/api/mutate";
import { query } from "@/api/query";
import queryClient from "@/api/queryClient";
import { ProfileResponse } from "@/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DotLoader } from "@/components/ui/skeleton/dot-loader";
import { useProfile } from "@/contexts/profile-context";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pencil, Plus, Trash2, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const MAX_PROFILES = 6;
const PROFILE_COLORS = [
  "#0EA5E9",
  "#8B5CF6",
  "#F97316",
  "#10B981",
  "#EC4899",
  "#EAB308",
  "#6366F1",
  "#14B8A6",
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "P";
}

function getStableColor(name: string) {
  const normalized = name.trim().toLowerCase();
  const hash = normalized.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PROFILE_COLORS[hash % PROFILE_COLORS.length];
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

function ProfileAvatar({ profile }: { profile: ProfileResponse }) {
  const fallbackColor = profile.color || getStableColor(profile.name);

  return (
    <Avatar className="h-16 w-16 border-4 border-white/70 shadow-sm">
      {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt={profile.name} /> : null}
      <AvatarFallback
        className="text-lg font-semibold text-white"
        style={{ backgroundColor: fallbackColor }}
      >
        {getInitials(profile.name)}
      </AvatarFallback>
    </Avatar>
  );
}

export default function ProfilesSelectPage() {
  const router = useRouter();
  const { data: auth, isFetching } = useQuery(query.user.whoami());
  const { profiles, activeProfileId, selectProfile } = useProfile();
  const profilesFromAuth = useMemo(() => auth?.profiles || profiles, [auth?.profiles, profiles]);
  const canCreateMore = profilesFromAuth.length < MAX_PROFILES;

  const [newProfileName, setNewProfileName] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creatingInProgress, setCreatingInProgress] = useState(false);
  const [selectingProfileId, setSelectingProfileId] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState("");
  const [editingError, setEditingError] = useState("");
  const [updatingProfileId, setUpdatingProfileId] = useState<string | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);
  const [rowActionError, setRowActionError] = useState<Record<string, string>>({});

  const { mutateAsync: createProfile } = mutation.profile.create();
  const { mutateAsync: updateProfile } = mutation.profile.update();
  const { mutateAsync: deleteProfile } = mutation.profile.delete();

  const handleSelectProfile = async (profileId: string) => {
    try {
      setSelectingProfileId(profileId);
      setRowActionError((prev) => ({ ...prev, [profileId]: "" }));
      await selectProfile(profileId);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
      const message = getErrorMessage(error, "Cannot select profile right now.");
      setRowActionError((prev) => ({ ...prev, [profileId]: message }));
      toast.error(message);
    } finally {
      setSelectingProfileId(null);
    }
  };

  const handleCreateProfile = async () => {
    const name = newProfileName.trim();
    if (!name) {
      setCreateError("Please enter profile name.");
      return;
    }

    try {
      setCreateError("");
      setCreatingInProgress(true);
      const profile = await createProfile({
        name,
        color: getStableColor(name),
      });
      setNewProfileName("");
      setIsCreating(false);
      await handleSelectProfile(profile._id);
    } catch (error) {
      console.error(error);
      setCreateError(getErrorMessage(error, "Cannot create profile right now."));
    } finally {
      setCreatingInProgress(false);
    }
  };

  const handleStartEdit = (profile: ProfileResponse) => {
    setEditingProfileId(profile._id);
    setEditingProfileName(profile.name);
    setEditingError("");
    setRowActionError((prev) => ({ ...prev, [profile._id]: "" }));
  };

  const handleSaveEdit = async (profile: ProfileResponse) => {
    const name = editingProfileName.trim();
    if (!name) {
      setEditingError("Please enter profile name.");
      return;
    }

    try {
      setEditingError("");
      setUpdatingProfileId(profile._id);
      await updateProfile({
        id: profile._id,
        name,
        color: profile.color || getStableColor(name),
      });
      setEditingProfileId(null);
      setEditingProfileName("");
      setRowActionError((prev) => ({ ...prev, [profile._id]: "" }));
      if (activeProfileId === profile._id) {
        await selectProfile(profile._id);
      }
      toast.success("Profile updated.");
    } catch (error) {
      console.error(error);
      setEditingError(getErrorMessage(error, "Cannot update profile right now."));
    } finally {
      setUpdatingProfileId(null);
    }
  };

  const handleDeleteProfile = async (profile: ProfileResponse) => {
    const confirmed = window.confirm(`Delete profile \"${profile.name}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingProfileId(profile._id);
      setRowActionError((prev) => ({ ...prev, [profile._id]: "" }));
      const res = await deleteProfile(profile._id);
      if (res.activeProfileId) {
        await selectProfile(res.activeProfileId);
      } else {
        await queryClient.refetchQueries({ queryKey: query.user.whoami().queryKey });
      }
      toast.success("Profile deleted.");
    } catch (error) {
      console.error(error);
      setRowActionError((prev) => ({
        ...prev,
        [profile._id]: getErrorMessage(error, "Cannot delete profile right now."),
      }));
    } finally {
      setDeletingProfileId(null);
    }
  };

  if (isFetching) {
    return <div className="min-h-screen flex items-center justify-center"><DotLoader /></div>;
  }

  if (!auth?.isLoggedIn) {
    router.replace(ROUTES.LOGIN);
    return <div className="min-h-screen flex items-center justify-center"><DotLoader /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg">
            <UserCircle2 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Choose your profile</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select the profile you want to use for this session.
          </p>
        </div>

        <Card className="border-white/60 bg-white/85 shadow-xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/85">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-center sm:text-left">Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profilesFromAuth.map((profile) => {
                const isActive = activeProfileId === profile._id;
                const isEditing = editingProfileId === profile._id;
                const isSelectingThisProfile = selectingProfileId === profile._id;
                const isUpdatingThisProfile = updatingProfileId === profile._id;
                const isDeletingThisProfile = deletingProfileId === profile._id;
                const isBusy = isSelectingThisProfile || isUpdatingThisProfile || isDeletingThisProfile;
                const inlineError = rowActionError[profile._id] || "";

                return (
                  <div
                    key={profile._id}
                    className={cn(
                      "rounded-2xl border p-5 transition-all duration-200",
                      isActive
                        ? "border-sky-500 bg-sky-50 shadow-md dark:border-sky-400 dark:bg-sky-950/40"
                        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectProfile(profile._id)}
                        disabled={isBusy || creatingInProgress}
                        className="flex flex-1 items-center gap-4 text-left"
                      >
                        <ProfileAvatar profile={profile} />
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <Input
                              autoFocus
                              value={editingProfileName}
                              onChange={(e) => setEditingProfileName(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              maxLength={40}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="truncate text-base font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                              {profile.isDefault ? (
                                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                                  Default
                                </span>
                              ) : null}
                            </div>
                          )}
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isSelectingThisProfile ? "Opening profile..." : "Profile"}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        {isEditing ? null : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(profile)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-sky-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-sky-300"
                            disabled={isBusy || creatingInProgress}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {!profile.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteProfile(profile)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
                            disabled={isBusy || creatingInProgress}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-4 flex flex-col gap-2">
                        {editingError ? (
                          <p className="text-sm text-rose-600 dark:text-rose-400">{editingError}</p>
                        ) : null}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            className="flex-1"
                            onClick={() => handleSaveEdit(profile)}
                            disabled={isUpdatingThisProfile}
                          >
                            {isUpdatingThisProfile ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setEditingProfileId(null);
                              setEditingProfileName("");
                              setEditingError("");
                            }}
                            disabled={isUpdatingThisProfile}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {!isEditing && inlineError ? (
                      <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{inlineError}</p>
                    ) : null}
                  </div>
                );
              })}

              {canCreateMore ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-5 dark:border-gray-700 dark:bg-gray-800/60">
                  {!isCreating ? (
                    <button
                      type="button"
                      onClick={() => setIsCreating(true)}
                      className="flex h-full min-h-[148px] w-full flex-col items-center justify-center gap-3 rounded-xl text-center transition-colors hover:bg-sky-50 dark:hover:bg-sky-950/30"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                        <Plus className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Create profile</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Up to {MAX_PROFILES} profiles per account</p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex min-h-[148px] flex-col justify-center gap-3">
                      <Input
                        autoFocus
                        value={newProfileName}
                        onChange={(e) => {
                          setNewProfileName(e.target.value);
                          if (createError) setCreateError("");
                        }}
                        placeholder="Enter profile name"
                        maxLength={40}
                      />
                      {createError ? (
                        <p className="text-sm text-rose-600 dark:text-rose-400">{createError}</p>
                      ) : null}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={handleCreateProfile}
                          disabled={creatingInProgress}
                        >
                          {creatingInProgress ? "Creating..." : "Create"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setIsCreating(false);
                            setNewProfileName("");
                            setCreateError("");
                          }}
                          disabled={creatingInProgress}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
