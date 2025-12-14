"use client";

import {authService} from "@stackschool/shared";
import { LoginForm } from "@/components/login-form";
import { SubmitHandler } from "@stackschool/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container } from "@/components/Container";

interface IFormInput {
  identifier: string;
  password: string;
}
export default function LoginPage() {
  const router = useRouter();

  const handleLogin: SubmitHandler<IFormInput> = async ({
    identifier,
    password,
  }) => {
    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
      });
      const data = res.data;
      if (res.data?.isSocialOnly && res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }
      if (data?.ok && data?.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.isSocialOnly) {
        return toast.warning(data.message);
      }
      toast.error(data?.message || "Erreur de connexion");
    }
  };
  return (
    <Container>
      <LoginForm handleLogin={handleLogin} />
    </Container>
  );
}
