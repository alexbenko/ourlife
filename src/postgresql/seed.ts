import { readdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import db from './db'

require('dotenv').config()
// TODO: move the promisifed fs to its own module since i use it in a few other files
const capitalizeWord = (word) => {
  const text = word.split('')
  text[0] = text[0].toUpperCase()
  return text.join('')
}
const formatAlbumName = (text:string) => {
  let formatted : string
  if (text.includes('_')) {
    // ie crater_lake => Crater Lake
    formatted = text.split('_').join(' ').split(' ').map((s) => capitalizeWord(s)).join(' ')
  } else {
    // acadia => Acadia
    formatted = capitalizeWord(text)
  }

  return formatted
}

/**
 * Seeds the database. Function is only ran on server startup if the db is empty
 */
const saveFilePaths = async () => {
  const staticFilePath = process.env.NODE_ENV === 'production' ? '../static/photos' : '../../static/photos'
  const photoFolderPath = path.join(__dirname, staticFilePath)
  const albums = await readdir(photoFolderPath)

  const thumbnails : { albumId : Number, path : string }[] = []
  for (const album of albums) {
    if (album.includes('.')) continue // these are directories and should not include any files

    // const albumName = formatAlbumName(album)
    await db('INSERT INTO ALBUMS(dirName, displayName) VALUES($1, $2);', [album, formatAlbumName(album)])
    const albumId = await db('SELECT id FROM albums WHERE dirName = $1;', [album])
    const { id } = albumId[0]

    const fullAlbumPath = `${photoFolderPath}/${album}`
    const imagesInAlbum = await readdir(fullAlbumPath)
    const imagePaths = imagesInAlbum.filter(img => img !== '.DS_Store').map(img => fullAlbumPath + '/' + img)
    const possibleThumbnails: { albumId : Number, path : string }[] = []
    for (const imageUrl of imagePaths) {
      const { width, height } = await sharp(imageUrl).metadata()
      /* example object
        {
          format: 'webp',
          width: 3024,
          height: 4032,
          space: 'srgb',
          channels: 3,
          depth: 'uchar',
          isProgressive: false,
          hasProfile: false,
          hasAlpha: false
        }
      */

      if (height > width) {
        possibleThumbnails.push({ albumId: id, path: imageUrl.split('/photos')[1] })
      }
      await db('INSERT INTO IMAGES(albumId, imgUrl) VALUES($1,$2);', [id, imageUrl.split('/photos')[1]])
    }
    thumbnails.push(possibleThumbnails[Math.floor(Math.random() * possibleThumbnails.length)])
  }

  for (const thumbnail of thumbnails) {
    if (typeof thumbnail !== 'undefined') {
      await db('UPDATE albums SET thumbnail = $1 WHERE id = $2;', [thumbnail.path, thumbnail.albumId])
    }
  }
  console.log('Successfully Saved All Image File Paths')
}

export default saveFilePaths
