import { Controller, useForm, zodResolver } from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { authService, loginFormSchema, LoginFormType, parseAxiosError } from '@stackschool/shared';
import Toast from 'react-native-toast-message';
import { FieldError } from './field';
import { Lock, Mail } from 'lucide-react-native';
import { SocialSections } from './social-section';
import { ToggleTheme } from '@/components/toggle-theme';
import Logo from './Logo';

export function SignInForm() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({ resolver: zodResolver(loginFormSchema), mode: 'onBlur' });
  const router = useRouter();

  const passwordInputRef = React.useRef<TextInput>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  function onEmailSubmitEditing() {
    console.log('onEmailSubmitEditing');
    passwordInputRef.current?.focus();
  }

  async function onSubmit(data: LoginFormType) {
    console.log('unsubmit');
    try {
      const res = await authService.login(data);
      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: res.message,
        });
        // router.replace("/dashboard");
        if (res.complteProfile) {
          router.push('/auth/complete-profile');
        }
      }
    } catch (err: any) {
      const { data, message, status } = parseAxiosError(err);
      console.log("erreur d'axios", message, data, status);
      Toast.show({
        type: 'error',
        text1: message || 'Erreur réseau',
      });
    }
  }

  return (
    <View className="gap-6">
      <Card className="  ">
        <CardHeader>
          <Logo />
          <CardTitle className="text-card! text-center text-xl sm:text-left">Bienvenue</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Accédez à votre espace scolaire pour communiquer, suivre et gérer les informations en
            temps réel.
          </CardDescription>
          <Separator className="flex-1" />

          <SocialSections />

          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">Ou continuer avec </Text>
            <Separator className="flex-1" />
          </View>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email ou nom d'utilisateur</Label>
              <Controller
                name="identifier"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    isValid={!!errors.identifier}
                    Icon={Mail}
                    id="identifier"
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
              {errors.identifier && <FieldError>{errors.identifier?.message}</FieldError>}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    router.push('/auth/forgot-password');
                  }}>
                  <Text className="font-normal leading-4">Mot de passe oublier?</Text>
                </Button>
              </View>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    isValid={!!errors.password}
                    isPassword
                    Icon={Lock}
                    ref={passwordInputRef}
                    id="password"
                    placeholder="********"
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && <FieldError>{errors.password?.message}</FieldError>}
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <Text>Connexion en cours...</Text> : <Text>Se connecter</Text>}
            </Button>
          </View>
          <View className="flex flex-row items-center justify-center  text-center text-sm">
            <Text className="text-sm">Pas de compte ? </Text>
            <Pressable
              onPress={() => {
                router.push('/auth/register');
              }}>
              <Text className="font-medium  underline underline-offset-4">Crée un compte</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
