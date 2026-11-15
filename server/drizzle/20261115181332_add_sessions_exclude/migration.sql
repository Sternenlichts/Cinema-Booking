-- Custom SQL migration file, put your code below! --

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "sessions"
ADD CONSTRAINT "sessions_no_overlap"
EXCLUDE USING gist (
  "hall_id" WITH =,
  tstzrange("start_time", "end_time", '[)') WITH &&
);