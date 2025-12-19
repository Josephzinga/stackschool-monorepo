/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {Container} from "@/components/Container";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp";

import {Controller, useForm, zodResolver} from "@stackschool/ui";
import {authService, parseAxiosError, VerifyCodeFormType, VerifyCodeSchema} from "@stackschool/shared";

import {REGEXP_ONLY_DIGITS} from "input-otp";
import Link from "next/link";
import {Spinner} from "@/components/ui/spinner";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";

import {useEffect, useState} from "react";

export default function VerifyCode() {
  const search = useSearchParams();
  const router = useRouter();
  const tempToken = search.get("token");
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeFormType>({
    resolver: zodResolver(VerifyCodeSchema),
    mode: "onBlur",
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
      const res = await authService.verifyCode(code, tempToken);
      toast.success(res.message);
      if (res.resetToken) {
        router.push(`/auth/reset-password?token=${res.resetToken}`);
      }
    } catch (error: any) {
      const {message} = parseAxiosError(error)
      toast.error(message || "Code invalide ou éxpiré");
      
      document.getElementById("code")?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await authService.resendCode(tempToken);
      if (res.data?.ok) {
        toast.success(res.data?.message || "Nouveau code envoyé");
        setCountdown(60); // 60 secondes d'attente
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <Container>
      <Card className="w-100! bg-white/50 dark:bg-slate-700/50 max-w-md mx-auto">
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
                      aria-invalid={!!errors.code}
                      aria-describedby={errors.code ? "code-error" : undefined}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-10 h-10 text-lg border"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>

              <FieldError id="code-error" className="text-center mt-2">
                {errors.code?.message}
              </FieldError>
            </Field>

            <Button
              type="submit"
              className="w-full text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Vérification...
                </>
              ) : (
                "Vérifier le code"
              )}
            </Button>
          </form>

          {/* Section renvoi de code */}
          <div className="text-center space-y-3">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nouveau code sera disponible dans{" "}
                <span className="text-emerald-400 font-medium">
                  {countdown}
                </span>{" "}
                secondes
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline text-sm"
              >
                Renvoyer le code
              </button>
            )}

            <div className="pt-4 border-t">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline text-sm"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
