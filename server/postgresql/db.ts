import { Pool } from 'pg'
import { log } from '../lib'

const pool = new Pool({
  user: process.env.NODE_ENV === 'production' ? process.env.PG_USER : process.env.PG_USER_LOCAL,
  password: process.env.DB_PASS,
  database: process.env.PG_DB,
  host: process.env.NODE_ENV === 'production' ? process.env.PG_USER : null,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

export default async (query = '', values = []) => {
  try {
    if (query.length === 0) throw new Error('No Query String Passed In')

    log.info(`[Query] ${query}`)
    const { rows } = await pool.query(query, values) // if you dont understand this, see: https://node-postgres.com/features/pooling
    return rows
  } catch (err) {
    if (err.toString().includes('duplicate')) {
      throw new Error('duplicate in unique column')
    }

    throw new Error(err)
  }
}
