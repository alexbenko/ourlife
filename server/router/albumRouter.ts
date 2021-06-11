import express from 'express'
import db from '../postgresql/db'
import log from '../logging/log'

const router = express.Router()
// child route of /api/albums
router.get('/ping', (req, res) => res.send('Pong'))

router.get('/all', async (req, res) => {
  const albumsInfo = await db('SELECT * FROM albums;')
  res.send(albumsInfo)
})

export default router
