import { loginFormSchema } from '@stackschool/shared';
import { Request, Response, NextFunction } from 'express';
import { createServiceError } from '../utils/api-response';

const validateLogin = async ({
  req,
  res,
  next,
}: {
  req: Request;
  res: Response;
  next: NextFunction;
}) => {
  const result = loginFormSchema.safeParse(req.body);

  console.log('data', result.data, 'Error', result.error);
};
