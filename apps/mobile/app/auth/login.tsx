import React from "react";
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
import {
  LoginFormType,
  loginFormSchema,
  authService,
} from "@stackschool/shared";

export default function Login() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema as any),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await authService.login(data as any);
      if (res?.isSocialOnly && res?.redirectUrl) {
        // ouvrir la redirection sociale dans le navigateur
        Alert.alert(
          "Redirection",
          "Redirection sociale non gérée dans l'app mobile."
        );
        return;
      }
      if (res?.ok && res?.redirectUrl) {
        router.push(res.redirectUrl);
        return;
      }
      Alert.alert("Info", res?.message || "Connexion réussie");
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err?.response?.data?.message || "Erreur de connexion"
      );
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white dark:bg-slate-800">
      <View className="w-full max-w-md">
        <Text className="text-2xl font-bold text-center mb-4">Connexion</Text>

        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <Text className="mb-1 text-sm">Email / Nom d'utilisateur</Text>
              <TextInput
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="email@example.com"
                className="border px-3 py-2 rounded-md"
                autoCapitalize="none"
              />
              {errors.identifier && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.identifier?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <Text className="mb-1 text-sm">Mot de passe</Text>
              <TextInput
                secureTextEntry
                value={value as any}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Mot de passe"
                className="border px-3 py-2 rounded-md"
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {String(errors.password?.message)}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-blue-600 py-3 rounded-md items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/forgot-password")}
          className="mt-4 items-center"
        >
          <Text className="text-sm text-sky-600">Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
