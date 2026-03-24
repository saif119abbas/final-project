ALTER TYPE "public"."job_status" ADD VALUE 'PROCESSING';--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "action_config" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "pipelines" ALTER COLUMN "action_config" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pipelines" ADD COLUMN "owner_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;