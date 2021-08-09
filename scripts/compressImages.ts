import { fsAsync, compress, dateStamp } from '../src/lib'
import path from 'path'

// await sharp('IMG_3861.jpeg').webp({ quality: 30 }).toFile('a.webp')
const compressImages = async () => {
  const imagesDir = path.join(__dirname, '../static/old')
  const outDir = path.join(__dirname, '../static/photos') // this is where the new compressed images go
  const images = await fsAsync.readdir(imagesDir)

  for (const dir of images) {
    if (dir === '.DS_Store') continue
    await fsAsync.mkdir(path.join(outDir, dir))
    const rootDir = path.join(imagesDir, dir)
    const images = await fsAsync.readdir(rootDir)
    const outDirAlbum = path.join(outDir, dir)
    console.log('Compressing Album: ', dir)
    for (let i = 0; i < images.length; i++) {
      console.log(Math.floor((i / images.length) * 100), '%')
      if (images[i] === '.DS_Store') continue
      const oldImagePath = path.join(rootDir, images[i])
      const newImagePath = path.join(outDirAlbum, `${dateStamp(new Date())}-${images[i].split('.')[0]}.webp`)
      await compress(oldImagePath, newImagePath)
    }
  }
}

compressImages()
