import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { appConfigConstants, appConfigSchema } from './common/configs/app.config.schema';
import { securityConfigSchema } from './common/configs/security.config.schema';

const config = new ConfigService();

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      ...appConfigSchema,
      ...securityConfigSchema
    })
  }), AuthModule,
  MongooseModule.forRoot(config.get<string>(appConfigConstants.DATABASE_URL))
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService]
})
export class AppModule { }
