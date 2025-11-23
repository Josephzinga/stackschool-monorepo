import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@stackschool/shared";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseCompleteProfileStore } from "@/store/complete-profiile-store";
import { Spinner } from "@/components/ui/spinner";

const invitationSchema = z.object({
  invitationCode: z
    .string()
    .min(5, "Le code d'invitation doit contenir au moins 6 lettre"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

export default function InvitationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
  });
  const { setSchoolData, setCurrentStep } = UseCompleteProfileStore();

  const onSubmit = async ({ invitationCode }: InvitationFormData) => {
    setSchoolData({ type: "invite", invitationCode });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="invitationCode">Code d'invitation *</FieldLabel>
        <Input
          id="invitationCode"
          type="text"
          {...register("invitationCode")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Entrez le code d'invitation"
          aria-invalid={!!errors.invitationCode}
        />

        <FieldError>{errors.invitationCode?.message}</FieldError>
      </Field>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex! w-full text-white font-semibold">
        {isSubmitting ? (
          <>
            <Spinner /> Vérification...
          </>
        ) : (
          "Rejoindre avec l'invitation"
        )}
      </Button>
    </form>
  );
}
