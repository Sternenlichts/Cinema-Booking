CREATE TYPE "age_rating" AS ENUM('0+', '6+', '12+', '16+', '18+');--> statement-breakpoint
CREATE TABLE "genres" (
	"id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "movie_genres" (
	"movie_id" integer,
	"genre_id" integer,
	CONSTRAINT "movie_genres_pkey" PRIMARY KEY("movie_id","genre_id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "movies" ALTER COLUMN "age_rating" SET DATA TYPE "age_rating" USING "age_rating"::"age_rating";--> statement-breakpoint
CREATE INDEX "movie_genres_genre_id_idx" ON "movie_genres" ("genre_id");--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_movie_id_movies_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "movie_genres" ADD CONSTRAINT "movie_genres_genre_id_genres_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "session_end_after_start" CHECK ("start_time" < "end_time");--> statement-breakpoint
ALTER TABLE "movies" DROP CONSTRAINT "movies_votes_non_negative", ADD CONSTRAINT "movies_votes_non_negative" CHECK ("votes_count" >= 0);