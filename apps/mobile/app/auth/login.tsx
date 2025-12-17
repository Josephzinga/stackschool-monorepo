import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Controller, useForm } from '@stackschool/ui';
import { zodResolver } from '@stackschool/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginFormType, loginFormSchema, authService } from '@stackschool/shared';
import { SignInForm } from '@/components/sign-in-form';

export default function Login() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema as any),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await authService.login(data as any);
      if (res?.isSocialOnly && res?.redirectUrl) {
        // ouvrir la redirection sociale dans le navigateur
        Alert.alert('Redirection', "Redirection sociale non gérée dans l'app mobile.");
        return;
      }
      if (res?.ok && res?.redirectUrl) {
        router.push(res.redirectUrl);
        return;
      }
      Alert.alert('Info', res?.message || 'Connexion réussie');
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <SignInForm />
      </View>
    </ScrollView>
  );
}
