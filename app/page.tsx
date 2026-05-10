'use client'
import { ROUTES } from "@/utils/constants/routes";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(()=>{
    router.push(ROUTES.DASHBOARD);
  }, [router])

  return <></>
}
