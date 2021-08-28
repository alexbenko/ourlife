import { readdir } from 'fs/promises'
import path from 'path'
import { render, sendEmail } from '../emails'
import { Router, Request, Response } from 'express'
import { log, dateStamp, token } from '../lib'
require('dotenv').config()

// each time the server is started, this router is assigned a random string for the root path
const router = Router()

router.get('/status', (req, res) => res.status(200).send('Server Is Up :)'))

router.get('/errors/today', async (req : Request, res: Response) => {
  try {
    const errorLogToday = path.join(__dirname, `../logs/errors/${dateStamp(new Date())}.log`)
    res.status(200).sendFile(errorLogToday)
  } catch (err) {
    console.log(err)
    log.error(`Error retrieving recent error log: ${err}`)
    res.status(400).send('Failed To Retrieve File.')
  }
})

/*
router.get('/errors/all', async (req : Request, res: Response) => {
  try {
    const errorLogs = await readdir(path.join(__dirname, '../logs/errors'))
    console.log(errorLogs)
  } catch (err) {
    log.error('Error Retrieving all error logs')
    res.status(400).send('Failed To Retrieve File.')
  }
})
*/

router.get('/sendsignup/:to', async (req : Request, res: Response) => {
  try {
    const { to } = req.params
    if (!to) {
      return res.status(404).send('Request Failed')
    }
    const newToken = await token.generateToken({}, '1800s') // valid for 30 minutes
    const inProduction = process.env.NODE_ENV === 'production'
    const signupUrl = `${inProduction ? 'https://www.alexanderbenko.com' : 'http://localhost:3000'}/signup/${newToken}`

    const templatePath = path.join(__dirname, '../../views/signup.hbs')

    const template = await render(templatePath, { signupUrl, expiresIn: '30 Minutes' })
    await sendEmail('Here is the Signup Url', template, template, to)

    log.info(`Sent Signup Email to ${to}`, true)
    res.send('Email Sent!')
  } catch (err) {
    console.log(err)
    log.error(`Error Sending Signup Email: ${err}`)
    res.status(404).send('Error')
  }
})

export default router
