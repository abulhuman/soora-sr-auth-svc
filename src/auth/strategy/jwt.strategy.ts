import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '../service/jwt.service';
import { AuthDocument } from '../auth.schema';
import { securityConfigConstants } from 'src/common/configs/security.config.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        securityConfigConstants.JWT_SECRET,
      ),
    });
  }

  private validate(token: string): Promise<AuthDocument | never> {
    return this.jwtService.validateUser(token);
  }
}
