ALTER TYPE "public"."job_status" ADD VALUE 'PARTIAL';--> statement-breakpoint
ALTER TABLE "pipelines" DROP COLUMN "action_config";