'use client';

import { Container } from '@/components/Container';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  ResetPasswordType,
  authServices,
  parseAxiosError,
} from '@stackschool/shared';
import { CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ResetPasswordForm } from './reset-password-view';
import { useQueryStates, useQueryState, parseAsString } from 'nuqs';

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useQueryState('token');
  const router = useRouter();

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error('Token de réinitialisation manquant');
      return;
    }

    try {
      const res = await authServices.resetPassword(
        token,
        data.password,
        data.confirm,
      );

      if (res.ok) {
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

  if (isSuccess) {
    return (
      <Container>
        <Card className="max-w-md mx-auto text-center w-100!">
          <CardContent className="space-y-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Mot de passe réinitialisé !</h2>
            <p>Votre mot de passe a été modifié avec succès.</p>
            <p className="text-sm text-gray-600">
              Redirection vers la page de connexion...
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return <ResetPasswordForm onSubmit={onSubmit} />;
}
