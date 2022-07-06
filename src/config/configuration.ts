import path = require('path');
import { config } from 'dotenv';
import * as ip from 'ip';

export enum EnvironmentTypes {
  Production = 'production',
  Development = 'development',
  Staging = 'staging',
  Test = 'test',
  Local = 'local',
}

const ENV_FILE = `${process.env.ENV || ''}.env`;
const ENV_PATH = path.resolve(process.cwd(), ENV_FILE);

config({ path: ENV_PATH });
export const configuration = {
  server: {
    host: process.env.API_ADDRESS || 'localhost',
    port: parseInt(process.env.API_PORT, 10) || 8000,
    environment: process.env.ENV || EnvironmentTypes.Development,
    wsUrl: process.env.WS_URL || `ws://${ip.address()}:${process.env.API_PORT || 8000}`,
    memoryDebug: process.env.MEMORY_DEBUG || false,
    internalApiKey: process.env.INTERNAL_API_KEY || 'localhost',
  },
  postgres: {
    postgresHost: process.env.POSTGRES_HOST || 'localhost',
    postgresPort: +process.env.POSTGRES_PORT || 5432,
    postgresUser: process.env.POSTGRES_USER || 'postgres',
    postgresDataBase: process.env.POSTGRES_DATABASE || 'example-db',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'password',
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET || 'localhost-secret1',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'localhost-secret2',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +process.env.REDIS_PORT || 6379,
  },
};
