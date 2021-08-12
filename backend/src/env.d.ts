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
    MAILTRAP_USER: string;
    MAILTRAP_PASS: string;
    GMAIL_PASS: string;
    GMAIL_USER: string;
  }
}