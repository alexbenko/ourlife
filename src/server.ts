// third party
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cron from 'node-cron'
import path from 'path'

// custom packages
import { log, randomString, dateStamp } from './lib'
import redisHelpers from './redis/redisHelpers'
import { backupLogs } from './jobs'
import db from './postgresql/db'
import seed from './postgresql/seed'
import render from './emails/render'

// routers
import albumRouter from './router/albumRouter'
import logRouter from './router/adminRouter'
import authRouter from './router/authRouter'
import webhookRouter from './router/webhookRouter'

const rfs = require('rotating-file-stream')
require('dotenv').config()

const app = express()

const inProduction = process.env.NODE_ENV === 'production'
const port = inProduction ? Number(process.env.PORT) : 8080
const serverUrl = inProduction ? process.env.PRODUCTION_URL : `http://localhost:${port}`

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(cors())
app.use(helmet())

if (!process.env.PORT) {
  console.log('No .env file, please create one using the enviornment variables in the README')
  // dont want server to start if enviornment variables havent been set
  process.exit(1)
} else if (!process.env.AWS_ACCESS_KEY) {
  console.log('No AWS Acess Key in .env file. Please add it before continuing.')
  process.exit(1)
}
// if in dev mode
if (!inProduction) {
  console.log('Development Mode detected, all logs will be logged to console instead of saving them.')
  app.use(morgan('dev'))
} else {
  console.log('Production Environment Detected, saving http logs and scheduling cronjobs')
  const generateDatestamp = () : string => {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    return `${year}-${month}-${day}`
  }
  const accessLogStream = rfs.createStream(`${generateDatestamp()}.log`, {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs/http')
  })

  // setup the log
  app.use(morgan('combined', { stream: accessLogStream }))

  // all cronjobs should go here     0 0 * * FRI
  cron.schedule('0 0 * * FRI', backupLogs) // friday at midniight
  // dont need to backup right now
  // cron.schedule('0 0 * * * ', backupPostgres) // every day at midnight
}

// in production the static folder volume is mounted inside the same directory.
// since i dont want to upload the images to dockerhub, i have the static directory outside the server code
const staticPath = inProduction ? '/static' : '../static'
app.use(express.static(path.join(__dirname, staticPath), { dotfiles: 'allow' }))

// all routers go here
app.use('/api/albums', albumRouter)
app.use('/api/auth', redisHelpers.isBanned, authRouter)
app.use('/api/webhook', redisHelpers.isBanned, webhookRouter)

const UNIQUE_ADMIN_ROUTE = randomString(16)
app.use(`/${UNIQUE_ADMIN_ROUTE}/admin`, async (req, res, next) => {
  // if request is more than /randomstring/admin pass request to the router
  // otherwise render the admin page
  if (req.originalUrl.split('/').length > 3) {
    next()
  } else {
    const adminUrl = `${serverUrl}/${UNIQUE_ADMIN_ROUTE}/admin`
    const templateParams = {
      startTime: dateStamp(new Date()),
      serverUrl: adminUrl,
      endpoints: ['/status', '/errors/today']
    }
    const templatePath = path.join(__dirname, '../views/adminIndex.hbs')
    const template = await render(templatePath, templateParams)
    // if you are unfamilar with tempura, this function returns an html string
    // this is similar to how the view engine works for express
    res.send(template)
  }
}, logRouter)

app.get('/admin', redisHelpers.isBanned, (req: express.Request, res : express.Response) => {
  redisHelpers.banIp(req.ip)
  res.status(404).send(';)')
})

app.get('/', redisHelpers.isBanned, (req: express.Request, res: express.Response) => {
  res.send('Welcome To the Backend Service for Ourlife. Made by Alexander Benko')
})

app.listen(port, async () => {
  try {
    const test = await db('SELECT * FROM albums;')
    if (test.length === 0) {
      console.log('DB is not set up, seeding...')
      // TODO: add some sort of boolean flag once app is deployed so instead of running this script, it will pull pgdump file from S3
      // and then import it
      await seed()
    }
    console.log('Connected to database successfully!')
    console.log(
      `app listening at ${serverUrl} in ${inProduction ? 'production' : 'development'} mode.`
    )
    log.info(
      `Started Server On ${new Date()}. Admin Route : ${serverUrl}/${UNIQUE_ADMIN_ROUTE}/admin`
      , true)
  } catch (err) {
    console.log(err)
    log.error(`Error connecting to Postgres: \n ${err.message}`)
    process.exit(1)
  }
})

process.on('uncaughtException', err => {
  console.log(err)
  log.error(`Uncaught Error: ${err}`, true)
  process.exit(1) // manadatory (as per the Node.js docs)
})
