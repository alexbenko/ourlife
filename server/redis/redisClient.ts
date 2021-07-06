import redis from 'redis'
import { promisify } from 'util'

const connection = process.env.ENVIRONMENT === 'production' ? process.env.REDIS_URL : null
const client = redis.createClient(connection)

client.on('connect', function () {
  console.log('Successfully connected to redis!')
})

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  hmsetAsync: promisify(client.hmset).bind(client),
  hmgetAsync: promisify(client.hmget).bind(client),
  keysAsync: promisify(client.keys).bind(client)
}
