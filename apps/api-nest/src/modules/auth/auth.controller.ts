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
} from '@stackschool/shared';
import { UserService } from '../user/user.service';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('all')
  async getAll() {
    return await this.userService.findAll();
  }

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

  @UseGuards(LocalAuthGuard)
  @Post('login')
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
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleSocialCallback(req, res);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.authService.handleSocialCallback(req, res);
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
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
      req,
      res,
    );
  }

  @Public()
  @UsePipes(new ZodValidationPipe(VerifyCodeSchema)) // ← ton schéma Zod existant
  @Post('verify-code')
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyCode(verifyCodeDto.code, req, res);
  }

  @Public()
  @Post('resend-code')
  async resendCode(@Req() req: Request) {
    return this.authService.resendCode(req);
  }

  @Public()
  @Post('refresh')
  async refreshToke(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;
    console.log('refreshToken', refreshToken);
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
  getCsrfToken(@Req() req: Request) {
    const csrfToken = req?.csrfToken?.();
    console.log('CSRF-token', csrfToken);
    return { csrfToken, ok: true };
  }
}
