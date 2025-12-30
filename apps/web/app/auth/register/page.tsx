'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  authService,
  parseAxiosError,
  registerFormSchema,
  RegisterFormType,
} from '@stackschool/shared';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FacebookIcon, GoogleIcon } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Controller, useForm, zodResolver } from '@stackschool/ui';
import { toast } from 'sonner';
import { Container } from '@/components/Container';
import { ButtonSocial } from '@/components/button-social';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
  });

  async function handleRegister(data: RegisterFormType) {
    try {
      const res = await authService.register(data);
      if (res.ok) {
        toast.success(res.message);
        router.push(`/auth/finish?from=${res.user.provider}`);
      }
    } catch (err: any) {
      const error = parseAxiosError(err);
      toast.error(error.message || 'Une erreur est survenue.');
    }
  }

  return (
    <Container>
      <Card className="max-w-lg w-100 md:w-md gap-4">
        <CardHeader className="text-center mt-4">
          <CardTitle className="text-xl">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte Google ou Facebook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)} className="mt-0">
            <FieldGroup className="gap-1.5 md:gap-2 text-sm md:text-base">
              <Field className="gap-1.5">
                <ButtonSocial provider="google" icon={<GoogleIcon />} />
                <ButtonSocial provider="facebook" icon={<FacebookIcon />} />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mt-1">
                <span className="font-medium font-jost text-sm ">
                  Ou continuer avec
                </span>
              </FieldSeparator>
              <Field className="gap-1.5 text-sm mt-3">
                <FieldLabel htmlFor="username">
                  Nom d&apos;utilisateur
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  required
                  icon={User}
                  autoComplete="name"
                  placeholder="John Doe"
                  aria-invalid={!!errors.username}
                  aria-describedby={
                    errors.username ? 'username-error' : undefined
                  }
                  {...register('username')}
                />

                <FieldError id="username-error">
                  {errors.username?.message}{' '}
                </FieldError>
              </Field>
              <Field className="gap-1.5 text-sm">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register('email')}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <FieldError id="email-error">
                  {errors.email?.message}{' '}
                </FieldError>
              </Field>
              <Field className="gap-1.5 ">
                <FieldLabel htmlFor="phoneNumber">Numéro WhatsApp</FieldLabel>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultcontry="ML"
                      id="phoneNumber"
                      placeholder="+223 07 12 34 56 78"
                      defaultCountry="CI"
                      className="phone-input-custom"
                    />
                  )}
                />

                <FieldError id="error-phone">
                  {errors.phoneNumber?.message}{' '}
                </FieldError>
              </Field>
              <Field className="gap-1.5">
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>

                <Input
                  isPassword
                  icon={Lock}
                  {...register('password')}
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="********"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                />

                <FieldError id="password-error">
                  {errors.password?.message}{' '}
                </FieldError>
              </Field>
              <Field className="gap-1.5 ">
                <FieldLabel htmlFor="confirm">
                  Confirmer le mot de passe
                </FieldLabel>
                <Input
                  isPassword
                  id="confirm"
                  autoComplete="current-password webauthn"
                  type="password"
                  icon={Lock}
                  placeholder="********"
                  {...register('confirm')}
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? 'confirm-error' : undefined
                  }
                />
                <FieldError id="confirm-error">
                  {errors.confirm?.message}
                </FieldError>
              </Field>

              <Field className="gap-1.5">
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
