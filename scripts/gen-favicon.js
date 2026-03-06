const sharp = require('sharp');
const path = require('path');

async function generateFavicon() {
  const size = 192;
  const radius = 40;

  const roundedMask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
  );

  const resized = await sharp(path.join('public', 'images', 'logo.png'))
    .resize(size, size, { fit: 'cover' })
    .toBuffer();

  const mask = await sharp(roundedMask)
    .resize(size, size)
    .toBuffer();

  await sharp(resized)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(path.join('public', 'images', 'favicon-rounded.png'));

  // 32x32 version
  const small = await sharp(path.join('public', 'images', 'logo.png'))
    .resize(32, 32, { fit: 'cover' })
    .toBuffer();

  const smallMask = await sharp(Buffer.from(
    `<svg width="32" height="32"><rect x="0" y="0" width="32" height="32" rx="7" ry="7" fill="white"/></svg>`
  )).resize(32, 32).toBuffer();

  await sharp(small)
    .composite([{ input: smallMask, blend: 'dest-in' }])
    .png()
    .toFile(path.join('public', 'images', 'favicon-32.png'));

  console.log('Rounded favicons generated!');
}

generateFavicon().catch(console.error);
