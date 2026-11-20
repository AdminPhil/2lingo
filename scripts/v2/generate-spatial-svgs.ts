import * as fs from "fs";
import * as path from "path";

/**
 * CR-095 / CroLingo v2: Crystal-clear Spatial Preposition Diagram SVGs for Unit 13
 * Solves the 40.5% Unit 13 mistake wall by giving young learners unmistakable
 * visual anchors for U (in), Na (on), Ispod (under), and Blizu (near).
 */

const spatialUSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="6" fill="#EFF6FF"/>
  <!-- Open cardboard/blue box -->
  <rect x="7" y="13" width="22" height="17" rx="2" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="2"/>
  <!-- Red ball clearly INSIDE the box -->
  <circle cx="18" cy="21.5" r="5.5" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
  <!-- Front translucent rim accent -->
  <path d="M7,19 H29 V28 A2,2 0 0 1 27,30 H9 A2,2 0 0 1 7,28 Z" fill="#3B82F6" fill-opacity="0.35"/>
  <!-- Downward arrow showing inside -->
  <path d="M18,5 V11 M15,8.5 L18,11.5 L21,8.5" fill="none" stroke="#1D4ED8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const spatialNaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="6" fill="#ECFDF5"/>
  <!-- Wooden table top and legs -->
  <rect x="6" y="19" width="24" height="4" rx="1.5" fill="#B45309"/>
  <rect x="9" y="23" width="3" height="9" rx="1" fill="#92400E"/>
  <rect x="24" y="23" width="3" height="9" rx="1" fill="#92400E"/>
  <!-- Red ball sitting ON TOP of table -->
  <circle cx="18" cy="13.5" r="5.5" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
  <ellipse cx="18" cy="19" rx="4.5" ry="1" fill="#78350F" fill-opacity="0.4"/>
</svg>`;

const spatialIspodSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="6" fill="#FEF3C7"/>
  <!-- Wooden table top and legs -->
  <rect x="6" y="12" width="24" height="4" rx="1.5" fill="#B45309"/>
  <rect x="9" y="16" width="3" height="15" rx="1" fill="#92400E"/>
  <rect x="24" y="16" width="3" height="15" rx="1" fill="#92400E"/>
  <!-- Red ball clearly UNDERNEATH the table -->
  <circle cx="18" cy="25.5" r="5.2" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
  <!-- Floor line -->
  <line x1="5" y1="31" x2="31" y2="31" stroke="#D97706" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

const spatialBlizuSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="6" fill="#F5F3FF"/>
  <!-- Small blue house/box on left -->
  <rect x="6" y="15" width="12" height="13" rx="2" fill="#6366F1" stroke="#312E81" stroke-width="1.5"/>
  <!-- Red ball right NEXT TO / NEAR it -->
  <circle cx="25.5" cy="22.5" r="5" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
  <!-- Double-headed proximity arrow -->
  <path d="M18.5,11 H25.5 M20.5,9 L18.5,11 L20.5,13 M23.5,9 L25.5,11 L23.5,13" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const outDir = path.join(process.cwd(), "public");
const files = [
  { name: "spatial_u.svg", content: spatialUSvg },
  { name: "spatial_na.svg", content: spatialNaSvg },
  { name: "spatial_ispod.svg", content: spatialIspodSvg },
  { name: "spatial_blizu.svg", content: spatialBlizuSvg },
];

for (const f of files) {
  fs.writeFileSync(path.join(outDir, f.name), f.content, "utf-8");
  console.log(`✓ Created public/${f.name}`);
}
