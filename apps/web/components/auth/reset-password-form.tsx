'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft, CheckCircle2, Lock} from 'lucide-react';
import {cn} from '@/lib/utils';
import {authServices, parseAxiosError} from '@stackschool/contracts';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Field, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';
import {Spinner} from '@/components/ui/spinner';

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        confirm: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    })
    .refine((data) => data.password === data.confirm, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirm'],
    });

type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    className?: string;
    token: string;
}

export function ResetPasswordForm({ className, token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormType>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
    });

    const passwordValue = watch('password');

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

    const onSubmit = async (data: ResetPasswordFormType) => {
        try {
            const res = await authServices.resetPassword(token, data.password, data.confirm);
            if (res.ok) {
                toast.success(res.data?.message || 'Mot de passe réinitialisé avec succès');
                setIsSuccess(true);
                setTimeout(() => router.push('/auth/login'), 3000);
            }
        } catch (error: any) {
            const { message } = parseAxiosError(error);
            toast.error(message || 'Erreur lors de la réinitialisation');
            if (error.response?.status === 400) {
                setTimeout(() => router.push('/auth/forgot-password'), 2000);
            }
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-md mx-auto text-center">
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                    <h2 className="text-2xl font-bold">Mot de passe réinitialisé !</h2>
                    <p className="text-sm text-muted-foreground">Votre mot de passe a été modifié avec succès.</p>
                    <p className="text-xs text-muted-foreground">Redirection vers la page de connexion...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('w-full max-w-md mx-auto', className)}>
            <FieldGroup className="gap-4">
                {/* En-tête */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Lock className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Nouveau mot de passe
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Choisissez un mot de passe fort et sécurisé pour protéger votre compte.
                    </p>
                </div>

                {/* Mot de passe */}
                <Field>
                    <FieldLabel htmlFor="password" className="text-sm font-medium">
                        Nouveau mot de passe
                    </FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        isPassword
                        placeholder="••••••••"
                        {...register('password')}
                        aria-invalid={!!errors.password}
                        className="h-11 rounded-xl pr-11"
                    />
                    <FieldError>{errors.password?.message}</FieldError>
                    {passwordValue && (
                        <div className="mt-2 space-y-1">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                        key={level}
                                        className={cn(
                                            'h-1 flex-1 rounded',
                                            level <= passwordStrength
                                                ? level <= 2
                                                    ? 'bg-red-500'
                                                    : level <= 3
                                                        ? 'bg-yellow-500'
                                                        : 'bg-green-500'
                                                : 'bg-gray-200'
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {passwordStrength <= 2 && 'Faible'}
                                {passwordStrength === 3 && 'Moyen'}
                                {passwordStrength >= 4 && 'Fort'}
                            </p>
                        </div>
                    )}
                </Field>

                {/* Confirmation */}
                <Field>
                    <FieldLabel htmlFor="confirm" className="text-sm font-medium">
                        Confirmer le mot de passe
                    </FieldLabel>
                    <Input
                        id="confirm"
                        type="password"
                        isPassword
                        placeholder="••••••••"
                        {...register('confirm')}
                        aria-invalid={!!errors.confirm}
                        className="h-11 rounded-xl pr-11"
                    />
                    <FieldError>{errors.confirm?.message}</FieldError>
                </Field>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Réinitialisation en cours...
                        </>
                    ) : (
                        'Réinitialiser le mot de passe'
                    )}
                </Button>

                <div className="text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Retour à la connexion
                    </Link>
                </div>
            </FieldGroup>
        </form>
    );
}
