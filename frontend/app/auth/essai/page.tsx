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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../../style/index.css";

interface FormData {
  identifier: string;
}

export default function ForgotPasswordPage() {
  const [inputType, setInputType] = useState<"any" | "phone" | "email">("any");
  const [phoneValue, setPhoneValue] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const identifierValue = watch("identifier");

  // Détection automatique du type d'identifiant
  const detectInputType = (value: string) => {
    // Si ça ressemble à un email
    if (value.includes("@") && value.includes(".")) {
      return "email";
    }

    // Si ça ressemble à un numéro de téléphone
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) {
      return "phone";
    }

    // Sinon, considérer comme username
    return "any";
  };

  const handleIdentifierChange = (value: string) => {
    const detectedType = detectInputType(value);
    setInputType(detectedType);

    if (detectedType === "phone") {
      setPhoneValue(value);
    }
  };

  const getPlaceholder = () => {
    switch (inputType) {
      case "phone":
        return "ex: +223 12 34 56 78";
      case "email":
        return "ex: email@exemple.com";
    }
  };

  const getInputType = () => {
    return inputType === "phone" ? "tel" : "text";
  };

  const handleSubmitForm = async (data: FormData) => {
    let finalIdentifier = data.identifier;

    // Si c'est un numéro, utiliser la version formatée du PhoneInput
    if (inputType === "phone" && phoneValue) {
      finalIdentifier = phoneValue;
    }
    console.log(finalIdentifier);

    try {
      // ... traitement de la réponse
    } catch (error) {
      // ... gestion des erreurs
    }
  };

  return (
    <Container>
      <Card className="dark:bg-slate-700/50 bg-white/50">
        <CardHeader>
          <CardTitle className="text-center">Mot de passe oublié</CardTitle>
          <CardDescription className="text-center">
            Entrez votre email, nom d'utilisateur ou numéro de téléphone
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Field>
              <FieldLabel htmlFor="identifier">Votre identifiant</FieldLabel>

              {inputType === "phone" ? (
                <div className="space-y-2">
                  <PhoneInput
                    international
                    defaultCountry="ML"
                    value={phoneValue}
                    onChange={(value) => {
                      setPhoneValue(value || "");
                      setValue("identifier", value || "");
                    }}
                    onBlur={() => {
                      if (phoneValue) {
                        setValue("identifier", phoneValue);
                      }
                    }}
                    placeholder="Entrez votre numéro"
                    className="phone-input-custom"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setInputType("any");
                      setValue("identifier", "");
                    }}
                    className="text-sm text-blue-500 hover:underline">
                    ← Utiliser un email ou nom d'utilisateur à la place
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    id="identifier"
                    type={getInputType()}
                    placeholder={getPlaceholder()}
                    {...register("identifier", {
                      onChange: (e) => handleIdentifierChange(e.target.value),
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setInputType("phone");
                      setValue("identifier", "");
                      setPhoneValue("");
                    }}
                    className="text-sm text-blue-500 hover:underline">
                    📱 Utiliser un numéro de téléphone à la place
                  </button>
                </div>
              )}

              {/* Indicateur visuel du type détecté */}
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-xs">Type détecté :</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    inputType === "phone"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}>
                  {inputType === "phone" ? "📞 Téléphone" : "📧 Email/Username"}
                </span>
              </div>
            </Field>

            <Button
              type="submit"
              className="w-full text-white mt-4"
              disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Continuer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
