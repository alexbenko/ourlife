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
    // eslint-disable-next-line no-throw-literal
    if (query.length === 0) throw ('No Query String Passed In')
    log.info(`[Query] ${query}`)
    const { rows } = await pool.query(query, values) // if you dont understand this, see: https://node-postgres.com/features/pooling
    return rows
  } catch (err) {
    if (err.toString().includes('duplicate')) {
      // eslint-disable-next-line no-throw-literal
      throw 'duplicate'
    }
    log.error(`Error Querying DB, reason: ${err}`)
    throw err
  }
}
