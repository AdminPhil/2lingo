import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// ==========================================
// UNIT 41: Sinjski vitezovi i konji
// ==========================================

// 1. Konj (Noble Dalmation tournament horse with braided mane)
const konjSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Circular tournament shield backdrop -->
  <circle cx="18" cy="18" r="16" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
  <!-- Horse neck and head -->
  <path fill="#92400E" d="M12 28c1-4 3-8 5-11 2-3 4-8 4-12 0 0 3 1 4 4s-1 6-1 8c3-1 6 1 7 4s-2 6-5 7c-2 4-5 7-9 8z"/>
  <!-- Muzzle -->
  <path fill="#78350F" d="M25 18c1 1 2 3 2 4s-1 3-3 3-3-1-3-3 2-4 4-4z"/>
  <!-- Forehead white blaze (lisina) -->
  <path fill="#FEF3C7" d="M20 13c1 2 1 4 0 6s-1-2 0-6z"/>
  <!-- Eye -->
  <circle cx="21" cy="15" r="1.5" fill="#1C1917"/>
  <circle cx="21.3" cy="14.7" r="0.5" fill="#FFFFFF"/>
  <!-- Noble golden bridle / uzda -->
  <path fill="none" stroke="#FBBF24" stroke-width="1.2" stroke-linecap="round" d="M18 13l6 9m-4-6l4-2"/>
  <circle cx="20" cy="16" r="1.2" fill="#D97706"/>
  <!-- Ears -->
  <path fill="#B45309" d="M18 6l2-3 2 3z"/>
  <path fill="#78350F" d="M19 6l1-2 1 2z"/>
</svg>`;

// 2. Sedlo (Traditional knightly leather saddle with brass stirrups)
const sedloSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E293B" stroke="#B45309" stroke-width="1.5"/>
  <!-- Saddle seat curves -->
  <path fill="#78350F" d="M8 17c2-5 7-7 10-5s8 0 10 5c1 3-2 6-5 6h-10c-3 0-6-3-5-6z"/>
  <!-- Pommel & Cantle highlights -->
  <path fill="#B45309" d="M8 17c1-3 4-5 6-4s-1 4-3 5-3 0-3-1zm14 1c2-1 4-2 6 0s0 3-2 3h-4z"/>
  <!-- Padded saddle blanket / podsedlica (embroidered red & gold) -->
  <path fill="#DC2626" d="M9 22h18v4c0 1-1 2-2 2H11c-1 0-2-1-2-2v-4z"/>
  <line x1="9" y1="26" x2="27" y2="26" stroke="#FBBF24" stroke-width="1"/>
  <!-- Stirrup leather and iron / stremen -->
  <line x1="18" y1="23" x2="18" y2="30" stroke="#475569" stroke-width="1.2"/>
  <path fill="none" stroke="#E2E8F0" stroke-width="1.5" d="M16 30h4v2a2 2 0 0 1-4 0v-2z"/>
</svg>`;

// 3. Staza (Sinj sandy tournament track with wooden railings & spectators)
const stazaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Summer sky -->
  <rect x="2" y="2" width="32" height="14" rx="4" fill="#38BDF8"/>
  <circle cx="28" cy="7" r="3" fill="#FDE047"/>
  <!-- Track surface (golden sand of Sinj) -->
  <path fill="#D97706" d="M2 16h32v18H2z"/>
  <!-- Perspective running track lines -->
  <polygon points="12,16 24,16 30,34 6,34" fill="#F59E0B"/>
  <line x1="18" y1="16" x2="18" y2="34" stroke="#FEF3C7" stroke-dasharray="2,2" stroke-width="1"/>
  <!-- Wooden barrier fence / ograda trkališta -->
  <line x1="6" y1="20" x2="6" y2="34" stroke="#78350F" stroke-width="1.5"/>
  <line x1="30" y1="20" x2="30" y2="34" stroke="#78350F" stroke-width="1.5"/>
  <line x1="2" y1="24" x2="34" y2="24" stroke="#92400E" stroke-width="1.2"/>
  <line x1="2" y1="28" x2="34" y2="28" stroke="#92400E" stroke-width="1.2"/>
</svg>`;

// 4. Jahač (Sinjski alkar rider in traditional uniform & feather cap)
const jahacSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#881337" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Fur hat (kalpak) with white feather plume -->
  <rect x="13" y="6" width="10" height="7" rx="2" fill="#1C1917"/>
  <path fill="#FFFFFF" d="M14 6c0-3 2-4 3-5 0 2 0 4-1 5z"/>
  <!-- Face -->
  <circle cx="18" cy="16" r="4" fill="#FCD34D"/>
  <!-- Alkar black moustache (brkovi) -->
  <path fill="#1C1917" d="M16 17c1-1 2 0 2 0s1-1 2 0c0 1-1 1-2 1s-2 0-2-1z"/>
  <!-- Dark eyes -->
  <circle cx="16.5" cy="15" r="0.7" fill="#1C1917"/>
  <circle cx="19.5" cy="15" r="0.7" fill="#1C1917"/>
  <!-- Traditional red velvet jacket (čoja) with gold embroidery -->
  <path fill="#991B1B" d="M12 21c2-1 4-1 6-1s4 0 6 1l2 11H10z"/>
  <path fill="none" stroke="#FBBF24" stroke-width="1.2" d="M15 21v11m6-11v11M13 25h10M13 28h10"/>
</svg>`;

// ==========================================
// UNIT 42: Alka i koplje
// ==========================================

// 5. Alka (The authentic iron tournament ring: two concentric circles with three compartments)
const alkaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Suspended rope from above -->
  <line x1="18" y1="0" x2="18" y2="7" stroke="#78350F" stroke-width="2"/>
  <!-- Iron hanging clip -->
  <rect x="16.5" y="6" width="3" height="3" rx="1" fill="#475569"/>
  <!-- Outer iron ring -->
  <circle cx="18" cy="21" r="13" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="18" cy="21" r="11" fill="#334155"/>
  <!-- Three dividing iron spokes (connecting outer to inner ring) -->
  <!-- Upper division (vertical) -->
  <line x1="18" y1="10" x2="18" y2="16" stroke="#94A3B8" stroke-width="1.8"/>
  <!-- Lower left division (120 deg) -->
  <line x1="14" y1="23" x2="8.5" y2="27" stroke="#94A3B8" stroke-width="1.8"/>
  <!-- Lower right division (120 deg) -->
  <line x1="22" y1="23" x2="27.5" y2="27" stroke="#94A3B8" stroke-width="1.8"/>
  <!-- Center circle (srida - worth 3 points!) highlighted in gold -->
  <circle cx="18" cy="21" r="5" fill="#0F172A" stroke="#F59E0B" stroke-width="2"/>
  <circle cx="18" cy="21" r="2.5" fill="#FEF08A"/>
</svg>`;

// 6. Koplje (Alkar knight's long tournament lance with steel point)
const kopljeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Ash wood lance shaft running diagonally -->
  <line x1="5" y1="31" x2="26" y2="10" stroke="#92400E" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Leather grip wrapped with gold cord -->
  <line x1="9" y1="27" x2="14" y2="22" stroke="#DC2626" stroke-width="3"/>
  <line x1="10" y1="26" x2="11" y2="25" stroke="#FBBF24" stroke-width="1"/>
  <line x1="12" y1="24" x2="13" y2="23" stroke="#FBBF24" stroke-width="1"/>
  <!-- Hand guard collar (štitnik) -->
  <circle cx="15" cy="21" r="2.5" fill="#D97706"/>
  <!-- Steel pointed arrowhead tip (oštri željezni šiljak) -->
  <polygon points="26,10 32,4 30,12" fill="#E2E8F0"/>
  <polygon points="26,10 32,4 28,6" fill="#94A3B8"/>
</svg>`;

// 7. Meta (Tournament target ring / aim marker with scoring zones)
const metaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Outer scoring ring (1 point zone) -->
  <circle cx="18" cy="18" r="16" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
  <!-- Middle scoring ring (2 points zone) -->
  <circle cx="18" cy="18" r="11" fill="#FFFFFF"/>
  <circle cx="18" cy="18" r="7" fill="#3B82F6"/>
  <!-- Bullseye center (srida - 3 points) -->
  <circle cx="18" cy="18" r="3.5" fill="#FACC15" stroke="#CA8A04" stroke-width="1"/>
  <!-- Crosshair alignment sights -->
  <line x1="18" y1="3" x2="18" y2="33" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="3" y1="18" x2="33" y2="18" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2"/>
</svg>`;

// 8. Pogodak (Lance striking into the center ring: bullseye spark!)
const pogodakSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Impact shockwave rings -->
  <circle cx="18" cy="18" r="11" fill="none" stroke="#FDE047" stroke-width="1.2" opacity="0.6"/>
  <circle cx="18" cy="18" r="7" fill="none" stroke="#FACC15" stroke-width="1.5" opacity="0.8"/>
  <!-- Alka ring in center -->
  <circle cx="18" cy="18" r="4.5" fill="#334155" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Lance tip hitting center hole -->
  <polygon points="18,18 7,29 11,31" fill="#CBD5E1"/>
  <!-- Explosive hit spark stars (srida!) -->
  <path fill="#F59E0B" d="M18 10l1.5 5.5L25 17l-5.5 1.5L18 24l-1.5-5.5L11 17l5.5-1.5z"/>
  <circle cx="18" cy="18" r="2.5" fill="#FFFFFF"/>
</svg>`;

// ==========================================
// UNIT 43: Kanjon rijeke Cetine
// ==========================================

// 9. Kanjon (Dramatic limestone gorge with turquoise Cetina river)
const kanjonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Azure blue sky above canyon walls -->
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#67E8F9"/>
  <!-- Distant sunlit gorge exit -->
  <polygon points="15,6 21,6 23,16 13,16" fill="#FDE68A"/>
  <!-- Left canyon limestone wall -->
  <polygon points="2,2 14,2 11,20 15,34 2,34" fill="#78716C"/>
  <polygon points="5,5 12,3 9,18 13,32 5,32" fill="#A8A29E"/>
  <!-- Right canyon limestone wall -->
  <polygon points="34,2 22,2 25,20 21,34 34,34" fill="#57534E"/>
  <polygon points="31,5 24,3 27,18 23,32 31,32" fill="#78716C"/>
  <!-- Emerald Cetina river flowing through bottom -->
  <polygon points="14,16 22,16 24,34 12,34" fill="#0D9488"/>
  <path d="M14 24c3-1 5 1 8 0" stroke="#5EEAD4" stroke-width="1.2" fill="none"/>
  <path d="M13 30c4-1 6 1 10 0" stroke="#5EEAD4" stroke-width="1.5" fill="none"/>
</svg>`;

// 10. Slap (Cascading emerald waterfall tumbling over rocks)
const slapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Dark canyon stone background -->
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#44403C"/>
  <!-- Green moss ledge -->
  <rect x="6" y="6" width="24" height="4" rx="2" fill="#15803D"/>
  <!-- Tumbling waterfall streams -->
  <rect x="10" y="8" width="16" height="20" fill="#06B6D4" opacity="0.8"/>
  <rect x="13" y="8" width="10" height="20" fill="#67E8F9" opacity="0.9"/>
  <!-- White foaming water torrents -->
  <line x1="12" y1="9" x2="12" y2="26" stroke="#FFFFFF" stroke-width="1.5"/>
  <line x1="16" y1="8" x2="16" y2="27" stroke="#FFFFFF" stroke-width="1.5"/>
  <line x1="20" y1="9" x2="20" y2="26" stroke="#FFFFFF" stroke-width="1.5"/>
  <line x1="23" y1="10" x2="23" y2="25" stroke="#FFFFFF" stroke-width="1"/>
  <!-- River pool splash at bottom -->
  <ellipse cx="18" cy="29" rx="14" ry="4" fill="#0891B2"/>
  <ellipse cx="18" cy="28" rx="10" ry="2" fill="#E0F2FE"/>
</svg>`;

// 11. Stijena (Sheer karst limestone cliff face against blue sky)
const stijenaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Sky -->
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0284C7"/>
  <!-- Sheer jagged cliff profile -->
  <polygon points="2,34 4,14 10,8 16,16 22,6 28,12 34,4 34,34" fill="#57534E"/>
  <!-- Sunny rock facets -->
  <polygon points="10,8 16,16 14,24 6,20" fill="#A8A29E"/>
  <polygon points="22,6 28,12 25,22 18,18" fill="#D6D3D1"/>
  <polygon points="28,12 34,4 34,18 29,24" fill="#A8A29E"/>
  <!-- Mountain pine trees clinging to rock -->
  <polygon points="10,7 8,11 12,11" fill="#166534"/>
  <polygon points="24,5 22,9 26,9" fill="#166534"/>
</svg>`;

// 12. Čamac / Raft (Whitewater raft with paddle on foaming rapids)
const camacWorld9Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Foaming rapids river -->
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0F766E"/>
  <path d="M2 12c6-2 10 2 16 0s10-2 16 0v22H2z" fill="#0D9488"/>
  <path d="M2 24c6 2 12-2 18 0s10 2 14 0" stroke="#CCFBF1" stroke-width="1.5" fill="none"/>
  <!-- Inflatable rafting boat (bright yellow/orange) -->
  <ellipse cx="18" cy="20" rx="13" ry="6" fill="#EA580C"/>
  <ellipse cx="18" cy="20" rx="10" ry="4" fill="#FACC15"/>
  <ellipse cx="18" cy="20" rx="8" ry="2.5" fill="#C2410C"/>
  <!-- Rafting cross thwart tubes -->
  <rect x="16.5" y="17.5" width="3" height="5" rx="1.5" fill="#EA580C"/>
  <!-- Yellow safety paddle / veslo -->
  <line x1="6" y1="26" x2="22" y2="12" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round"/>
  <polygon points="5,27 3,31 8,29" fill="#FACC15"/>
</svg>`;

// ==========================================
// UNIT 44: Stari mlin i kruh ispod peke
// ==========================================

// 13. Mlin (Historic stone watermill with turning paddle wheel)
const mlinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#0F172A"/>
  <!-- Stone mill building -->
  <rect x="4" y="10" width="16" height="18" fill="#78716C"/>
  <polygon points="3,10 12,3 21,10" fill="#991B1B"/>
  <!-- Mill window & doorway -->
  <rect x="9" y="18" width="4" height="10" fill="#451A03"/>
  <rect x="9" y="12" width="4" height="4" fill="#FEF08A"/>
  <!-- Wooden water wheel (mlinsko kolo) with paddles -->
  <circle cx="26" cy="22" r="8" fill="none" stroke="#78350F" stroke-width="2.5"/>
  <circle cx="26" cy="22" r="2" fill="#B45309"/>
  <line x1="26" y1="14" x2="26" y2="30" stroke="#78350F" stroke-width="2"/>
  <line x1="18" y1="22" x2="34" y2="22" stroke="#78350F" stroke-width="2"/>
  <line x1="20" y1="16" x2="32" y2="28" stroke="#78350F" stroke-width="1.5"/>
  <line x1="20" y1="28" x2="32" y2="16" stroke="#78350F" stroke-width="1.5"/>
  <!-- Splashing water stream -->
  <path d="M18 28c4 1 8-1 14 1" stroke="#38BDF8" stroke-width="2" fill="none"/>
</svg>`;

// 14. Peka (Traditional cast iron baking bell on hot stone hearth with embers)
const pekaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Dark hearth atmosphere -->
  <circle cx="18" cy="18" r="16" fill="#1C1917" stroke="#EA580C" stroke-width="1.5"/>
  <!-- Stone hearth hearth base / ognjište -->
  <ellipse cx="18" cy="27" rx="14" ry="5" fill="#44403C"/>
  <!-- Glowing red-hot embers / žar around bell -->
  <ellipse cx="18" cy="27" rx="12" ry="3.5" fill="#DC2626"/>
  <circle cx="9" cy="27" r="1.5" fill="#FACC15"/>
  <circle cx="13" cy="28" r="1.2" fill="#F97316"/>
  <circle cx="23" cy="28" r="1.5" fill="#FACC15"/>
  <circle cx="27" cy="27" r="1.2" fill="#F97316"/>
  <!-- Cast iron heavy dome / peka čripnja -->
  <path d="M8 26c0-9 4-13 10-13s10 4 10 13z" fill="#292524" stroke="#44403C" stroke-width="1.5"/>
  <!-- Lifting iron loop / ručka na vrhu -->
  <ellipse cx="18" cy="11" rx="2.5" ry="3" fill="none" stroke="#78716C" stroke-width="2"/>
  <!-- Ash and burning coals piled on top rim / obruč za žar -->
  <path d="M11 20c2-2 5-3 7-3s5 1 7 3" stroke="#F97316" stroke-width="2" fill="none"/>
  <circle cx="18" cy="16" r="1" fill="#FEF08A"/>
</svg>`;

// 15. Brašno (Burlap flour sack with freshly milled wheat flour)
const brasnoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#451A03" stroke="#D97706" stroke-width="1.5"/>
  <!-- Burlap sack body / vreća -->
  <path d="M10 18c0-4 3-6 8-6s8 2 8 6l2 12c0 2-3 3-10 3s-10-1-10-3z" fill="#D97706"/>
  <path d="M12 20c0-3 2-4 6-4s6 1 6 4l1 10c0 1-2 2-7 2s-7-1-7-2z" fill="#B45309"/>
  <!-- Sack tied neck / konopac -->
  <ellipse cx="18" cy="13" rx="6" ry="2" fill="#78350F"/>
  <line x1="12" y1="13" x2="24" y2="13" stroke="#FEF3C7" stroke-width="1.5"/>
  <!-- Overflowing pure white flour mound -->
  <ellipse cx="18" cy="12" rx="5" ry="3" fill="#FFFFFF"/>
  <ellipse cx="18" cy="11.5" rx="3.5" ry="1.8" fill="#F8FAFC"/>
  <!-- Wooden flour scoop / drvena lopatica -->
  <rect x="21" y="7" width="3" height="8" rx="1.5" transform="rotate(30 21 7)" fill="#F59E0B"/>
</svg>`;

// 16. Vatra (Warm crackling hearth fire with glowing logs)
const vatraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1C1917" stroke="#EA580C" stroke-width="1.5"/>
  <!-- Wooden logs arranged in campfire cross -->
  <line x1="8" y1="30" x2="28" y2="24" stroke="#78350F" stroke-width="4" stroke-linecap="round"/>
  <line x1="8" y1="24" x2="28" y2="30" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>
  <!-- Outer orange fire flame -->
  <path fill="#EA580C" d="M18 5c3 4 8 8 8 15 0 6-4 10-8 10s-8-4-8-10c0-7 5-11 8-15z"/>
  <!-- Inner yellow flame core -->
  <path fill="#FACC15" d="M18 12c2 3 5 5 5 9 0 4-2 7-5 7s-5-3-5-7c0-4 3-6 5-9z"/>
  <!-- White-hot inner heart -->
  <ellipse cx="18" cy="24" rx="2.5" ry="4" fill="#FFFFFF"/>
</svg>`;

// ==========================================
// UNIT 45: Slavlje slavodobitnika
// ==========================================

// 17. Pobjeda (Golden victor's laurel wreath & trophy celebration)
const pobjedaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#450A0A" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Golden laurel wreath leaves (Lovorov vijenac) -->
  <!-- Left branch -->
  <path fill="#F59E0B" d="M18 30c-7 0-11-5-11-12 0-5 3-10 8-12-1 2-1 5 0 7-3 2-4 5-3 8 1 3 3 5 6 6v3z"/>
  <!-- Right branch -->
  <path fill="#F59E0B" d="M18 30c7 0 11-5 11-12 0-5-3-10-8-12 1 2 1 5 0 7 3 2 4 5 3 8-1 3-3 5-6 6v3z"/>
  <!-- Golden chalice / pehar u sredini -->
  <path fill="#FDE047" d="M14 12h8v5c0 3-2 5-4 5s-4-2-4-5v-5z"/>
  <rect x="16.5" y="22" width="3" height="4" fill="#EAB308"/>
  <rect x="13" y="26" width="10" height="2.5" rx="1" fill="#CA8A04"/>
  <!-- Trophy handles -->
  <path fill="none" stroke="#FDE047" stroke-width="1.5" d="M14 13c-2 0-3 2-3 3.5s1 3.5 3 3.5m8-7c2 0 3 2 3 3.5s-1 3.5-3 3.5"/>
  <!-- Star sparkle -->
  <circle cx="18" cy="16" r="1.5" fill="#FFFFFF"/>
</svg>`;

// 18. Medalja (Shining tournament gold medal with Croatian tricolor ribbon)
const medaljaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.5"/>
  <!-- Croatian tricolor ribbon (Crven-Bijeli-Plavi) -->
  <!-- Left red strip -->
  <polygon points="13,2 17,2 14,14 10,14" fill="#DC2626"/>
  <!-- Center white strip -->
  <polygon points="17,2 19,2 18,14 16,14" fill="#FFFFFF"/>
  <!-- Right blue strip -->
  <polygon points="19,2 23,2 26,14 22,14" fill="#2563EB"/>
  <!-- Golden suspension ring -->
  <circle cx="18" cy="15" r="2.5" fill="none" stroke="#D97706" stroke-width="1.5"/>
  <!-- Heavy circular gold medal -->
  <circle cx="18" cy="24" r="9" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5"/>
  <circle cx="18" cy="24" r="7.5" fill="#FDE047"/>
  <!-- Engraved alka symbol on medal -->
  <circle cx="18" cy="24" r="4.5" fill="none" stroke="#B45309" stroke-width="1.2"/>
  <circle cx="18" cy="24" r="2" fill="#B45309"/>
  <!-- Medal sparkle -->
  <circle cx="15.5" cy="21.5" r="1" fill="#FFFFFF"/>
</svg>`;

// 19. Slavlje (Festive Alka celebration with brass fanfares & confetti)
const slavljeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Festive purple night sky -->
  <rect x="2" y="2" width="32" height="32" rx="4" fill="#581C87"/>
  <!-- Golden brass trumpet / truba -->
  <polygon points="6,26 18,18 20,20 8,28" fill="#F59E0B"/>
  <path d="M18 18l10-8v12l-10-8z" fill="#FACC15"/>
  <ellipse cx="28" cy="16" rx="2" ry="6" fill="#EAB308"/>
  <ellipse cx="28" cy="16" rx="1" ry="4" fill="#CA8A04"/>
  <!-- Confetti streamers & stars -->
  <circle cx="8" cy="8" r="1.5" fill="#F43F5E"/>
  <circle cx="16" cy="6" r="1.5" fill="#38BDF8"/>
  <circle cx="24" cy="6" r="1.2" fill="#4ADE80"/>
  <circle cx="12" cy="14" r="1.2" fill="#FDE047"/>
  <!-- Star sparklers -->
  <path fill="#FEF08A" d="M10 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>
  <path fill="#FEF08A" d="M26 26l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>
</svg>`;

// 20. Ponos (Knightly heraldic crest with Croatian chequy & golden sun)
const ponosSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Deep royal backdrop -->
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Classic heraldic knight shield / grb -->
  <path d="M10 6h16v12c0 8-8 12-8 12s-8-4-8-12V6z" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5"/>
  <!-- Croatian Red-White Chequy squares inside shield -->
  <rect x="12" y="8" width="4" height="4" fill="#DC2626"/>
  <rect x="16" y="8" width="4" height="4" fill="#FFFFFF"/>
  <rect x="20" y="8" width="4" height="4" fill="#DC2626"/>
  <rect x="12" y="12" width="4" height="4" fill="#FFFFFF"/>
  <rect x="16" y="12" width="4" height="4" fill="#DC2626"/>
  <rect x="20" y="12" width="4" height="4" fill="#FFFFFF"/>
  <rect x="12" y="16" width="4" height="4" fill="#DC2626"/>
  <rect x="16" y="16" width="4" height="4" fill="#FFFFFF"/>
  <rect x="20" y="16" width="4" height="4" fill="#DC2626"/>
  <!-- Golden crown crest on top of shield -->
  <path fill="#FACC15" d="M12 6l2-3 4 2 4-2 2 3z"/>
</svg>`;

// Mapping of assets to create (both Croatian slug and English alias)
const svgFiles: { name: string; content: string }[] = [
  // Unit 41
  { name: "konj.svg", content: konjSvg },
  { name: "horse.svg", content: konjSvg },
  { name: "sedlo.svg", content: sedloSvg },
  { name: "saddle.svg", content: sedloSvg },
  { name: "staza.svg", content: stazaSvg },
  { name: "track.svg", content: stazaSvg },
  { name: "jahac.svg", content: jahacSvg },
  { name: "rider.svg", content: jahacSvg },

  // Unit 42
  { name: "alka.svg", content: alkaSvg },
  { name: "ring.svg", content: alkaSvg },
  { name: "koplje.svg", content: kopljeSvg },
  { name: "lance.svg", content: kopljeSvg },
  { name: "meta.svg", content: metaSvg },
  { name: "target.svg", content: metaSvg },
  { name: "pogodak.svg", content: pogodakSvg },
  { name: "hit.svg", content: pogodakSvg },

  // Unit 43
  { name: "kanjon.svg", content: kanjonSvg },
  { name: "canyon.svg", content: kanjonSvg },
  { name: "slap.svg", content: slapSvg },
  { name: "waterfall.svg", content: slapSvg },
  { name: "stijena.svg", content: stijenaSvg },
  { name: "cliff.svg", content: stijenaSvg },
  { name: "camac.svg", content: camacWorld9Svg },
  { name: "raft.svg", content: camacWorld9Svg },

  // Unit 44
  { name: "mlin.svg", content: mlinSvg },
  { name: "mill.svg", content: mlinSvg },
  { name: "peka.svg", content: pekaSvg },
  { name: "hearth.svg", content: pekaSvg },
  { name: "brasno.svg", content: brasnoSvg },
  { name: "flour.svg", content: brasnoSvg },
  { name: "vatra.svg", content: vatraSvg },
  { name: "fire.svg", content: vatraSvg },

  // Unit 45
  { name: "pobjeda.svg", content: pobjedaSvg },
  { name: "victory.svg", content: pobjedaSvg },
  { name: "medalja.svg", content: medaljaSvg },
  { name: "medal.svg", content: medaljaSvg },
  { name: "slavlje.svg", content: slavljeSvg },
  { name: "celebration.svg", content: slavljeSvg },
  { name: "ponos.svg", content: ponosSvg },
  { name: "pride.svg", content: ponosSvg },
];

export function generateAllWorld9Svgs() {
  console.log(`Writing ${svgFiles.length} SVG files to ${publicDir}...`);
  for (const item of svgFiles) {
    const targetPath = path.join(publicDir, item.name);
    fs.writeFileSync(targetPath, item.content.trim(), "utf8");
    console.log(`  ✓ Created: ${item.name}`);
  }
  console.log("All World 9 SVGs generated successfully!");
}

if (require.main === module) {
  generateAllWorld9Svgs();
}
