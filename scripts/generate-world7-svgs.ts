import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// 1. Dvorac (Trakošćan inspired castle: white walls, red cone roofs, green hill)
const dvoracSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Green hill base -->
  <path fill="#5C913B" d="M0 32c4-3 12-4 18-4s14 1 18 4v4H0v-4z"/>
  <!-- Central main keep -->
  <path fill="#E1E8ED" d="M12 14h12v15H12z"/>
  <path fill="#CCD6DD" d="M12 14h2v15h-2zm10 0h2v15h-2z"/>
  <!-- Central roof cone -->
  <path fill="#DD2E44" d="M18 4l-7 10h14L18 4z"/>
  <!-- Left turret -->
  <path fill="#CCD6DD" d="M5 18h6v12H5z"/>
  <path fill="#DD2E44" d="M8 10l-4 8h8l-4-8z"/>
  <!-- Right turret -->
  <path fill="#CCD6DD" d="M25 18h6v12h-6z"/>
  <path fill="#DD2E44" d="M28 10l-4 8h8l-4-8z"/>
  <!-- Arched Gate -->
  <path fill="#66757F" d="M15 23a3 3 0 0 1 6 0v6h-6v-6z"/>
  <path fill="#292F33" d="M16 24a2 2 0 0 1 4 0v5h-4v-5z"/>
  <!-- Windows -->
  <rect fill="#292F33" x="16.5" y="16" width="3" height="4" rx="1.5"/>
  <rect fill="#292F33" x="7" y="21" width="2" height="3" rx="1"/>
  <rect fill="#292F33" x="27" y="21" width="2" height="3" rx="1"/>
  <!-- Gold pennant flags -->
  <path fill="#FFCC4D" d="M18 4V1l4 1.5L18 4zM8 10V7l3 1.5L8 10zM28 10V7l3 1.5L28 10z"/>
</svg>`;

// 2. Kula (Medieval stone tower with battlements)
const kulaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Tower Body -->
  <path fill="#99AAB5" d="M10 10l2 24h12l2-24H10z"/>
  <path fill="#66757F" d="M10 10h16v3H10z"/>
  <!-- Battlements / Crenellations -->
  <path fill="#99AAB5" d="M8 5h4v6H8zm6 0h4v6h-4zm6 0h4v6h-4zm6 0h4v6h-4z"/>
  <path fill="#CCD6DD" d="M7 10h22v2H7z"/>
  <!-- Arrow slit windows -->
  <rect fill="#292F33" x="17" y="14" width="2" height="5" rx="1"/>
  <rect fill="#292F33" x="17" y="22" width="2" height="5" rx="1"/>
  <!-- Heavy wooden arched entrance -->
  <path fill="#78350F" d="M15 28a3 3 0 0 1 6 0v6h-6v-6z"/>
  <circle fill="#FFCC4D" cx="19.5" cy="31" r="0.5"/>
  <!-- Stone texture lines -->
  <path stroke="#8899A6" stroke-width="0.5" d="M12 18h12M11 25h14M13 31h2M21 31h3"/>
</svg>`;

// 3. Ključ (Ornate medieval golden skeleton key)
const kljucSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Key Bow / Handle (trefoil / ornate heart) -->
  <circle fill="#F59E0B" cx="11" cy="11" r="7"/>
  <circle fill="#FDE68A" cx="11" cy="11" r="5"/>
  <circle fill="#FFFBEB" cx="11" cy="11" r="2.5"/>
  <!-- Key Shaft -->
  <path fill="#D97706" d="M15 9l16 16-2 2-16-16 2-2z"/>
  <path fill="#F59E0B" d="M16 10l15 15-1.5 1.5L14.5 11.5 16 10z"/>
  <!-- Key Bit / Teeth -->
  <path fill="#F59E0B" d="M26 24l4-4 2 2-4 4-2-2zM29 27l3-3 2 2-3 3-2-2z"/>
  <path fill="#D97706" d="M28 26l2-2 1 1-2 2-1-1z"/>
</svg>`;

// 4. Vitez (Knight in polished armor with red crest plume)
const vitezSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Plume feather on helm -->
  <path fill="#DC2626" d="M16 2c4 0 8 3 8 8 0 3-2 5-4 6l-2-4-2 4c-2-1-4-3-4-6 0-5 4-8 4-8z"/>
  <!-- Helmet -->
  <path fill="#94A3B8" d="M10 13c0-4 3-7 8-7s8 3 8 7v10c0 5-4 8-8 8s-8-3-8-8V13z"/>
  <!-- Visor -->
  <path fill="#CBD5E1" d="M12 15h12v5H12z"/>
  <!-- Visor Slit -->
  <path fill="#0F172A" d="M14 17h8v1.5h-8z"/>
  <!-- Breathing holes -->
  <circle fill="#475569" cx="15" cy="22" r="0.75"/>
  <circle fill="#475569" cx="18" cy="22" r="0.75"/>
  <circle fill="#475569" cx="21" cy="22" r="0.75"/>
  <!-- Gorget / neck guard -->
  <path fill="#E2E8F0" d="M8 27c0 4 4 7 10 7s10-3 10-7H8z"/>
</svg>`;

// 5. Štit (Heraldic shield with Croatian red and white chequy)
const stitSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Shield Outer Rim (Gold & Steel) -->
  <path fill="#94A3B8" d="M18 2C8 2 5 6 5 16c0 10 9 16 13 18 4-2 13-8 13-18 0-10-3-14-13-14z"/>
  <path fill="#F59E0B" d="M18 3.5C9.5 3.5 7 7 7 16c0 8.5 8 14 11 15.5 3-1.5 11-7 11-15.5 0-9-2.5-12.5-11-12.5z"/>
  <!-- Shield Inner Field (White background for chequy) -->
  <path fill="#FFFFFF" d="M18 5C11 5 9 8 9 16c0 7 6.5 12 9 13.5 2.5-1.5 9-6.5 9-13.5 0-8-2-11-9-11z"/>
  <!-- Croatian Checkers (Red squares clip / pattern) -->
  <!-- Top row: Red, White, Red -->
  <rect fill="#DC2626" x="11" y="7" width="4" height="4"/>
  <rect fill="#DC2626" x="19" y="7" width="4" height="4"/>
  <!-- Row 2: White, Red, White -->
  <rect fill="#DC2626" x="15" y="11" width="4" height="4"/>
  <rect fill="#DC2626" x="23" y="11" width="2" height="4"/>
  <rect fill="#DC2626" x="9.5" y="11" width="2" height="4"/>
  <!-- Row 3: Red, White, Red -->
  <rect fill="#DC2626" x="11" y="15" width="4" height="4"/>
  <rect fill="#DC2626" x="19" y="15" width="4" height="4"/>
  <!-- Row 4: White, Red, White -->
  <rect fill="#DC2626" x="15" y="19" width="4" height="4"/>
  <!-- Row 5: Red bottom tip -->
  <path fill="#DC2626" d="M16 23h4v2l-2 2-2-2z"/>
</svg>`;

// 6. Mač (Gleaming knight's sword with silver blade & golden crossguard)
const macSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Blade Pointing up-right -->
  <path fill="#E2E8F0" d="M29 3l-1.5 4.5L14 21l-3-3L24.5 4.5 29 3z"/>
  <path fill="#CBD5E1" d="M29 3l-4.5 1.5L11 18l1.5 1.5L26 6 29 3z"/>
  <!-- Central fuller line -->
  <line x1="28" y1="4" x2="13" y2="19" stroke="#94A3B8" stroke-width="0.75"/>
  <!-- Crossguard -->
  <path fill="#F59E0B" d="M8 17l6-6 3 3-6 6z"/>
  <circle fill="#D97706" cx="8.5" cy="19.5" r="1.5"/>
  <circle fill="#D97706" cx="16.5" cy="11.5" r="1.5"/>
  <!-- Grip / Hilt -->
  <path fill="#78350F" d="M10 21l-4 4 2 2 4-4z"/>
  <!-- Pommel -->
  <circle fill="#F59E0B" cx="6" cy="27" r="2.5"/>
  <circle fill="#DC2626" cx="6" cy="27" r="1"/>
</svg>`;

// 7. Zastava (Croatian tricolor flag waving on flagpole)
const zastavaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Flagpole -->
  <path fill="#64748B" d="M4 2h2v32H4z"/>
  <circle fill="#F59E0B" cx="5" cy="2" r="2"/>
  <!-- Flag Stripes (Red, White, Blue waving) -->
  <!-- Top Red Stripe -->
  <path fill="#DC2626" d="M6 4c6-2 12 2 18 0s8-2 8-2v6c0 0-3 1-8 2s-12-2-18 0V4z"/>
  <!-- Middle White Stripe -->
  <path fill="#FFFFFF" d="M6 10c6-2 12 2 18 0s8-2 8-2v6c0 0-3 1-8 2s-12-2-18 0v-6z"/>
  <!-- Bottom Blue Stripe -->
  <path fill="#2563EB" d="M6 16c6-2 12 2 18 0s8-2 8-2v6c0 0-3 1-8 2s-12-2-18 0v-6z"/>
  <!-- Mini Shield in Center -->
  <path fill="#FFFFFF" d="M16 8h4v6a2 2 0 0 1-4 0V8z"/>
  <rect fill="#DC2626" x="16" y="8" width="2" height="2"/>
  <rect fill="#DC2626" x="18" y="10" width="2" height="2"/>
  <rect fill="#DC2626" x="16" y="12" width="2" height="1.5"/>
</svg>`;

// 8. Igračka (UNESCO Hrvatsko Zagorje traditional painted wooden toy - bird/flute)
const igrackaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Wooden base bird body -->
  <path fill="#DC2626" d="M5 22c0-8 6-14 14-14 4 0 9 3 13 8l-2 2c-3-2-6-3-9-3-6 0-10 4-11 9H5z"/>
  <path fill="#EF4444" d="M10 24c0-5 5-9 11-9 5 0 8 2 11 6l2 2H10z"/>
  <!-- Head & Beak -->
  <circle fill="#DC2626" cx="28" cy="14" r="5"/>
  <polygon fill="#F59E0B" points="33,14 36,16 33,18"/>
  <circle fill="#000000" cx="29" cy="13" r="1"/>
  <!-- Traditional Folk Yellow & Floral Paint Stripes -->
  <path fill="#FDE047" d="M14 17c2 2 5 2 7 0v2c-2 2-5 2-7 0v-2z"/>
  <path fill="#16A34A" d="M11 20c2 2 5 2 7 0v1.5c-2 2-5 2-7 0V20z"/>
  <circle fill="#FFFFFF" cx="17" cy="16" r="1"/>
  <circle fill="#FDE047" cx="21" cy="18" r="1"/>
  <!-- Toy Wheels / Axle -->
  <circle fill="#78350F" cx="12" cy="28" r="4"/>
  <circle fill="#F59E0B" cx="12" cy="28" r="2"/>
  <circle fill="#78350F" cx="26" cy="28" r="4"/>
  <circle fill="#F59E0B" cx="26" cy="28" r="2"/>
</svg>`;

// 9. Konjić (UNESCO Zagorje painted wooden rocking horse)
const konjicSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Rocker curved bottom rails -->
  <path fill="#78350F" d="M4 28c8 4 20 4 28 0v2c-8 4-20 4-28 0v-2z"/>
  <!-- Horse Body (Traditional Red Wood) -->
  <path fill="#DC2626" d="M10 18h12l3 5h-4l-2-3h-4l-2 3H9l1-5z"/>
  <!-- Neck and Head -->
  <path fill="#DC2626" d="M19 18l3-10 5 3-2 3 3 1-2 3-7 0z"/>
  <!-- Ears and Mane (Traditional Zagorje black / floral decor) -->
  <polygon fill="#1E293B" points="23,7 24,4 26,8"/>
  <path fill="#1E293B" d="M21 9c-1 2-2 5-2 8h2c0-3 1-6 2-8h-2z"/>
  <!-- Eye -->
  <circle fill="#FFFFFF" cx="25" cy="10" r="1"/>
  <circle fill="#000000" cx="25.3" cy="10" r="0.5"/>
  <!-- Traditional Folk Painted Flowers / Yellow Saddle -->
  <rect fill="#FACC15" x="14" y="17" width="5" height="3" rx="1"/>
  <circle fill="#16A34A" cx="16.5" cy="18.5" r="0.8"/>
  <circle fill="#FFFFFF" cx="12" cy="19" r="0.8"/>
  <!-- Legs / Posts into Rocker -->
  <rect fill="#B91C1C" x="10" y="22" width="2.5" height="6"/>
  <rect fill="#B91C1C" x="21" y="22" width="2.5" height="6"/>
</svg>`;

// 10. Kruna (Golden royal crown with rubies and emeralds)
const krunaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Crown Base Band -->
  <path fill="#D97706" d="M5 24h26v5H5z"/>
  <path fill="#F59E0B" d="M6 25h24v3H6z"/>
  <!-- Crown Spikes / Peaks -->
  <path fill="#F59E0B" d="M5 24l3-14 5 7 5-11 5 11 5-7 3 14H5z"/>
  <path fill="#FDE68A" d="M18 6l4 8-4-2-4 2 4-8z"/>
  <!-- Jewels on Points -->
  <circle fill="#FFFFFF" cx="8" cy="10" r="1.8"/>
  <circle fill="#DC2626" cx="8" cy="10" r="1.2"/>
  <circle fill="#FFFFFF" cx="18" cy="6" r="2.2"/>
  <circle fill="#2563EB" cx="18" cy="6" r="1.5"/>
  <circle fill="#FFFFFF" cx="28" cy="10" r="1.8"/>
  <circle fill="#DC2626" cx="28" cy="10" r="1.2"/>
  <!-- Jewels on Headband -->
  <circle fill="#16A34A" cx="11" cy="26.5" r="1.2"/>
  <circle fill="#DC2626" cx="18" cy="26.5" r="1.5"/>
  <circle fill="#16A34A" cx="25" cy="26.5" r="1.2"/>
</svg>`;

// 11. Gozba (Medieval festive banquet feast table)
const gozbaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Table cloth & legs -->
  <path fill="#78350F" d="M6 22l-2 10h3l1.5-10zm24 0l2 10h-3l-1.5-10z"/>
  <path fill="#DC2626" d="M3 20h30v4c-2 2-6 0-9 2s-7-2-11 0c-3-2-7 0-10-2v-4z"/>
  <rect fill="#F59E0B" x="2" y="19" width="32" height="2" rx="1"/>
  <!-- Large Roast on Platter -->
  <ellipse fill="#E2E8F0" cx="18" cy="18" rx="7" ry="2"/>
  <ellipse fill="#B45309" cx="18" cy="16.5" rx="5" ry="2.5"/>
  <path fill="#92400E" d="M14 15.5c1-1 7-1 8 0v1.5c-1 1-7 1-8 0v-1.5z"/>
  <!-- Golden Goblet / Chalice -->
  <path fill="#F59E0B" d="M7 13h4v3a2 2 0 0 1-4 0v-3z"/>
  <rect fill="#D97706" x="8.5" y="16" width="1" height="3"/>
  <rect fill="#F59E0B" x="7.5" y="19" width="3" height="1"/>
  <!-- Fresh Round Bread Loaf -->
  <circle fill="#D97706" cx="27" cy="16" r="3"/>
  <circle fill="#FDE68A" cx="27" cy="15.5" r="2"/>
  <line x1="26" y1="14.5" x2="28" y2="16.5" stroke="#92400E" stroke-width="0.5"/>
</svg>`;

// 12. Lijevo (Castle direction: Left navigation arrow with Croatian chequy accent)
const lijevoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Background navigation disk -->
  <circle cx="18" cy="18" r="16" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
  <!-- Leftward Arrow -->
  <path fill="#2563EB" d="M16 11l-8 7 8 7v-4h11v-6H16z"/>
  <path fill="#1D4ED8" d="M8 18l8 7v-4h-4z"/>
  <!-- Croatian checker tip on arrow tail -->
  <rect x="23" y="15" width="2" height="3" fill="#DC2626"/>
  <rect x="25" y="15" width="2" height="3" fill="#FFFFFF"/>
  <rect x="23" y="18" width="2" height="3" fill="#FFFFFF"/>
  <rect x="25" y="18" width="2" height="3" fill="#DC2626"/>
</svg>`;

// 13. Desno (Castle direction: Right navigation arrow with Croatian chequy accent)
const desnoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Background navigation disk -->
  <circle cx="18" cy="18" r="16" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
  <!-- Rightward Arrow -->
  <path fill="#2563EB" d="M20 11l8 7-8 7v-4H9v-6h11z"/>
  <path fill="#1D4ED8" d="M28 18l-8 7v-4h4z"/>
  <!-- Croatian checker tip on arrow tail -->
  <rect x="9" y="15" width="2" height="3" fill="#DC2626"/>
  <rect x="11" y="15" width="2" height="3" fill="#FFFFFF"/>
  <rect x="9" y="18" width="2" height="3" fill="#FFFFFF"/>
  <rect x="11" y="18" width="2" height="3" fill="#DC2626"/>
</svg>`;

// 14. Ravno (Castle direction: Straight ahead corridor & arrow)
const ravnoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Background navigation disk -->
  <circle cx="18" cy="18" r="16" fill="#F0FDF4" stroke="#10B981" stroke-width="2"/>
  <!-- Forward straight path / corridor perspective -->
  <polygon points="12,30 24,30 20,16 16,16" fill="#CBD5E1"/>
  <line x1="18" y1="30" x2="18" y2="18" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2,2"/>
  <!-- Upward straight arrow -->
  <path fill="#059669" d="M18 6l7 8h-4v9h-6v-9h-4z"/>
  <path fill="#047857" d="M18 6l7 8h-4z"/>
</svg>`;

// 15. Gore (Castle direction: Upward stairs & ascending arrow)
const goreSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Background navigation disk -->
  <circle cx="18" cy="18" r="16" fill="#FAF5FF" stroke="#A855F7" stroke-width="2"/>
  <!-- Castle stone steps ascending upward -->
  <rect x="6" y="26" width="6" height="5" fill="#94A3B8"/>
  <rect x="12" y="21" width="6" height="10" fill="#64748B"/>
  <rect x="18" y="16" width="6" height="15" fill="#475569"/>
  <!-- Upward arrow -->
  <path fill="#9333EA" d="M26 6l5 6h-3v7h-4v-7h-3z"/>
  <circle cx="18" cy="10" r="1.5" fill="#F59E0B"/>
</svg>`;

const assets = [
  { name: "dvorac", alt: "castle", content: dvoracSvg },
  { name: "kula", alt: "tower", content: kulaSvg },
  { name: "kljuc", alt: "key", content: kljucSvg },
  { name: "vitez", alt: "knight", content: vitezSvg },
  { name: "stit", alt: "shield", content: stitSvg },
  { name: "mac", alt: "sword", content: macSvg },
  { name: "zastava", alt: "flag", content: zastavaSvg },
  { name: "igracka", alt: "toy", content: igrackaSvg },
  { name: "konjic", alt: "rocking_horse", content: konjicSvg },
  { name: "kruna", alt: "crown", content: krunaSvg },
  { name: "gozba", alt: "feast", content: gozbaSvg },
  { name: "lijevo", alt: "left", content: lijevoSvg },
  { name: "desno", alt: "right", content: desnoSvg },
  { name: "ravno", alt: "straight", content: ravnoSvg },
  { name: "gore", alt: "up", content: goreSvg },
];

for (const asset of assets) {
  const p1 = path.join(publicDir, `${asset.name}.svg`);
  const p2 = path.join(publicDir, `${asset.alt}.svg`);
  fs.writeFileSync(p1, asset.content, "utf-8");
  fs.writeFileSync(p2, asset.content, "utf-8");
  console.log(`Generated ${asset.name}.svg and ${asset.alt}.svg`);
}

console.log("All World 7 SVGs created successfully!");
