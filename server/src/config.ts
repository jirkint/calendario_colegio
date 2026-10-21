import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5433/edupaz',
  jwtSecret: process.env.JWT_SECRET ?? 'edupaz-dev-secret-change-me',
  inviteCode: process.env.INVITE_CODE ?? '',
  cookieName: 'edupaz_token',
};
