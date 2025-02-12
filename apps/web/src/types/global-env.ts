import { z } from "zod";

const envVariables = z.object({
  // Server Side
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  BASE_URL: z.string().url(),
  BASE_MAIL_SERVER_URL: z.string().url(),
  SERVER_IDENTITY: z.string(),
  MONGODB_URI: z.string(),
  DATABASE_URL: z.string(),

  NODE_ENV: z.string().default("testing"),


  NEXT_PUBLIC_BASE_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_BASE_URL: z.string(),

  REDIS_URL: z.string(),

  // for vertex AI
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_VERTEX_PROJECT: z.string(),
  GOOGLE_VERTEX_LOCATION: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
