import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// ==========================================
// UNIT 46: Luka Rijeka i brodovi (Rijeka Port & Ships)
// ==========================================

// 1. Luka (Rijeka harbor quay with port crane & Adriatic water)
const lukaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0EA5E9"/>
  <rect x="2" y="22" width="32" height="12" fill="#0369A1"/>
  <path d="M2 26c4-1 8 1 12 0s8-1 12 0 6 1 8 0" stroke="#7DD3FC" stroke-width="1.2" fill="none"/>
  <!-- Stone harbor pier / mol -->
  <rect x="2" y="18" width="16" height="6" fill="#94A3B8"/>
  <rect x="2" y="17" width="16" height="2" fill="#CBD5E1"/>
  <!-- Port crane -->
  <line x1="9" y1="17" x2="9" y2="7" stroke="#DC2626" stroke-width="2"/>
  <line x1="9" y1="7" x2="21" y2="11" stroke="#EF4444" stroke-width="1.8"/>
  <line x1="19" y1="10.5" x2="19" y2="16" stroke="#334155" stroke-width="1"/>
  <rect x="17" y="16" width="4" height="3" fill="#F59E0B"/>
  <!-- Mooring bollard -->
  <rect x="15" y="15" width="2" height="2.5" rx="0.5" fill="#1E293B"/>
</svg>`;

// 2. Brod (White Adriatic passenger/cargo ship sailing on Kvarner Bay)
const brodSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#38BDF8"/>
  <rect x="2" y="24" width="32" height="10" fill="#0284C7"/>
  <!-- Ship hull -->
  <polygon points="5,20 31,20 27,26 9,26" fill="#0F172A"/>
  <rect x="8" y="17" width="20" height="3" fill="#FFFFFF"/>
  <!-- Cabin & bridge -->
  <rect x="11" y="12" width="13" height="5" rx="1" fill="#F8FAFC"/>
  <rect x="13" y="13.5" width="3" height="2" fill="#0EA5E9"/>
  <rect x="18" y="13.5" width="3" height="2" fill="#0EA5E9"/>
  <!-- Funnel with red-white-blue stripe -->
  <rect x="15" y="7" width="4" height="5" fill="#DC2626"/>
  <rect x="15" y="9" width="4" height="1.2" fill="#FFFFFF"/>
  <circle cx="19" cy="5.5" r="1.5" fill="#E2E8F0"/>
  <circle cx="22" cy="4.5" r="1.2" fill="#CBD5E1"/>
</svg>`;

// 3. Sidro (Heavy iron maritime anchor)
const sidroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#14B8A6" stroke-width="1.5"/>
  <!-- Ring at top -->
  <circle cx="18" cy="7.5" r="2.5" fill="none" stroke="#CBD5E1" stroke-width="2"/>
  <!-- Vertical shank -->
  <line x1="18" y1="10" x2="18" y2="28" stroke="#E2E8F0" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Crossbar / stock -->
  <line x1="12" y1="13" x2="24" y2="13" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
  <!-- Curved flukes -->
  <path d="M9 21c0 5 4 7.5 9 7.5s9-2.5 9-7.5" fill="none" stroke="#E2E8F0" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Fluke arrow tips -->
  <polygon points="7,22 9,18 12,21" fill="#CBD5E1"/>
  <polygon points="29,22 27,18 24,21" fill="#CBD5E1"/>
</svg>`;

// 4. Svjetionik (Coastal stone lighthouse with glowing beam)
const svjetionikSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#1E293B"/>
  <!-- Light beams -->
  <polygon points="18,10 4,5 4,14" fill="#FEF08A" opacity="0.5"/>
  <polygon points="18,10 32,5 32,14" fill="#FEF08A" opacity="0.5"/>
  <!-- Rocky base -->
  <polygon points="6,34 10,27 26,27 30,34" fill="#475569"/>
  <!-- Lighthouse tower -->
  <polygon points="14,27 15,12 21,12 22,27" fill="#F8FAFC"/>
  <polygon points="14.5,21 21.5,21 21.3,18 14.7,18" fill="#DC2626"/>
  <!-- Lantern room -->
  <rect x="15" y="8" width="6" height="4" fill="#FACC15"/>
  <polygon points="14,8 18,4.5 22,8" fill="#DC2626"/>
  <!-- Door -->
  <rect x="16.5" y="23" width="3" height="4" rx="1" fill="#334155"/>
</svg>`;

// ==========================================
// UNIT 47: Trsatska gradina i stube (Trsat Castle & Stairs)
// ==========================================

// 5. Gradina (Hilltop Trsat stone fortress with crenellated tower)
const gradinaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0369A1"/>
  <!-- Green Trsat hill -->
  <path d="M2 28c6-6 26-6 32 0v6H2z" fill="#15803D"/>
  <!-- Fortress curtain wall -->
  <rect x="7" y="17" width="22" height="10" fill="#A8A29E"/>
  <!-- Watchtower -->
  <rect x="13" y="8" width="10" height="19" fill="#D6D3D1"/>
  <!-- Battlements -->
  <rect x="13" y="6" width="2.5" height="2" fill="#D6D3D1"/>
  <rect x="16.75" y="6" width="2.5" height="2" fill="#D6D3D1"/>
  <rect x="20.5" y="6" width="2.5" height="2" fill="#D6D3D1"/>
  <!-- Arched gate -->
  <path d="M16 27v-5a2 2 0 0 1 4 0v5z" fill="#44403C"/>
  <!-- Arrow slit -->
  <rect x="17.2" y="12" width="1.6" height="4" fill="#292524"/>
</svg>`;

// 6. Stube (Petar Kružić historic stone staircase climbing uphill)
const stubeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#334155"/>
  <!-- Ascending stone steps -->
  <polygon points="4,32 4,27 10,27 10,22 16,22 16,17 22,17 22,12 28,12 28,7 32,7 32,32" fill="#D6D3D1"/>
  <!-- Step shadows / risers -->
  <line x1="4" y1="27" x2="10" y2="27" stroke="#78716C" stroke-width="1.2"/>
  <line x1="10" y1="22" x2="16" y2="22" stroke="#78716C" stroke-width="1.2"/>
  <line x1="16" y1="17" x2="22" y2="17" stroke="#78716C" stroke-width="1.2"/>
  <line x1="22" y1="12" x2="28" y2="12" stroke="#78716C" stroke-width="1.2"/>
  <!-- Iron handrail -->
  <line x1="6" y1="23" x2="29" y2="4" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="10" y1="22" x2="10" y2="19.5" stroke="#F59E0B" stroke-width="1.2"/>
  <line x1="18" y1="17" x2="18" y2="13" stroke="#F59E0B" stroke-width="1.2"/>
  <line x1="26" y1="12" x2="26" y2="6.5" stroke="#F59E0B" stroke-width="1.2"/>
</svg>`;

// 7. Vidikovac (Scenic terrace overlook with binoculars/railing over bay)
const vidikovacSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0EA5E9"/>
  <!-- Distant Kvarner islands & sea -->
  <path d="M2 18c6-2 10 0 16-1s10 1 16 0v17H2z" fill="#0284C7"/>
  <path d="M5 17c3-3 7-3 10 0z" fill="#166534"/>
  <path d="M22 17c3-2.5 7-2.5 10 0z" fill="#15803D"/>
  <!-- Stone lookout terrace -->
  <rect x="2" y="25" width="32" height="9" fill="#78716C"/>
  <!-- Balustrade railing -->
  <line x1="2" y1="22" x2="34" y2="22" stroke="#E7E5E4" stroke-width="2"/>
  <line x1="8" y1="22" x2="8" y2="25" stroke="#D6D3D1" stroke-width="2"/>
  <line x1="18" y1="22" x2="18" y2="25" stroke="#D6D3D1" stroke-width="2"/>
  <line x1="28" y1="22" x2="28" y2="25" stroke="#D6D3D1" stroke-width="2"/>
  <!-- Sun -->
  <circle cx="28" cy="8" r="3" fill="#FDE047"/>
</svg>`;

// 8. Zmaj (The iconic bronze Trsat Dragon / Basilisk)
const zmajSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Dragon wing -->
  <path d="M16 17c-5-7-10-5-11 0 3 0 5 2 6 4z" fill="#0D9488"/>
  <!-- Dragon body & tail -->
  <path d="M12 28c2-6 5-10 8-12 3-2 4-5 3-8l4 1c1 4-1 8-4 11s-2 7-4 9z" fill="#14B8A6"/>
  <!-- Dragon head & snout -->
  <path d="M22 8l6 2-2 3-5-1z" fill="#2DD4BF"/>
  <!-- Horns -->
  <polygon points="22,8 20,4 24,7" fill="#FBBF24"/>
  <!-- Eye -->
  <circle cx="25" cy="9.5" r="0.8" fill="#DC2626"/>
  <!-- Fire spark -->
  <polygon points="29,11 33,10 31,13" fill="#F97316"/>
</svg>`;

// ==========================================
// UNIT 48: Opatijska rivijera i kamelije (Opatija Riviera & Camellias)
// ==========================================

// 9. Šetnica (Lungomare seaside promenade with palm & lamp)
const setnicaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#38BDF8"/>
  <!-- Sea on left -->
  <rect x="2" y="18" width="16" height="16" fill="#0284C7"/>
  <!-- Stone promenade path on right -->
  <polygon points="16,18 34,18 34,34 12,34" fill="#E7E5E4"/>
  <line x1="16" y1="18" x2="12" y2="34" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Vintage promenade streetlamp -->
  <line x1="22" y1="26" x2="22" y2="11" stroke="#1E293B" stroke-width="1.5"/>
  <circle cx="22" cy="10" r="2" fill="#FEF08A"/>
  <!-- Palm tree -->
  <line x1="29" y1="24" x2="28" y2="13" stroke="#78350F" stroke-width="1.8"/>
  <path d="M28 13c-3-2-5 0-6 2m6-2c3-2 5 0 6 2m-6-2c-1-3-3-4-5-3m5 3c1-3 3-4 5-3" stroke="#15803D" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;

// 10. Kamelija (Pink Opatija camellia flower with glossy green leaves)
const kamelijaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#064E3B" stroke="#F472B6" stroke-width="1.5"/>
  <!-- Leaves -->
  <ellipse cx="10" cy="24" rx="5" ry="3" transform="rotate(-30 10 24)" fill="#16A34A"/>
  <ellipse cx="26" cy="24" rx="5" ry="3" transform="rotate(30 26 24)" fill="#15803D"/>
  <!-- Outer pink petals -->
  <circle cx="18" cy="11" r="5" fill="#F472B6"/>
  <circle cx="11" cy="16" r="5" fill="#EC4899"/>
  <circle cx="25" cy="16" r="5" fill="#EC4899"/>
  <circle cx="13" cy="23" r="5" fill="#DB2777"/>
  <circle cx="23" cy="23" r="5" fill="#DB2777"/>
  <!-- Inner petals & golden stamens -->
  <circle cx="18" cy="18" r="5" fill="#F9A8D4"/>
  <circle cx="18" cy="18" r="2.2" fill="#FACC15"/>
</svg>`;

// 11. Vila (Historic Austro-Hungarian Opatija villa with arched windows)
const vilaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#7DD3FC"/>
  <!-- Garden lawn -->
  <rect x="2" y="27" width="32" height="7" fill="#16A34A"/>
  <!-- Villa facade -->
  <rect x="7" y="13" width="22" height="15" fill="#FEF3C7"/>
  <!-- Terracotta roof -->
  <polygon points="5,13 18,6 31,13" fill="#B91C1C"/>
  <!-- Arched windows -->
  <path d="M10 20v-3a1.5 1.5 0 0 1 3 0v3z" fill="#0369A1"/>
  <path d="M16.5 20v-3a1.5 1.5 0 0 1 3 0v3z" fill="#0369A1"/>
  <path d="M23 20v-3a1.5 1.5 0 0 1 3 0v3z" fill="#0369A1"/>
  <!-- Grand entrance door -->
  <rect x="16" y="22" width="4" height="6" rx="1" fill="#78350F"/>
</svg>`;

// 12. Fontana (Ornate stone park fountain with spraying water)
const fontanaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Water arcs -->
  <path d="M18 11c-4-4-8 0-8 7" fill="none" stroke="#7DD3FC" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M18 11c4-4 8 0 8 7" fill="none" stroke="#7DD3FC" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="18" y1="7" x2="18" y2="12" stroke="#BAE6FD" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Upper & lower stone basins -->
  <path d="M12 16h12l-2 3h-8z" fill="#CBD5E1"/>
  <rect x="16.5" y="19" width="3" height="5" fill="#94A3B8"/>
  <path d="M7 24h22l-2 5H9z" fill="#E2E8F0"/>
  <!-- Water surface in basin -->
  <ellipse cx="18" cy="24" rx="10" ry="1.5" fill="#0EA5E9"/>
</svg>`;

// ==========================================
// UNIT 49: Otok Krk i glagoljica (Krk Island & Glagolitic)
// ==========================================

// 13. Ploča (Baška Tablet - carved limestone slab with Glagolitic lines)
const plocaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1C1917" stroke="#D6D3D1" stroke-width="1.5"/>
  <!-- Limestone tablet -->
  <rect x="6" y="10" width="24" height="16" rx="1.5" fill="#D6D3D1" stroke="#78716C" stroke-width="1.2"/>
  <!-- Ornamental top band -->
  <line x1="8" y1="13" x2="28" y2="13" stroke="#57534E" stroke-width="1.5"/>
  <!-- Carved Glagolitic inscription lines -->
  <line x1="9" y1="16.5" x2="27" y2="16.5" stroke="#44403C" stroke-width="1.3" stroke-dasharray="2,1.5"/>
  <line x1="9" y1="19.5" x2="27" y2="19.5" stroke="#44403C" stroke-width="1.3" stroke-dasharray="3,1.5"/>
  <line x1="9" y1="22.5" x2="23" y2="22.5" stroke="#44403C" stroke-width="1.3" stroke-dasharray="2,2"/>
</svg>`;

// 14. Slovo (Golden Glagolitic letter Az on parchment)
const slovoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="4" y="4" width="28" height="28" rx="4" fill="#FEF3C7" stroke="#B45309" stroke-width="1.8"/>
  <!-- Glagolitic "Az" cross-like glyph -->
  <line x1="18" y1="9" x2="18" y2="27" stroke="#991B1B" stroke-width="2.8" stroke-linecap="round"/>
  <line x1="10" y1="16" x2="26" y2="16" stroke="#991B1B" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="11" cy="24" r="2.2" fill="none" stroke="#991B1B" stroke-width="2.2"/>
  <circle cx="25" cy="24" r="2.2" fill="none" stroke="#991B1B" stroke-width="2.2"/>
  <line x1="13" y1="24" x2="23" y2="24" stroke="#991B1B" stroke-width="2.2"/>
</svg>`;

// 15. Maslina (Mediterranean olive branch with dark & green olives)
const maslinaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#FEF9C3" stroke="#65A30D" stroke-width="1.5"/>
  <!-- Branch stem -->
  <path d="M8 26c6-6 12-10 20-16" fill="none" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
  <!-- Olive leaves -->
  <ellipse cx="14" cy="15" rx="4.5" ry="1.8" transform="rotate(-35 14 15)" fill="#4D7C0F"/>
  <ellipse cx="22" cy="12" rx="4.5" ry="1.8" transform="rotate(20 22 12)" fill="#65A30D"/>
  <ellipse cx="23" cy="21" rx="4.5" ry="1.8" transform="rotate(-15 23 21)" fill="#4D7C0F"/>
  <!-- Olives -->
  <ellipse cx="14" cy="22" rx="2.8" ry="3.5" fill="#1E293B"/>
  <ellipse cx="20" cy="18" rx="2.5" ry="3.2" fill="#84CC16"/>
  <circle cx="13.2" cy="21" r="0.7" fill="#FFFFFF"/>
</svg>`;

// 16. Ovca (Krk island sheep grazing on karst meadow)
const ovcaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#38BDF8"/>
  <rect x="2" y="24" width="32" height="10" fill="#22C55E"/>
  <!-- Legs -->
  <line x1="13" y1="23" x2="13" y2="29" stroke="#1C1917" stroke-width="2"/>
  <line x1="22" y1="23" x2="22" y2="29" stroke="#1C1917" stroke-width="2"/>
  <!-- Fluffy wool body -->
  <circle cx="14" cy="18" r="5" fill="#FFFFFF"/>
  <circle cx="20" cy="18" r="5.5" fill="#F8FAFC"/>
  <circle cx="17" cy="15" r="5" fill="#FFFFFF"/>
  <circle cx="23" cy="19" r="4" fill="#F1F5F9"/>
  <!-- Head & ears -->
  <ellipse cx="10" cy="17" rx="3.2" ry="4" fill="#292524"/>
  <ellipse cx="7.5" cy="15.5" rx="2" ry="1" fill="#44403C"/>
  <circle cx="9.2" cy="16.2" r="0.8" fill="#FFFFFF"/>
</svg>`;

// ==========================================
// UNIT 50: Riječki karneval i Korzo (Rijeka Carnival & Korzo)
// ==========================================

// 17. Maska (Colorful Rijeka Carnival Venetian-style mask with feathers)
const maskaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#312E81" stroke="#FBBF24" stroke-width="1.5"/>
  <!-- Carnival plumes -->
  <path d="M18 13c-3-6-8-7-10-4" fill="none" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M18 13c3-6 8-7 10-4" fill="none" stroke="#2DD4BF" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M18 13v-7" fill="none" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Mask body -->
  <path d="M6 17c0-3 5-5 12-3 7-2 12 0 12 3 0 5-5 8-9 6-2-1-4-1-6 0-4 2-9-1-9-6z" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1"/>
  <!-- Eye cutouts -->
  <ellipse cx="12.5" cy="17.5" rx="2.8" ry="1.8" fill="#1E1B4B"/>
  <ellipse cx="23.5" cy="17.5" rx="2.8" ry="1.8" fill="#1E1B4B"/>
  <!-- Gem -->
  <polygon points="18,13 19.5,15.5 18,18 16.5,15.5" fill="#EC4899"/>
</svg>`;

// 18. Povorka (Festive Korzo carnival parade banners & confetti)
const povorkaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#1E293B"/>
  <!-- Street / Korzo -->
  <rect x="2" y="26" width="32" height="8" fill="#475569"/>
  <!-- Colorful parade flags -->
  <polygon points="6,11 14,14 6,17" fill="#EF4444"/>
  <line x1="6" y1="10" x2="6" y2="26" stroke="#E2E8F0" stroke-width="1.5"/>
  <polygon points="16,9 24,12 16,15" fill="#FACC15"/>
  <line x1="16" y1="8" x2="16" y2="26" stroke="#E2E8F0" stroke-width="1.5"/>
  <polygon points="26,11 33,14 26,17" fill="#14B8A6"/>
  <line x1="26" y1="10" x2="26" y2="26" stroke="#E2E8F0" stroke-width="1.5"/>
  <!-- Confetti -->
  <circle cx="11" cy="7" r="1.2" fill="#EC4899"/>
  <circle cx="22" cy="6" r="1.2" fill="#38BDF8"/>
  <circle cx="29" cy="8" r="1.2" fill="#A855F7"/>
  <circle cx="12" cy="21" r="1.2" fill="#FACC15"/>
  <circle cx="22" cy="22" r="1.2" fill="#4ADE80"/>
</svg>`;

// 19. Zvono (Traditional Halubajski Zvončari brass bell)
const zvonoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#7C2D12" stroke="#FBBF24" stroke-width="1.5"/>
  <!-- Top loop -->
  <circle cx="18" cy="8" r="2.2" fill="none" stroke="#FDE047" stroke-width="2"/>
  <!-- Bell body -->
  <path d="M12 15c0-4 2.5-6 6-6s6 2 6 6l3 9H9l3-9z" fill="#F59E0B" stroke="#FEF08A" stroke-width="1"/>
  <!-- Rim -->
  <rect x="8" y="24" width="20" height="2.5" rx="1" fill="#D97706"/>
  <!-- Clapper -->
  <circle cx="18" cy="28" r="2.2" fill="#FDE047"/>
  <!-- Sound waves -->
  <path d="M6 16c-1 2-1 4 0 6" fill="none" stroke="#FEF08A" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M30 16c1 2 1 4 0 6" fill="none" stroke="#FEF08A" stroke-width="1.3" stroke-linecap="round"/>
</svg>`;

// 20. Bubanj (Carnival parade drum with drumsticks)
const bubanjSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
  <!-- Drumsticks -->
  <line x1="8" y1="8" x2="18" y2="15" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="18" cy="15" r="1.5" fill="#FFFFFF"/>
  <line x1="28" y1="8" x2="18" y2="15" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
  <!-- Drum cylinder -->
  <rect x="8" y="16" width="20" height="11" rx="2" fill="#DC2626"/>
  <!-- Top drumhead -->
  <ellipse cx="18" cy="16" rx="10" ry="3" fill="#FEF3C7" stroke="#B45309" stroke-width="1.2"/>
  <!-- Zigzag tension cords -->
  <polyline points="9,18 12,26 15,18 18,26 21,18 24,26 27,18" fill="none" stroke="#FACC15" stroke-width="1.3"/>
</svg>`;

const svgFiles = [
  // Unit 46
  { name: "luka.svg", content: lukaSvg },
  { name: "brod.svg", content: brodSvg },
  { name: "sidro.svg", content: sidroSvg },
  { name: "svjetionik.svg", content: svjetionikSvg },

  // Unit 47
  { name: "gradina.svg", content: gradinaSvg },
  { name: "stube.svg", content: stubeSvg },
  { name: "vidikovac.svg", content: vidikovacSvg },
  { name: "zmaj.svg", content: zmajSvg },

  // Unit 48
  { name: "setnica.svg", content: setnicaSvg },
  { name: "kamelija.svg", content: kamelijaSvg },
  { name: "vila.svg", content: vilaSvg },
  { name: "fontana.svg", content: fontanaSvg },

  // Unit 49
  { name: "ploca.svg", content: plocaSvg },
  { name: "slovo.svg", content: slovoSvg },
  { name: "maslina.svg", content: maslinaSvg },
  { name: "ovca.svg", content: ovcaSvg },

  // Unit 50
  { name: "maska.svg", content: maskaSvg },
  { name: "povorka.svg", content: povorkaSvg },
  { name: "zvono.svg", content: zvonoSvg },
  { name: "bubanj.svg", content: bubanjSvg },
];

export function generateAllWorld10Svgs() {
  console.log(`Writing ${svgFiles.length} SVG files to ${publicDir}...`);
  for (const item of svgFiles) {
    const targetPath = path.join(publicDir, item.name);
    fs.writeFileSync(targetPath, item.content.trim(), "utf8");
    console.log(`  ✓ Created: ${item.name}`);
  }
  console.log("All World 10 SVGs generated successfully!");
}

if (require.main === module) {
  generateAllWorld10Svgs();
}
