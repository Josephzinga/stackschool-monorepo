'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthRedirectDecision } from '@/lib/auth/use-auth-redirect';

export default function FinishPage() {
  const router = useRouter();
  const { redirectTo, error } = useAuthRedirectDecision();

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  // This page never renders real content — it exists only to resolve and
  // forward. If `error` is set and redirectTo somehow stays null, that's a
  // sign resolveGuardRedirect didn't recognize this path as an auth page;
  // fall back to login rather than leaving the user stuck on a spinner.
  useEffect(() => {
    if (error && !redirectTo) {
      router.replace('/auth/login');
    }
  }, [error, redirectTo, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
    </div>
  );
}
