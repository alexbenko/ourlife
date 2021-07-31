import sharp from 'sharp'

// sharp throws away metadata when compressing, causing a lot compressed images to be roated
// calling rotate ensures the image is in the original orientation without the need of keeping the metadata keeping the image size smaller
// see : https://stackoverflow.com/questions/48716266/sharp-image-library-rotates-image-when-resizing

export default async function (oldImage : string | Buffer, outputPath : string) {
  await sharp(oldImage).rotate().webp({ quality: 50, force: true }).toFile(outputPath)
}
