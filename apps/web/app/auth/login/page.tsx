"use client";

import {
  authService,
  LoginFormType,
  parseAxiosError,
} from "@stackschool/shared";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/Container";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async ({ identifier, password }: LoginFormType) => {
    try {
      const res = await authService.login({
        identifier,
        password,
      });
      if (res.ok) {
        router.push("/auth/finish?from=");
      }
      toast.success(res.message || "Connexion réussie");
    } catch (err: any) {
      const { message, data, status } = parseAxiosError(err);
      if (data?.isSocialOnly) {
        return toast.warning(data.message);
      }
      toast.error(message || "Erreur de connexion");
    }
  };
  return (
    <Container>
      <LoginForm handleLogin={handleLogin} className="w" />
    </Container>
  );
}
