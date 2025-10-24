"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, RegisterFormType } from "@/lib/schema";
import { toast } from "sonner";
import { Container } from "@/components/Container";

export default function RegisterPage() {
  const [showpwd, setShowpwd] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerFormSchema), mode: "onBlur" });

  async function handleRegister({
    username,
    phoneNumber,
    email,
    password,
  }: RegisterFormType) {
    try {
      const res = await api.post("/api/auth/register", {
        username,
        phoneNumber,
        email,
        password,
      });
      if (res.data.ok) {
        router.replace("/auth/finish");
      }
      if (res.data?.message) {
        return toast.success(res.data?.message);
      }

      // if (res.ok) router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error);
    }
  }

  return (
    <Container>
      <Card className="max-w-lg w-[25rem] md:w-[28rem] bg-white/50 dark:bg-slate-700/50 py-4 gap-2">
        <CardHeader className="text-center mt-4">
          <CardTitle className="text-xl">Bienvenue</CardTitle>
          <CardDescription>
            Connecter vous à votre compte Google ou Facebook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)} className="mt-0">
            <FieldGroup className="gap-1.5 md:gap-2 text-sm md:text-base">
              <Field className=" gap-1 ">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
                  className="w-full">
                  <Button variant="outline" type="button" className="w-full">
                    <GoogleIcon />
                    Connectez vous avec Google
                  </Button>
                </a>
                <Button variant="outline" type="button">
                  <FacebookIcon />
                  Connectez vous avec Facebook
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Ou continuer avec
                </span>
              </FieldSeparator>
              <Field className="gap-1 text-sm">
                <FieldLabel htmlFor="username">
                  Nom d&apos;utilisateur
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  {...register("username")}
                  className="h-9 text-sm py-1 px-2"
                />

                <FieldError id="username-error">
                  {errors.username?.message}{" "}
                </FieldError>
              </Field>
              <Field className="gap-1 text-sm">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <FieldError id="email-error">
                  {errors.email?.message}{" "}
                </FieldError>
              </Field>
              <Field className="gap-1 ">
                <FieldLabel htmlFor="phoneNumber">Numéro whatsApp</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  autoComplete="tel"
                  aria-invalid={!!errors.phoneNumber}
                  aria-describedby={
                    errors.phoneNumber ? "error-phone" : undefined
                  }
                />

                <FieldError id="error-phone">
                  {errors.phoneNumber?.message}{" "}
                </FieldError>
              </Field>
              <Field className="gap-1">
                <div className="flex items-center relative">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>

                  <button
                    type="button"
                    onClick={() => setShowpwd(!showpwd)}
                    aria-label={
                      showpwd
                        ? "Cacher le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-8 text-gray-600 dark:text-gray-400">
                    {showpwd ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type={showpwd ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="h-9 text-sm py-1 px-2 pr-10"
                />

                <FieldError id="password-error">
                  {errors.password?.message}{" "}
                </FieldError>
              </Field>
              <Field className="gap-1 ">
                <FieldLabel htmlFor="confirm">
                  Confirmer le mot de passe
                </FieldLabel>
                <Input
                  id="confirm"
                  autoComplete="current-password webauthn"
                  type="password"
                  {...register("confirm")}
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? "confirm-error" : undefined
                  }
                />
                <FieldError id="confirm-error">
                  {errors.confirm?.message}
                </FieldError>
              </Field>

              <Field className="gap-1">
                <Button type="submit" className="font-semibold text-white mt-2">
                  {isSubmitting ? (
                    <>
                      <Spinner /> Inscription en cours...
                    </>
                  ) : (
                    <span>S&apos;inscrire</span>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Déjà un compte ? <Link href="/auth/login">Connexion</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
