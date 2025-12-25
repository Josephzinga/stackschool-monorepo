import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';
import { Controller, useForm, zodResolver } from '@stackschool/ui';
import Toast from 'react-native-toast-message';
import {
  authService,
  parseAxiosError,
  registerFormSchema,
  RegisterFormType,
} from '@stackschool/shared';
import { useRouter } from 'expo-router';
import { FieldError } from './field';
import { Lock, Mail, Phone, User } from 'lucide-react-native';
import { SocialSections } from './social-section';

export function SignUpForm() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({ resolver: zodResolver(registerFormSchema), mode: 'onBlur' });
  const router = useRouter();

  const phoneNumberInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  function onUsernameSubmitEditing() {
    phoneNumberInputRef.current?.focus();
  }
  function onPhoneNumberSubmitEditing() {
    emailInputRef.current?.focus();
  }
  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }
  async function onSubmit({ username, phoneNumber, email, password, confirm }: RegisterFormType) {
    try {
      const res = await authService.register({
        username,
        phoneNumber,
        email,
        password,
        confirm,
      });

      if (res.ok) {
        if (res.profileCompleted) {
          router.replace('/auth/complete-profile');
        }
        Toast.show({
          type: 'success',
          text1: res.message || 'Authentification réussi',
        });
      }
    } catch (err: any) {
      const { message } = parseAxiosError(err);
      Toast.show({
        type: 'error',
        text1: message || 'Registration Failed',
      });
      console.log(err.message);
    }
  }

  return (
    <Card className="mb-8 rounded-none border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
      <CardHeader className="pt-0">
        <CardTitle className=" text-center text-xl sm:text-left">Crée un compte</CardTitle>
        <CardDescription className="text-center sm:text-left">
          Connecter vous à votre compte Google ou Facebook
        </CardDescription>
        <SocialSections />
      </CardHeader>
      <CardContent className="h-ful gap-6">
        <View className="gap-5">
          <View className="gap-1.5">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  Icon={User}
                  id="username"
                  placeholder="John Doe"
                  autoCapitalize="words"
                  onSubmitEditing={onUsernameSubmitEditing}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            {errors.username && <FieldError>{errors.username?.message}</FieldError>}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="phoneNumber">Numéro de télephone</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  Icon={Phone}
                  ref={phoneNumberInputRef}
                  id="phoneNumber"
                  placeholder="+1 234 567 890"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  onSubmitEditing={onPhoneNumberSubmitEditing}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.phoneNumber && <FieldError>{errors.phoneNumber?.message}</FieldError>}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  Icon={Mail}
                  ref={emailInputRef}
                  id="email"
                  placeholder="m@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <FieldError className="text-destructive">{errors.email.message}</FieldError>
            )}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  Icon={Lock}
                  isPassword
                  ref={passwordInputRef}
                  id="password"
                  placeholder="********"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                  returnKeyType="next"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && <FieldError>{errors.password?.message}</FieldError>}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="confirm">Confirmer le mot de passe</Label>
            <Controller
              name="confirm"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={confirmPasswordInputRef}
                  Icon={Lock}
                  isPassword
                  id="confirm"
                  secureTextEntry
                  placeholder="********"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType="send"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.confirm && <FieldError>{errors.confirm?.message}</FieldError>}
          </View>
          <Button className="w-full" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? <Text>Inscription en cours...</Text> : <Text>S&apos;inscrire</Text>}
          </Button>
        </View>
        <View className="flex flex-row justify-center gap-1 text-sm">
          <Text> Déjà un compte?</Text>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/auth/sign-in');
              }
            }}>
            <Text className="text-sm underline underline-offset-4">Connexion</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
