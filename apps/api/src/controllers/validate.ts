import {loginFormSchema, LoginFormType,} from "@stackschool/shared";


export const validateLogin = (data: LoginFormType) => {
  const result = loginFormSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error?.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return errors;
  }
};
