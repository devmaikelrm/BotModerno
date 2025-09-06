// web-panel/lib/serverClient.js
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { Pool } = pg;

// Create a PostgreSQL pool for direct database access
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
  }
  return pool;
}

export function adminClient() {
  // If using Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { 
      auth: { persistSession: false } 
    });
  }
  
  // For development with PostgreSQL database
  const pool = getPool();
  
  return {
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          maybeSingle: async () => {
            try {
              const query = `SELECT ${columns} FROM ${table} WHERE ${column} = $1 LIMIT 1`;
              const result = await pool.query(query, [value]);
              return { data: result.rows[0] || null, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
          order: (col, opts = {}) => ({
            limit: async (n) => {
              try {
                const query = `SELECT ${columns} FROM ${table} WHERE ${column} = $1 ORDER BY ${col} ${opts.ascending ? 'ASC' : 'DESC'} LIMIT ${n}`;
                const result = await pool.query(query, [value]);
                return { data: result.rows, error: null };
              } catch (error) {
                return { data: null, error };
              }
            }
          })
        }),
        order: (col, opts = {}) => ({
          limit: async (n) => {
            try {
              const query = `SELECT ${columns} FROM ${table} ORDER BY ${col} ${opts.ascending ? 'ASC' : 'DESC'} LIMIT ${n}`;
              const result = await pool.query(query);
              return { data: result.rows, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        }),
        limit: async (n) => {
          try {
            const query = `SELECT ${columns} FROM ${table} LIMIT ${n}`;
            const result = await pool.query(query);
            return { data: result.rows, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      insert: async (data) => {
        try {
          const keys = Object.keys(data);
          const values = Object.values(data);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
          const result = await pool.query(query, values);
          return { data: result.rows[0], error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      update: (data) => ({
        eq: async (column, value) => {
          try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${values.length + 1} RETURNING *`;
            const result = await pool.query(query, [...values, value]);
            return { data: result.rows[0], error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      delete: () => ({
        eq: async (column, value) => {
          try {
            const query = `DELETE FROM ${table} WHERE ${column} = $1`;
            await pool.query(query, [value]);
            return { error: null };
          } catch (error) {
            return { error };
          }
        }
      })
    })
  };
}
