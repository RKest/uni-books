import {drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Assuming DATABASE_URL environment variable is in the format:
// mysql://user:password@host:port/database
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
}

const connection = mysql.createPool(databaseUrl);

export const db = drizzle(
    connection,
    {
        schema,
        mode: "default",
    });