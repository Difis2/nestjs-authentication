import { boolean, pgEnum, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

/**
 * User table schema with id as primary key
 */

export const roleEnum = pgEnum('role', ['user', 'admin']); // Define an enum for role

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username'),
  email: text('email').notNull(),
  password: varchar('password', { length: 256 }),
  isEmailVerified: boolean('isEmailVerified').default(false),
  image: text('image'),
  role: roleEnum('role').default('user'), // Use enum for role with a default value
});
