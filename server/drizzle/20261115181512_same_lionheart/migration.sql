ALTER TABLE "movies" ADD COLUMN "age_rating" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "end_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "base_price" numeric(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "halls" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "halls" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone USING "updated_at"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "halls" ADD CONSTRAINT "halls_rows_positive" CHECK ("rows_count" > 0);--> statement-breakpoint
ALTER TABLE "halls" ADD CONSTRAINT "halls_seats_positive" CHECK ("seats_per_row" > 0);--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_rating_range" CHECK ("rating" >= 0 AND "rating" <= 10);--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_duration_positive" CHECK ("duration_minutes" > 0);--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_votes_non_negative" CHECK ("duration_minutes" >= 0);--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_row_positive" CHECK ("row" > 0);--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_seat_positive" CHECK ("seat_number" > 0);--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_price_non_negative" CHECK ("price" >= 0);