import { timestamp, text, uuid, index, pgTable, jsonb } from 'drizzle-orm/pg-core'

export const reports = pgTable('reports', {
   id: uuid('id').primaryKey().defaultRandom(),
   date: text('date').notNull(),
   line: text('line'),
   tag: text('tag'),
   problem: text('problem').notNull(),
   cause: text('cause'),
   correctiveAction: text('corrective_action'),
   preventiveAction: text('preventive_action'),
   fullReport: text('full_report'),

   originalData: jsonb('original_data').notNull(),

   createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
   updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
   createdBy: text('created_by')
}, (table) => ({
   dateIdx: index('reports_date_idx').on(table.date),
   lineIdx: index('reports_line_idx').on(table.line),
   tagIdx: index('reports_tag_idx').on(table.tag),
   createdAtIdx: index('reports_created_at_idx').on(table.createdAt)
}))

export const categories = pgTable('categories', {
   id: uuid('id').primaryKey().defaultRandom(),
   name: text('name').notNull().unique(),
   description: text('description'),
   createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const reportCategories = pgTable('report_categories', {
   id: uuid('id').primaryKey().defaultRandom(),
   reportId: uuid('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
   categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
})
