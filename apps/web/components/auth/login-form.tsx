'use client';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator,} from '@/components/ui/field';
import {Input} from '@/components/ui/input';
import {FacebookIcon, GoogleIcon} from '../icons';
import {useState} from 'react';
import {useForm, zodResolver} from '@stackschool/ui';
import Link from 'next/link';
import {Eye, EyeOff, Lock, Mail} from 'lucide-react';
import {Spinner} from '../ui/spinner';
import {loginFormSchema, LoginFormType} from '@stackschool/contracts';
import {ButtonSocial} from './button-social';

interface LoginFormProps {
  className?: string;
  handleLogin: (values: LoginFormType) => void;
}

export function LoginForm({ className, handleLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
  });

  return (
      <form onSubmit={handleSubmit(handleLogin)} className={cn('w-full max-w-104 mx-auto', className)}>
        <FieldGroup className="gap-6">
          {/* Entête */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Bienvenue sur StackSchool</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour accéder à vos cours, vos notes et votre espace pédagogique.
            </p>
          </div>

          {/* Boutons sociaux */}
          <div className="flex gap-3 w-full justify-center">
            <ButtonSocial provider="google" className="flex-1 max-w-45" icon={<GoogleIcon />} />
            <ButtonSocial provider="facebook" className="flex-1 max-w-45" icon={<FacebookIcon />} />
          </div>

          <FieldSeparator className="flex items-center">
          <span className="px-2 text-xs font-medium text-muted-foreground bg-background">
            Ou connectez-vous avec votre compte
          </span>
          </FieldSeparator>

          {/* Champs du formulaire */}
          <FieldGroup className="space-y-2">
            <Field>
              <FieldLabel htmlFor="identifier">Email ou nom d'utilisateur</FieldLabel>
              <Input
                  id="identifier"
                  type="text"
                  placeholder="exemple@ecole.fr ou nom.utilisateur"
                  icon={Mail}
                  autoComplete="username"
                  {...register('identifier')}
                  aria-invalid={!!errors.identifier}
                  aria-describedby={errors.identifier ? 'identifier-error' : undefined}
              />
              <FieldError id="identifier-error">{errors.identifier?.message}</FieldError>
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-primary hover:underline hover:text-primary/80"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe sécurisé"
                  icon={Lock}
                  autoComplete="current-password"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  rightElement={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
              />
              <FieldError id="password-error">{errors.password?.message}</FieldError>
            </Field>

            <Field>
              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                      'w-full font-semibold transition-all',
                      isSubmitting && 'opacity-70 cursor-not-allowed'
                  )}
              >
                {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                ) : (
                    'Se connecter'
                )}
              </Button>
              <FieldDescription className="text-center text-sm">
                Pas encore inscrit ?{' '}
                <Link href="/auth/register" className="font-medium text-primary hover:underline">
                  Créer un compte
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
  );
}
