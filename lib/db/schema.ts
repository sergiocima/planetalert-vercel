import { pgTable, serial, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type', { enum: ['alluvione', 'terremoto', 'siccità', 'incendio'] }).notNull(),
  location: text('location').notNull(),
  latitude: decimal('latitude', { precision: 8, scale: 6 }).notNull(),
  longitude: decimal('longitude', { precision: 9, scale: 6 }).notNull(),
  date: timestamp('date').notNull(),
  description: text('description').notNull(),
  scientificAnalysis: text('scientific_analysis').notNull(),
  severity: integer('severity').notNull(),
  status: text('status', { enum: ['In corso', 'Concluso'] }).notNull(),
  affectedArea: decimal('affected_area').notNull(),
  casualties: integer('casualties').notNull(),
  economicDamage: text('economic_damage').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  type: text('type', { enum: ['article', 'link'] }).notNull(),
  url: text('url').notNull(),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  sources: many(sources),
}));

export const sourcesRelations = relations(sources, ({ one }) => ({
  event: one(events, {
    fields: [sources.eventId],
    references: [events.id],
  }),
})); 