import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'

import { ResponseObj } from '../interfaces/user'
import { log, isEmptyString, token, compress } from '../lib'
import db from '../postgresql/db'
import User from '../classes/User'

const router = Router()
// child route of /api/auth

router.post('/signup/:token', async (req : Request, res: Response) => {
  let responseObj : ResponseObj
  try {
    const body = { ...req.body }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    // password and email validation
    if (body.plainTextPassword !== body.passwordConfirmation) {
      responseObj.success = false
      responseObj.error = 'Passwords Do Not Match'
      return res.status(400).send(responseObj)
    } else if (!passwordRegex.test(body.plainTextPassword)) {
      responseObj.success = false
      responseObj.error = 'Password Does Not Meet Requirements.'
      return res.status(400).send(responseObj)
    } else if (!body.email.includes('@') || !body.email.includes('.')) {
      responseObj.success = false
      responseObj.error = 'Invalid Email.'
      return res.status(400).send(responseObj)
    }

    // check for empty string fields
    for (const key of body) {
      if (typeof body[key] === 'string' && isEmptyString(body[key])) {
        responseObj.success = false
        responseObj.error = 'Please Fill In All Fields'
        break
      }
    }

    if (!responseObj.success) {
      return res.status(400).send(responseObj)
    }

    const { email, fname, lname, plainTextPassword } = body

    const newUser = new User(email)
    newUser.addOne({ fname, lname, plainTextPassword })
    log.info(`Added a New User: ${email}`)
    responseObj.success = true
    responseObj.successMsg = 'Successfully Created an Account.'
    responseObj.token = await token.generateToken({ fname, lname })
    return res.status(200).send(responseObj)
  } catch (err) {
    log.error(`Unknown Error In Signup: ${err}`)
    responseObj.success = false
    responseObj.error = 'Unknown Error, Refresh and Try Again'
    return res.status(400).send(responseObj)
  }
})

router.post('/login', token.authenticateTokenMiddleware, async (req, res) => {

})

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/single/:albumId', token.authenticateTokenMiddleware, upload.single('file'), async (req : Request, res: Response) => {
  try {
    const { albumId } = req.params
    const existingAlbum = await db('SELECT id, dirname from albums WHERE id = $1', [albumId])
    if (!existingAlbum.length) {
      res.status(201).send('Album Does Not exist')
    } else {
      // multer stores the image as a buffer here
      const { buffer, originalname } = req.file

      const staticFilePath = process.env.NODE_ENV === 'production' ? '../static' : '../../static'
      const photoFolderPath = path.join(__dirname, staticFilePath)
      const url = `/photos/${existingAlbum[0].dirname}/${originalname.split('.')[0]}.webp`
      const newImagePath = photoFolderPath + url

      await compress(buffer, newImagePath)
      // TODO: Need to insert new image into db
      res.send({ url })
    }
  } catch (err) {
    log.error(`Error uploading a single Image: ${err}`)
    res.status(400).send('Failed')
  }
})

export default router
