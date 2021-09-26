import express from 'express'

import { ResponseObj } from '../interfaces/response'
import db from '../postgresql/db'
import { log } from '../lib'

const router = express.Router()

// child routes of /api/webhook
router.post('/visit/:albumid', async (req, res) => {
  const responseObj = <ResponseObj>{}
  try {
    const { albumid } = req.params
    await db('UPDATE albums SET visits = visits + 1 WHERE id = $1;', [albumid])
    responseObj.success = true
    return res.status(200).send(responseObj)
  } catch (err) {
    responseObj.success = false
    responseObj.error = 'Request Failed Please Try Again Later.'
    return res.status(400).send(responseObj)
  }
})
export default router
