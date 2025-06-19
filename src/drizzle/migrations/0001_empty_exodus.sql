CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "report_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscriptions" RENAME TO "reports";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "name" TO "date";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "email" TO "line";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "subscriptions_email_unique";--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "tag" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "problem" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "cause" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "corrective_action" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "preventive_action" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "full_report" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "original_data" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "report_categories" ADD CONSTRAINT "report_categories_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_categories" ADD CONSTRAINT "report_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_date_idx" ON "reports" USING btree ("date");--> statement-breakpoint
CREATE INDEX "reports_line_idx" ON "reports" USING btree ("line");--> statement-breakpoint
CREATE INDEX "reports_tag_idx" ON "reports" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");