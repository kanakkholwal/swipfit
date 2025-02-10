import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";

import { db } from "~/db/connect";
import { accounts, sessions, users, verifications } from "~/db/schema";
import { APP_NAME } from "~/project.config";
import { mailFetch } from "./server-fetch";

const VERIFY_EMAIL_PATH_PREFIX = "/verify-email?token=";

const baseUrl = process.env.BASE_URL 

export const auth = betterAuth({
  appName: "SwipFit",
  baseURL: baseUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      sessions,
      accounts,
      verifications,
    },
    //if all of them are just using plural form, you can just pass the option below
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const verification_url = `${baseUrl}${VERIFY_EMAIL_PATH_PREFIX}${token}`;
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "reset-password",
            targets: [user.email],
            subject: `Reset Password | ${APP_NAME}`,
            payload: {
              name: user.name,
              email: user.email,
              reset_link: verification_url,
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verification_url = `${baseUrl}${VERIFY_EMAIL_PATH_PREFIX}${token}`;
      try {
        const response = await mailFetch<{
          data: string[] | null;
          error?: string | null | object;
        }>("/api/send", {
          method: "POST",
          body: JSON.stringify({
            template_key: "welcome_verify",
            targets: [user.email],
            subject: `Welcome to ${APP_NAME}`,
            payload: {
              platform_name: APP_NAME,
              name: user.name,
              email: user.email,
              verification_url: verification_url,
            },
          }),
        });
        if (response.error) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Error sending email",
          });
        }
        console.log(response);
      } catch (err) {
        console.error(err);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Error sending email",
        });
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      mapProfileToUser: async (profile) => {
        return {
          image: profile.picture,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
      },
      genderGroup: {
        type: "string",
        input: false,
      },
      username: {
        type: "string",
        required: true,
        unique: true,
        input: true,
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? "nith.eu.org" : undefined,
    },
  },
  plugins: [
    username(),
    admin({
      defaultRole: "customer",
      adminRole: ["admin"],
      defaultBanExpiresIn: 60 * 60 * 24 * 7, // 1 week
    }),
    nextCookies(),
  ], // make sure this is the last plugin (nextCookies) in the array
});

export type Session = typeof auth.$Infer.Session;
