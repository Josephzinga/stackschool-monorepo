'use client';

import {
  authServices,
  parseAxiosError,
  ResetPasswordType,
  resetPasswordSchema,
} from '@stackschool/shared';
import { toast } from 'sonner';
import { router } from 'next/client';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/Container';
import { AlertCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '@/components/submit-button';

export const ResetPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (data: ResetPasswordType) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Omit<ResetPasswordType, 'token'>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  // Vérification de la force du mot de passe
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <Container>
      <Card className="max-w-md mx-auto w-100! font-poppins">
        <CardHeader>
          <CardTitle className="text-center">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-center">
            Choisissez un nouveau mot de passe sécurisé
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Champ mot de passe */}
            <Field>
              <FieldLabel>Nouveau mot de passe</FieldLabel>
              <Input
                icon={Lock}
                isPassword
                {...register('password')}
                placeholder="********"
                aria-invalid={!!errors.password}
              />

              <FieldError>{errors.password?.message}</FieldError>
              {/* Indicateur de force du mot de passe */}
              {passwordValue && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength
                            ? level <= 2
                              ? 'bg-red-500'
                              : level <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {passwordStrength <= 2 && 'Faible'}
                    {passwordStrength === 3 && 'Moyen'}
                    {passwordStrength >= 4 && 'Fort'}
                  </div>
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel>Confirmer le mot de passe</FieldLabel>
              <Input
                isPassword
                {...register('confirm')}
                aria-invalid={!!errors.confirm}
              />

              <FieldError>{errors.confirm?.message}</FieldError>
            </Field>
            <SubmitButton
              className="w-full font-poppins"
              isSubmitting={isSubmitting}
            >
              {isSubmitting
                ? 'Réinitialisation en cours...'
                : 'Réinitialiser le mot de passe'}
            </SubmitButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-primary hover:underline text-sm"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
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
