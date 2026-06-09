import { NextFunction, Request, Response } from 'express';
export declare function sendApiResponse(res: Response, statusCode: number, data?: any, ok?: boolean): Response<any, Record<string, any>> | undefined;
export declare function errorHandler(err: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=errorHandler.d.ts.map