import { Controller, useForm, zodResolver } from '@stackschool/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { authServices, loginFormSchema, LoginFormType, parseAxiosError } from '@stackschool/shared';
import Toast from 'react-native-toast-message';
import { FieldError } from './field';
import { Lock, Mail } from 'lucide-react-native';
import { SocialSections } from './social-section';
import Logo from './Logo';
import { CustomButton } from '@/components/CustomButton';

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
      const res = await authServices.login(data);
      console.log('response ok', res);
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
      Toast.show({
        type: 'error',
        text1: message || 'Erreur réseau',
      });
    }
  }

  return (
    <Card className="h-full bg-slate-50 py-4 dark:bg-blue-900">
      <CardHeader>
        <Logo />
        <CardTitle className="text-card! font-inter-bold text-center text-xl sm:text-left">
          Bienvenue
        </CardTitle>
        <CardDescription className="text-center sm:text-left">
          Accédez à votre espace scolaire pour communiquer, suivre et gérer les informations en
          temps réel.
        </CardDescription>
      </CardHeader>
      <CardContent className=" gap-4">
        <View className="gap-3 ">
          <View className="gap-1.5">
            <Label htmlFor="email">Email ou nom d'utilisateur</Label>
            <Controller
              name="identifier"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  error={!!errors.identifier}
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
                <Text className="font-inter-medium text-sm leading-4 text-blue-700">
                  Mot de passe oublier?
                </Text>
              </Button>
            </View>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  error={!!errors.password}
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
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </View>
          <CustomButton
            className=" mt-1 w-full"
            onPress={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Connexion'}
          </CustomButton>
        </View>
        <View className="flex gap-6 px-4">
          <Text className=" text-md font-jost-medium w-full text-center text-muted-foreground">
            Ou continuer avec
          </Text>

          <SocialSections />
          <View className=" flex w-full flex-row items-center justify-center  text-center text-sm">
            <Text className="font-inter-meduim text-sm">Pas de compte? </Text>
            <Pressable
              onPress={() => {
                router.push('/auth/register');
              }}>
              <Text className="font-inter-semibold text-sm text-blue-700 underline underline-offset-4">
                Crée un compte
              </Text>
            </Pressable>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
