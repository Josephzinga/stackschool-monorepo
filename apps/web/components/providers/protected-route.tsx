'use client';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthRedirectDecision } from '@/lib/auth/use-auth-redirect';
import { registerSchoolHeaderInterceptor } from '@/lib/auth/school-header.interceptor';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, redirectTo } = useAuthRedirectDecision();
  registerSchoolHeaderInterceptor();
  useEffect(() => {
    if (redirectTo && redirectTo !== pathname) {
      router.replace(redirectTo);
    }
  }, [redirectTo, pathname, router]);

  if (isLoading || redirectTo) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return <>{children}</>;
}
