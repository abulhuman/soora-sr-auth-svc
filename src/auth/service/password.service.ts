import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcryptjs';
import { securityConfigConstants } from 'src/common/configs/security.config.schema';

@Injectable()
export class PasswordService {
    get bcryptSaltRounds(): string | number {
        const saltOrRounds =
            this.configService.get<number>(securityConfigConstants.BCRYPT_SALT_OR_ROUND) ?? '10';

        return Number.isInteger(Number(saltOrRounds))
            ? Number(saltOrRounds)
            : saltOrRounds;
    }

    constructor(private configService: ConfigService) { }

    // Validate User's password
    validatePassword(password: string, hashedPassword: string): boolean {
        return compareSync(password, hashedPassword);
    }

    // Encode User's password
    hashPassword(password: string): string {
        return hashSync(password, this.bcryptSaltRounds);
    }
}
