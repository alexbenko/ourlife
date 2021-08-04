import express from 'express'
import db from '../postgresql/db'
import { log } from '../lib'

const router = express.Router()
// child route of /api/albums
router.get('/all', async (req, res) => {
  const albumsInfo = await db('SELECT id,displayname FROM albums;')
  res.send(albumsInfo)
})

router.get('/:albumId', async (req, res) => {
  // this formats the data for the photo gallery component on the front end since at most can be 4 columns
  const formatData = (imageData) => {
    // i want an array with 4 sub arrays of similar length
    const formatted = []
    for (let i = 4; i > 0; i--) {
      console.log(i)
      formatted.push(imageData.splice(0, Math.ceil(imageData.length / i)))
    }
    return formatted
  }
  try {
    const { albumId } = req.params
    let album = await db('SELECT * FROM images WHERE albumid = $1', [albumId])
    album = formatData(album)
    res.send(album)
  } catch (err) {
    log.error(`Error Retrieving Albumid:${req.params.albumId}: ${err}`)
    res.status(400)
  }
})

export default router
