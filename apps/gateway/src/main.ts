import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import helmet from 'helmet';
import type { ErrorRequestHandler } from 'express';
import { doubleCsrf } from 'csrf-csrf';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SchoolContextInterceptor } from './common/interceptors/school-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT', 4000);

  const pgSession = connectPgSimple(session);
  const pgPool = new Pool({
    connectionString: configService.get('DATABASE_URL'),
  });
  const SESSION_TTL = 1000 * 60 * 60; // 1h;

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.enableCors({
    origin: [
      (configService.get('FRONTEND_URL') as string) || '*',
      'http://localhost:3000',
      'https://sandbox.embed.apollographql.com',
      'https://studio.apollographql.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-csrf-token',
      'Accept',
      'CSRF-Token',
      'X-Requested-With',
      'x-school-id',
      'Access-Control-Allow-Origin',
      'Cookie',
    ],
    exposedHeaders: ['x-csrf-token'],
  });

  app.use(
    session({
      store: new pgSession({ pool: pgPool, tableName: 'Session' }),
      name: 'sid',
      secret: configService.get('SESSION_SECRET') || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get('NODE_ENV') === 'production',
        httpOnly: true,
        maxAge: SESSION_TTL,
        sameSite: 'lax',
      },
    }),
  );

  app.use(cookieParser.default());
  app.useGlobalInterceptors(new SchoolContextInterceptor());
  app.use(passport.initialize());
  app.use(passport.session());

  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => configService.get('CSRF_SECRET') as string,
    getSessionIdentifier: (req) => req.sessionID,
    skipCsrfProtection: (req) =>
      req.url.includes('api') || req.path === '/graphql',
    cookieName: '__localhost-3000.x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      secure: configService.get('NODE_ENV') === 'production',
      httpOnly: true,
      path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    doubleCsrfProtection(req, res, next);
  });

  const csrfErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const error = err as { code?: string; status?: number };

    if (error.code === 'EBADCSRFTOKEN') {
      const status = typeof error.status === 'number' ? error.status : 403;
      return res.status(status).json({
        ok: false,
        statusCode: status,
        message: 'Jeton CSRF invalide ou manquant',
        error: 'csrf-missing',
      });
    }

    next(err);
  };

  app.use(csrfErrorHandler);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, () => {
    console.log('Server is running on Port', PORT);
  });
}

void bootstrap();
