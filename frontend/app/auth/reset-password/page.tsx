"use client";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { registerFormSchema, RegisterFormType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

const ResetPasswordPage = () => {
  const search = useSearchParams();
  const token = search.get("token");
  console.log(token);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });

  const handleReset = ({ confirm, password }: RegisterFormType) => {
    console.log(confirm, password);
  };
  return (
    <Container>
      <Card className="w-100 bg-white/50 dark:bg-slate-700/50">
        <CardHeader>
          <CardDescription>
            Veuliez reinitialiser votre mot de passe
          </CardDescription>
          <CardContent className="w-full">
            <form
              onSubmit={handleSubmit(handleReset)}
              className="w-full space-y-4">
              <Field>
                <FieldLabel htmlFor="password">Nouveau mot de passe</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  {...register("password")}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                />
                <FieldError id="password-error">
                  {errors.password?.message}{" "}
                </FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm">
                  Confirmer votre mot de passe
                </FieldLabel>
                <Input
                  type="password"
                  id="confirm"
                  required
                  {...register("confirm")}
                  aria-describedby={
                    errors.confirm ? "confirm-error" : undefined
                  }
                  aria-invalid={!!errors.confirm}
                />
                <FieldError id="confirm-error">
                  {errors.confirm?.message}
                </FieldError>
              </Field>
              <Button type="submit" className="w-full text-white font-semibold">
                {isSubmitting ? (
                  <>
                    <Spinner /> Envoie en cours...
                  </>
                ) : (
                  <>Envoyer</>
                )}
              </Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;
