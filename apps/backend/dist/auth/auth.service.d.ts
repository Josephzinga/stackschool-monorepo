import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    register(registerDto: RegisterDto): string;
    private findUserByIdentifier;
}
