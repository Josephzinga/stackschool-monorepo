import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  InternalServerErrorException,
  UnauthorizedException,
  HttpCode,
  BadRequestException,
  Query,
  HttpStatus,
  Param,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { ZodValidationPipe } from '../../utils/zod-validation-pipe';
import type {
  RegisterDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from './dto/auth-dto';
import {
  forgotPasswordSchema,
  registerFormSchema,
  VerifyCodeSchema,
  resetPasswordSchema,
} from '@stackschool/contracts';
import { UserService } from '../user/user.service';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle, ThrottlerGuard, ThrottlerStorage } from '@nestjs/throttler';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerFormSchema))
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const newUser = await this.authService.register(registerDto);

    req.logIn(newUser!, (err) => {
      if (err || !newUser)
        throw new InternalServerErrorException(
          "Impossible de se connecter après l'inscription.",
        );
      this.authService.login(newUser, res).catch((err) => {
        throw new InternalServerErrorException(err);
      });
    });
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Res() res: Response) {
    return await this.authService.login(req.user, res);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @CurrentUser() user: Request['user'],
    @Res() res: Response,
  ) {
    if (!user)
      throw new UnauthorizedException("Erreur lors de l'authentification");
    return this.authService.handleSocialCallback(user, res);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(
    @CurrentUser() user: Request['user'],
    @Res() res: Response,
  ) {
    if (!user)
      throw new UnauthorizedException("Erreur lors de l'authentification");
    return this.authService.handleSocialCallback(user, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ ok: false, message: 'Impossible de se déconnecter.' });
      }
      res.clearCookie('refresh_token');
      res.json({ ok: true, message: 'Déconnexion réussie.' });
    });
  }

  @Public()
  @Post('forgot-password')
  @UsePipes(new ZodValidationPipe(forgotPasswordSchema))
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.identifier, res);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) dto: ResetPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('token') token: string | undefined,
  ) {
    const resetToken = req.cookies['reset_access_token'] as string | undefined;

    if (!resetToken && !token) throw new BadRequestException('Token manquant.');
    return this.authService.resetPassword({
      res,
      password: dto.password,
      token: token ?? '',
      resetToken: resetToken ?? '',
    });
  }

  @Public()
  @UsePipes(new ZodValidationPipe(VerifyCodeSchema))
  @Post('verify-code')
  async verifyCode(
    @Body() dto: VerifyCodeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tempToken = req.cookies['tempToken'] as string | undefined;

    if (!tempToken)
      throw new BadRequestException(
        'Token maquant invalide ou expirés veuillez recomencer la procédure.',
      );
    return this.authService.verifyCode(res, dto.code, tempToken);
  }

  @Public()
  @Post('resend-code')
  @HttpCode(HttpStatus.ACCEPTED)
  async resendCode(@Req() req: Request) {
    const tempToken = req.cookies['tempToken'] as string | undefined;

    if (!tempToken)
      throw new BadRequestException(
        'Token maquant invalide ou expirés veuillez recomencer la procédure.',
      );
    return this.authService.resendCode(tempToken);
  }

  @Public()
  @Post('refresh')
  async refreshToke(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refresh_token as string | undefined;
    if (!refreshToken)
      throw new UnauthorizedException('Aucun token de rafraîchissement.');
    return this.authService.refreshToken(req, res, refreshToken);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  me(@Req() req: Request) {
    console.log('headers', req.headers['CSRF-Token']);
    return { ok: true, user: req.user };
  }

  @Public()
  @Get('csrf-token')
  @Throttle({ default: { limit: 10, ttl: 20000 } })
  getCsrfToken(@Req() req: Request) {
    const csrfToken = req?.csrfToken?.();
    return { csrfToken, ok: true };
  }
}
