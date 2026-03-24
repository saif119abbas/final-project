ALTER TABLE "pipelines" ALTER COLUMN "action_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."action_type";--> statement-breakpoint
CREATE TYPE "public"."action_type" AS ENUM('FORMAT_TEXT', 'ADD_META', 'FILTER_FIELDS');--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "action_type" SET DATA TYPE "public"."action_type" USING "action_type"::"public"."action_type";