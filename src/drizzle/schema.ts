import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
  
/**
 * User table schema with id as primary key
 */
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: varchar("password", { length: 256 }),
  isEmailVerified: boolean("isEmailVerified").default(false),
  image: text("image"),
});
