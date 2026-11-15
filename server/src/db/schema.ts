import {
  pgTable,
  integer,
  serial,
  varchar,
  unique,
  timestamp,
  text,
  pgEnum,
  numeric,
  check,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["USER", "ADMIN"]);

export const bookingStatus = pgEnum("booking_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
  "REFUNDED",
]);

export const ageRating = pgEnum("age_rating", [
  "0+",
  "6+",
  "12+",
  "16+",
  "18+",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRole("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const movies = pgTable(
  "movies",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 150 }).notNull(),
    director: varchar("director", { length: 100 }).notNull(),
    cover: varchar("cover", { length: 255 }).notNull(),
    description: text("description").notNull(),
    ageRating: ageRating("age_rating").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    votesCount: integer("votes_count").default(0).notNull(),
    rating: numeric("rating", { precision: 3, scale: 1 })
      .default("0.0")
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("movies_rating_range", sql`${t.rating} >= 0 AND ${t.rating} <= 10`),
    check("movies_duration_positive", sql`${t.durationMinutes} > 0`),
    check("movies_votes_non_negative", sql`${t.votesCount} >= 0`),
  ]
);

export const halls = pgTable(
  "halls",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 30 }).notNull().unique(),
    rowsCount: integer("rows_count").notNull(),
    seatsPerRow: integer("seats_per_row").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("halls_rows_positive", sql`${t.rowsCount} > 0`),
    check("halls_seats_positive", sql`${t.seatsPerRow} > 0`),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    movieId: integer("movie_id")
      .references(() => movies.id, { onDelete: "restrict" })
      .notNull(),
    hallId: integer("hall_id")
      .references(() => halls.id, { onDelete: "restrict" })
      .notNull(),
  },
  (t) => [
    index("sessions_movie_id_idx").on(t.movieId),
    index("sessions_hall_id_idx").on(t.hallId),
    check("session_end_after_start", sql`${t.startTime} < ${t.endTime}`),
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    status: bookingStatus("status").default("PENDING").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [index("bookings_user_id_idx").on(t.userId)]
);

export const tickets = pgTable(
  "tickets",
  {
    id: serial("id").primaryKey(),
    row: integer("row").notNull(),
    seatNumber: integer("seat_number").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    sessionId: integer("session_id")
      .references(() => sessions.id, { onDelete: "restrict" })
      .notNull(),
    bookingId: integer("booking_id")
      .references(() => bookings.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    unique("tickets_session_seat_uq").on(t.sessionId, t.row, t.seatNumber),
    index("tickets_booking_id_idx").on(t.bookingId),
    check("tickets_row_positive", sql`${t.row} > 0`),
    check("tickets_seat_positive", sql`${t.seatNumber} > 0`),
    check("tickets_price_non_negative", sql`${t.price} >= 0`),
  ]
);

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const movieGenres = pgTable(
  "movie_genres",
  {
    movieId: integer("movie_id")
      .references(() => movies.id, { onDelete: "cascade" })
      .notNull(),
    genreId: integer("genre_id")
      .references(() => genres.id, { onDelete: "restrict" })
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.genreId] }),
    index("movie_genres_genre_id_idx").on(t.genreId),
  ]
);
