import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// ==========================================
// UNIT 56: Velebit i alpsko bilje (Alpine Velebit Peaks & Endemic Flora)
// ==========================================

// 1. Vrh (Snow-dusted Velebit karst summit above pine treeline)
const vrhSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0369A1"/>
  <!-- Limestone peak -->
  <polygon points="3,34 18,7 33,34" fill="#78716C"/>
  <polygon points="18,7 33,34 21,34" fill="#57534E"/>
  <!-- Snow cap -->
  <polygon points="18,7 13,16 16,15 19,17 23,16" fill="#F8FAFC"/>
  <!-- Pine silhouettes at base -->
  <polygon points="6,34 9,26 12,34" fill="#14532D"/>
  <polygon points="24,34 27,27 30,34" fill="#14532D"/>
</svg>`;

// 2. Degenija (Endemic yellow Velebit degenia alpine flower on limestone)
const degenijaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1C1917" stroke="#FACC15" stroke-width="1.5"/>
  <!-- Karst rock base -->
  <path d="M5 27c5-4 21-4 26 0v5H5z" fill="#78716C"/>
  <!-- Silvery-green leaves -->
  <ellipse cx="14" cy="23" rx="4" ry="1.8" transform="rotate(-25 14 23)" fill="#4D7C0F"/>
  <ellipse cx="22" cy="23" rx="4" ry="1.8" transform="rotate(25 22 23)" fill="#65A30D"/>
  <!-- Four-petaled golden-yellow degenia blossom -->
  <circle cx="18" cy="11" r="3.5" fill="#FACC15"/>
  <circle cx="14" cy="15" r="3.5" fill="#EAB308"/>
  <circle cx="22" cy="15" r="3.5" fill="#EAB308"/>
  <circle cx="18" cy="19" r="3.5" fill="#FACC15"/>
  <circle cx="18" cy="15" r="2" fill="#B45309"/>
</svg>`;

// 3. Greben (Jagged Velebit mountain ridge line at dusk)
const grebenSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#312E81"/>
  <!-- Sunset glow -->
  <circle cx="26" cy="10" r="3.5" fill="#F59E0B"/>
  <!-- Distant ridge -->
  <polygon points="2,34 2,20 9,14 15,19 22,12 28,17 34,13 34,34" fill="#475569"/>
  <!-- Foreground jagged karst ridge -->
  <polygon points="2,34 2,24 8,18 14,22 20,15 26,21 34,18 34,34" fill="#1E293B"/>
  <polyline points="2,24 8,18 14,22 20,15 26,21 34,18" fill="none" stroke="#CBD5E1" stroke-width="1"/>
</svg>`;

// 4. Bura (Fierce coastal/mountain Bora wind gusts over Velebit)
const buraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Sweeping wind streamlines -->
  <path d="M6 13h16c3 0 4-3 2-5-1.5-1.5-4 0-3 2" fill="none" stroke="#BAE6FD" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 19h22c3 0 4 3 2 5-1.5 1.5-4 0-3-2" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M8 25h12c2 0 3 2 1.5 3.5" fill="none" stroke="#7DD3FC" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// ==========================================
// UNIT 57: Kanjoni Paklenice i penjanje (Paklenica Canyons & Climbing)
// ==========================================

// 5. Penjač (Rock climber ascending Anića kuk cliff face)
const penjacSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0EA5E9"/>
  <!-- Sheer limestone cliff on left -->
  <polygon points="2,2 18,2 15,18 19,34 2,34" fill="#78716C"/>
  <!-- Climbing rope -->
  <line x1="17" y1="6" x2="22" y2="34" stroke="#F59E0B" stroke-width="1.3"/>
  <!-- Climber helmet & torso -->
  <circle cx="20" cy="13" r="2.5" fill="#EF4444"/>
  <rect x="18" y="16" width="4" height="6" rx="1" fill="#FACC15"/>
  <!-- Arms reaching rock -->
  <line x1="18" y1="17" x2="14" y2="14" stroke="#FDE68A" stroke-width="1.6" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="19" y1="22" x2="16" y2="27" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="21" y1="22" x2="23" y2="27" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// 6. Uže (Coiled mountaineering climbing rope with carabiner)
const uzeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E293B" stroke="#F97316" stroke-width="1.5"/>
  <!-- Coiled rope loops -->
  <ellipse cx="18" cy="19" rx="9" ry="7" fill="none" stroke="#EA580C" stroke-width="3"/>
  <ellipse cx="18" cy="19" rx="6.5" ry="5" fill="none" stroke="#FACC15" stroke-width="1.8"/>
  <!-- Carabiner clip at top -->
  <rect x="15" y="7" width="6" height="8" rx="3" fill="none" stroke="#CBD5E1" stroke-width="2"/>
  <line x1="21" y1="9.5" x2="21" y2="12.5" stroke="#38BDF8" stroke-width="2"/>
</svg>`;

// 7. Špilja (Paklenica Manita peć limestone cave with stalactites)
const spiljaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#57534E"/>
  <!-- Cave dark opening -->
  <path d="M6 34c0-14 5-22 12-22s12 8 12 22z" fill="#0F172A"/>
  <!-- Stalactites hanging from arch -->
  <polygon points="12,13 13.5,20 15,13" fill="#D6D3D1"/>
  <polygon points="17,12 18.5,21 20,12" fill="#E7E5E4"/>
  <polygon points="22,14 23.5,19 25,14" fill="#D6D3D1"/>
  <!-- Stalagmites rising -->
  <polygon points="10,34 12,26 14,34" fill="#A8A29E"/>
  <polygon points="23,34 25,27 27,34" fill="#A8A29E"/>
</svg>`;

// 8. Bukva (UNESCO primeval Paklenica beech tree)
const bukvaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#BAE6FD"/>
  <rect x="2" y="27" width="32" height="7" fill="#15803D"/>
  <!-- Smooth silver-grey beech trunk -->
  <rect x="16" y="17" width="4" height="12" fill="#A8A29E"/>
  <!-- Lush green canopy -->
  <circle cx="18" cy="12" r="7" fill="#16A34A"/>
  <circle cx="12" cy="15" r="5" fill="#22C55E"/>
  <circle cx="24" cy="15" r="5" fill="#15803D"/>
</svg>`;

// ==========================================
// UNIT 58: Utočište za medvjede u Kuterevu (Kuterevo Bear Sanctuary)
// ==========================================

// 9. Medvjedić (Cute Kuterevo brown bear cub)
const medvjedicSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#064E3B" stroke="#D97706" stroke-width="1.5"/>
  <!-- Ears -->
  <circle cx="11" cy="11" r="3.5" fill="#78350F"/>
  <circle cx="25" cy="11" r="3.5" fill="#78350F"/>
  <circle cx="11" cy="11" r="1.8" fill="#B45309"/>
  <circle cx="25" cy="11" r="1.8" fill="#B45309"/>
  <!-- Head -->
  <circle cx="18" cy="18" r="9" fill="#92400E"/>
  <!-- Snout -->
  <ellipse cx="18" cy="21" rx="4" ry="3" fill="#FDE68A"/>
  <ellipse cx="18" cy="19.8" rx="1.6" ry="1.1" fill="#1C1917"/>
  <!-- Eyes -->
  <circle cx="14.5" cy="16" r="1.1" fill="#1C1917"/>
  <circle cx="21.5" cy="16" r="1.1" fill="#1C1917"/>
</svg>`;

// 10. Utočište (Wooden forest sanctuary sign & timber shelter)
const utocisteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#065F46"/>
  <!-- Wooden sanctuary fence -->
  <line x1="4" y1="22" x2="32" y2="22" stroke="#92400E" stroke-width="2"/>
  <line x1="4" y1="28" x2="32" y2="28" stroke="#92400E" stroke-width="2"/>
  <rect x="6" y="18" width="3" height="14" fill="#78350F"/>
  <rect x="27" y="18" width="3" height="14" fill="#78350F"/>
  <!-- Timber shelter roof & heart emblem -->
  <polygon points="8,16 18,7 28,16" fill="#B45309"/>
  <rect x="11" y="16" width="14" height="12" fill="#D97706"/>
  <circle cx="18" cy="22" r="3" fill="#FEF3C7"/>
</svg>`;

// 11. Ris (Eurasian lynx with tufted ears)
const risSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Pointed ears with black tufts -->
  <polygon points="9,14 10,6 15,11" fill="#D97706"/>
  <polygon points="27,14 26,6 21,11" fill="#D97706"/>
  <line x1="10" y1="6" x2="9" y2="3.5" stroke="#1C1917" stroke-width="1.5"/>
  <line x1="26" y1="6" x2="27" y2="3.5" stroke="#1C1917" stroke-width="1.5"/>
  <!-- Face -->
  <circle cx="18" cy="19" r="8" fill="#F59E0B"/>
  <!-- Cheek ruffs -->
  <polygon points="9,20 12,25 14,21" fill="#FEF3C7"/>
  <polygon points="27,20 24,25 22,21" fill="#FEF3C7"/>
  <!-- Eyes & nose -->
  <circle cx="15" cy="17.5" r="1.2" fill="#FACC15"/>
  <circle cx="21" cy="17.5" r="1.2" fill="#FACC15"/>
  <circle cx="15" cy="17.5" r="0.6" fill="#0F172A"/>
  <circle cx="21" cy="17.5" r="0.6" fill="#0F172A"/>
  <polygon points="16.8,21 19.2,21 18,22.5" fill="#1C1917"/>
</svg>`;

// 12. Sova (Forest owl perched on branch at night)
const sovaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#818CF8" stroke-width="1.5"/>
  <!-- Branch -->
  <line x1="6" y1="28" x2="30" y2="28" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Owl body -->
  <ellipse cx="18" cy="19" rx="7" ry="9" fill="#92400E"/>
  <ellipse cx="18" cy="22" rx="4.5" ry="5" fill="#FDE68A"/>
  <!-- Large owl eyes -->
  <circle cx="14.5" cy="14.5" r="3" fill="#FFFFFF"/>
  <circle cx="21.5" cy="14.5" r="3" fill="#FFFFFF"/>
  <circle cx="14.5" cy="14.5" r="1.4" fill="#0F172A"/>
  <circle cx="21.5" cy="14.5" r="1.4" fill="#0F172A"/>
  <!-- Beak -->
  <polygon points="17,16.5 19,16.5 18,19" fill="#F59E0B"/>
</svg>`;

// ==========================================
// UNIT 59: Izvori Gacke i pastrve (Gacka Crystal Springs & Trout)
// ==========================================

// 13. Vrilo (Crystal-clear turquoise karst spring pool Majerovo vrilo)
const vriloSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#15803D"/>
  <!-- Karst rock rim -->
  <ellipse cx="18" cy="20" rx="13" ry="10" fill="#78716C"/>
  <!-- Deep turquoise spring water -->
  <ellipse cx="18" cy="20" rx="10.5" ry="7.5" fill="#0284C7"/>
  <ellipse cx="18" cy="20" rx="7" ry="4.5" fill="#06B6D4"/>
  <!-- Bubbling spring ripples -->
  <circle cx="18" cy="20" r="2.2" fill="#E0F2FE"/>
  <ellipse cx="18" cy="20" rx="4.5" ry="2.5" fill="none" stroke="#BAE6FD" stroke-width="0.9"/>
</svg>`;

// 14. Pastrva (Speckled Gacka river trout swimming in clear water)
const pastrvaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0369A1" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Trout body -->
  <path d="M7 18c4-5 13-5 18 0-5 5-14 5-18 0z" fill="#94A3B8"/>
  <!-- Tail fin -->
  <polygon points="24,18 30,13 30,23" fill="#64748B"/>
  <!-- Dorsal fin -->
  <polygon points="15,14 19,10 21,14" fill="#64748B"/>
  <!-- Trout spots -->
  <circle cx="14" cy="17" r="0.9" fill="#EF4444"/>
  <circle cx="17" cy="18.5" r="0.9" fill="#1E293B"/>
  <circle cx="20" cy="16.8" r="0.9" fill="#EF4444"/>
  <!-- Eye -->
  <circle cx="10.5" cy="17" r="1" fill="#0F172A"/>
</svg>`;

// 15. Potok (Winding crystal mountain stream through green meadow)
const potokSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#22C55E"/>
  <!-- Winding stream -->
  <path d="M16 2c-5 8 7 14 0 22s4 8 6 10h-9c-4-4 3-10 0-16s-5-10 0-16z" fill="#0EA5E9"/>
  <!-- White water glints -->
  <path d="M14 9c1 2 1 4 0 6" stroke="#E0F2FE" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M17 22c-1 2-1 4 0 6" stroke="#E0F2FE" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <!-- Stepping stones -->
  <ellipse cx="9" cy="18" rx="2.5" ry="1.5" fill="#78716C"/>
  <ellipse cx="26" cy="24" rx="2.5" ry="1.5" fill="#78716C"/>
</svg>`;

// 16. Mostić (Traditional wooden footbridge over Gacka spring)
const mosticSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0284C7"/>
  <!-- Green banks -->
  <rect x="2" y="22" width="7" height="12" fill="#16A34A"/>
  <rect x="27" y="22" width="7" height="12" fill="#16A34A"/>
  <!-- Arched wooden bridge deck -->
  <path d="M5 23c8-5 18-5 26 0" fill="none" stroke="#92400E" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Wooden railing -->
  <path d="M6 17c7-4 17-4 24 0" fill="none" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="9" y1="16" x2="9" y2="21" stroke="#B45309" stroke-width="1.5"/>
  <line x1="18" y1="14" x2="18" y2="19.5" stroke="#B45309" stroke-width="1.5"/>
  <line x1="27" y1="16" x2="27" y2="21" stroke="#B45309" stroke-width="1.5"/>
</svg>`;

// ==========================================
// UNIT 60: Lička baština i gorštaci (Lika Highlander Heritage Capstone)
// ==========================================

// 17. Koliba (Traditional Lika timber log cabin in snowy pines)
const kolibaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#1E293B"/>
  <rect x="2" y="27" width="32" height="7" fill="#E2E8F0"/>
  <!-- Log cabin body -->
  <rect x="8" y="16" width="20" height="12" fill="#92400E"/>
  <line x1="8" y1="20" x2="28" y2="20" stroke="#78350F" stroke-width="1.2"/>
  <line x1="8" y1="24" x2="28" y2="24" stroke="#78350F" stroke-width="1.2"/>
  <!-- Steep pitched roof -->
  <polygon points="6,16 18,7 30,16" fill="#44403C"/>
  <polyline points="6,16 18,7 30,16" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <!-- Warm glowing window & door -->
  <rect x="11" y="18" width="4" height="4" fill="#FACC15"/>
  <rect x="19" y="19" width="5" height="9" fill="#451A03"/>
</svg>`;

// 18. Krumpir (Hearty golden Lika potatoes)
const krumpirSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
  <!-- Main potato -->
  <ellipse cx="16" cy="19" rx="9" ry="6" transform="rotate(-15 16 19)" fill="#D97706"/>
  <!-- Second potato -->
  <ellipse cx="23" cy="23" rx="6" ry="4" transform="rotate(20 23 23)" fill="#B45309"/>
  <!-- Potato eyes / spots -->
  <circle cx="13" cy="18" r="0.8" fill="#78350F"/>
  <circle cx="18" cy="16.5" r="0.8" fill="#78350F"/>
  <circle cx="22" cy="22" r="0.7" fill="#78350F"/>
</svg>`;

// 19. Škripavac (Traditional Lika squeaky cheese wheel & wedge)
const skripavacSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#FEF08A" stroke-width="1.5"/>
  <!-- Wooden board -->
  <ellipse cx="18" cy="25" rx="12" ry="3.5" fill="#92400E"/>
  <!-- White fresh cheese wheel -->
  <ellipse cx="17" cy="20" rx="9" ry="4" fill="#FEF9C3"/>
  <rect x="8" y="15" width="18" height="5" fill="#FEF9C3"/>
  <ellipse cx="17" cy="15" rx="9" ry="3.5" fill="#FFFFFF" stroke="#FDE047" stroke-width="1"/>
</svg>`;

// 20. Vuna (Cozy ball of Lika sheep wool with knitting needles)
const vunaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#F8FAFC" stroke-width="1.5"/>
  <!-- Knitting needles -->
  <line x1="7" y1="28" x2="29" y2="8" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round"/>
  <line x1="9" y1="9" x2="27" y2="27" stroke="#CBD5E1" stroke-width="1.6" stroke-linecap="round"/>
  <!-- Wool yarn ball -->
  <circle cx="18" cy="18" r="8.5" fill="#DC2626"/>
  <path d="M12 14c4 2 8 2 12 0" fill="none" stroke="#FCA5A5" stroke-width="1.3"/>
  <path d="M11 19c5 2 9 2 14 0" fill="none" stroke="#FCA5A5" stroke-width="1.3"/>
  <path d="M14 11c2 5 2 9 0 14" fill="none" stroke="#FCA5A5" stroke-width="1.3"/>
</svg>`;

const svgFiles = [
  // Unit 56
  { name: "vrh.svg", content: vrhSvg },
  { name: "degenija.svg", content: degenijaSvg },
  { name: "greben.svg", content: grebenSvg },
  { name: "bura.svg", content: buraSvg },

  // Unit 57
  { name: "penjac.svg", content: penjacSvg },
  { name: "uze.svg", content: uzeSvg },
  { name: "spilja.svg", content: spiljaSvg },
  { name: "bukva.svg", content: bukvaSvg },

  // Unit 58
  { name: "medvjedic.svg", content: medvjedicSvg },
  { name: "utociste.svg", content: utocisteSvg },
  { name: "ris.svg", content: risSvg },
  { name: "sova.svg", content: sovaSvg },

  // Unit 59
  { name: "vrilo.svg", content: vriloSvg },
  { name: "pastrva.svg", content: pastrvaSvg },
  { name: "potok.svg", content: potokSvg },
  { name: "mostic.svg", content: mosticSvg },

  // Unit 60
  { name: "koliba.svg", content: kolibaSvg },
  { name: "krumpir.svg", content: krumpirSvg },
  { name: "skripavac.svg", content: skripavacSvg },
  { name: "vuna.svg", content: vunaSvg },
];

export function generateAllWorld12Svgs() {
  console.log(`Writing ${svgFiles.length} SVG files to ${publicDir}...`);
  for (const item of svgFiles) {
    const targetPath = path.join(publicDir, item.name);
    fs.writeFileSync(targetPath, item.content.trim(), "utf8");
    console.log(`  ✓ Created: ${item.name}`);
  }
  console.log("All World 12 SVGs generated successfully!");
}

if (require.main === module) {
  generateAllWorld12Svgs();
}
