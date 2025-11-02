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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ResetPasswordType, resetPasswordSchema } from "@stackschool/shared";
import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Token de réinitialisation manquant");
      return;
    }

    try {
      const res = await api.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });

      if (res.data.ok) {
        setIsSuccess(true);
        toast.success(
          res.data?.message || "Mot de passe réinitialisé avec succès"
        );

        // Redirection après 3 secondes
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Erreur lors de la réinitialisation";
      toast.error(message);

      // Si le token est invalide, rediriger vers forgot-password
      if (error.response?.status === 400) {
        setTimeout(() => {
          router.push("/auth/forgot-password");
        }, 2000);
      }
    }
  };

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

  if (!token) {
    return (
      <Container>
        <Card className="max-w-md w-100! mx-auto text-center bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
          <CardContent className="space-y-4 py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Lien invalide</h2>
            <p>Le lien de réinitialisation est invalide ou a expiré.</p>
            <Button
              className="text-white font-semibold"
              onClick={() => router.push("/auth/forgot-password")}>
              Demander un nouveau lien
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="max-w-md mx-auto w-100!  bg-white/50 dark:bg-slate-700/50">
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Votre nouveau mot de passe"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

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
                              ? "bg-red-500"
                              : level <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    {passwordStrength <= 2 && "Faible"}
                    {passwordStrength === 3 && "Moyen"}
                    {passwordStrength >= 4 && "Fort"}
                  </div>
                </div>
              )}

              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            {/* Confirmation mot de passe */}
            <Field>
              <FieldLabel>Confirmer le mot de passe</FieldLabel>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm")}
                  placeholder="Confirmez votre mot de passe"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              <FieldError>{errors.confirm?.message}</FieldError>
            </Field>

            <Button
              type="submit"
              className="w-full text-white font-semibold"
              disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <span className="flex text-slate-300 gap-3">
                  <Spinner /> Réinitialisation...
                </span>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline text-sm">
              ← Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
