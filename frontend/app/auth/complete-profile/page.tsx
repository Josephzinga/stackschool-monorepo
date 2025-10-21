"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}
export default function OnboaringPage() {
  const search = useSearchParams();
  const router = useRouter();
  const provider = search?.get("provider");

  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    return router.replace("/dashboard");
  };
  console.log(provider);

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-gray-800 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Veilliez Completer vos imformation</h1>
      </form>
    </div>
  );
}
