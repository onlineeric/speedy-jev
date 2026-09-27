// Renders resources/speedy-jev-icon.svg into the PNG sizes the extension manifest uses.
// Usage: npm run icons
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE_SVG = new URL('../resources/speedy-jev-icon.svg', import.meta.url);
const OUTPUT_DIR = new URL('../public/icon/', import.meta.url);
const ICON_SIZES = [16, 32, 48, 96, 128];
// Render well above the largest size so downscaled edges stay crisp.
const RENDER_DENSITY_DPI = 72 * 8;

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  ICON_SIZES.map(async (size) => {
    const outputFile = new URL(`${size}.png`, OUTPUT_DIR);
    await sharp(SOURCE_SVG.pathname, { density: RENDER_DENSITY_DPI })
      .resize(size, size)
      .png()
      .toFile(outputFile.pathname);
    console.log(`public/icon/${size}.png`);
  }),
);
