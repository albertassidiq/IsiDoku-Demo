CREATE TABLE "sop_edges" (
	"id" text PRIMARY KEY NOT NULL,
	"sop_id" uuid NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL,
	"source_handle" text,
	"target_handle" text,
	"type" text,
	"animated" jsonb,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sop_nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"sop_id" uuid NOT NULL,
	"type" text NOT NULL,
	"position" jsonb NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sop_edges" ADD CONSTRAINT "sop_edges_sop_id_sops_id_fk" FOREIGN KEY ("sop_id") REFERENCES "public"."sops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sop_nodes" ADD CONSTRAINT "sop_nodes_sop_id_sops_id_fk" FOREIGN KEY ("sop_id") REFERENCES "public"."sops"("id") ON DELETE cascade ON UPDATE no action;