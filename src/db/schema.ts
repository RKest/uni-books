import {
    mysqlTable,
    int,
    varchar,
    timestamp,
    primaryKey,
    uniqueIndex,
    datetime,
    index,
} from "drizzle-orm/mysql-core";
import {relations} from "drizzle-orm";

export const locations = mysqlTable(
    "locations",
    {
        id: int("id").autoincrement().notNull(),
        name: varchar("name", {length: 255}).notNull(),
        address: varchar("address", {length: 255}).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    },
    (locations) => [primaryKey({columns: [locations.id]})],
);

export const books = mysqlTable(
    "books",
    {
        id: int("id").autoincrement().notNull(),
        title: varchar("title", {length: 255}).notNull(),
        author: varchar("author", {length: 255}).notNull(),
        isbn: varchar("isbn", {length: 255}).notNull().unique(),
        publishedDate: timestamp("published_date"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    },
    (books) => [
        primaryKey({columns: [books.id]}),
        uniqueIndex("isbn_idx").on(books.isbn),
    ],
);

export const inventory = mysqlTable(
    "inventory",
    {
        id: int("id").autoincrement().notNull(),
        bookId: int("book_id").notNull(),
        locationId: int("location_id").notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    },
    (inventory) => [primaryKey({columns: [inventory.id]})],
);

export const rentals = mysqlTable(
    "rentals",
    {
        id: int("id").autoincrement().notNull(),
        userId: int("user_id").notNull(),
        inventoryId: int("inventory_id").notNull(),
        rentalDate: timestamp("rental_date").notNull().defaultNow(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    },
    (rentals) => [primaryKey({columns: [rentals.id]})],
);

export const users = mysqlTable(
    "user",
    {
        id: int("id").primaryKey().autoincrement(),
        username: varchar("username", {
            length: 255,
        }).notNull(),
        passwordHash: varchar("password_hash", {
            length: 255,
        }).notNull(),
    },
    (users) => [index("username_idx").on(users.username)],
);

export const sessions = mysqlTable(
    "session",
    {
        id: varchar("id", {
            length: 255,
        }).primaryKey(),
        userId: int("user_id")
            .notNull()
            .references(() => users.id),
        expiresAt: datetime("expires_at").notNull(),
    },
    (sessions) => [primaryKey({columns: [sessions.id]})],
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const usersRelations = relations(users, ({many}) => ({
    rentals: many(rentals),
}));

export const locationsRelations = relations(locations, ({many}) => ({
    inventory: many(inventory),
}));

export const booksRelations = relations(books, ({many}) => ({
    inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({one, many}) => ({
    book: one(books, {
        fields: [inventory.bookId],
        references: [books.id],
    }),
    location: one(locations, {
        fields: [inventory.locationId],
        references: [locations.id],
    }),
    rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({one}) => ({
    user: one(users, {
        fields: [rentals.userId],
        references: [users.id],
    }),
    inventory: one(inventory, {
        fields: [rentals.inventoryId],
        references: [inventory.id],
    }),
}));
