import { Pool } from 'pg'
import log from '../logging/log'
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.DB_PASS,
  database: process.env.PG_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

export default async (query = '', values = []) => {
  try {
    if (query.length === 0) throw Error('No Query String Passed In')

    log.info(`[Query] ${query}`)
    const { rows } = await pool.query(query, values) // if you dont understand this, see: https://node-postgres.com/features/pooling
    return rows
  } catch (err) {
    if (err.toString().includes('duplicate')) {
      throw new Error('duplicate in unique column')
    }

    throw err
  }
}
