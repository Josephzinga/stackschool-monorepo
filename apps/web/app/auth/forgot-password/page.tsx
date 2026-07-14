'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
  authServices,
  forgotPasswordSchema,
  FormDataType,
  parseAxiosError,
  api,
} from '@stackschool/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, zodResolver } from '@stackschool/ui';
import { toast } from 'sonner';
import { AlertCircle, PhoneIcon } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [inputType, setInputType] = useState<'any' | 'phone' | 'email'>('any');
  const [phoneValue, setPhoneValue] = useState<string>('');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const detectInputType = (value: string) => {
    if (value.includes('@') && value.includes('.')) {
      return 'email';
    }
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) {
      return 'phone';
    }
    return 'any';
  };

  const handleIdentifierChange = (value: string) => {
    const detectedType = detectInputType(value);
    setInputType(detectedType);

    if (detectedType === 'phone') {
      setPhoneValue(value);
    }
  };

  const handleIdentifier = async (data: FormDataType) => {
    let identifier = data.identifier;

    if (inputType === 'phone' && phoneValue) {
      identifier = phoneValue;
    }

    try {
      const res = await authServices.forgotPassword(identifier);
      if (res.ok) {
        toast.success(res.message);
        if (res.method === 'whatsapp') {
          setTimeout(() => router.push(`/auth/verify-code}`), 1000);
        }
      }
    } catch (error: any) {
      const { message } = parseAxiosError(error);
      toast.error(message || 'Erreur réseau');
    }
  };

  return (
    <Container>
      <Card className="backdrop-sm w-110  ">
        <CardHeader>
          <CardTitle className="text-center ">
            Récupération de mot de passe
          </CardTitle>
          <CardDescription className="text-center">
            Entrez votre email, numéro WhatsApp ou nom d&apos;utilisateur pour
            recevoir un code de réinitialisation
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(handleIdentifier)} className="space-y-3">
            <Field>
              <FieldLabel htmlFor="identifier">
                Entrez votre email, nom complet ou numéro
              </FieldLabel>

              {inputType === 'phone' ? (
                <PhoneInput
                  international
                  defaultCountry="ML"
                  className="phone-input-custom"
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value || '');
                    setValue('identifier', value || '');
                  }}
                  onBlur={() => {
                    if (phoneValue) {
                      setValue('identifier', phoneValue);
                    }
                  }}
                  placeholder="+223 07 12 34 56 78"
                />
              ) : (
                <Input
                  id="identifier"
                  className="placeholder:text-sm"
                  aria-invalid={!!errors.identifier}
                  type="text"
                  {...register('identifier', {
                    onChange: (e) => handleIdentifierChange(e.target.value),
                  })}
                />
              )}
              {errors.identifier && (
                <FieldError id="error-identifier" className="flex gap-1">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {errors.identifier.message}
                </FieldError>
              )}

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
                className="text-sm text-primary hover:underline flex gap-1"
              >
                {inputType === 'phone' ? (
                  "← Utiliser un email ou nom d'utilisateur à la place"
                ) : (
                  <>
                    <PhoneIcon size={17} /> Utiliser un numéro de téléphone à la
                    place
                  </>
                )}
              </button>
            </Field>

            <Button
              type="submit"
              className="w-full  mt-4 font-semibold font-inter"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Envoi en cours...
                </>
              ) : (
                'Recevoir le code de réinitialisation'
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <Link
              href="/auth/login"
              className="hover:underline block text-sm text-primary/90 font-inter "
            >
              ← Retour à la connexion
            </Link>

            <Link
              href="/auth/verify-code"
              className="hover:underline block text-sm text-primary/90 font-inter "
            >
              Vérifier le code{' '}
            </Link>

            <p className="text-sm font-jost text-foreground/85 tracking-tight">
              Vous recevrez un lien par email ou un code WhatsApp Valable
              pendant 15 minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
