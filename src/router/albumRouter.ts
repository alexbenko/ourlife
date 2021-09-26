import express from 'express'

import { ResponseObj } from '../interfaces/response'
import db from '../postgresql/db'
import { log } from '../lib'

const router = express.Router()
// child route of /api/albums
router.get('/all', async (req, res) => {
  const albumsInfo = await db('SELECT id,displayname FROM albums ORDER BY displayname ASC;')
  res.send(albumsInfo)
})

router.get('/:albumId', async (req, res) => {
  // this formats the data for the photo gallery component on the front end since at most can be 4 columns
  const formatData = (imageData) => {
    // i want an array with 4 sub arrays of similar length
    const formatted = []
    // i
    for (let i = 4; i > 0; i--) {
      formatted.push(imageData.splice(0, Math.ceil(imageData.length / i)))
    }
    return formatted
  }
  const responseObj = <ResponseObj>{}
  try {
    const { albumId } = req.params
    const album = await db(
      'SELECT images.imgurl, albums.displayname, albums.visits FROM images JOIN albums ON(images.albumid = albums.id AND images.albumid = $1)', [albumId]
    )

    responseObj.success = true
    const displayName = album[0].displayname
    const visits = album[0].visits
    responseObj.data = { album: formatData(album), displayName, visits }

    res.send(responseObj)
  } catch (err) {
    responseObj.success = false
    responseObj.error = 'Request Failed Please Try Again Later.'
    log.error(`Error Retrieving Albumid:${req.params.albumId}: ${err}`)
    return res.status(400).send(responseObj)
  }
})

// necessary for index page for front end
router.get('/fe/index', async (req, res) => {
  const responseObj = <ResponseObj>{}
  try {
    // WARNING : random() is really slow on bigger datasets (in the millions) but since there will only ever be a few hundred rows it works great here
    // Set up a redis cache for this endpoint so this query isn't ran every time
    const randomAlbums = await db('SELECT id,thumbnail,dirname,displayname FROM albums WHERE thumbnail IS NOT NULL ORDER BY random() LIMIT 3;')

    responseObj.success = true
    responseObj.data = randomAlbums
    res.status(200).send(responseObj)
  } catch (err) {
    responseObj.success = false
    responseObj.error = 'Request Failed Please Try Again Later.'
    return res.status(400).send(responseObj)
  }
})

export default router
