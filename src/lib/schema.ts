import { pgTable, text, integer, numeric, timestamp, boolean, uuid, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'asset_manager', 'viewer']);

export const assets = pgTable('assets', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'Residential', 'Commercial', 'Land'
    status: text('status').notNull().default('Available'), // 'Available', 'Sold', 'Under Contract', 'Renovation', 'Archived'
    listingType: text('listing_type').notNull().default('For Sale'), // 'For Sale', 'For Lease', 'Shortlet', 'Not for Sale'
    isFeatured: boolean('is_featured').default(false),

    // Core Data
    description: text('description'),
    acquisitionDate: timestamp('acquisition_date'),
    purchasePrice: numeric('purchase_price'),
    currentValuation: numeric('current_valuation'),

    // Location
    address: text('address'),
    latitude: numeric('latitude'),
    longitude: numeric('longitude'),
    city: text('city'),
    state: text('state'),
    country: text('country'),

    // Physical Attributes
    landSize: numeric('land_size'),
    buildingSize: numeric('building_size'),
    units: integer('units'),
    floors: integer('floors'),
    yearBuilt: integer('year_built'),
    conditionRating: integer('condition_rating'),

    // Financial Attributes
    rentalIncome: numeric('rental_income'),
    operatingCost: numeric('operating_cost'),

    // Media & Attachments
    media: jsonb('media').default([]), // [{ url: string, type: 'image' | 'video', publicId: string }]
    attachments: jsonb('attachments').default([]), // [{ url: string, name: string, type: 'pdf' | 'doc' | 'audio' }]

    // Metadata
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    isDeleted: boolean('is_deleted').default(false),
});

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'), // Optional display name
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('viewer'),
    companyId: uuid('company_id'), // For future multi-tenancy
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    action: text('action').notNull(), // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    entityType: text('entity_type').notNull(), // 'ASSET', 'USER'
    entityId: uuid('entity_id'),
    details: jsonb('details'),
    createdAt: timestamp('created_at').defaultNow(),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
