"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FacebookIcon, GoogleIcon } from "./icons";
import { useState } from "react";
import { useForm } from "@stackschool/ui";
import { zodResolver } from "@stackschool/ui";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { LoginFormType, loginFormSchema } from "@stackschool/shared";
import { ButtonSocial } from "./button-social";
export function LoginForm({
  className,
  handleLogin,
}: {
  className?: string;
  handleLogin: (value: LoginFormType) => void;
}) {
  const [showpwd, setShowpwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
  });

  return (
    <>
      <Card className="max-w-lg w-100 md:w-md xl:w-lg bg-white/50 dark:bg-slate-700/50 py-4 gap-2 ">
        <CardHeader className="text-center">
          <CardTitle className="text-xl lg:text-2xl!">Bienvenue</CardTitle>
          <CardDescription>
            Connecter vous à votre compte Google ou Facebook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
            <FieldGroup className="gap-3">
              <Field>
                <ButtonSocial provider="google" icon={<GoogleIcon />} />
                <ButtonSocial provider="facebook" icon={<FacebookIcon />} />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Ou continuer avec
                </span>
              </FieldSeparator>
              <Field className="last:mt-0">
                <FieldLabel htmlFor="email">
                  Email ou nom d&apos;utilisateur
                </FieldLabel>
                <Input
                  icon={Mail}
                  id="email"
                  type="text"
                  required
                  autoComplete="name"
                  {...register("identifier")}
                  aria-describedby={
                    errors.identifier ? "identifier-error" : undefined
                  }
                  aria-invalid={!!errors.identifier}
                />

                <FieldError id="identifier-error">
                  {errors.identifier?.message}{" "}
                </FieldError>
              </Field>
              <Field>
                <div className="flex items-center relative">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublier
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    icon={Lock}
                    {...register("password")}
                    id="password"
                    type={showpwd ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    aria-label="Toggle password visibility"
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowpwd((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    {showpwd ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <FieldError id="password-error">
                  {errors.password?.message}
                </FieldError>
              </Field>
              <Field>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className={cn(
                    "font-semibold text-white",
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Connection en cours...
                    </>
                  ) : (
                    <span>Se connecter</span>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Pas de compte ?{" "}
                  <Link href="/auth/register">Creé un compte</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
