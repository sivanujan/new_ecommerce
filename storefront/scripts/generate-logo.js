const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:/Users/Sivanujan_PC/.gemini/antigravity-ide/brain/b2454d1c-dd68-4a47-8b63-20559f9d7703/.user_uploaded/media_1790847903788.png';

async function generateAssets() {
  const { data, info } = await sharp(imgPath).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  const BG = 254;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const dr = BG - r;
    const dg = BG - g;
    const db = BG - b;
    const dist = Math.sqrt(Math.max(0, dr)**2 + Math.max(0, dg)**2 + Math.max(0, db)**2);

    if (dist <= 3.5) {
      out[i] = 0;
      out[i+1] = 0;
      out[i+2] = 0;
      out[i+3] = 0;
    } else {
      let alpha = (dist - 3.5) / (28.0 - 3.5);
      if (alpha > 1) alpha = 1;
      alpha = alpha * alpha * (3 - 2 * alpha); // smoothstep anti-alias

      const unblend = (c, a) => {
        const val = (c - (1 - a) * BG) / a;
        return Math.max(0, Math.min(255, Math.round(val)));
      };

      out[i] = unblend(r, alpha);
      out[i+1] = unblend(g, alpha);
      out[i+2] = unblend(b, alpha);
      out[i+3] = Math.round(alpha * 255);
    }
  }

  // 1. Full logo (cropped to bounding box with 16px padding)
  // Bounding box: x: 72..972 (w: 901), y: 28..297 (h: 270)
  const fullLeft = Math.max(0, 72 - 16);
  const fullTop = Math.max(0, 28 - 16);
  const fullWidth = Math.min(info.width - fullLeft, 901 + 32);
  const fullHeight = Math.min(info.height - fullTop, 270 + 32);

  const fullLogoBuffer = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: fullLeft, top: fullTop, width: fullWidth, height: fullHeight })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const publicDir = path.resolve(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'logo.png'), fullLogoBuffer);
  console.log('Saved public/logo.png', { width: fullWidth, height: fullHeight });

  // 2. Emblem only (cropped and centered in square)
  // Emblem bounds: x: 72..351 (w: 280), y: 28..297 (h: 270)
  const embLeft = Math.max(0, 72 - 12);
  const embTop = Math.max(0, 28 - 12);
  const embWidth = Math.min(info.width - embLeft, 280 + 24);
  const embHeight = Math.min(info.height - embTop, 270 + 24);

  const emblemBuffer = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: embLeft, top: embTop, width: embWidth, height: embHeight })
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'logo-icon.png'), emblemBuffer);
  console.log('Saved public/logo-icon.png (512x512 square)');

  // 3. SVG wrappers that embed clean transparent PNG
  // This allows all existing components requesting /logo.svg or /logo-icon.svg to work smoothly
  const fullBase64 = fullLogoBuffer.toString('base64');
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fullWidth} ${fullHeight}" width="100%" height="100%">
  <image href="data:image/png;base64,${fullBase64}" width="${fullWidth}" height="${fullHeight}" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullSvg);
  console.log('Updated public/logo.svg');

  const emblemBase64 = emblemBuffer.toString('base64');
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${emblemBase64}" width="512" height="512" />
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);
  console.log('Updated public/logo-icon.svg and favicon.svg');

  // Favicon
  await sharp(emblemBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Updated public/favicon.ico');
}

generateAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
