import { Controller, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AUTH_PATTERNS,
  AuthRpcException,
  type ForgotPasswordResponse,
  resetPasswordInput,
  type ResetPasswordInput,
  createUserSessionInput,
  type CreateUserSessionInput,
  type CreateUserSessionResponse,
  ValidateCredentialsInput,
  findFullUserInput,
  type FindFullUserInput,
  refreshTokenInput,
  type RefreshTokenInput,
  RefreshTokenResponse,
  createUserInput,
  type CreateUserInput,
  forgotPasswordInput,
  type ForgotPasswordInput,
  ZodValidationPipe,
  verifyCodeInput,
  type VerifyCodeInput,
  type VerifyCodeResponse,
  UserWithRelationsContract,
} from '@stackschool/messaging';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ForgotPasswordService } from './services/forgot-password.service';
import { toUserWithRelationsContract } from '../../mappers/user.mapper';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern(AUTH_PATTERNS.VALIDATE_CREDENTIALS)
  @UsePipes(new ZodValidationPipe(ValidateCredentialsInput))
  async validateCredentials(
    @Payload(new ZodValidationPipe(ValidateCredentialsInput))
    data: ValidateCredentialsInput,
  ) {
    console.log('service auth', data);
    return this.authService.validateLocalUser(data);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_OAUTH_USER)
  async rpcValidateOAuthUser(@Payload() data: any) {
    return this.authService.validateOAuthUser(data);
  }

  @MessagePattern(AUTH_PATTERNS.CREATE_USER)
  async register(
    @Payload(new ZodValidationPipe(createUserInput)) data: CreateUserInput,
  ) {
    const user = await this.authService.register(data);
    return user;
  }

  @MessagePattern(AUTH_PATTERNS.FIND_FULL_USER)
  async findFullUser(
    @Payload(new ZodValidationPipe(findFullUserInput))
    data: FindFullUserInput,
  ) {
    if (!data.userId)
      throw new AuthRpcException(
        'INVALID_CREDENTIALS',
        "L'identifiant manquat.",
      );
    const user = await this.authService.findFullUser(data.userId);
    return toUserWithRelationsContract(user!);
  }

  @MessagePattern(AUTH_PATTERNS.CREATE_USER_SESSION)
  @UsePipes(new ZodValidationPipe(createUserSessionInput))
  async createUserSession(
    @Payload() data: CreateUserSessionInput,
  ): Promise<CreateUserSessionResponse> {
    return await this.authService.generateSession(data.userId);
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  async forgotPassword(
    @Payload(new ZodValidationPipe(forgotPasswordInput))
    data: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(data.identifier);
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  async resetPassword(
    @Payload(new ZodValidationPipe(resetPasswordInput))
    data: ResetPasswordInput,
  ) {
    console.log('reset-password', data);
    return this.authService.resetPassword(data);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshToken(
    @Payload(new ZodValidationPipe(refreshTokenInput)) data: RefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(data.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_CODE)
  async verifyCode(
    @Payload(new ZodValidationPipe(verifyCodeInput)) data: VerifyCodeInput,
  ): Promise<VerifyCodeResponse> {
    return this.authService.verifyCode(data.code, data.tempToken);
  }

  @MessagePattern(AUTH_PATTERNS.RESEND_CODE)
  async rpcResendCode(@Payload() data: { tempToken: string }) {
    return this.authService.resendCode(data.tempToken);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER_FIELD)
  async rpcValidateUserField(
    @Payload()
    data: {
      phoneNumber: string | null;
      email: string | null;
      user: UserWithRelationsContract;
    },
  ) {
    return this.userService.validateField({
      phoneNumber: data.phoneNumber,
      email: data.email,
      selfCheck: false,
      user: data.user,
    });
  }
}
