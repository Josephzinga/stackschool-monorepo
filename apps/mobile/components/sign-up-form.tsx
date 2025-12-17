import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

      if (res.requireVerification) {
        return router.replace(`/auth/verify-code?userId=${res.user.id}`);
      }
      if (res.profileCompleted) {
        Toast.show({
          type: 'info',
          text1: 'Profile Completed',
          text2: 'Your profile is now complete.',
        });
        return console.log('profileCompleted', res.profileCompleted);
      }
    } catch (err: any) {
      const error = parseAxiosError(err);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
      });
      console.log(err.message);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create an account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
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
              {errors.username && (
                <Text className="text-destructive">{errors.username.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
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
              {errors.phoneNumber && (
                <Text className="text-destructive">{errors.phoneNumber.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
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
              {errors.email && <Text className="text-destructive">{errors.email.message}</Text>}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    secureTextEntry
                    placeholder="********"
                    onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                    returnKeyType="next"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-destructive">{errors.password.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Controller
                name="confirm"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={confirmPasswordInputRef}
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
              {errors.confirm && <Text className="text-destructive">{errors.confirm.message}</Text>}
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <Text>Creating account...</Text> : <Text>Create account</Text>}
            </Button>
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/auth/sign-in');
                }
              }}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
