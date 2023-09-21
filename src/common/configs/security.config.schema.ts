import * as Joi from 'joi';

export const securityConfigSchema = {
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
};

export const securityConfigConstants = {
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  JWT_SECRET: 'JWT_SECRET',
  BCRYPT_SALT_OR_ROUND: 'BCRYPT_SALT_OR_ROUND',
} as const;
