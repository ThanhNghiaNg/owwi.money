"use client";

import { query } from "@/api/query";
import { DotLoader } from "@/components/ui/skeleton/dot-loader";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: res, isFetching } = useQuery(query.user.whoami());

  useEffect(() => {
    if (!isFetching && res && (!res.isLoggedIn || !res.activeProfile?._id)) {
      router.replace("/login");
    }
  }, [res, isFetching, router]);

  if (isFetching || !res?.isLoggedIn || !res.activeProfile?._id) return <DotLoader />;

  return <>{children}</>;
}
