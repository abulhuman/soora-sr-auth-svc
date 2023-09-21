import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './service/auth.service';
import { PasswordService } from './service/password.service';
import { JwtService } from './service/jwt.service';
import { securityConfigConstants } from 'src/common/configs/security.config.schema';

import { config as dotenv } from 'dotenv';
dotenv();
const config = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
      property: 'user',
    }),
    JwtModule.register({
      global: true,
      secret: config.get<string>(securityConfigConstants.JWT_SECRET),
      signOptions: {
        expiresIn: config.get<string>(securityConfigConstants.JWT_EXPIRES_IN),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    JwtService,
    JwtStrategy,
    ConfigService,
  ],
  exports: [ConfigService],
})
export class AuthModule {}
