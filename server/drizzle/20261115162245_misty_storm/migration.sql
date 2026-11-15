CREATE TYPE "booking_status" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY,
	"status" "booking_status" DEFAULT 'PENDING'::"booking_status" NOT NULL,
	"total_price" numeric(10,2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "halls" (
	"id" serial PRIMARY KEY,
	"name" varchar(30) NOT NULL UNIQUE,
	"rows_count" integer NOT NULL,
	"seats_per_row" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY,
	"title" varchar(150) NOT NULL,
	"director" varchar(100) NOT NULL,
	"cover" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"votes_count" integer DEFAULT 0 NOT NULL,
	"rating" numeric(3,1) DEFAULT '0.0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY,
	"start_time" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"movie_id" integer NOT NULL,
	"hall_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY,
	"row" integer NOT NULL,
	"seat_number" integer NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"session_id" integer NOT NULL,
	"booking_id" integer NOT NULL,
	CONSTRAINT "tickets_session_seat_uq" UNIQUE("session_id","row","seat_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(254) NOT NULL UNIQUE,
	"phone" varchar(20) NOT NULL UNIQUE,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'USER'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bookings_user_id_idx" ON "bookings" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_movie_id_idx" ON "sessions" ("movie_id");--> statement-breakpoint
CREATE INDEX "sessions_hall_id_idx" ON "sessions" ("hall_id");--> statement-breakpoint
CREATE INDEX "tickets_booking_id_idx" ON "tickets" ("booking_id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_movie_id_movies_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_hall_id_halls_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_session_id_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_booking_id_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE;