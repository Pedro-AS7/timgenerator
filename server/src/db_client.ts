import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables as early as possible
dotenv.config();

// Initialize the Neon client
// The @neondatabase/serverless library manages connection pooling implicitly
// when connected to Neon's pooler endpoint (which your DATABASE_URL uses).
export const sql = neon(process.env.DATABASE_URL!);

console.log('Neon Database client initialized!');
