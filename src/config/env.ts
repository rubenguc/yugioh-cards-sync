import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  TYPESENSE_HOST: string;
  TYPESENSE_PORT: number;
  TYPESENSE_API_KEY: string;
  TYPESENSE_PROTOCOL: string;

  CLOUDFLARE_R2_BUCKET_NAME: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_R2_ACCESS_KEY_ID: string;
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_MODE: string;
  CLOUDFLARE_DEV_DOMAIN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    TYPESENSE_HOST: joi.string().required(),
    TYPESENSE_PORT: joi.number().required(),
    TYPESENSE_API_KEY: joi.string().required(),
    TYPESENSE_PROTOCOL: joi.string().required(),
    CLOUDFLARE_R2_BUCKET_NAME: joi.string().required(),
    CLOUDFLARE_ACCOUNT_ID: joi.string().required(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: joi.string().required(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: joi.string().required(),
    CLOUDFLARE_MODE: joi.string().valid('dev', 'production').required(),
    CLOUDFLARE_DEV_DOMAIN: joi.string().when('CLOUDFLARE_MODE', {
      is: 'dev',
      then: joi.string().required(),
      otherwise: joi.string().optional(),
    }),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  typesenseHost: envVars.TYPESENSE_HOST,
  typesensePort: envVars.TYPESENSE_PORT,
  typesenseApiKey: envVars.TYPESENSE_API_KEY,
  typesenseProtocol: envVars.TYPESENSE_PROTOCOL,
  cloudflareR2BucketName: envVars.CLOUDFLARE_R2_BUCKET_NAME,
  cloudflareAccountId: envVars.CLOUDFLARE_ACCOUNT_ID,
  cloudflareR2AccessKeyId: envVars.CLOUDFLARE_R2_ACCESS_KEY_ID,
  cloudflareR2SecretAccessKey: envVars.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  cloudflareMode: envVars.CLOUDFLARE_MODE,
  cloudflareDevDomain: envVars.CLOUDFLARE_DEV_DOMAIN,
};
