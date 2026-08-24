'use client';
import {
  authServices,
  parseAxiosError,
  registerFormSchema,
  RegisterFormType,
} from '@stackschool/contracts';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import Link from 'next/link';
import { FacebookIcon, GoogleIcon } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Controller, useForm, zodResolver } from '@stackschool/ui';
import { toast } from 'sonner';
import { ButtonSocial } from '@/components/auth/button-social';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
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

  const handleRegister = async (data: RegisterFormType) => {
    try {
      const res = await authServices.register(data);
      toast.success(res.message || 'Compte créé avec succès !');
      router.push('/auth/finish?from=register');
    } catch (err: any) {
      const { message, data } = parseAxiosError(err);
      console.log('Message: ', message);
      toast.error(message || "Erreur lors de l'inscription");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className={cn('w-full max-w-lg mx-auto', className)}
    >
      <FieldGroup className="gap-3">
        {/* En-tête compact */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Rejoignez StackSchool
          </h1>
          <p className="text-sm text-muted-foreground">
            Créez votre compte pour découvrir un monde d'apprentissage.
          </p>
        </div>

        {/* Boutons sociaux */}
        <div className="flex gap-3 w-full justify-center">
          <ButtonSocial
            provider="google"
            className="flex-1 max-w-45"
            icon={<GoogleIcon />}
          />
          <ButtonSocial
            provider="facebook"
            className="flex-1 max-w-45"
            icon={<FacebookIcon />}
          />
        </div>

        <FieldSeparator className="my-1 flex items-center font-sans">
          <span className="px-2 text-xs font-medium text-muted-foreground bg-background">
            Ou inscrivez-vous par email
          </span>
        </FieldSeparator>

        {/* Grille des champs (2 colonnes sur desktop) */}
        <div className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-xs">Nom d'utilisateur</FieldLabel>
            <Input
              placeholder="John Doe"
              icon={User}
              {...register('username')}
              aria-invalid={!!errors.username}
              className="h-9 text-sm"
            />
            <FieldError>{errors.username?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-xs">Email</FieldLabel>
            <Input
              placeholder="exemple@ecole.fr"
              icon={Mail}
              {...register('email')}
              aria-invalid={!!errors.email}
              className="h-9 text-sm"
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-xs">WhatsApp</FieldLabel>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="+223 07 12 34 56 78"
                  defaultCountry="ML"
                  international
                  className="phone-input-custom h-9 text-sm"
                />
              )}
            />
            <FieldError>{errors.phoneNumber?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-xs">Mot de passe</FieldLabel>
            <Input
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('password')}
              aria-invalid={!!errors.password}
              className="h-9 text-sm"
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel className="text-xs">
              Confirmer le mot de passe
            </FieldLabel>
            <Input
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('confirm')}
              aria-invalid={!!errors.confirm}
              className="h-9 text-sm"
            />
            <FieldError>{errors.confirm?.message}</FieldError>
          </Field>
        </div>

        {/* Bouton d'inscription */}
        <Field className="mt-1">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer font-semibold shadow-md shadow-primary/20"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Inscription en cours...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Créer mon compte
              </>
            )}
          </Button>
          <FieldDescription className="text-center text-sm mt-2">
            Déjà un compte ?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline"
            >
              Se connecter
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
