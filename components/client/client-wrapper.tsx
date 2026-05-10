'use client';

import { axiosHomeInstance, axiosInstance } from '@/api/axios';
import { setupAxiosInterceptors } from '@/api/axios-setup';
import queryClient from '@/api/queryClient';
import { LanguageProvider } from '@/contexts/language-context';
import { ProfileProvider } from '@/contexts/profile-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { JSX, useEffect } from 'react';

function ClientWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  const router = useRouter();
  const [isSettingUp, setIsSettingUp] = React.useState(true);
  useEffect(() => {
    setIsSettingUp(true);
    setupAxiosInterceptors(router, axiosInstance);
    setupAxiosInterceptors(router, axiosHomeInstance);
    setIsSettingUp(false);
  }, [router])

  if (isSettingUp) {
    return <></>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ProfileProvider>
          {children}
        </ProfileProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default ClientWrapper;
