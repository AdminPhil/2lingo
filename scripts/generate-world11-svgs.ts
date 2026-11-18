import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// ==========================================
// UNIT 51: Barokni Varaždin i glazba (Baroque Varaždin & Music)
// ==========================================

// 1. Violina (Baroque wooden violin with bow)
const violinaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Violin body -->
  <ellipse cx="18" cy="24" rx="6" ry="5" fill="#B45309"/>
  <ellipse cx="18" cy="17" rx="4.5" ry="4" fill="#D97706"/>
  <rect x="16.5" y="7" width="3" height="8" fill="#78350F"/>
  <!-- Scroll -->
  <circle cx="18" cy="6.5" r="1.8" fill="#92400E"/>
  <!-- Bridge & tailpiece -->
  <polygon points="16.5,27 19.5,27 18.8,23 17.2,23" fill="#1C1917"/>
  <rect x="16.5" y="21" width="3" height="0.8" fill="#FEF3C7"/>
  <!-- Strings -->
  <line x1="17.5" y1="8" x2="17.5" y2="23" stroke="#E2E8F0" stroke-width="0.6"/>
  <line x1="18.5" y1="8" x2="18.5" y2="23" stroke="#E2E8F0" stroke-width="0.6"/>
  <!-- Bow -->
  <line x1="7" y1="26" x2="29" y2="12" stroke="#FDE68A" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

// 2. Klavir (Baroque concert grand piano / harpsichord)
const klavirSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#312E81" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Piano body -->
  <path d="M7 18c0-6 5-9 11-9 5 0 9 3 9 7 0 2-2 3-2 5v4H7v-7z" fill="#0F172A"/>
  <!-- Open lid -->
  <polygon points="8,13 24,7 26,12 10,16" fill="#1E293B" stroke="#94A3B8" stroke-width="0.8"/>
  <!-- Keyboard -->
  <rect x="7" y="21" width="18" height="4" fill="#FFFFFF"/>
  <rect x="9" y="21" width="1.6" height="2.4" fill="#0F172A"/>
  <rect x="12" y="21" width="1.6" height="2.4" fill="#0F172A"/>
  <rect x="16" y="21" width="1.6" height="2.4" fill="#0F172A"/>
  <rect x="19" y="21" width="1.6" height="2.4" fill="#0F172A"/>
  <rect x="22" y="21" width="1.6" height="2.4" fill="#0F172A"/>
  <!-- Legs -->
  <line x1="9" y1="25" x2="9" y2="30" stroke="#475569" stroke-width="1.8"/>
  <line x1="23" y1="25" x2="23" y2="30" stroke="#475569" stroke-width="1.8"/>
</svg>`;

// 3. Nota (Golden beamed musical notes on parchment)
const notaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="4" y="4" width="28" height="28" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>
  <!-- Staff lines -->
  <line x1="7" y1="13" x2="29" y2="13" stroke="#D6D3D1" stroke-width="1"/>
  <line x1="7" y1="18" x2="29" y2="18" stroke="#D6D3D1" stroke-width="1"/>
  <line x1="7" y1="23" x2="29" y2="23" stroke="#D6D3D1" stroke-width="1"/>
  <!-- Beamed eighth notes -->
  <ellipse cx="13" cy="24" rx="3.2" ry="2.2" transform="rotate(-15 13 24)" fill="#4338CA"/>
  <ellipse cx="23" cy="21" rx="3.2" ry="2.2" transform="rotate(-15 23 21)" fill="#4338CA"/>
  <line x1="15.8" y1="23.5" x2="15.8" y2="11" stroke="#4338CA" stroke-width="2"/>
  <line x1="25.8" y1="20.5" x2="25.8" y2="8.5" stroke="#4338CA" stroke-width="2"/>
  <polygon points="15.8,11 25.8,8.5 25.8,11.5 15.8,14" fill="#4338CA"/>
</svg>`;

// 4. Orkestar (Baroque chamber orchestra stage with music stands)
const orkestarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#4C1D95"/>
  <!-- Stage curtains -->
  <path d="M2 2h7c0 8-2 14-7 18z" fill="#991B1B"/>
  <path d="M34 2h-7c0 8 2 14 7 18z" fill="#991B1B"/>
  <!-- Stage floor -->
  <rect x="2" y="25" width="32" height="9" fill="#78350F"/>
  <!-- Conductor & musicians silhouettes -->
  <circle cx="18" cy="14" r="2.2" fill="#FDE68A"/>
  <path d="M15 17h6l1 8h-8z" fill="#1E293B"/>
  <line x1="21" y1="18" x2="25" y2="12" stroke="#FBBF24" stroke-width="1.2"/>
  <circle cx="10" cy="17" r="1.8" fill="#FDE68A"/>
  <path d="M8 20h4l1 5H7z" fill="#0F172A"/>
  <circle cx="26" cy="17" r="1.8" fill="#FDE68A"/>
  <path d="M24 20h4l1 5h-6z" fill="#0F172A"/>
</svg>`;

// ==========================================
// UNIT 52: Špancirfest i ulice (Špancirfest Festival & Streets)
// ==========================================

// 5. Pozornica (Open-air Špancirfest festival stage with lights)
const pozornicaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#1E1B4B"/>
  <!-- Stage truss & roof -->
  <polygon points="4,11 18,5 32,11" fill="#EC4899"/>
  <line x1="6" y1="11" x2="6" y2="27" stroke="#CBD5E1" stroke-width="1.8"/>
  <line x1="30" y1="11" x2="30" y2="27" stroke="#CBD5E1" stroke-width="1.8"/>
  <!-- Spotlights -->
  <polygon points="10,11 6,27 14,27" fill="#FDE047" opacity="0.45"/>
  <polygon points="26,11 22,27 30,27" fill="#38BDF8" opacity="0.45"/>
  <!-- Stage deck -->
  <rect x="4" y="26" width="28" height="5" rx="1" fill="#475569"/>
  <circle cx="18" cy="21" r="2" fill="#FFFFFF"/>
  <line x1="18" y1="23" x2="18" y2="26" stroke="#FFFFFF" stroke-width="1.5"/>
</svg>`;

// 6. Glumac (Street performer / theater actor with comedy mask)
const glumacSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#EC4899" stroke-width="1.5"/>
  <!-- Performer hat -->
  <polygon points="13,11 18,5 23,11" fill="#8B5CF6"/>
  <rect x="11" y="10.5" width="14" height="2" rx="1" fill="#F59E0B"/>
  <!-- Face -->
  <circle cx="18" cy="16.5" r="4" fill="#FDE68A"/>
  <circle cx="16.5" cy="16" r="0.7" fill="#1E293B"/>
  <circle cx="19.5" cy="16" r="0.7" fill="#1E293B"/>
  <path d="M16.5 18c1 1 2 1 3 0" stroke="#DC2626" stroke-width="1" fill="none"/>
  <!-- Ruffled collar & tunic -->
  <path d="M11 22c2-1 12-1 14 0l2 9H9z" fill="#EC4899"/>
  <path d="M13 21.5h10" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2,1"/>
</svg>`;

// 7. Kišobran (Colorful suspended Špancirfest umbrella)
const kisobranSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#38BDF8"/>
  <!-- Umbrella canopy -->
  <path d="M6 19c0-7 5-12 12-12s12 5 12 12z" fill="#EF4444"/>
  <path d="M10 19c0-7 3.5-12 8-12s8 5 8 12z" fill="#FACC15"/>
  <path d="M14 19c0-7 1.8-12 4-12s4 5 4 12z" fill="#10B981"/>
  <!-- Tip & handle -->
  <line x1="18" y1="5" x2="18" y2="7" stroke="#1E293B" stroke-width="1.5"/>
  <line x1="18" y1="19" x2="18" y2="28" stroke="#78350F" stroke-width="1.8"/>
  <path d="M18 28c0 2.5 3.5 2.5 3.5 0" fill="none" stroke="#78350F" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// 8. Šešir (Festive straw/felt festival hat with ribbon)
const sesirSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E293B" stroke="#FBBF24" stroke-width="1.5"/>
  <!-- Hat crown -->
  <path d="M11 21l2-10h10l2 10z" fill="#D97706"/>
  <!-- Ribbon band -->
  <rect x="11.4" y="17.5" width="13.2" height="2.5" fill="#DC2626"/>
  <!-- Wide brim -->
  <ellipse cx="18" cy="21.5" rx="12" ry="3.2" fill="#F59E0B"/>
  <!-- Feather -->
  <path d="M22 18c2-4 5-5 6-3" fill="none" stroke="#FDE047" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// ==========================================
// UNIT 53: Stari grad i anđeli (Varaždin Old Town & Angels)
// ==========================================

// 9. Anđeo (Baroque Varaždin angel with golden wings & halo)
const andeoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#312E81" stroke="#FDE047" stroke-width="1.5"/>
  <!-- Wings -->
  <path d="M15 17c-6-5-10-2-9 4 2 2 5 1 8-1z" fill="#F8FAFC"/>
  <path d="M21 17c6-5 10-2 9 4-2 2-5 1-8-1z" fill="#F8FAFC"/>
  <!-- Halo -->
  <ellipse cx="18" cy="7.5" rx="4" ry="1.3" fill="none" stroke="#FACC15" stroke-width="1.5"/>
  <!-- Head & robe -->
  <circle cx="18" cy="12" r="3.2" fill="#FDE68A"/>
  <polygon points="14,16 22,16 24,29 12,29" fill="#E0E7FF"/>
</svg>`;

// 10. Bedem (Old Town stone fortress rampart & bastion)
const bedemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0284C7"/>
  <!-- Green embankment -->
  <rect x="2" y="24" width="32" height="10" fill="#15803D"/>
  <!-- Whitewashed rampart wall -->
  <rect x="5" y="14" width="26" height="12" fill="#E7E5E4"/>
  <!-- Terracotta roof -->
  <polygon points="4,14 18,7 32,14" fill="#B91C1C"/>
  <!-- Bastion windows -->
  <rect x="9" y="18" width="3" height="4" fill="#44403C"/>
  <rect x="16.5" y="18" width="3" height="4" fill="#44403C"/>
  <rect x="24" y="18" width="3" height="4" fill="#44403C"/>
</svg>`;

// 11. Toranj (Baroque onion-domed church/castle tower)
const toranjSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#1E1B4B"/>
  <!-- Tower shaft -->
  <rect x="13" y="15" width="10" height="18" fill="#FEF3C7"/>
  <!-- Baroque copper dome -->
  <path d="M12 15c0-4 3-6 6-8 3 2 6 4 6 8z" fill="#0D9488"/>
  <line x1="18" y1="4" x2="18" y2="7" stroke="#FACC15" stroke-width="1.5"/>
  <!-- Clock face -->
  <circle cx="18" cy="20" r="2.8" fill="#FFFFFF" stroke="#B45309" stroke-width="0.8"/>
  <line x1="18" y1="20" x2="18" y2="18.2" stroke="#1E293B" stroke-width="0.8"/>
  <line x1="18" y1="20" x2="19.5" y2="20" stroke="#1E293B" stroke-width="0.8"/>
  <!-- Door -->
  <rect x="16" y="27" width="4" height="6" rx="1" fill="#78350F"/>
</svg>`;

// 12. Grb (Historic Varaždin heraldic shield / coat of arms)
const grbSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Heraldic shield -->
  <path d="M10 8h16v11c0 6-8 10-8 10s-8-4-8-10z" fill="#DC2626" stroke="#FACC15" stroke-width="1.8"/>
  <!-- Silver bars & tower emblem -->
  <rect x="11" y="13" width="14" height="2.5" fill="#FFFFFF"/>
  <rect x="11" y="18" width="14" height="2.5" fill="#FFFFFF"/>
  <rect x="16" y="10" width="4" height="6" fill="#FACC15"/>
</svg>`;

// ==========================================
// UNIT 54: Rijeke Mura i Drava (Mura & Drava Rivers)
// ==========================================

// 13. Labud (Graceful white swan gliding on Drava river)
const labudSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0EA5E9"/>
  <rect x="2" y="22" width="32" height="12" fill="#0369A1"/>
  <!-- Swan body -->
  <path d="M9 22c2-4 10-4 14 0 1 2-1 4-4 4H12c-3 0-4-2-3-4z" fill="#FFFFFF"/>
  <!-- Curved neck & head -->
  <path d="M21 21c2-5 0-11-3-11-2 0-3 1.5-2 3" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <!-- Orange beak -->
  <polygon points="15,12 12,13 15,14" fill="#F97316"/>
  <circle cx="16.5" cy="11.5" r="0.6" fill="#0F172A"/>
</svg>`;

// 14. Vrba (Weeping willow tree beside river)
const vrbaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#7DD3FC"/>
  <rect x="2" y="26" width="32" height="8" fill="#16A34A"/>
  <!-- Trunk -->
  <rect x="16" y="18" width="4" height="10" fill="#78350F"/>
  <!-- Drooping willow canopy -->
  <ellipse cx="18" cy="12" rx="10" ry="6" fill="#22C55E"/>
  <line x1="11" y1="14" x2="10" y2="25" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="15" x2="14" y2="25" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="15" x2="22" y2="25" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="25" y1="14" x2="26" y2="25" stroke="#15803D" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

// 15. Splav (Traditional wooden river ferry/raft on Mura)
const splavSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0284C7"/>
  <!-- River ripples -->
  <path d="M4 28c4-1 8 1 12 0s8-1 12 0" stroke="#BAE6FD" stroke-width="1.2" fill="none"/>
  <!-- Wooden logs of raft -->
  <rect x="6" y="21" width="24" height="4" rx="1.5" fill="#92400E"/>
  <rect x="8" y="19" width="20" height="2" fill="#B45309"/>
  <!-- Small wooden shelter & pole -->
  <rect x="13" y="12" width="10" height="7" fill="#D97706"/>
  <polygon points="12,12 18,8 24,12" fill="#78350F"/>
  <line x1="27" y1="10" x2="24" y2="24" stroke="#FEF3C7" stroke-width="1.5"/>
</svg>`;

// 16. Obala (Sandy/grassy river shore meeting flowing water)
const obalaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#38BDF8"/>
  <!-- River water -->
  <rect x="2" y="16" width="32" height="18" fill="#0284C7"/>
  <!-- Curved grassy riverbank -->
  <path d="M2 18c8-2 12 4 18 8s8 4 14 8H2z" fill="#22C55E"/>
  <path d="M2 22c6-1 10 3 15 6s6 3 11 6H2z" fill="#D97706"/>
  <!-- Reeds -->
  <line x1="7" y1="22" x2="7" y2="14" stroke="#15803D" stroke-width="1.4"/>
  <line x1="10" y1="23" x2="11" y2="15" stroke="#15803D" stroke-width="1.4"/>
</svg>`;

// ==========================================
// UNIT 55: Međimurski vinogradi i baština (Međimurje Vineyards)
// ==========================================

// 17. Vinograd (Terraced green Međimurje vineyard hills)
const vinogradSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#7DD3FC"/>
  <circle cx="28" cy="8" r="3" fill="#FDE047"/>
  <!-- Rolling hills -->
  <path d="M2 18c8-4 20-4 32 2v14H2z" fill="#16A34A"/>
  <!-- Vine rows -->
  <line x1="6" y1="20" x2="30" y2="22" stroke="#14532D" stroke-width="2" stroke-dasharray="3,2"/>
  <line x1="6" y1="25" x2="30" y2="27" stroke="#14532D" stroke-width="2" stroke-dasharray="3,2"/>
  <line x1="6" y1="30" x2="30" y2="32" stroke="#14532D" stroke-width="2" stroke-dasharray="3,2"/>
</svg>`;

// 18. Grožđe (Cluster of purple Međimurje grapes with leaf)
const grozdeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#FEF9C3" stroke="#7E22CE" stroke-width="1.5"/>
  <!-- Stem & leaf -->
  <line x1="18" y1="6" x2="18" y2="11" stroke="#78350F" stroke-width="2"/>
  <ellipse cx="22" cy="9" rx="4" ry="2" transform="rotate(-20 22 9)" fill="#16A34A"/>
  <!-- Grape cluster -->
  <circle cx="14" cy="14" r="3" fill="#7E22CE"/>
  <circle cx="18" cy="14" r="3" fill="#9333EA"/>
  <circle cx="22" cy="14" r="3" fill="#7E22CE"/>
  <circle cx="15.5" cy="19" r="3" fill="#9333EA"/>
  <circle cx="20.5" cy="19" r="3" fill="#7E22CE"/>
  <circle cx="18" cy="24" r="3" fill="#6B21A8"/>
</svg>`;

// 19. Čipka (Intricate white traditional lace rosette on indigo)
const cipkaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E3A8A" stroke="#E2E8F0" stroke-width="1.5"/>
  <!-- Lace concentric rings & spokes -->
  <circle cx="18" cy="18" r="11" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-dasharray="2,1.5"/>
  <circle cx="18" cy="18" r="7" fill="none" stroke="#E0F2FE" stroke-width="1.2"/>
  <circle cx="18" cy="18" r="3" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
  <line x1="18" y1="7" x2="18" y2="29" stroke="#FFFFFF" stroke-width="1"/>
  <line x1="7" y1="18" x2="29" y2="18" stroke="#FFFFFF" stroke-width="1"/>
  <line x1="10" y1="10" x2="26" y2="26" stroke="#FFFFFF" stroke-width="1"/>
  <line x1="26" y1="10" x2="10" y2="26" stroke="#FFFFFF" stroke-width="1"/>
</svg>`;

// 20. Tambura (Traditional Croatian stringed tamburica instrument)
const tamburaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#451A03" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Pear-shaped body -->
  <ellipse cx="14" cy="23" rx="6.5" ry="5.5" transform="rotate(-35 14 23)" fill="#D97706"/>
  <!-- Soundhole -->
  <circle cx="15" cy="22" r="2" fill="#451A03"/>
  <!-- Long neck -->
  <line x1="18" y1="19" x2="28" y2="7" stroke="#92400E" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Strings -->
  <line x1="14" y1="23" x2="28" y2="7" stroke="#FEF3C7" stroke-width="0.7"/>
  <!-- Headstock -->
  <circle cx="28.5" cy="6.5" r="1.8" fill="#B45309"/>
</svg>`;

const svgFiles = [
  // Unit 51
  { name: "violina.svg", content: violinaSvg },
  { name: "klavir.svg", content: klavirSvg },
  { name: "nota.svg", content: notaSvg },
  { name: "orkestar.svg", content: orkestarSvg },

  // Unit 52
  { name: "pozornica.svg", content: pozornicaSvg },
  { name: "glumac.svg", content: glumacSvg },
  { name: "kisobran.svg", content: kisobranSvg },
  { name: "sesir.svg", content: sesirSvg },

  // Unit 53
  { name: "andeo.svg", content: andeoSvg },
  { name: "bedem.svg", content: bedemSvg },
  { name: "toranj.svg", content: toranjSvg },
  { name: "grb.svg", content: grbSvg },

  // Unit 54
  { name: "labud.svg", content: labudSvg },
  { name: "vrba.svg", content: vrbaSvg },
  { name: "splav.svg", content: splavSvg },
  { name: "obala.svg", content: obalaSvg },

  // Unit 55
  { name: "vinograd.svg", content: vinogradSvg },
  { name: "grozde.svg", content: grozdeSvg },
  { name: "cipka.svg", content: cipkaSvg },
  { name: "tambura.svg", content: tamburaSvg },
];

export function generateAllWorld11Svgs() {
  console.log(`Writing ${svgFiles.length} SVG files to ${publicDir}...`);
  for (const item of svgFiles) {
    const targetPath = path.join(publicDir, item.name);
    fs.writeFileSync(targetPath, item.content.trim(), "utf8");
    console.log(`  ✓ Created: ${item.name}`);
  }
  console.log("All World 11 SVGs generated successfully!");
}

if (require.main === module) {
  generateAllWorld11Svgs();
}
