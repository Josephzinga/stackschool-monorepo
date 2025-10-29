"use client";

import api from "@/services/api";
import { LoginForm } from "@/components/login-form";
import { SubmitHandler } from "react-hook-form";
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
      const res = await api.post("/api/auth/login", {
        identifier,
        password,
      });

      if (res.data?.isSocialOnly && res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }
      if (res.data?.ok && res.data?.redirectUrl) {
        router.push(res.data.redirectUrl);
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.isSocialOnly && data?.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      toast.error(data?.message || "Erreur de connexion");
      console.log(data.message);
    }
  };
  return (
    <Container>
      <LoginForm handleLogin={handleLogin} />
    </Container>
  );
}
