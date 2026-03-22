ALTER TABLE "subscribers" DROP CONSTRAINT "subscribers_pipeline_id_pipelines_id_fk";
--> statement-breakpoint
ALTER TABLE "subscribers" ALTER COLUMN "pipeline_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_pipeline_id_pipelines_id_fk" FOREIGN KEY ("pipeline_id") REFERENCES "public"."pipelines"("id") ON DELETE cascade ON UPDATE no action;