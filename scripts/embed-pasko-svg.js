const fs = require('fs');
const path = require('path');

const mascotPngPath = path.join(__dirname, '..', 'public', 'mascot.png');
const mascotSvgPath = path.join(__dirname, '..', 'public', 'mascot.svg');
const paskoSvgPath = path.join(__dirname, '..', 'public', 'pasko.svg');

const pngBuffer = fs.readFileSync(mascotPngPath);
const base64Png = pngBuffer.toString('base64');

const svgContent = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="paskoCircle">
      <circle cx="60" cy="60" r="56" />
    </clipPath>
  </defs>
  <circle cx="60" cy="60" r="58" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
  <image href="data:image/png;base64,${base64Png}" x="4" y="4" width="112" height="112" preserveAspectRatio="xMidYMid slice" clip-path="url(#paskoCircle)" />
</svg>
`;

fs.writeFileSync(mascotSvgPath, svgContent);
fs.writeFileSync(paskoSvgPath, svgContent);

console.log('Successfully updated mascot.svg and pasko.svg with approved Paško artwork.');
