import express, { Request, Response } from 'express'
import { log, dateStamp } from '../lib'
import path from 'path'

// each time the server is started, this router is assigned a random string for the root path
const router = express.Router()

router.get('/status', (req : Request, res: Response) => res.status(200).send('Everythin is good'))
router.get('/error/today', async (req : Request, res: Response) => {
  try {
    const errorLogToday = path.join(__dirname, `../logs/errors/${dateStamp(new Date())}.log`)
    res.status(200).sendFile(errorLogToday)
  } catch (err) {
    console.log(err)
    log.error(`Error retrieving recent error log: ${err}`)
    res.status(400).send('Failed To Retrieve File.')
  }
})

export default router
