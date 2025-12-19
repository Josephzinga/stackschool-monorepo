"use client";

import {Container} from "@/components/Container";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {authService, forgotPasswordSchema, FormDataType, parseAxiosError} from "@stackschool/shared";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useForm, zodResolver} from "@stackschool/ui";
import {toast} from "sonner";
import {AlertCircle, PhoneIcon} from "lucide-react";
import PhoneInput, {isValidPhoneNumber} from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {useState} from "react";

export default function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputType, setInputType] = useState<"any" | "phone" | "email">("any");
  const [phoneValue, setPhoneValue] = useState<string>("");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const detectInputType = (value: string) => {
    if (value.includes("@") && value.includes(".")) {
      return "email";
    }
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) {
      return "phone";
    }
    return "any";
  };

  const handleIdentifierChange = (value: string) => {
    const detectedType = detectInputType(value);
    setInputType(detectedType);
    console.log("value", value);

    if (detectedType === "phone") {
      setPhoneValue(value);
    }
  };
  console.log(inputType);
  console.log(isValidPhoneNumber(phoneValue));
  console.log(isSubmitting);

  const getInputType = () => {
    return inputType === "phone"
      ? "tel"
      : inputType === "email"
      ? "email"
      : "text";
  };
  console.log("identifier dehors");
  const handleIdentifier = async (data: FormDataType) => {
    let identifier = data.identifier;

    // Si c'est un numéro, utiliser la version formatée du PhoneInput
    if (inputType === "phone" && phoneValue) {
      identifier = phoneValue;
    }
    console.log("identifier", identifier);
    try {
      const res = await authService.forgotPassword(identifier);
      if (res.ok) {
        toast.success(res.message);
        const tempToken = res.tempToken;

        if (tempToken) {
          router.push(`/auth/verify-code?token=${tempToken}`);
        }
      }
    } catch (error: any) {
      const {message} = parseAxiosError(error)
      toast.error(message || "Erreur réseau");
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

              {inputType === "phone" ? (
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
                  placeholder="+223 07 12 34 56 78"

                />
              ) : (
                <Input
                  id="identifier"
                  placeholder="example@gmail.com ou nom d'utilisateur"
                  className="placeholder:text-sm"
                  type="text"
                  {...register("identifier", {
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
                  if (inputType === "phone") {
                    setValue("identifier", "");
                    setInputType("any");
                  } else {
                    setInputType("phone");
                    setValue("identifier", "");
                    setPhoneValue("");
                  }
                }}
                className="text-sm text-blue-500 hover:underline flex gap-1"
              >
                {inputType === "phone" ? (
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
              className="w-full text-white mt-4 font-semibold"
              disabled={
                isSubmitting || inputType === "phone"
                  ? !isValidPhoneNumber(phoneValue)
                  : false
              }
            >
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
              className="text-blue-500 hover:underline hover:text-blue-700 block"
            >
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
