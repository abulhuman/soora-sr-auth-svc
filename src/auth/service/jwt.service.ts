import { Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { Auth, AuthDocument } from '../auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordService } from './password.service';
import { Model } from 'mongoose';
import { JWTPayload } from '../jwt.payload';

@Injectable()
export class JwtService {

    private readonly jwt: Jwt;

    constructor(jwt: Jwt, @InjectModel(Auth.name) private authModel: Model<Auth>, private readonly passwordService: PasswordService) {
        this.jwt = jwt;
    }

    // Decoding the JWT Token
    public async decode(token: string): Promise<unknown> {
        return this.jwt.decode(token, null);
    }

    // Get User by User ID we get from decode()
    public async validateUser(decoded: any): Promise<AuthDocument> {
        return this.authModel.findById(decoded.id);
    }

    // Generate JWT Token
    public generateToken(auth: AuthDocument): string {
        return this.jwt.sign({ id: auth._id.toString(), email: auth.email });
    }

    // Validate JWT Token, throw forbidden error if JWT Token is invalid
    public async verify(token: string): Promise<JWTPayload> {
        try {
            return this.jwt.verify(token);
        } catch (err) { }
    }
}