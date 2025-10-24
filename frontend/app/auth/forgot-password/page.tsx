"use client";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { forgotPasswordSchema, FormDataType } from "@/lib/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export default function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const handleIdentifier = async ({ identifier }: FormDataType) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { identifier });
      if (res.data?.ok) {
        toast.success(res.data.message);
        const tempToken = res.data.tempToken;

        if (tempToken) {
          router.push(`/auth/verify-code?token=${tempToken}`);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur réseau");
    }
  };

  return (
    <Container>
      <Card className="dark:bg-slate-700/50 bg-white/50 backdrop-sm w-110 transition duration-150 ">
        <CardHeader>
          <CardTitle className="text-center text-white">
            Récupération de mot de passe
          </CardTitle>
          <CardDescription className="text-center">
            Entrez votre email, numéro WhatsApp ou nom d&apos;utilisateur pour
            recevoir un code de réinitialisation
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(handleIdentifier)}>
            <Field>
              <FieldLabel htmlFor="identifier">Identifiant *</FieldLabel>
              <Input
                id="identifier"
                type="text"
                {...register("identifier")}
                aria-invalid={!!errors.identifier}
                aria-describedby={
                  errors.identifier ? "error-identifier" : undefined
                }
              />

              {errors.identifier && (
                <FieldError id="error-identifier" className="flex gap-1">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {errors.identifier.message}
                </FieldError>
              )}

              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-200 mt-2 font-mono">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="hover:underline hover:cursor-pointer hover:text-blue-400">
                    Ex de formats acceptés :
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Email : example@domaine.com</li>
                      <li>Téléphone : +33 6 12 34 56 78 ou 0612345678</li>
                      <li>
                        Nom d&apos;tilisateur : 3-20 caractères (lettres,
                        chiffres, _)
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Field>

            <Button
              type="submit"
              className="w-full text-white mt-4 font-semibold"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Envoi en cours...
                </>
              ) : (
                <>Recevoir le code de réinitialisation</>
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <Link
              href="/auth/login"
              className="text-blue-500 hover:underline hover:text-blue-700 block">
              ← Retour à la connexion
            </Link>

            <div className="text-sm text-gray-500 dark:text-gray-100">
              <p>Vous recevrez un lien par email ou un code WhatsApp</p>
              <p>Valable pendant 15 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
