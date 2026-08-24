// components/auth/VerifyCodeForm.tsx
'use client';

import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft, CheckCircle, RotateCw} from 'lucide-react';
import {InputOTP, InputOTPGroup, InputOTPSlot} from '@/components/ui/input-otp';
import {REGEXP_ONLY_DIGITS} from 'input-otp';
import {cn} from '@/lib/utils';
import {authServices, parseAxiosError, VerifyCodeFormType, VerifyCodeSchema} from '@stackschool/contracts';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Field, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';
import {Spinner} from '@/components/ui/spinner';

interface VerifyCodeFormProps {
    className?: string;
}

export function VerifyCodeForm({ className }: VerifyCodeFormProps) {
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

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = async ({ code }: VerifyCodeFormType) => {
        try {
            const res = await authServices.verifyCode(code, null);
            toast.success(res.message);
            if (res.ok) {
                router.push('/auth/reset-password');
            }
        } catch (error: any) {
            const { message } = parseAxiosError(error);
            toast.error(error?.data?.errors?.message || message || 'Code invalide ou expiré');
        }
    };

    const handleResendCode = async () => {
        try {
            const res = await authServices.resendCode();
            if (res.ok) {
                toast.success(res.message || 'Nouveau code envoyé');
                setCountdown(60);
            }
        } catch (error: any) {
            toast.error(error?.errors?.message || "Erreur lors de l'envoi");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('w-full max-w-md mx-auto', className)}>
            <FieldGroup className="gap-4">
                {/* En-tête */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-7 w-7 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Vérification du code
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Entrez le code à 6 chiffres que nous venons de vous envoyer par WhatsApp ou email.
                    </p>
                </div>

                {/* Champ OTP */}
                <Field>
                    <FieldLabel htmlFor="code" className="text-center block text-sm font-medium">
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
                                    className="justify-center gap-2"
                                >
                                    <InputOTPGroup>
                                        {[...Array(6)].map((_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="h-12 w-12 text-lg font-mono focus:border-primary"
                                                aria-invalid={!!errors.code}
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                    </div>
                    <FieldError className="text-center">{errors.code?.message}</FieldError>
                </Field>

                {/* Bouton de vérification */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 cursor-pointer w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Vérification en cours...
                        </>
                    ) : (
                        'Vérifier le code'
                    )}
                </Button>

                {/* Renvoi et retour */}
                <div className="text-center space-y-3">
                    {countdown > 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nouveau code dans <span className="font-medium">{countdown}</span> secondes
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            <RotateCw className="h-3 w-3" />
                            Renvoyer le code
                        </button>
                    )}
                    <div className="pt-2 border-t">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </FieldGroup>
        </form>
    );
}
