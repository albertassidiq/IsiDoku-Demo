import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const sops = pgTable('sops', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(), // Clerk User ID
    title: text('title').notNull(),
    description: text('description'),
    content: jsonb('content').notNull(), // Stores full app state (columns, rows, cellData, arrows)
    pdfUrl: text('pdf_url'), // Stores uploaded PDF URL for Merge PDF feature
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sopsRelations = relations(sops, ({ many }) => ({
    nodes: many(sopNodes),
    edges: many(sopEdges),
}));

export const sopNodes = pgTable('sop_nodes', {
    id: text('id').primaryKey(), // Using text ID from React Flow
    sopId: uuid('sop_id').references(() => sops.id, { onDelete: 'cascade' }).notNull(),
    type: text('type').notNull(),
    position: jsonb('position').notNull(), // { x: number, y: number }
    data: jsonb('data').notNull(), // Node data
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sopNodesRelations = relations(sopNodes, ({ one }) => ({
    sop: one(sops, {
        fields: [sopNodes.sopId],
        references: [sops.id],
    }),
}));

export const sopEdges = pgTable('sop_edges', {
    id: text('id').primaryKey(), // Using text ID from React Flow
    sopId: uuid('sop_id').references(() => sops.id, { onDelete: 'cascade' }).notNull(),
    source: text('source').notNull(),
    target: text('target').notNull(),
    sourceHandle: text('source_handle'),
    targetHandle: text('target_handle'),
    type: text('type'),
    animated: jsonb('animated'), // Boolean stored as json/text or just handled in data
    data: jsonb('data'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sopEdgesRelations = relations(sopEdges, ({ one }) => ({
    sop: one(sops, {
        fields: [sopEdges.sopId],
        references: [sops.id],
    }),
}));
