CREATE TYPE "public"."user_gender_group_enum" AS ENUM('men', 'women', 'boy', 'girl', 'not_specified');--> statement-breakpoint
CREATE TYPE "public"."user_roles_enum" AS ENUM('admin', 'brand', 'influencer', 'customer');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"title" text NOT NULL,
	"short_description" text NOT NULL,
	"description" text NOT NULL,
	"product_url" text NOT NULL,
	"price" jsonb DEFAULT '{"currency":"INR","value":0}'::jsonb NOT NULL,
	"brand" text NOT NULL,
	"variants" jsonb DEFAULT '{"size":[]}'::jsonb NOT NULL,
	"markup_metadata" jsonb DEFAULT '{"sku":""}'::jsonb,
	"gender_group" varchar(10) NOT NULL,
	"item_type" text NOT NULL,
	"wear_type" text NOT NULL,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"dominant_color" text NOT NULL,
	"color_palette" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"occasions" text[] DEFAULT '{}' NOT NULL,
	"seasons" text[] DEFAULT '{}' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_product_url_unique" UNIQUE("product_url")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_product_preferences" (
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"action" text NOT NULL,
	"weight" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_product_preferences_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"role" "user_roles_enum" DEFAULT 'customer' NOT NULL,
	"gender_group" "user_gender_group_enum" DEFAULT 'not_specified' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_product_preferences" ADD CONSTRAINT "user_product_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_product_preferences" ADD CONSTRAINT "user_product_preferences_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;