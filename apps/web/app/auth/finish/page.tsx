'use client';

import { Container } from '@/components/Container';
import { Spinner } from '@/components/ui/spinner';
import { toUserWithRelationsContract } from '@stackschool/contracts';
import { LucideOctagonX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetMeQuery, useUserStore } from '@stackschool/ui';

export default function AuthFinish() {
  const router = useRouter();
  const { currentMemberShip, setCurrentMemberShip, setCurrentSchool, setUser } =
    useUserStore();

  const [status, setStatus] = useState<
    'loading' | 'ok' | 'need_onboard' | 'error'
  >('loading');
  const [msg, setMsg] = useState('');

  const { data, isLoading, isError, error } = useGetMeQuery(
    {},
    { retry: false },
  );

  useEffect(() => {
    if (isLoading) {
      setStatus('loading');
      return;
    }

    if (isError || !data?.me) {
      setStatus('error');
      setMsg(
        'Impossible de valider la connexion. Réessaie ou contacte le support.',
      );
      console.error('Erreur de validation de la connexion:', error);
      return;
    }

    const user = data.me;
    setUser(toUserWithRelationsContract(user));

    const profile = user?.profile;
    // si le profile est manquant
    if (!profile || !user.profileCompleted) {
      setStatus('need_onboard');
      router.replace(`/auth/complete-profile`);
      return;
    }

    setStatus('ok');

    // Vérifier si un currentMemberShip existe déjà dans le store
    if (currentMemberShip) {
      if (currentMemberShip.role) {
        router.replace(
          `/dashboard/${currentMemberShip.role.toLocaleLowerCase()}`,
        );
      } else {
        router.replace(`/auth/complete-profile`);
      }
      return;
    }

    // Sinon, vérifier le tableau des memberships
    const memberships = data?.me?.memberships || [];
    if (memberships.length === 0) {
      router.replace(`/auth/complete-profile`);
    } else if (memberships.length === 1) {
      const singleMembership = memberships[0];
      const membershipWithoutSchool = {
        id: singleMembership?.id!,
        role: singleMembership?.role!,
      };
      setCurrentMemberShip(singleMembership!);
      if (singleMembership?.school) {
        setCurrentSchool(singleMembership.school);
      }
      if (singleMembership?.role) {
        router.replace(
          `/dashboard/${singleMembership.role.toLocaleLowerCase()}`,
        );
      } else {
        router.replace(`/dashboard/`);
      }
    } else {
      router.replace(`/school/select-school`);
    }
  }, [
    data,
    isLoading,
    isError,
    error,
    router,
    currentMemberShip,
    setCurrentMemberShip,
    setCurrentSchool,
    setUser,
  ]);

  return (
    <Container>
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-700/60 relative h-45 rounded-2xl">
        {status === 'loading' && (
          <>
            <Spinner className="w-10 md:w-15 h-10 md:h-15 mt-4" />
            <span className="text-xl animate-pulse font-medium px-3 text-white">
              Vérification de la connexion ...
            </span>
          </>
        )}
        {status === 'error' && (
          <>
            <LucideOctagonX className="w-10 md:w-15 h-10 md:h-15 text-red-500" />
            <span className="text-white px-3 text-center">{msg}</span>
          </>
        )}
      </div>
    </Container>
  );
}
