"use client";

import { mutation } from "@/api/mutate";
import { query } from "@/api/query";
import { ProfileResponse } from "@/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DotLoader } from "@/components/ui/skeleton/dot-loader";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { Plus, UserCircle2 } from "lucide-react";
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
  const profiles = useMemo(() => auth?.profiles || [], [auth?.profiles]);
  const activeProfileId = auth?.activeProfileId || null;
  const canCreateMore = profiles.length < MAX_PROFILES;

  const [newProfileName, setNewProfileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { mutateAsync: selectProfile, isPending: isSelecting } = mutation.profile.select();
  const { mutateAsync: createProfile, isPending: isCreatingProfile } = mutation.profile.create();

  const handleSelectProfile = async (profileId: string) => {
    try {
      await selectProfile(profileId);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
      toast.error("Cannot select profile right now.");
    }
  };

  const handleCreateProfile = async () => {
    const name = newProfileName.trim();
    if (!name) {
      toast.error("Please enter profile name.");
      return;
    }

    try {
      const profile = await createProfile({
        name,
        color: getStableColor(name),
      });
      setNewProfileName("");
      setIsCreating(false);
      await handleSelectProfile(profile._id);
    } catch (error) {
      console.error(error);
      toast.error("Cannot create profile right now.");
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
              {profiles.map((profile) => {
                const isActive = activeProfileId === profile._id;
                return (
                  <button
                    key={profile._id}
                    type="button"
                    onClick={() => handleSelectProfile(profile._id)}
                    disabled={isSelecting || isCreatingProfile}
                    className={cn(
                      "group rounded-2xl border p-5 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg",
                      "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                      isActive
                        ? "border-sky-500 bg-sky-50 shadow-md dark:border-sky-400 dark:bg-sky-950/40"
                        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/80"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <ProfileAvatar profile={profile} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                          {profile.isDefault ? (
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Profile</p>
                      </div>
                    </div>
                  </button>
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
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="Enter profile name"
                        maxLength={40}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={handleCreateProfile}
                          disabled={isCreatingProfile}
                        >
                          {isCreatingProfile ? "Creating..." : "Create"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setIsCreating(false);
                            setNewProfileName("");
                          }}
                          disabled={isCreatingProfile}
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
