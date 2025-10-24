/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyCodeSchema, VerifyCodeFormType } from "@/lib/schema";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

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
      const res = await api.post("/api/auth/verify-code", { code, tempToken });
      toast.success(res?.data.message);
      if (res?.data.resetToken) {
        router.push(`/auth/reset-password?token=${res.data.resetToken}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Code invalide";
      toast.error(errorMessage);

      // Focus automatique sur le champ OTP en cas d'erreur
      document.getElementById("code")?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await api.post("/api/auth/resend-code", { tempToken });
      if (res.data?.ok) {
        toast.success("Nouveau code envoyé");
        setCountdown(60); // 60 secondes d'attente
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <Container>
      <Card className="!w-100 bg-white/50 dark:bg-slate-700/50 max-w-md mx-auto">
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
                      className="justify-center">
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-10 h-10 text-lg border-2"
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
              disabled={isSubmitting}>
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
                Nouveau code disponible dans {countdown} secondes
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline text-sm">
                Renvoyer le code
              </button>
            )}

            <div className="pt-4 border-t">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline text-sm">
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
