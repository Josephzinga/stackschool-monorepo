'use client';

import { useState } from 'react';
import {
  api,
  CreateInvitationData,
  createInvitationSchema,
  parseAxiosError,
} from '@stackschool/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { allRoles, Controller, useForm, zodResolver } from '@stackschool/ui';
import { toast } from 'sonner';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Mail, Phone } from 'lucide-react';

interface CreateInvitationFormProps {
  schoolId: string;
  onSuccess?: () => void;
}

export function CreateInvitationForm({
  schoolId,
  onSuccess,
}: CreateInvitationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean>(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvitationData>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      schoolId,
      role: 'STUDENT',
      email: '',
      phoneNumber: '',
      message: '',
    },
  });

  async function onSubmit(data: CreateInvitationData) {
    setIsLoading(true);
    try {
      await api.post('/api/schools/invitations', data);
      toast.success('Invitation envoyée avec succès !');

      onSuccess?.();
    } catch (error: any) {
      const { message } = parseAxiosError(error);
      console.error(message);
      toast.error(message || "Erreur lors de l'envoi de l'invitation.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Rôle invité</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem value={r.value} key={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: errors.role?.message }]} />
            </Field>
          )}
        />

        <div className="flex flex-col gap-3">
          {isEmail ? (
            <Field>
              <FieldLabel htmlFor="emaim">Email</FieldLabel>
              <Input
                id="email"
                placeholder="exemple@email.com"
                {...register('email')}
              />
              <FieldError errors={[{ message: errors.email?.message }]} />
            </Field>
          ) : (
            <Field>
              <FieldLabel htmlFor="phoneNumber">
                Téléphone (WhatsApp)
              </FieldLabel>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <PhoneInput
                    onChange={field.onChange}
                    value={field.value}
                    className="phone-input-custom"
                    international
                    defaultCountry="ML"
                  />
                )}
              />
              <FieldError errors={[{ message: errors.phoneNumber?.message }]} />
            </Field>
          )}
          <Button
            variant="link"
            onClick={() => setIsEmail(!isEmail)}
            className="text-primary hover:text-primary/60 hover:underline"
          >
            <span className="flex gap-2 ">
              {isEmail ? (
                <>
                  <Phone /> Utiliser un numéro de téléphone
                </>
              ) : (
                <>
                  <Mail /> Utiliser l'adresse email{' '}
                </>
              )}
            </span>
          </Button>
        </div>

        <FieldDescription className="text-xs text-muted-foreground px-1">
          Remplissez au moins l'un des deux champs de contact.
        </FieldDescription>

        <FieldLabel>Message personnalisé (Optionnel)</FieldLabel>

        <Textarea
          placeholder="Bonjour, rejoignez notre école sur StackSchool..."
          className="resize-none"
          {...register('message')}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Envoi en cours...' : "Envoyer l'invitation"}
        </Button>
      </form>
    </div>
  );
}
