import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "@stackschool/ui";
import { zodResolver } from "@stackschool/ui";
import { forgotPasswordSchema, FormDataType } from "@stackschool/shared";

export default function ForgotPassword() {
  const router = useRouter();
  const [phoneValue, setPhoneValue] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(forgotPasswordSchema as any),
    mode: "onBlur",
  });

  const detectInputType = (value: string) => {
    if (value.includes("@") && value.includes(".")) return "email";
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length >= 8 && /^[\d\s+()-]+$/.test(value)) return "phone";
    return "any";
  };

  const handleIdentifierChange = (value: string) => {
    const type = detectInputType(value);
    if (type === "phone") setPhoneValue(value);
    setValue("identifier", value);
  };

  const onSubmit = async (data: FormDataType) => {
    let identifier = data.identifier;
    if (detectInputType(identifier) === "phone" && phoneValue)
      identifier = phoneValue;

    try {
      const res = await fetch(`/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const json = await res.json();
      if (json?.ok) {
        Alert.alert("Succès", json.message || "Code envoyé");
        const tempToken = json.tempToken;
        if (tempToken) router.push(`/auth/verify-code?token=${tempToken}`);
        return;
      }
      Alert.alert("Erreur", json?.message || "Erreur réseau");
    } catch (err: any) {
      Alert.alert("Erreur", err?.message || "Erreur réseau");
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">
          Récupération de mot de passe
        </Text>

        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm">
                Identifiant (email, téléphone ou nom d'utilisateur)
              </Text>
              <TextInput
                value={value as any}
                onChangeText={(v) => {
                  onChange(v);
                  handleIdentifierChange(v);
                }}
                onBlur={onBlur}
                placeholder="example@gmail.com ou +223 77 00 00 00"
                className="border px-3 py-2 rounded-md"
              />
              {errors.identifier && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.identifier?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-emerald-600 py-3 rounded-md items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Recevoir le code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-sky-600">← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
