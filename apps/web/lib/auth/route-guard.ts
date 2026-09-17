// lib/auth/route-guard.ts
//
// Pure function: given the session/state, decide where (if anywhere) the
// user should be redirected. No React, no Next.js router — testable with
// plain objects.

import { SchoolRole } from '@stackschool/contracts';

export interface GuardContext {
  pathname: string;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  hasCurrentSchool: boolean;
  membershipCount: number;
  currentRole?: SchoolRole | null;
}

const SELECT_SCHOOL_PATH = '/school/select-school';
const COMPLETE_PROFILE_PATH = '/auth/complete-profile';

// The "where should a fully-authenticated, profile-complete user actually
// land" rule — used both when coming FROM an auth-flow page (login, finish,
// complete-profile) and when already inside the app with no school
// resolved. Having ONE function for this is what fixes the ordering bug:
// previously, "came from an auth page" short-circuited straight to
// /dashboard/:role without ever checking whether a school still needed to
// be picked.
function resolveLandingPath(ctx: GuardContext): string {
  if (!ctx.hasCurrentSchool) {
    if (ctx.membershipCount === 0) return COMPLETE_PROFILE_PATH; // shouldn't happen if hasMembership is true, but stay safe
    // membershipCount === 1 falls back here too: if useSessionSync hasn't
    // auto-selected it yet (e.g. this runs before that effect commits),
    // select-school is still a safe landing — it redirects onward once the
    // store settles, rather than guessing a role that isn't set yet.
    return SELECT_SCHOOL_PATH;
  }
  return ctx.currentRole
    ? `/dashboard/${ctx.currentRole.toLowerCase()}`
    : '/dashboard';
}

export function resolveGuardRedirect(ctx: GuardContext): string | null {
  const { pathname, isAuthenticated, isProfileComplete } = ctx;

  if (!isAuthenticated) {
    return pathname.startsWith('/auth') ? null : '/auth/login';
  }

  const isOnCompleteProfile = pathname === COMPLETE_PROFILE_PATH;
  const isOnAuthPage = pathname.startsWith('/auth') && !isOnCompleteProfile;
  const isOnSelectSchool = pathname === SELECT_SCHOOL_PATH;

  if (!isProfileComplete) {
    return isOnCompleteProfile ? null : COMPLETE_PROFILE_PATH;
  }

  const landingPath = resolveLandingPath(ctx);

  // Coming from any auth-flow page with a complete profile: send them to
  // their real landing target — which itself accounts for missing/ambiguous
  // school selection, instead of blindly assuming a school is set.
  if (isOnCompleteProfile || isOnAuthPage) {
    return landingPath;
  }

  // Already inside the app but no school resolved (store not hydrated yet,
  // or multiple schools never chosen): same landing rule applies.
  if (!ctx.hasCurrentSchool && !isOnSelectSchool) {
    return landingPath;
  }

  return null;
}
