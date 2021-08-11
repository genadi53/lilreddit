declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASS: string;
    PORT: string;
    SECRET: string;
    CORS_ORIGIN: string;
  }
}