import { Router, Request, Response } from 'express'

import { ResponseObj } from '../interfaces/user'
import { log, isEmptyString, token } from '../lib'
import User from '../classes/User'

const router = Router()
// child route of /api/auth

router.post('/signup', async (req : Request, res: Response) => {
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

router.post('/login', async (req, res) => {

})
export default router
