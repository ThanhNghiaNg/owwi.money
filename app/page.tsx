'use client'
import { APP_VERSION } from "@/lib/env";
import { ROUTES } from "@/utils/constants/routes";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(()=>{
    router.push(ROUTES.DASHBOARD);
    console.debug("App version: ", APP_VERSION);
  }, [router])

  return <></>
}
