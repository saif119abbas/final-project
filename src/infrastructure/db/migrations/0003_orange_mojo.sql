CREATE TYPE "public"."attempt_status" AS ENUM('PENDING', 'SUCCESS', 'FAILED');--> statement-breakpoint
ALTER TABLE "job_attempts" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_attempts" ALTER COLUMN "status" SET DATA TYPE "public"."attempt_status" USING "status"::text::"public"."attempt_status";--> statement-breakpoint
ALTER TABLE "job_attempts" ALTER COLUMN "status" SET DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "job_attempts" ADD COLUMN "next_retry_at" timestamp;