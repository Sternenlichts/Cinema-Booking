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
  index,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "ADMIN"]);

export const bookingStatus = pgEnum("booking_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
  "REFUNDED",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRole("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  director: varchar("director", { length: 100 }).notNull(),
  cover: varchar("cover", { length: 255 }).notNull(),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  votesCount: integer("votes_count").default(0).notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 })
    .default("0.0")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const halls = pgTable("halls", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull().unique(),
  rowsCount: integer("rows_count").notNull(),
  seatsPerRow: integer("seats_per_row").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
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
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    status: bookingStatus("status").default("PENDING").notNull(),
    totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (b) => [index("bookings_user_id_idx").on(b.userId)]
);

export const tickets = pgTable(
  "tickets",
  {
    id: serial("id").primaryKey(),
    row: integer("row").notNull(),
    seatNumber: integer("seat_number").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
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
  ]
);
