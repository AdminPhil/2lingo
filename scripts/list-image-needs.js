const fs = require('fs');

const glob = [
  'scripts/refine-units-1-5.ts', 
  'scripts/refine-units-6-10.ts', 
  'scripts/refine-units-11-15.ts'
];

const map = new Map();

for (const file of glob) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /text:\s*"([^"]+)",\s*(?:correct:\s*(?:true|false),\s*)?imageSrc:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const text = m[1];
    const img = m[2];
    if (!map.has(img)) map.set(img, new Set());
    map.get(img).add(text);
  }
}

console.log('Total unique images referenced:', map.size);
const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
for (const [img, words] of sorted) {
  const localExists = fs.existsSync('public' + img);
  console.log(`${localExists ? '✓' : '✗'} ${img} (${Array.from(words).join(', ')})`);
}
