import sharp from 'sharp'

export default async function (oldImagePath : string, outputPath : string) {
  await sharp(oldImagePath).webp({ quality: 30, force: true }).toFile(outputPath)
}
