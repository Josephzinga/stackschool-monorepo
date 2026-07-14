'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { Controller, useForm, zodResolver } from '@stackschool/ui';
import {
  authServices,
  parseAxiosError,
  VerifyCodeFormType,
  VerifyCodeSchema,
} from '@stackschool/contracts';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

export default function VerifyCode() {
  //  const search = useSearchParams();
  //   const token = search.get('token');
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeFormType>({
    resolver: zodResolver(VerifyCodeSchema),
    mode: 'onBlur',
  });

  // Compte à rebours pour le renvoi de code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCode = async ({ code }: VerifyCodeFormType) => {
    try {
      const res = await authServices.verifyCode(code, null);
      toast.success(res.message);
      if (res.ok) {
        router.push(`/auth/reset-password`);
      }
    } catch (error: any) {
      const { message, status, data } = parseAxiosError(error);
      console.log('Data', data);
      toast.error(error?.data?.errors?.message || 'Code invalide ou éxpiré');

      document.getElementById('code')?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await authServices.resendCode();
      if (res.ok) {
        toast.success(res.message || 'Nouveau code envoyé');
        setCountdown(60); // 60 secondes d'attente
      }
    } catch (error: any) {
      toast.error(error?.errors?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <Container>
      <Card className="w-100! max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vérification du code</CardTitle>
          <CardDescription>
            Entrez le code à 6 chiffres envoyé sur WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleCode)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="code" className="text-center block">
                Code de vérification
              </FieldLabel>

              <div className="flex justify-center">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      {...field}
                      id="code"
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-10 h-10 text-lg border"
                            aria-invalid={!!errors.code}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>
              <div className="w-full flex justify-center mt-1">
                <FieldError className="mx-auto">
                  {errors.code?.message}
                </FieldError>
              </div>
            </Field>

            <Button
              type="submit"
              className="w-full  font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Vérification...
                </>
              ) : (
                'Vérifier le code'
              )}
            </Button>
          </form>

          {/* Section renvoi de code */}
          <div className="text-center space-y-3">
            {countdown > 0 ? (
              <p className="text-sm ">
                Nouveau code sera disponible dans{' '}
                <span className="font-medium">{countdown}</span> secondes
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="hover:underline text-sm"
              >
                Renvoyer le code
              </button>
            )}

            <div className="pt-4 border-t">
              <Link href="/auth/login" className="hover:underline text-sm">
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
