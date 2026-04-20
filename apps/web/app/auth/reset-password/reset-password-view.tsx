'use client';

import {
  authService,
  parseAxiosError,
  ResetPasswordType,
} from '@stackschool/shared';
import { toast } from 'sonner';
import { router } from 'next/client';
import { use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/Container';
import { AlertCircle } from 'lucide-react';

export const onSubmit = async (
  data: ResetPasswordType,
  onSuccess: (success: boolean) => void,
  token?: string,
) => {
  if (!token) {
    toast.error('Token de réinitialisation manquant');
    return;
  }

  try {
    const res = await authService.resetPassword(
      token,
      data.password,
      data.confirm,
    );

    if (res.ok) {
      onSuccess(true);
      toast.success(
        res.data?.message || 'Mot de passe réinitialisé avec succès',
      );
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  } catch (error: any) {
    const { message } = parseAxiosError(error);
    toast.error(message || 'Erreur lors de la réinitialisation');

    // Si le token est invalide, rediriger vers forgot-password
    if (error.response?.status === 400) {
      setTimeout(() => {
        router.push('/auth/forgot-password');
      }, 2000);
    }
  }
};

export const HandleFallBack = ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; method?: string }>;
}) => {
  const { token, method } = use(searchParams);
  if (!token && !method && method === 'email') {
    return (
      <Container>
        <Card className="max-w-md w-100! mx-auto text-center bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
          <CardContent className="space-y-4 py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Lien invalide</h2>
            <p>Le lien de réinitialisation est invalide ou a expiré.</p>
            <Button
              className="text-white font-semibold"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Demander un nouveau lien
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }
};
