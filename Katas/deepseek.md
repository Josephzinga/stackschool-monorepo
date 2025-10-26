Je trouve ces deux pages globalement bien structurées, mais voici mon analyse détaillée avec des suggestions d'amélioration :

## 🎯 **Page VerifyCode - Points positifs et améliorations**

### ✅ **Points forts :**

- Bon usage de `InputOTP` pour une UX optimale
- Gestion propre des erreurs et loading states
- Redirection automatique après succès

### 🔧 **Améliorations suggérées :**

```tsx
import { useState, useEffect } from "react";

export default function VerifyCode() {
  const search = useSearchParams();
  const router = useRouter();
  const tempToken = search.get("token");
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VerifyCodeFormType>({
    resolver: zodResolver(VerifyCodeSchema),
    mode: "onBlur",
  });

  // Compte à rebours pour le renvoi de code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCode = async ({ code }: VerifyCodeFormType) => {
    try {
      const res = await api.post("/api/auth/verify-code", { code, tempToken });
      toast.success(res?.data.message);
      if (res?.data.resetToken) {
        router.push(`/auth/reset-password?token=${res.data.resetToken}`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Code invalide";
      toast.error(errorMessage);

      // Focus automatique sur le champ OTP en cas d'erreur
      document.getElementById("code")?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await api.post("/api/auth/resend-code", { tempToken });
      if (res.data?.ok) {
        toast.success("Nouveau code envoyé");
        setCountdown(60); // 60 secondes d'attente
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <Container>
      <Card className="!w-100 bg-white/50 dark:bg-slate-700/50 max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Vérification du code</CardTitle>
          <CardDescription>
            Entrez le code à 6 chiffres envoyé sur WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleCode)} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="code" className="text-center block">
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
                      aria-invalid={!!errors.code}
                      aria-describedby={errors.code ? "code-error" : undefined}
                      className="justify-center">
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-12 text-lg border-2"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>

              <FieldError id="code-error" className="text-center mt-2">
                {errors.code?.message}
              </FieldError>
            </Field>

            <Button
              type="submit"
              className="w-full text-white font-semibold"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Vérification...
                </>
              ) : (
                "Vérifier le code"
              )}
            </Button>
          </form>

          {/* Section renvoi de code */}
          <div className="text-center space-y-3">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nouveau code disponible dans {countdown} secondes
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 hover:underline text-sm">
                Renvoyer le code
              </button>
            )}

            <div className="pt-4 border-t">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline text-sm">
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
```

## 🎯 **Page ForgotPasswordPage - Analyse et améliorations**

### ✅ **Points forts :**

- Bonne structure avec validation Zod
- Collapsible pour les exemples (très UX)
- Gestion d'erreurs complète

### 🔧 **Améliorations suggérées :**

```tsx
export default function ForgotPasswordPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountryDetecting, setIsCountryDetecting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormDataType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const identifierValue = watch("identifier");

  // Détection automatique du type d'input
  useEffect(() => {
    if (identifierValue?.includes("@")) {
      // C'est probablement un email
      setInputType("email");
    } else if (
      /^[\d\s+()-]+$/.test(identifierValue) &&
      identifierValue.replace(/\D/g, "").length >= 8
    ) {
      // C'est probablement un numéro
      setInputType("phone");
    } else {
      setInputType("username");
    }
  }, [identifierValue]);

  const handleIdentifier = async ({ identifier }: FormDataType) => {
    try {
      const res = await api.post("/api/auth/forgot-password", { identifier });
      if (res.data?.ok) {
        toast.success(res.data.message);
        const tempToken = res.data.tempToken;

        if (tempToken) {
          router.push(`/auth/verify-code?token=${tempToken}`);
        } else {
          // Si pas de tempToken (cas email), rediriger vers une page de confirmation
          router.push("/auth/check-email");
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erreur réseau";
      toast.error(errorMessage);
    }
  };

  const getInputType = () => {
    if (identifierValue?.includes("@")) return "email";
    if (/^[\d\s+()-]+$/.test(identifierValue)) return "tel";
    return "text";
  };

  const getPlaceholder = () => {
    if (identifierValue?.includes("@")) {
      return "email@exemple.com";
    } else if (/^[\d+]/.test(identifierValue)) {
      return "+33 6 12 34 56 78";
    }
    return "nom_utilisateur";
  };

  return (
    <Container>
      <Card className="dark:bg-slate-700/50 bg-white/50 backdrop-blur-sm max-w-md mx-auto transition-all duration-200">
        <CardHeader className="space-y-4">
          <CardTitle className="text-center text-xl">
            Mot de passe oublié ?
          </CardTitle>
          <CardDescription className="text-center text-balance">
            Entrez votre email, numéro WhatsApp ou nom d'utilisateur pour
            réinitialiser votre mot de passe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleIdentifier)} className="space-y-4">
            <Field>
              <FieldLabel
                htmlFor="identifier"
                className="flex items-center gap-2">
                Identifiant *
                {isDirty && (
                  <span className="text-xs font-normal text-gray-500 capitalize">
                    ({getInputType()} détecté)
                  </span>
                )}
              </FieldLabel>

              <Input
                id="identifier"
                type={getInputType()}
                placeholder={getPlaceholder()}
                {...register("identifier")}
                aria-invalid={!!errors.identifier}
                aria-describedby={
                  errors.identifier ? "error-identifier" : undefined
                }
                className="transition-all duration-200"
              />

              {errors.identifier && (
                <FieldError
                  id="error-identifier"
                  className="flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.identifier.message}
                </FieldError>
              )}

              {/* Section exemples améliorée */}
              <div className="mt-3">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      {isOpen
                        ? "▲ Masquer les exemples"
                        : "▼ Voir les formats acceptés"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 animate-in fade-in">
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <strong>Email :</strong>
                        <div className="font-mono text-xs">
                          example@domaine.com
                        </div>
                      </div>
                      <div>
                        <strong>Téléphone :</strong>
                        <div className="font-mono text-xs">
                          +33 6 12 34 56 78 ou 0612345678
                        </div>
                      </div>
                      <div>
                        <strong>Nom d'utilisateur :</strong>
                        <div className="font-mono text-xs">
                          3-20 caractères (lettres, chiffres, _)
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Field>

            <Button
              type="submit"
              className="w-full text-white font-semibold py-2.5"
              disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" />
                  Envoi en cours...
                </>
              ) : (
                "Recevoir le code de réinitialisation"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-blue-600 hover:underline text-sm">
              ← Retour à la connexion
            </Link>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>📧 Lien de réinitialisation par email</p>
              <p>📱 Code WhatsApp valable 15 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
```

## 🚀 **Améliorations globales apportées :**

### **VerifyCode :**

1. **Compte à rebours** pour le renvoi de code
2. **Bouton renvoyer le code** fonctionnel
3. **Meilleure accessibilité** avec focus automatique
4. **Messages d'erreur** plus précis
5. **Structure visuelle** améliorée

### **ForgotPasswordPage :**

1. **Détection automatique** du type d'identifiant
2. **Placeholder dynamique** selon le type détecté
3. **Indicateur visuel** du type détecté
4. **Meilleur feedback** de validation
5. **Collapsible amélioré** avec meilleur design
6. **Redirection conditionnelle** (email vs WhatsApp)

## 📱 **Points d'attention :**

1. **Performance** : Éviter les re-rendus inutiles
2. **Accessibilité** : Bien gérer les labels et descriptions
3. **Responsive** : Tester sur mobile
4. **Erreurs réseau** : Gérer les cas hors ligne

Les deux pages sont bien parties et ces améliorations devraient rendre l'expérience utilisateur encore plus fluide et professionnelle !
