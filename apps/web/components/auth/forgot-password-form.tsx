'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft, Phone} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {cn} from '@/lib/utils';
import {authServices, parseAxiosError} from '@stackschool/contracts';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Field, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';
import {Spinner} from '@/components/ui/spinner';

const forgotPasswordSchema = z.object({
    identifier: z.string().min(1, 'Veuillez entrer votre email, numéro ou nom d\'utilisateur'),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
    className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
    const router = useRouter();
    const [inputType, setInputType] = useState<'any' | 'phone' | 'email'>('any');
    const [phoneValue, setPhoneValue] = useState<string>('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormType>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
    });

    const detectInputType = (value: string) => {
        if (value.includes('@') && value.includes('.')) return 'email';
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) return 'phone';
        return 'any';
    };

    const handleIdentifierChange = (value: string) => {
        setInputType(detectInputType(value));
        if (detectInputType(value) === 'phone') {
            setPhoneValue(value);
        }
    };

    const onSubmit = async (data: ForgotPasswordFormType) => {
        let identifier = data.identifier;
        if (inputType === 'phone' && phoneValue) {
            identifier = phoneValue;
        }

        try {
            const res = await authServices.forgotPassword(identifier);
            toast.success(res.message);
            if (res.method === 'whatsapp') {
                setTimeout(() => router.push('/auth/verify-code'), 1000);
            } else {
                setTimeout(() => router.push('/auth/verify-code'), 1000);
            }
        } catch (error: any) {
            const { message } = parseAxiosError(error);
            toast.error(message || 'Erreur réseau');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn('w-full max-w-md mx-auto', className)}>
            <FieldGroup className="gap-4">
                {/* En-tête */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">
                        Mot de passe oublié ?
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Entrez votre email, numéro WhatsApp ou nom d'utilisateur pour recevoir un code de réinitialisation.
                    </p>
                </div>

                {/* Champ d'identification */}
                <Field>
                    <FieldLabel htmlFor="identifier" className="text-sm font-medium">
                        Email, numéro ou nom d'utilisateur
                    </FieldLabel>
                    {inputType === 'phone' ? (
                        <PhoneInput
                            international
                            defaultCountry="ML"
                            className="phone-input-custom h-11 rounded-xl"
                            value={phoneValue}
                            onChange={(value) => {
                                setPhoneValue(value || '');
                                setValue('identifier', value || '');
                            }}
                            onBlur={() => {
                                if (phoneValue) setValue('identifier', phoneValue);
                            }}
                            placeholder="+223 07 12 34 56 78"
                        />
                    ) : (
                        <Input
                            id="identifier"
                            placeholder="exemple@ecole.fr, nom_utilisateur ou +223..."
                            className="h-11 rounded-xl"
                            {...register('identifier', {
                                onChange: (e) => handleIdentifierChange(e.target.value),
                            })}
                            aria-invalid={!!errors.identifier}
                        />
                    )}
                    <FieldError>{errors.identifier?.message}</FieldError>

                    <button
                        type="button"
                        onClick={() => {
                            if (inputType === 'phone') {
                                setValue('identifier', '');
                                setInputType('any');
                            } else {
                                setInputType('phone');
                                setValue('identifier', '');
                                setPhoneValue('');
                            }
                        }}
                        className="mt-1 text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                        {inputType === 'phone' ? (
                            <>
                                <ArrowLeft className="h-3 w-3" />
                                Utiliser un email ou nom d'utilisateur
                            </>
                        ) : (
                            <>
                                <Phone className="h-3 w-3" />
                                Utiliser un numéro de téléphone
                            </>
                        )}
                    </button>
                </Field>

                {/* Bouton d'envoi */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Envoi en cours...
                        </>
                    ) : (
                        'Recevoir le code de réinitialisation'
                    )}
                </Button>

                {/* Liens de retour */}
                <div className="text-center space-y-2 mt-2">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Retour à la connexion
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        Vous recevrez un lien par email ou un code WhatsApp valable 15 minutes.
                    </p>
                </div>
            </FieldGroup>
        </form>
    );
}
