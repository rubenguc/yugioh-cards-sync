import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  TYPESENSE_HOST: string;
  TYPESENSE_PORT: number;
  TYPESENSE_API_KEY: string;
  TYPESENSE_PROTOCOL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    TYPESENSE_HOST: joi.string().required(),
    TYPESENSE_PORT: joi.number().required(),
    TYPESENSE_API_KEY: joi.string().required(),
    TYPESENSE_PROTOCOL: joi.string().required(),
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
};
