import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { RegisterRequestDto, LoginRequestDto, ValidateRequestDto } from '../auth.dto';
import { Auth, AuthDocument } from '../auth.schema';
import { LoginResponse, RegisterResponse, ValidateResponse } from '../auth.pb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
    constructor(@InjectModel(Auth.name) private authModel: Model<Auth>, private readonly passwordService: PasswordService) { }

    @Inject(JwtService)
    private readonly jwtService: JwtService;

    public async register({ email, password }: RegisterRequestDto): Promise<RegisterResponse> {
        let auth: Auth = await this.authModel.findOne({ email });

        if (auth) {
            return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
        }

        auth = new Auth();

        auth.email = email;
        auth.password = this.passwordService.hashPassword(password);

        await this.authModel.create(auth);

        return { status: HttpStatus.CREATED, error: null };
    }

    public async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
        const auth: AuthDocument = await this.authModel.findOne({ email });

        if (!auth) {
            return { status: HttpStatus.NOT_FOUND, error: ['E-Mail not found'], token: null };
        }

        const isPasswordValid: boolean = this.passwordService.validatePassword(password, auth.password);

        if (!isPasswordValid) {
            return { status: HttpStatus.NOT_FOUND, error: ['Password wrong'], token: null };
        }

        const token: string = this.jwtService.generateToken(auth);

        return { token, status: HttpStatus.OK, error: null };
    }

    public async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {
        const decoded: AuthDocument = await this.jwtService.verify(token);

        if (!decoded) {
            return { status: HttpStatus.FORBIDDEN, error: ['Token is invalid'], userId: null };
        }

        const auth: Auth = await this.jwtService.validateUser(decoded);

        if (!auth) {
            return { status: HttpStatus.NOT_FOUND, error: ['User not found'], userId: null };
        }

        return { status: HttpStatus.OK, error: null, userId: decoded._id.toString() };
    }
}