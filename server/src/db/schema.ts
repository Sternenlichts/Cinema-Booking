import {
  pgTable,
  integer,
  serial,
  varchar,
  unique,
  timestamp,
  time,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 20 }).notNull(),
  lastName: varchar("last_name", { length: 20 }).notNull(),
  email: varchar("email", { length: 30 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id")
    .references(() => movies.id)
    .notNull(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  autor: varchar("autor", { length: 40 }).notNull(),
  cover: varchar("cover", { length: 255 }).notNull().unique(),
  desciprion: varchar("description", { length: 255 }).notNull(),
  rating: integer("rating").default(0).notNull(),
});

export const halls = pgTable("halls", {});

export const tickets = pgTable("tickets", {});
