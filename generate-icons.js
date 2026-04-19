import sharp from "sharp";
import fs from "fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c9a84c"/>
      <stop offset="100%" stop-color="#e8c96e"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bg)"/>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="none" stroke="url(#gold)" stroke-width="12" opacity="0.5"/>
  <text x="256" y="335" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="210" fill="url(#gold)" text-anchor="middle" letter-spacing="-8">FA</text>
  <rect x="140" y="375" width="232" height="20" rx="10" fill="url(#gold)" opacity="0.7"/>
</svg>`;

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`./public/${name}`);
  console.log(`✓ public/${name}`);
}

console.log("Icons generated!");
