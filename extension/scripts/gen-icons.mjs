import { mkdirSync } from "node:fs";
import { readFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync(new URL("../../ui/public/favicon.svg", import.meta.url));
mkdirSync(new URL("../public/icons/", import.meta.url), { recursive: true });

for (const size of [16, 32, 48, 128]) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}.png`);
  console.log(`public/icons/icon-${size}.png`);
}
