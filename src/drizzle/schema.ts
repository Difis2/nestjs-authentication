import { boolean, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

/**
 * User table schema with id as primary key
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username'),
  email: text('email').notNull(),
  password: varchar('password', { length: 256 }),
  isEmailVerified: boolean('isEmailVerified').default(false),
  image: text('image'),
});
