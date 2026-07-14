'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCompleteProfileStore, zodResolver } from '@stackschool/ui';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { api, parseAxiosError } from '@stackschool/contracts';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

// Schéma simple pour vérifier le code
const verifyInvitationSchema = z.object({
  invitationCode: z.string().min(1, "Le code d'invitation est requis"),
});

type VerifyInvitationData = z.infer<typeof verifyInvitationSchema>;

export function InvitationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setSchoolData } = useCompleteProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyInvitationData>({
    resolver: zodResolver(verifyInvitationSchema),
    defaultValues: {
      invitationCode: '',
    },
    mode: 'onBlur',
  });

  async function onSubmit(data: VerifyInvitationData) {
    setIsLoading(true);
    try {
      // Appel API pour vérifier le code et récupérer les infos de l'école
      const res = await api.post(
        '/api/complete-profile/verify-invitation',
        data,
      );

      if (res.data.ok) {
        toast.success('Code valide !');

        setSchoolData({
          type: 'invite',
          invitationCode: data.invitationCode,
        });
      }
    } catch (error: any) {
      const { message } = parseAxiosError(error);
      toast.error(message || "Code d'invitation invalide.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel>Code d'invitation</FieldLabel>

          <Input
            placeholder="Entrez votre code reçu par SMS/Email"
            {...register('invitationCode')}
          />

          <FieldError errors={[{ message: errors.invitationCode?.message }]} />
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Vérification...' : "Rejoindre l'école"}
        </Button>
      </form>
    </div>
  );
}
