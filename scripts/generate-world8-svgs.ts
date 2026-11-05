import * as fs from "fs";
import * as path from "path";

const publicDir = path.resolve(__dirname, "../public");

// 1. Svjetlost (Luminescent lantern with radiant light beams)
const svjetlostSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Glowing radiant background disc -->
  <circle cx="18" cy="18" r="16" fill="#0C4A6E" stroke="#0284C7" stroke-width="1.5"/>
  <circle cx="18" cy="18" r="12" fill="#0284C7" opacity="0.4"/>
  <!-- Lantern top cap -->
  <path fill="#F59E0B" d="M14 8h8v3h-8z"/>
  <circle fill="#FDE68A" cx="18" cy="6" r="2"/>
  <!-- Glass chamber -->
  <path fill="#E0F2FE" opacity="0.9" d="M12 11h12l-2 15h-8z"/>
  <!-- Golden inner flame / filament -->
  <path fill="#F59E0B" d="M18 15c-2 2-2 5 0 7s2-5 0-7z"/>
  <circle fill="#FEF08A" cx="18" cy="19" r="2.5"/>
  <circle fill="#FFFFFF" cx="18" cy="19" r="1.2"/>
  <!-- Base -->
  <path fill="#D97706" d="M13 26h10v3H13z"/>
  <!-- Light rays radiating outward -->
  <line x1="18" y1="2" x2="18" y2="4" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="5" y1="18" x2="7" y2="18" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="29" y1="18" x2="31" y2="18" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8" y1="8" x2="10" y2="10" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="28" y1="8" x2="26" y2="10" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

// 2. Iskra (Electric static discharge spark)
const iskraSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#082F49" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Primary 4-point electric blue spark -->
  <path fill="#38BDF8" d="M18 4c0 7-7 14-14 14 7 0 14 7 14 14 0-7 7-14 14-14-7 0-14-7-14-14z"/>
  <!-- Inner electric cyan glow -->
  <path fill="#7DD3FC" d="M18 8c0 5-5 10-10 10 5 0 10 5 10 10 0-5 5-10 10-10-5 0-10-5-10-10z"/>
  <!-- Core white hot center -->
  <circle fill="#FFFFFF" cx="18" cy="18" r="3"/>
  <!-- Satellite micro sparks -->
  <circle fill="#FACC15" cx="9" cy="9" r="1.5"/>
  <circle fill="#FACC15" cx="27" cy="9" r="1.5"/>
  <circle fill="#FACC15" cx="27" cy="27" r="1.5"/>
  <circle fill="#FACC15" cx="9" cy="27" r="1.5"/>
</svg>`;

// 3. Struja (Electric circuit wire & dynamic voltage pulse)
const strujaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#06B6D4" stroke-width="1.5"/>
  <!-- Insulated copper wire cable -->
  <path fill="none" stroke="#334155" stroke-width="6" stroke-linecap="round" d="M4 22c6 0 8-8 14-8s8 8 14 8"/>
  <path fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" d="M4 22c6 0 8-8 14-8s8 8 14 8"/>
  <!-- High voltage energy pulse -->
  <path fill="none" stroke="#22D3EE" stroke-width="2" stroke-linecap="round" d="M12 18l3-5 5 7 4-6"/>
  <circle fill="#FFFFFF" cx="15" cy="13" r="2"/>
  <circle fill="#22D3EE" cx="20" cy="20" r="2.5"/>
  <circle fill="#FFFFFF" cx="20" cy="20" r="1.2"/>
</svg>`;

// 4. Izum (Tesla carbon filament lightbulb on brass base)
const izumSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Glowing amber aura -->
  <circle cx="18" cy="15" r="12" fill="#FEF3C7" opacity="0.25"/>
  <!-- Bulb glass body -->
  <path fill="#FEF08A" stroke="#F59E0B" stroke-width="1.2" d="M18 5a10 10 0 0 0-7 17.1c1.2 1.3 2 3.1 2 4.9h10c0-1.8.8-3.6 2-4.9A10 10 0 0 0 18 5z"/>
  <!-- Tesla loop filament -->
  <path fill="none" stroke="#DC2626" stroke-width="1.2" stroke-linecap="round" d="M16 23v-7c0-2 4-2 4 0v7"/>
  <!-- Filament bridge loop -->
  <path fill="none" stroke="#F59E0B" stroke-width="1.5" d="M15 15a3 3 0 0 1 6 0"/>
  <!-- Core glow -->
  <circle fill="#FFFFFF" cx="18" cy="14" r="2"/>
  <!-- Screw base -->
  <path fill="#94A3B8" d="M14 27h8v2h-8zm1 2h6v2h-6z"/>
  <path fill="#475569" d="M16 31h4v1.5a2 2 0 0 1-4 0V31z"/>
</svg>`;

// 5. Zvijezda (Golden celestial star with soft nebula aura)
const zvijezdaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Deep cosmic background -->
  <circle cx="18" cy="18" r="16" fill="#0B0F19" stroke="#EAB308" stroke-width="1.5"/>
  <!-- Outer soft glow star -->
  <polygon fill="#FDE047" opacity="0.4" points="18,3 22,13 33,13 24,20 28,31 18,24 8,31 12,20 3,13 14,13"/>
  <!-- Core 5-point golden star -->
  <polygon fill="#F59E0B" points="18,5 21.5,13.5 31,13.5 23.5,19.5 26.5,29 18,23 9.5,29 12.5,19.5 5,13.5 14.5,13.5"/>
  <!-- Inner facet light reflection -->
  <polygon fill="#FEF08A" points="18,5 21.5,13.5 18,19 14.5,13.5"/>
  <polygon fill="#FFFFFF" points="18,8 19.5,13 18,16 16.5,13"/>
</svg>`;

// 6. Nebo (Midnight indigo sky disc with constellations)
const neboSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Sky Disc -->
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5"/>
  <!-- Subtle nebula gradient overlay -->
  <ellipse cx="20" cy="14" rx="10" ry="7" fill="#4338CA" opacity="0.6"/>
  <!-- Big Dipper / Constellation lines -->
  <path fill="none" stroke="#93C5FD" stroke-width="0.8" stroke-dasharray="1.5,1.5" d="M7 12l5 2 4 5 6-1 4 4-5 3"/>
  <!-- Constellation Stars -->
  <circle fill="#FFFFFF" cx="7" cy="12" r="1.3"/>
  <circle fill="#FFFFFF" cx="12" cy="14" r="1.3"/>
  <circle fill="#FFFFFF" cx="16" cy="19" r="1.3"/>
  <circle fill="#FFFFFF" cx="22" cy="18" r="1.3"/>
  <circle fill="#FFFFFF" cx="26" cy="22" r="1.5"/>
  <circle fill="#FFFFFF" cx="21" cy="25" r="1.3"/>
  <!-- Distant micro stars -->
  <circle fill="#FACC15" cx="10" cy="25" r="1"/>
  <circle fill="#FACC15" cx="27" cy="10" r="1"/>
  <circle fill="#67E8F9" cx="18" cy="8" r="1.2"/>
</svg>`;

// 7. Mjesec (Detailed lunar crescent with craters)
const mjesecSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#090D16" stroke="#94A3B8" stroke-width="1.5"/>
  <!-- Crescent Moon -->
  <path fill="#F8FAFC" d="M22 6c-8 0-14 6-14 14s6 14 14 14c-8 0-12-7-12-14s4-14 12-14z"/>
  <!-- Lunar glow -->
  <path fill="#E2E8F0" opacity="0.6" d="M19 8c-6 1-10 6-10 12s4 11 10 12c-6-1-8-6-8-12s2-11 8-12z"/>
  <!-- Craters on crescent -->
  <circle fill="#CBD5E1" cx="14" cy="15" r="1.5"/>
  <circle fill="#CBD5E1" cx="13" cy="22" r="1.2"/>
  <circle fill="#CBD5E1" cx="16" cy="27" r="1"/>
  <!-- Night sky accent star -->
  <polygon fill="#FDE047" points="26,11 27,13 29,13 27.5,14.5 28,16.5 26,15 24,16.5 24.5,14.5 23,13 25,13"/>
</svg>`;

// 8. Sjaj (Diamond starburst sparkle)
const sjajSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#172554" stroke="#60A5FA" stroke-width="1.5"/>
  <!-- Main 8-axis Starburst -->
  <path fill="#60A5FA" opacity="0.4" d="M18 2L15 15 2 18l13 3 3 13 3-13 13-3-13-3z"/>
  <!-- Core Crisp Diamond Sparkle -->
  <path fill="#93C5FD" d="M18 5l2 11 11 2-11 2-2 11-2-11-11-2 11-2z"/>
  <!-- Central White Brilliance -->
  <path fill="#FFFFFF" d="M18 9l1.5 7.5L27 18l-7.5 1.5L18 27l-1.5-7.5L9 18l7.5-1.5z"/>
  <!-- Corner gleams -->
  <circle fill="#FDE047" cx="7" cy="7" r="1.2"/>
  <circle fill="#FDE047" cx="29" cy="7" r="1.2"/>
  <circle fill="#FDE047" cx="29" cy="29" r="1.2"/>
  <circle fill="#FDE047" cx="7" cy="29" r="1.2"/>
</svg>`;

// 9. Teleskop (Astronomical refractor telescope on sturdy tripod)
const teleskopSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#0EA5E9" stroke-width="1.5"/>
  <!-- Tripod Legs -->
  <line x1="17" y1="21" x2="9" y2="33" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
  <line x1="17" y1="21" x2="17" y2="33" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
  <line x1="17" y1="21" x2="25" y2="33" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
  <!-- Tripod mount / swivel joint -->
  <circle fill="#D97706" cx="17" cy="21" r="2.5"/>
  <!-- Optical tube assembly pointing up-right at 40 degrees -->
  <path fill="#E2E8F0" d="M11 25l15-12 2 2.5-15 12z"/>
  <!-- Dew shield / Objective lens rim (Large front aperture) -->
  <path fill="#F59E0B" d="M25 14l3-2.5 1.5 2-3 2.5z"/>
  <!-- Objective glass reflection -->
  <ellipse cx="28" cy="12.5" rx="1.5" ry="2.5" fill="#38BDF8" transform="rotate(-40 28 12.5)"/>
  <!-- Eyepiece / diagonal mirror at back -->
  <path fill="#334155" d="M9 24l2-1.5 1.5 1.5-2 1.5z"/>
  <rect x="7" y="24" width="3" height="1.5" fill="#0EA5E9" transform="rotate(45 8.5 24.75)"/>
</svg>`;

// 10. Planet (Ringed celestial gas giant)
const planetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0B0F19" stroke="#8B5CF6" stroke-width="1.5"/>
  <!-- Back arc of planetary ring -->
  <path fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.6" d="M7 14c3-4 17-6 24 2"/>
  <path fill="none" stroke="#FDE68A" stroke-width="1.5" opacity="0.7" d="M8 15c3-3 15-5 22 2"/>
  <!-- Planet sphere -->
  <circle cx="18" cy="18" r="9" fill="#6366F1"/>
  <!-- Cloud atmospheric bands -->
  <path fill="#4F46E5" d="M9.5 16c2-1 15-1 17 0a9 9 0 0 1-17 0z"/>
  <path fill="#A855F7" d="M10 20c2 1 14 1 16 0a9 9 0 0 1-16 0z"/>
  <circle fill="#818CF8" cx="15" cy="14" r="1.5"/>
  <!-- Front arc of planetary ring -->
  <path fill="none" stroke="#F59E0B" stroke-width="2.5" d="M5 22c5 5 19 3 26-6"/>
  <path fill="none" stroke="#FDE68A" stroke-width="1.2" d="M5 22c5 5 19 3 26-6"/>
</svg>`;

// 11. Svemir (Swirling cosmic spiral galaxy / nebula)
const svemirSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Deep void space -->
  <circle cx="18" cy="18" r="16" fill="#030712" stroke="#A855F7" stroke-width="1.5"/>
  <!-- Swirling purple nebula arm 1 -->
  <path fill="none" stroke="#9333EA" stroke-width="3" stroke-linecap="round" d="M18 18c3-3 8-2 11 1s2 8-2 11-10 1-13-3"/>
  <!-- Swirling cyan nebula arm 2 -->
  <path fill="none" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round" d="M18 18c-3 3-8 2-11-1s-2-8 2-11 10-1 13 3"/>
  <!-- Inner bright spiral -->
  <path fill="none" stroke="#E0E7FF" stroke-width="1.5" d="M18 18c1-1 3-1 4 0s0 3-1 4-3 0-4-1"/>
  <!-- Galactic core supermassive glow -->
  <circle fill="#FFFFFF" cx="18" cy="18" r="2.5"/>
  <!-- Star dust specks -->
  <circle fill="#FACC15" cx="8" cy="14" r="1"/>
  <circle fill="#FACC15" cx="28" cy="22" r="1"/>
  <circle fill="#38BDF8" cx="22" cy="8" r="1"/>
  <circle fill="#A855F7" cx="14" cy="28" r="1"/>
</svg>`;

// 12. Kupola (Višnjan astronomical observatory dome)
const kupolaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
  <!-- Stone foundation base -->
  <path fill="#475569" d="M7 26h22v6H7z"/>
  <path fill="#334155" d="M9 28h18v4H9z"/>
  <!-- White hemispherical dome -->
  <path fill="#E2E8F0" d="M8 26c0-6 4-11 10-11s10 5 10 11H8z"/>
  <!-- Shutter opening / viewing slit -->
  <path fill="#0F172A" d="M16 15h4v11h-4z"/>
  <!-- Telescope barrel peeking out of slit -->
  <path fill="#0284C7" d="M16.5 13l3-4 2 1.5-3 4z"/>
  <ellipse cx="20.5" cy="10" rx="1.5" ry="1" fill="#38BDF8"/>
  <!-- Dome ring / rotation track -->
  <rect x="7" y="25" width="22" height="2" fill="#94A3B8"/>
</svg>`;

// 13. Munja (High-voltage zigzag lightning bolt)
const munjaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <!-- Stormy night sky disc -->
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#FACC15" stroke-width="1.5"/>
  <!-- Golden Lightning Bolt -->
  <polygon fill="#F59E0B" points="20,2 9,18 17,18 13,34 27,15 19,15"/>
  <!-- Inner White-hot Lightning Core -->
  <polygon fill="#FEF08A" points="20,4 12,17 18,17 15,30 25,16 19,16"/>
  <polygon fill="#FFFFFF" points="20,7 15,16 18,16 16,25 22,17 19,17"/>
  <!-- Electric discharge sparks -->
  <circle fill="#38BDF8" cx="6" cy="14" r="1.2"/>
  <circle fill="#38BDF8" cx="29" cy="22" r="1.2"/>
</svg>`;

// 14. Grom (Dark storm cloud with sonic thunder waves)
const gromSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#090D16" stroke="#64748B" stroke-width="1.5"/>
  <!-- Dark Nimbus Storm Cloud -->
  <path fill="#475569" d="M26 19a5 5 0 0 0-4.5-3A7 7 0 0 0 8 18a4 4 0 0 0 1 8h17a4 4 0 0 0 0-8z"/>
  <path fill="#334155" d="M25 20a4 4 0 0 0-4-2.5A6 6 0 0 0 10 19a3.5 3.5 0 0 0 1 6h14a3.5 3.5 0 0 0 0-7z"/>
  <!-- Sound vibration waves (Thunder acoustic rumble) -->
  <path fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" d="M12 28c2 2 6 2 8 0"/>
  <path fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" d="M9 31c4 3 10 3 14 0"/>
</svg>`;

// 15. Baterija (Electric accumulator cell with green charge)
const baterijaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
  <!-- Positive Terminal Nub -->
  <path fill="#94A3B8" d="M16 5h4v2h-4z"/>
  <!-- Main Battery Canister Body -->
  <rect x="11" y="7" width="14" height="22" rx="3" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
  <!-- Green Energy Charge Level -->
  <rect x="13" y="16" width="10" height="11" rx="1.5" fill="#10B981"/>
  <!-- Lightning energy indicator inside battery -->
  <polygon fill="#FEF08A" points="18,17 15,22 18,22 17,26 21,21 18,21"/>
  <!-- Plus symbol on battery -->
  <path fill="#FFFFFF" d="M17 10h2v4h-2zm-2 2h6v1.5h-6z"/>
</svg>`;

// 16. Snaga (Atomic power orb with energetic electron rings)
const snagaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0C0A09" stroke="#E11D48" stroke-width="1.5"/>
  <!-- Orbital Ring 1 (Horizontal tilt) -->
  <ellipse cx="18" cy="18" rx="13" ry="5" fill="none" stroke="#06B6D4" stroke-width="1.2" transform="rotate(-30 18 18)"/>
  <!-- Orbital Ring 2 (Vertical tilt) -->
  <ellipse cx="18" cy="18" rx="13" ry="5" fill="none" stroke="#A855F7" stroke-width="1.2" transform="rotate(30 18 18)"/>
  <!-- Orbiting electrons -->
  <circle fill="#22D3EE" cx="8" cy="12" r="1.5"/>
  <circle fill="#C084FC" cx="28" cy="12" r="1.5"/>
  <!-- Central Energy Core Nucleus -->
  <circle cx="18" cy="18" r="4.5" fill="#E11D48"/>
  <circle cx="18" cy="18" r="3" fill="#FB7185"/>
  <circle cx="18" cy="18" r="1.2" fill="#FFFFFF"/>
</svg>`;

// 17. Robot (Friendly assistant automaton)
const robotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0F172A" stroke="#06B6D4" stroke-width="1.5"/>
  <!-- Antenna -->
  <line x1="18" y1="5" x2="18" y2="9" stroke="#94A3B8" stroke-width="1.5"/>
  <circle fill="#F59E0B" cx="18" cy="5" r="1.8"/>
  <!-- Robot Head Box -->
  <rect x="10" y="9" width="16" height="13" rx="3" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1"/>
  <!-- Glowing Cyan Visor Screen -->
  <rect x="12" y="11" width="12" height="6" rx="2" fill="#0284C7"/>
  <!-- Animated Eyes on Screen -->
  <circle fill="#38BDF8" cx="15" cy="14" r="1.5"/>
  <circle fill="#FFFFFF" cx="15" cy="14" r="0.7"/>
  <circle fill="#38BDF8" cx="21" cy="14" r="1.5"/>
  <circle fill="#FFFFFF" cx="21" cy="14" r="0.7"/>
  <!-- Speaker Smile -->
  <line x1="14" y1="19" x2="22" y2="19" stroke="#64748B" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Neck & Shoulders -->
  <rect x="16" y="22" width="4" height="2" fill="#64748B"/>
  <path fill="#94A3B8" d="M8 24h20v6H8z"/>
</svg>`;

// 18. Ideja (Electric spark lightbulb with graduation laurel)
const idejaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#1E1B4B" stroke="#F59E0B" stroke-width="1.5"/>
  <!-- Bulb -->
  <path fill="#FDE047" stroke="#D97706" stroke-width="1" d="M18 7a8 8 0 0 0-5.5 13.8c1 1 1.5 2.2 1.5 3.7h8c0-1.5.5-2.7 1.5-3.7A8 8 0 0 0 18 7z"/>
  <!-- Radiant Idea Beams -->
  <line x1="18" y1="3" x2="18" y2="5" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="7" y1="14" x2="5" y2="14" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="31" y1="14" x2="29" y2="14" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Screw base -->
  <path fill="#94A3B8" d="M15 24h6v2h-6zm1 2h4v2h-4z"/>
</svg>`;

// 19. Znanje (Glowing ancient wisdom book)
const znanjeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#0A0A0A" stroke="#3B82F6" stroke-width="1.5"/>
  <!-- Open Book Spines & Pages -->
  <path fill="#1D4ED8" d="M18 12c-4-2-9-2-12 0v14c3-2 8-2 12 0 4-2 9-2 12 0V12c-3-2-8-2-12 0z"/>
  <path fill="#F8FAFC" d="M18 13c-4-2-8-2-11 0v12c3-2 7-2 11 0 4-2 8-2 11 0V13c-3-2-7-2-11 0z"/>
  <!-- Center Book Fold -->
  <line x1="18" y1="13" x2="18" y2="25" stroke="#94A3B8" stroke-width="1"/>
  <!-- Glowing star ascending from book pages -->
  <polygon fill="#F59E0B" points="18,6 19.5,9.5 23,9.5 20,11.5 21,15 18,13 15,15 16,11.5 13,9.5 16.5,9.5"/>
</svg>`;

// 20. Buducnost (Space exploration rocket ascending into the stars)
const buducnostSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <circle cx="18" cy="18" r="16" fill="#030712" stroke="#EC4899" stroke-width="1.5"/>
  <!-- Rocket exhaust flame -->
  <polygon fill="#DC2626" points="18,33 14,26 22,26"/>
  <polygon fill="#F59E0B" points="18,30 15.5,26 20.5,26"/>
  <polygon fill="#FEF08A" points="18,28 16.5,26 19.5,26"/>
  <!-- Rocket Body -->
  <path fill="#F8FAFC" d="M18 5c-3 4-5 12-5 18h10c0-6-2-14-5-18z"/>
  <!-- Nose cone in crimson -->
  <path fill="#DC2626" d="M18 5c-1.5 2.5-3 6-3.8 9h7.6c-.8-3-2.3-6.5-3.8-9z"/>
  <!-- Porthole Window -->
  <circle fill="#0284C7" cx="18" cy="17" r="2.5" stroke="#CBD5E1" stroke-width="1"/>
  <circle fill="#38BDF8" cx="18" cy="17" r="1.5"/>
  <!-- Fins -->
  <path fill="#DC2626" d="M13 20l-4 4v2h4zM23 20l4 4v2h-4z"/>
</svg>`;

const assets = [
  { name: "svjetlost", alt: "light", content: svjetlostSvg },
  { name: "iskra", alt: "spark", content: iskraSvg },
  { name: "struja", alt: "current", content: strujaSvg },
  { name: "izum", alt: "invention", content: izumSvg },
  { name: "zvijezda", alt: "star", content: zvijezdaSvg },
  { name: "nebo", alt: "sky", content: neboSvg },
  { name: "mjesec", alt: "moon", content: mjesecSvg },
  { name: "sjaj", alt: "radiance", content: sjajSvg },
  { name: "teleskop", alt: "telescope", content: teleskopSvg },
  { name: "planet", alt: "planet_asset", content: planetSvg },
  { name: "svemir", alt: "cosmos", content: svemirSvg },
  { name: "kupola", alt: "observatory", content: kupolaSvg },
  { name: "munja", alt: "lightning", content: munjaSvg },
  { name: "grom", alt: "thunder", content: gromSvg },
  { name: "baterija", alt: "battery", content: baterijaSvg },
  { name: "snaga", alt: "power", content: snagaSvg },
  { name: "robot", alt: "automaton", content: robotSvg },
  { name: "ideja", alt: "idea", content: idejaSvg },
  { name: "znanje", alt: "knowledge", content: znanjeSvg },
  { name: "buducnost", alt: "future", content: buducnostSvg },
];

for (const asset of assets) {
  const p1 = path.join(publicDir, `${asset.name}.svg`);
  const p2 = path.join(publicDir, `${asset.alt}.svg`);
  fs.writeFileSync(p1, asset.content, "utf-8");
  fs.writeFileSync(p2, asset.content, "utf-8");
  console.log(`Generated ${asset.name}.svg and ${asset.alt}.svg`);
}

console.log(`\nSuccessfully generated all ${assets.length * 2} World 8 vector SVGs!`);
