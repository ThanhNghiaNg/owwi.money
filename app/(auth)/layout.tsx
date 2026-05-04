"use client";

import { query } from "@/api/query";
import { DotLoader } from "@/components/ui/skeleton/dot-loader";
import { ROUTES } from "@/utils/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: res, isFetching } = useQuery(query.user.whoami());

  useEffect(() => {
    if (isFetching || !res) return;

    if (!res.isLoggedIn) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (res.needsProfileSelection || !res.activeProfileId) {
      router.replace(ROUTES.PROFILES_SELECT);
    }
  }, [res, isFetching, router]);

  if (isFetching || !res?.isLoggedIn || res?.needsProfileSelection || !res?.activeProfileId) {
    return <DotLoader />;
  }

  return <>{children}</>;
}
