import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  homeGymId: varchar("home_gym_id").notNull(),
  awayGymIds: varchar("away_gym_ids").array().notNull().default(sql`ARRAY[]::varchar[]`),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gyms = pgTable("gyms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  checkins: integer("checkins").notNull().default(0),
  revenue: integer("revenue").notNull().default(0),
  isRatFitAssured: boolean("is_ratfit_assured").notNull().default(false),
  qrCode: text("qr_code"),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  gymId: varchar("gym_id").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const checkins = pgTable("checkins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  gymId: varchar("gym_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  homeGymId: true,
  awayGymIds: true,
});

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  gymId: true,
  date: true,
});

export const insertCheckinSchema = createInsertSchema(checkins).pick({
  userId: true,
  gymId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type Checkin = typeof checkins.$inferSelect;
export type Gym = typeof gyms.$inferSelect;
