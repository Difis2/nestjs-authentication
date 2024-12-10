declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_PASSWORD: string;
    DB_URL: string;
    JWT_TOKEN: string;
    VERIFY_JWT_TOKEN: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    EMAIL_HOST: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
  }
}
