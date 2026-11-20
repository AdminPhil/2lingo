import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

import { WorldYaml, WorldYamlSchema } from "../../lib/v2/curriculum-schema";

/**
 * CroLingo v2 Phase 3 Curriculum Elevation Engine
 * Applies all 5 CR-094 pedagogical upgrades cleanly to `curriculum/worlds/world-01..12.yaml`:
 *   1. CR-095: Unit 13 Spatial Prepositions visual contrast diagrams (spatial_u/na/ispod/blizu.svg)
 *   2. CR-096a: Eliminates Worlds 7-8 complexity dip with authentic 4-5w Perfekt & Futur I sentences
 *   3. CR-096b: Restores Perfekt, Futur I, Kondicional I (bih/bismo) & subordinate clauses in W9-W12
 *   4. CR-097: Upgrades Worlds 5-12 L3-L4 ASSIST options to >=35% Croatian morphological minimal pairs
 *   5. CR-098: Injects Tier 3 LISTEN (W2-W12 L2) & Tier 5 BUILD_SENTENCE (W4-W12 L3-L4)
 *
 * Also writes `scripts/v2/v2-missing-audio.json` for any newly introduced Croatian audio clips.
 */

function toAudioSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

type CuratedUpgrade = {
  prompt: string;
  correct: string;
  distractors: string[];
  grammarTags: string[];
};

/**
 * Hand-crafted authentic Croatian upgrades for:
 * - Worlds 7-8 single-word/short-phrase regressions (eliminating the W7-W8 dip)
 * - Worlds 9-12 tense/conditional/subordinate clause spirals (restoring Early B1 trajectory)
 */
const CURATED_SENTENCE_UPGRADES: Record<string, CuratedUpgrade> = {
  // === WORLD 7 (Zagorje Castles — Perfekt + Castle Narrative, lifting 1-2w regressions) ===
  "31:2:1": {
    prompt: 'Translate: "We walked into the old castle."',
    correct: "Ušli smo u stari dvorac.",
    distractors: [
      "Ušli smo u starom dvorcu.",
      "Ulazimo u stari dvorac.",
      "Izašli smo iz starog dvorca.",
    ],
    grammarTags: ["perfekt", "accusative_motion"],
  },
  "31:2:2": {
    prompt: 'Translate: "I found the golden key on the table."',
    correct: "Našao sam zlatni ključ na stolu.",
    distractors: [
      "Našao sam zlatni ključ na stol.",
      "Tražim zlatni ključ na stolu.",
      "Našli smo zlatne ključeve u sobi.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "31:2:3": {
    prompt: 'Translate: "The old tower stands above the green lake."',
    correct: "Stara kula stoji iznad zelenog jezera.",
    distractors: [
      "Stara kula stoji ispod zelenog jezera.",
      "Stara kula je stajala pored ceste.",
      "Visoka kula gleda prema starom mostu.",
    ],
    grammarTags: ["genitive", "spatial_preposition"],
  },
  "31:3:1": {
    prompt: 'Translate: "Yesterday we visited the big castle."',
    correct: "Jučer smo posjetili veliki dvorac.",
    distractors: [
      "Sutra ćemo posjetiti veliki dvorac.",
      "Jučer smo posjetili velikom dvorcu.",
      "Danas posjećujemo mali dvorac.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "32:2:1": {
    prompt: 'Translate: "The brave knight protected the castle gate."',
    correct: "Hrabri vitez je čuvao vrata dvorca.",
    distractors: [
      "Hrabri vitez čuva vrata dvorca.",
      "Hrabri vitez će čuvati vrata dvorca.",
      "Hrabri vitez je otvorio stara vrata.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "32:2:2": {
    prompt: 'Translate: "The knight held a shiny sword in his hand."',
    correct: "Vitez je držao sjajni mač u ruci.",
    distractors: [
      "Vitez je držao sjajni mač u ruku.",
      "Vitez drži sjajni mač na stolu.",
      "Vitez je nosio teški štit u dvorani.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "32:3:1": {
    prompt: 'Translate: "He carried a heavy wooden shield."',
    correct: "Nosio je teški drveni štit.",
    distractors: [
      "Nosi teški drveni štit.",
      "Nosio je teškim drvenim štitom.",
      "Nosili smo stari kameni ključ.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "32:3:2": {
    prompt: 'Translate: "We watched the Croatian flag on the tower."',
    correct: "Gledali smo hrvatsku zastavu na kuli.",
    distractors: [
      "Gledali smo hrvatsku zastavu na kulu.",
      "Gledat ćemo hrvatsku zastavu na kuli.",
      "Gledamo staru zastavu u dvorcu.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "32:4:2": {
    prompt: 'Translate: "The knights defended the town because they were brave."',
    correct: "Vitezovi su branili grad jer su bili hrabri.",
    distractors: [
      "Vitezovi brane grad jer su hrabri.",
      "Vitezovi su čuvali dvorac dok je padala kiša.",
      "Vitezovi će braniti grad sutra ujutro.",
    ],
    grammarTags: ["perfekt", "subordinate_jer"],
  },
  "32:4:3": {
    prompt: 'Translate: "We listened carefully while the guide spoke."',
    correct: "Pažljivo smo slušali dok je vodič govorio.",
    distractors: [
      "Pažljivo slušamo dok vodič govori.",
      "Pažljivo smo slušali kada smo ušli.",
      "Brzo smo hodali dok je sunce sjalo.",
    ],
    grammarTags: ["perfekt", "subordinate_dok"],
  },
  "33:2:1": {
    prompt: 'Translate: "Turn left when you see the tower."',
    correct: "Skreni lijevo kada vidiš kulu.",
    distractors: [
      "Skreni desno kada vidiš kulu.",
      "Skrenuli smo lijevo kod stare kule.",
      "Idi ravno dok ne vidiš most.",
    ],
    grammarTags: ["imperative", "subordinate_kada"],
  },
  "33:2:2": {
    prompt: 'Translate: "We turned right toward the great hall."',
    correct: "Skrenuli smo desno prema velikoj dvorani.",
    distractors: [
      "Skrenuli smo lijevo prema velikoj dvorani.",
      "Skrećemo desno prema velikoj dvorani.",
      "Skrenut ćemo desno kod starog ulaza.",
    ],
    grammarTags: ["perfekt", "dative"],
  },
  "33:2:3": {
    prompt: 'Translate: "Walk straight through the stone hall."',
    correct: "Idi ravno kroz kamenu dvoranu.",
    distractors: [
      "Idi ravno u kamenoj dvorani.",
      "Išli smo ravno kroz kamenu dvoranu.",
      "Skreni lijevo kod kamenog mosta.",
    ],
    grammarTags: ["imperative", "accusative"],
  },
  "33:4:2": {
    prompt: 'Translate: "We looked for the secret passage in the castle."',
    correct: "Tražili smo tajni prolaz u dvorcu.",
    distractors: [
      "Tražili smo tajni prolaz u dvorac.",
      "Tražimo tajni prolaz u dvorcu.",
      "Našli smo tajni prolaz ispod mosta.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "34:2:1": {
    prompt: 'Translate: "Grandpa carved a wooden toy for me."',
    correct: "Djed je izradio drvenu igračku za mene.",
    distractors: [
      "Djed izrađuje drvenu igračku za mene.",
      "Djed je izradio drvenom igračkom u sobi.",
      "Baka je kupila drvenu igračku na tržnici.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "34:3:2": {
    prompt: 'Translate: "We painted the little wooden horse red."',
    correct: "Obojali smo malog drvenog konjića crveno.",
    distractors: [
      "Bojamo malog drvenog konjića crveno.",
      "Obojali smo malog drvenog konjića plavo.",
      "Kupili smo drvenog konjića na sajmu.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "34:3:3": {
    prompt: 'Translate: "I gave a sweet gingerbread heart to mom."',
    correct: "Darovao sam mami slatko licitarsko srce.",
    distractors: [
      "Darujem mami slatko licitarsko srce.",
      "Darovao sam tati drvenu igračku.",
      "Darovali smo prijateljima male poklone.",
    ],
    grammarTags: ["perfekt", "dative"],
  },
  "34:4:3": {
    prompt: 'Translate: "This is the toy that the craftsman made."',
    correct: "Ovo je igračka koju je majstor izradio.",
    distractors: [
      "Ovo je igračka koja je na stolu.",
      "Ovo je dvorac koji smo jučer posjetili.",
      "Ovo je srce koje smo zajedno obojali.",
    ],
    grammarTags: ["perfekt", "subordinate_koji"],
  },

  // === WORLD 8 (Tesla & Astronomy — Futur I + Perfekt spiral, lifting W8 2.19w dip!) ===
  "36:2:1": {
    prompt: 'Translate: "Bright light filled the whole room."',
    correct: "Svijetla svjetlost je ispunila cijelu sobu.",
    distractors: [
      "Svijetla svjetlost ispunjava cijelu sobu.",
      "Svijetla svjetlost je ispunila cijeloj sobi.",
      "Mala iskra je obasjala tamnu sobu.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "36:2:2": {
    prompt: 'Translate: "We will learn about Nikola Tesla tomorrow."',
    correct: "Sutra ćemo učiti o Nikoli Tesli.",
    distractors: [
      "Jučer smo učili o Nikoli Tesli.",
      "Sutra učimo u velikoj školi.",
      "Sutra ćemo gledati sjajne zvijezde.",
    ],
    grammarTags: ["futur_1", "locative"],
  },
  "36:2:3": {
    prompt: 'Translate: "Electric current flows quickly through the wire."',
    correct: "Električna struja brzo teče kroz žicu.",
    distractors: [
      "Električna struja brzo teče u žici.",
      "Električna struja će teći kroz kuću.",
      "Hladna voda tiho teče kroz rijeku.",
    ],
    grammarTags: ["accusative"],
  },
  "36:2:4": {
    prompt: 'Translate: "Tesla created an important invention for the world."',
    correct: "Tesla je stvorio važan izum za svijet.",
    distractors: [
      "Tesla stvara važan izum za svijet.",
      "Tesla će stvoriti novi izum sutra.",
      "Tesla je živio u malom selu Smiljanu.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "36:3:1": {
    prompt: 'Translate: "The lamp will shine brightly tonight."',
    correct: "Lampa će večeras sjajno svijetliti.",
    distractors: [
      "Lampa je sinoć sjajno svijetlila.",
      "Lampa večeras sjajno svijetli.",
      "Zvijezda će večeras sjajno sjati.",
    ],
    grammarTags: ["futur_1"],
  },
  "36:3:2": {
    prompt: 'Translate: "I turn on the light when it gets dark."',
    correct: "Palim svjetlo kada padne mrak.",
    distractors: [
      "Upalio sam svjetlo kada je pao mrak.",
      "Upalit ću svjetlo kada padne mrak.",
      "Gasim svjetlo prije spavanja.",
    ],
    grammarTags: ["subordinate_kada"],
  },
  "37:2:1": {
    prompt: 'Translate: "Tonight we will watch a bright star."',
    correct: "Večeras ćemo gledati sjajnu zvijezdu.",
    distractors: [
      "Sinoć smo gledali sjajnu zvijezdu.",
      "Večeras gledamo sjajnu zvijezdu.",
      "Večeras ćemo gledati puni mjesec.",
    ],
    grammarTags: ["futur_1", "accusative"],
  },
  "37:2:2": {
    prompt: 'Translate: "The dark sky is full of stars."',
    correct: "Tamno nebo je puno sjajnih zvijezda.",
    distractors: [
      "Tamno nebo je puno bijelih oblaka.",
      "Tamno nebo će biti puno zvijezda.",
      "Plavo nebo je puno toplog sunca.",
    ],
    grammarTags: ["genitive"],
  },
  "37:2:3": {
    prompt: 'Translate: "The full moon shone above the mountain."',
    correct: "Puni mjesec je sjao iznad planine.",
    distractors: [
      "Puni mjesec sja iznad planine.",
      "Puni mjesec će sjati iznad mora.",
      "Puni mjesec je sjao ispod planine.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "37:2:4": {
    prompt: 'Translate: "We saw a golden glow in the night."',
    correct: "Vidjeli smo zlatni sjaj u noći.",
    distractors: [
      "Vidjet ćemo zlatni sjaj u noći.",
      "Vidimo zlatni sjaj na nebu.",
      "Vidjeli smo zlatni sjaj u noć.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "38:2:1": {
    prompt: 'Translate: "We will look through a big telescope."',
    correct: "Gledat ćemo kroz veliki teleskop.",
    distractors: [
      "Gledali smo kroz veliki teleskop.",
      "Gledamo kroz veliki teleskop.",
      "Gledat ćemo prema dalekom planetu.",
    ],
    grammarTags: ["futur_1", "accusative"],
  },
  "38:2:2": {
    prompt: 'Translate: "Astronomers discovered a distant planet."',
    correct: "Astronomi su otkrili daleki planet.",
    distractors: [
      "Astronomi će otkriti daleki planet.",
      "Astronomi otkrivaju daleki planet.",
      "Astronomi su promatrali sjajnu zvijezdu.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "38:3:1": {
    prompt: 'Translate: "We will observe the stars from the observatory."',
    correct: "Promatrat ćemo zvijezde iz zvjezdarnice.",
    distractors: [
      "Promatrali smo zvijezde iz zvjezdarnice.",
      "Promatramo zvijezde iz zvjezdarnice.",
      "Promatrat ćemo more s visokog brda.",
    ],
    grammarTags: ["futur_1", "genitive"],
  },
  "38:3:2": {
    prompt: 'Translate: "Soon we will discover new secrets of space."',
    correct: "Uskoro ćemo otkriti nove tajne svemira.",
    distractors: [
      "Jučer smo otkrili nove tajne svemira.",
      "Danas otkrivamo nove tajne svemira.",
      "Uskoro ćemo posjetiti veliku zvjezdarnicu.",
    ],
    grammarTags: ["futur_1", "genitive"],
  },
  "39:2:1": {
    prompt: 'Translate: "Strong lightning lit up the dark sky."',
    correct: "Snažna munja je obasjala tamno nebo.",
    distractors: [
      "Snažna munja obasjava tamno nebo.",
      "Snažna munja će obasjati tamno nebo.",
      "Glasni grom je odjeknuo iznad sela.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "39:2:2": {
    prompt: 'Translate: "We stayed inside because loud thunder came."',
    correct: "Ostali smo unutra jer je došao glasni grom.",
    distractors: [
      "Ostajemo unutra jer dolazi oluja.",
      "Ostali smo vani dok je sjalo sunce.",
      "Ostat ćemo unutra ako dođe oluja.",
    ],
    grammarTags: ["perfekt", "subordinate_jer"],
  },
  "39:2:3": {
    prompt: 'Translate: "We charged the battery before the trip."',
    correct: "Napunili smo bateriju prije puta.",
    distractors: [
      "Punimo bateriju prije puta.",
      "Napunit ćemo bateriju prije puta.",
      "Napunili smo bateriju poslije škole.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "40:2:1": {
    prompt: 'Translate: "The smart robot will help the scientists."',
    correct: "Pametni robot će pomoći znanstvenicima.",
    distractors: [
      "Pametni robot je pomogao znanstvenicima.",
      "Pametni robot pomaže znanstvenicima.",
      "Pametni robot će graditi novu školu.",
    ],
    grammarTags: ["futur_1", "dative"],
  },
  "40:2:2": {
    prompt: 'Translate: "Would you like to invent a smart robot?"',
    correct: "Bi li htio izumiti pametnog robota?",
    distractors: [
      "Htio si izumiti pametnog robota.",
      "Izumit ćeš pametnog robota sutra.",
      "Bi li htio posjetiti veliku zvjezdarnicu?",
    ],
    grammarTags: ["conditional", "accusative"],
  },
  "36:3:3": {
    prompt: 'Translate: "The new lamp shines brightly on the desk."',
    correct: "Nova lampa sjajno svijetli na stolu.",
    distractors: [
      "Nova lampa sjajno svijetli na stol.",
      "Nova lampa je svijetlila u sobi.",
      "Stara lampa ne svijetli večeras.",
    ],
    grammarTags: ["locative"],
  },
  "36:3:4": {
    prompt: 'Translate: "We turn on the light in the evening."',
    correct: "Navečer palimo toplo svjetlo u sobi.",
    distractors: [
      "Navečer palimo toplo svjetlo u sobu.",
      "Ujutro gasimo toplo svjetlo u sobi.",
      "Sinoć smo upalili svjetlo u kuhinji.",
    ],
    grammarTags: ["locative"],
  },
  "37:3:1": {
    prompt: 'Translate: "Thousands of bright stars shine above us."',
    correct: "Tisuće sjajnih zvijezda sjaje iznad nas.",
    distractors: [
      "Tisuće sjajnih zvijezda sjale su sinoć.",
      "Tisuće tamnih oblaka plove iznad mora.",
      "Jedna sjajna zvijezda sja iznad brda.",
    ],
    grammarTags: ["genitive"],
  },
  "38:4:2": {
    prompt: 'Translate: "The white dome opens slowly at night."',
    correct: "Bijela kupola se polako otvara noću.",
    distractors: [
      "Bijela kupola se polako zatvara ujutro.",
      "Bijela kupola se jučer polako otvorila.",
      "Velika kupola će se otvoriti večeras.",
    ],
    grammarTags: ["reflexive_se"],
  },
  "39:3:3": {
    prompt: 'Translate: "A strong summer storm is coming from the sea."',
    correct: "Snažna ljetna oluja dolazi s mora.",
    distractors: [
      "Snažna ljetna oluja je došla s mora.",
      "Snažna ljetna oluja dolazi prema gradu.",
      "Topli ljetni vjetar puše iz šume.",
    ],
    grammarTags: ["genitive"],
  },
  "39:3:4": {
    prompt: 'Translate: "We will charge the battery before the evening walk."',
    correct: "Napunit ćemo bateriju prije večernje šetnje.",
    distractors: [
      "Napunili smo bateriju prije večernje šetnje.",
      "Punimo bateriju za večernju šetnju.",
      "Napunit ćemo bateriju poslije večere.",
    ],
    grammarTags: ["futur_1", "genitive"],
  },
  "40:3:1": {
    prompt: 'Translate: "Tomorrow we will learn new Croatian words."',
    correct: "Sutra ćemo učiti nove hrvatske riječi.",
    distractors: [
      "Jučer smo učili nove hrvatske riječi.",
      "Danas učimo nove hrvatske riječi.",
      "Sutra ćemo čitati stare hrvatske priče.",
    ],
    grammarTags: ["futur_1", "accusative"],
  },
  "40:3:2": {
    prompt: 'Translate: "Tonight we will watch the stars with a telescope."',
    correct: "Večeras ćemo gledati zvijezde velikim teleskopom.",
    distractors: [
      "Sinoć smo gledali zvijezde velikim teleskopom.",
      "Večeras gledamo zvijezde s visokog brda.",
      "Večeras ćemo gledati puni mjesec na nebu.",
    ],
    grammarTags: ["futur_1", "instrumental"],
  },
  "40:3:3": {
    prompt: 'Translate: "One day we will travel to distant planets."',
    correct: "Jednog dana putovat ćemo na daleke planete.",
    distractors: [
      "Prošle godine putovali smo na daleke otoke.",
      "Jednog dana putovat ćemo na dalekim planetima.",
      "Danas putujemo brzim brodom prema otoku.",
    ],
    grammarTags: ["futur_1", "accusative_motion"],
  },
  "40:3:4": {
    prompt: 'Translate: "Together we will invent clean energy for everyone."',
    correct: "Zajedno ćemo izumiti čistu energiju za sve.",
    distractors: [
      "Zajedno smo izumili novu igru u školi.",
      "Zajedno izumljujemo pametnog robota za kuću.",
      "Sutra ćemo učiti o čistoj energiji.",
    ],
    grammarTags: ["futur_1", "accusative"],
  },

  // === WORLD 9 (Sinjska Alka & Cetina — A2/B1 Narrative, Perfekt + Futur I + Kondicional I) ===
  "41:2:3": {
    prompt: 'Translate: "The fast horse ran smoothly along the track."',
    correct: "Brzi konj je mirno trčao duž staze.",
    distractors: [
      "Brzi konj mirno trči duž staze.",
      "Brzi konj će trčati duž cijele staze.",
      "Brzi konj je stajao ispred stare štale.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "41:3:2": {
    prompt: 'Translate: "The rider checked the leather saddle before the race."',
    correct: "Jahač je provjerio kožno sedlo prije trke.",
    distractors: [
      "Jahač provjerava kožno sedlo prije trke.",
      "Jahač će provjeriti kožno sedlo sutra ujutro.",
      "Jahač je stavio teško koplje na sedlo.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "41:3:4": {
    prompt: 'Translate: "Tomorrow we will watch the knights in Sinj."',
    correct: "Sutra ćemo gledati vitezove u Sinju.",
    distractors: [
      "Jučer smo gledali vitezove u Sinju.",
      "Sutra ćemo gledati vitezove u Sinj.",
      "Danas gledamo vitezove na stazi.",
    ],
    grammarTags: ["futur_1", "locative"],
  },
  "42:2:2": {
    prompt: 'Translate: "The knight held a long wooden spear."',
    correct: "Alkar je držao dugačko drveno koplje u ruci.",
    distractors: [
      "Alkar drži dugačko drveno koplje u ruci.",
      "Alkar će držati dugačko drveno koplje na konju.",
      "Alkar je spustio željeznu alku na stol.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "42:2:4": {
    prompt: 'Translate: "The iron ring hangs high above the track."',
    correct: "Željezna alka visi visoko iznad cijele staze.",
    distractors: [
      "Željezna alka visi nisko ispod drvenog mosta.",
      "Željezna alka će visjeti iznad staze sutra.",
      "Sjajna medalja visi na prsima pobjednika.",
    ],
    grammarTags: ["genitive", "spatial_preposition"],
  },
  "42:3:3": {
    prompt: 'Translate: "He aimed carefully with the sharp spear."',
    correct: "Pažljivo je ciljao oštrim kopljem prema alki.",
    distractors: [
      "Pažljivo cilja oštrim kopljem prema alki.",
      "Pažljivo će ciljati kada krene brzi konj.",
      "Brzo je jahao bez teškog koplja u ruci.",
    ],
    grammarTags: ["perfekt", "instrumental", "dative"],
  },
  "42:3:4": {
    prompt: 'Translate: "The crowd cheered when he hit the center."',
    correct: "Publika je pljeskala kada je pogodio u sridu.",
    distractors: [
      "Publika plješće kada vitez pogodi u sridu.",
      "Publika će pljeskati ako pogodi u sridu.",
      "Publika je čekala dok su konji ulazili.",
    ],
    grammarTags: ["perfekt", "subordinate_kada"],
  },
  "42:4:3": {
    prompt: 'Translate: "The knight won because he aimed accurately."',
    correct: "Vitez je pobijedio jer je točno ciljao.",
    distractors: [
      "Vitez pobjeđuje jer točno cilja.",
      "Vitez će pobijediti ako točno pogodi.",
      "Vitez je jahao brzo duž staze.",
    ],
    grammarTags: ["perfekt", "subordinate_jer"],
  },
  "43:2:2": {
    prompt: 'Translate: "High cliffs rise above the emerald Cetina."',
    correct: "Visoke stijene uzdižu se iznad smaragdne Cetine.",
    distractors: [
      "Visoke stijene stoje ispod dubokog kanjona.",
      "Visoke stijene su čuvale mirnu zelenu rijeku.",
      "Strme staze vode prema starom kamenom mostu.",
    ],
    grammarTags: ["reflexive", "genitive"],
  },
  "43:2:3": {
    prompt: 'Translate: "We would love to photograph the wonderful waterfall."',
    correct: "Rado bismo fotografirali predivni slap u kanjonu.",
    distractors: [
      "Jučer smo fotografirali predivni slap u kanjonu.",
      "Sutra ćemo fotografirati predivni slap na rijeci.",
      "Rado bismo veslali mirnim čamcem niz rijeku.",
    ],
    grammarTags: ["conditional", "locative"],
  },
  "43:2:4": {
    prompt: 'Translate: "Tomorrow we will paddle through the deep canyon."',
    correct: "Sutra ćemo veslati kroz duboki kanjon Cetine.",
    distractors: [
      "Jučer smo veslali kroz duboki kanjon Cetine.",
      "Sutra ćemo veslati u dubokom kanjonu.",
      "Danas veslamo mirnim čamcem uz zelenu obalu.",
    ],
    grammarTags: ["futur_1", "accusative_motion", "genitive"],
  },
  "44:2:2": {
    prompt: 'Translate: "A warm fire crackled under the iron bell."',
    correct: "Topla vatra je pucketala ispod željezne peke.",
    distractors: [
      "Topla vatra pucketa ispod željezne peke.",
      "Topla vatra će grijati staru kamenu kuću.",
      "Hladna voda je tekla ispod drvenog kotača.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "44:2:3": {
    prompt: 'Translate: "The old mill ground grain into white flour."',
    correct: "Stari mlin je samljeo žito u bijelo brašno.",
    distractors: [
      "Stari mlin melje žito u bijelo brašno.",
      "Stari mlin će mljeti žito cijelo jutro.",
      "Baka je zamijesila svježi kruh od bijelog brašna.",
    ],
    grammarTags: ["perfekt", "accusative"],
  },
  "44:4:3": {
    prompt: 'Translate: "We would gladly taste warm bread under the bell."',
    correct: "Rado bismo kušali topli kruh ispod peke.",
    distractors: [
      "Jučer smo kušali topli kruh ispod peke.",
      "Sutra ćemo kušati topli kruh ispod peke.",
      "Rado bismo posjetili stari mlin na rijeci.",
    ],
    grammarTags: ["conditional", "genitive"],
  },
  "45:2:2": {
    prompt: 'Translate: "The winner received a shiny gold medal."',
    correct: "Pobjednik je primio sjajnu zlatnu medalju na trgu.",
    distractors: [
      "Pobjednik prima sjajnu zlatnu medalju na trgu.",
      "Pobjednik će primiti medalju nakon cijele trke.",
      "Pobjednik je zahvalio publici koja je pljeskala.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "45:2:3": {
    prompt: 'Translate: "We stayed at the big celebration until evening."',
    correct: "Ostali smo na velikom slavlju do večeri.",
    distractors: [
      "Ostajemo na velikom slavlju do večeri.",
      "Ostat ćemo na velikom slavlju ako bude glazbe.",
      "Došli smo na veliko slavlje s prijateljima.",
    ],
    grammarTags: ["perfekt", "locative", "genitive"],
  },
  "45:2:4": {
    prompt: 'Translate: "I would like to return to Sinj next summer."',
    correct: "Volio bih se vratiti u Sinj sljedećeg ljeta.",
    distractors: [
      "Vratio sam se u Sinj prošlog ljeta.",
      "Vratit ću se u Sinj sljedećeg ljeta.",
      "Volio bih vidjeti stare konje u dolini.",
    ],
    grammarTags: ["conditional", "reflexive", "genitive"],
  },

  // === WORLD 10 (Kvarner & Rijeka — Maritime & Glagolitic B1 Bridge) ===
  "46:2:1": {
    prompt: 'Translate: "Many ships anchor in the large Rijeka harbor."',
    correct: "Mnogi brodovi pristaju u velikoj riječkoj luci.",
    distractors: [
      "Mnogi brodovi pristaju u veliku riječku luku.",
      "Mnogi brodovi su pristali u mirnoj uvali.",
      "Mnogi brodovi će isploviti iz luke ujutro.",
    ],
    grammarTags: ["locative"],
  },
  "46:2:2": {
    prompt: 'Translate: "The large cargo ship slowly entered the quiet Rijeka harbor."',
    correct: "Veliki teretni brod polako je uplovio u mirnu riječku luku.",
    distractors: [
      "Veliki teretni brod polako je uplovio u mirnoj riječkoj luci.",
      "Veliki teretni brod će uskoro isploviti iz riječke luke.",
      "Bijeli brod mirno čeka putnike pored kamenog svjetionika.",
    ],
    grammarTags: ["perfekt", "accusative_motion"],
  },
  "46:3:1": {
    prompt: 'Translate: "The white ship sailed calmly across Kvarner Bay."',
    correct: "Bijeli brod je mirno plovio Kvarnerskim zaljevom.",
    distractors: [
      "Bijeli brod mirno plovi Kvarnerskim zaljevom.",
      "Bijeli brod će zaploviti prema otoku Krku.",
      "Veliki brod je čekao kapetana u luci.",
    ],
    grammarTags: ["perfekt", "instrumental"],
  },
  "46:4:3": {
    prompt: 'Translate: "Tomorrow we will sail by catamaran to Krk."',
    correct: "Sutra ćemo ploviti katamaranom na otok Krk.",
    distractors: [
      "Jučer smo plovili katamaranom na otok Krk.",
      "Sutra ćemo ploviti katamaranom na otoku Krku.",
      "Danas plovimo velikim brodom iz luke.",
    ],
    grammarTags: ["futur_1", "instrumental", "accusative_motion"],
  },
  "47:2:1": {
    prompt: 'Translate: "The old Trsat fortress has guarded the city for centuries."',
    correct: "Stara trsatska gradina stoljećima čuva cijeli grad.",
    distractors: [
      "Stara trsatska gradina je čuvala mirnu obalu.",
      "Stara trsatska gradina će privući mnoge posjetitelje.",
      "Visoka kamena kula stoji iznad male luke.",
    ],
    grammarTags: ["instrumental", "accusative"],
  },
  "47:2:2": {
    prompt: 'Translate: "We climbed the stone stairs because we wanted to see the sea."',
    correct: "Penjali smo se kamenim stubama jer smo željeli vidjeti more.",
    distractors: [
      "Penjemo se kamenim stubama jer želimo vidjeti more.",
      "Popet ćemo se kamenim stubama kada sunce zađe.",
      "Hodali smo starim zidinama dok je puhao lagani vjetar.",
    ],
    grammarTags: ["perfekt", "instrumental", "subordinate_jer"],
  },
  "47:4:3": {
    prompt: 'Translate: "We climbed the stairs that lead to Trsat."',
    correct: "Popeli smo se stubama koje vode na Trsat.",
    distractors: [
      "Penjemo se stubama koje vode na Trsat.",
      "Popet ćemo se stubama do stare gradine.",
      "Stajali smo na vidikovcu koji gleda na more.",
    ],
    grammarTags: ["perfekt", "instrumental", "subordinate_koji"],
  },
  "48:2:1": {
    prompt: 'Translate: "We will walk along the long promenade while the sun sets."',
    correct: "Šetat ćemo dugom šetnicom dok sunce polako zalazi.",
    distractors: [
      "Šetali smo dugom šetnicom dok je sunce zalazilo.",
      "Šetamo dugom šetnicom pored visokih palmi.",
      "Rado bismo šetali uz mirno plavo more.",
    ],
    grammarTags: ["futur_1", "instrumental", "subordinate_dok"],
  },
  "48:3:2": {
    prompt: 'Translate: "Tall green palms grow along the sunlit Opatija coast."',
    correct: "Visoke zelene palme rastu duž sunčane opatijske obale.",
    distractors: [
      "Visoke zelene palme su rasle u starom parku.",
      "Mirisne kamelije cvjetaju uz kamenu fontanu u gradu.",
      "Tihi valovi polako dolaze prema kamenoj šetnici.",
    ],
    grammarTags: ["genitive"],
  },
  "48:4:3": {
    prompt: 'Translate: "I would like to walk along the Opatija promenade."',
    correct: "Želio bih šetati opatijskom šetnicom uz more.",
    distractors: [
      "Šetao sam opatijskom šetnicom uz more.",
      "Šetat ću opatijskom šetnicom sutra navečer.",
      "Želio bih popiti kavu na sunčanoj terasi.",
    ],
    grammarTags: ["conditional", "instrumental"],
  },
  "49:2:1": {
    prompt: 'Translate: "We read about the stone tablet that preserves Glagolitic script."',
    correct: "Čitali smo o kamenoj ploči koja čuva glagoljicu.",
    distractors: [
      "Čitamo o kamenoj ploči koja čuva glagoljicu.",
      "Čitat ćemo o starom pismu u našoj školi.",
      "Vidjeli smo kamenu ploču kada smo posjetili Krk.",
    ],
    grammarTags: ["perfekt", "locative", "subordinate_koji"],
  },
  "49:3:4": {
    prompt: 'Translate: "In autumn families pick olives on the sunny island of Krk."',
    correct: "U jesen obitelji beru zrele masline na sunčanom otoku Krku.",
    distractors: [
      "Prošle jeseni obitelji su brale masline na otoku Krku.",
      "U jesen obitelji beru zrele masline na sunčani otok Krk.",
      "Sutra ćemo prijeći veliki Krčki most prema gradu.",
    ],
    grammarTags: ["locative"],
  },
  "50:2:1": {
    prompt: 'Translate: "Children wore colorful masks because it was carnival."',
    correct: "Djeca su nosila šarene maske jer je bio karneval.",
    distractors: [
      "Djeca nose šarene maske jer je karneval.",
      "Djeca će nositi šarene maske na velikoj povorci.",
      "Djeca su gledala zvončare koji su prolazili Korzom.",
    ],
    grammarTags: ["perfekt", "subordinate_jer"],
  },
  "50:3:2": {
    prompt: 'Translate: "The whole city celebrates joyfully while musicians play on Korzo."',
    correct: "Cijeli grad veselo slavi dok glazbenici sviraju na Korzu.",
    distractors: [
      "Cijeli grad je slavio dok su glazbenici svirali na Korzu.",
      "Cijeli grad će slaviti kada počne velika povorka.",
      "Šareni konfeti polako padaju po glavnoj ulici grada.",
    ],
    grammarTags: ["locative", "subordinate_dok"],
  },
  "50:4:2": {
    prompt: 'Translate: "We would gladly join the cheerful parade on Korzo."',
    correct: "Rado bismo se pridružili veseloj povorci na Korzu.",
    distractors: [
      "Pridružili smo se veseloj povorci na Korzu.",
      "Pridružit ćemo se veseloj povorci iduće zime.",
      "Rado bismo slušali glasne zvončare na trgu.",
    ],
    grammarTags: ["conditional", "dative", "locative"],
  },

  // === WORLD 11 (Varaždin & Međimurje — Baroque Culture & Northern Rivers) ===
  "51:2:1": {
    prompt: 'Translate: "The musician played a baroque violin in the hall."',
    correct: "Glazbenik je svirao baroknu violinu u staroj dvorani.",
    distractors: [
      "Glazbenik svira baroknu violinu u staroj dvorani.",
      "Glazbenik će svirati baroknu violinu večeras.",
      "Glazbenik je čitao stare note prije koncerta.",
    ],
    grammarTags: ["perfekt", "locative"],
  },
  "51:4:3": {
    prompt: 'Translate: "We will listen to baroque music in Varaždin."',
    correct: "Slušat ćemo baroknu glazbu u Varaždinu.",
    distractors: [
      "Slušali smo baroknu glazbu u Varaždinu.",
      "Slušat ćemo baroknu glazbu u Varaždin.",
      "Slušamo baroknu glazbu u staroj dvorani.",
    ],
    grammarTags: ["futur_1", "locative"],
  },
  "52:2:1": {
    prompt: 'Translate: "We opened a colorful umbrella when the rain started."',
    correct: "Otvorili smo šareni kišobran kada je počela kiša.",
    distractors: [
      "Otvaramo šareni kišobran kada počne kiša.",
      "Otvorit ćemo šareni kišobran ako padne kiša.",
      "Gledali smo šarene kišobrane iznad uske ulice.",
    ],
    grammarTags: ["perfekt", "subordinate_kada"],
  },
  "53:2:1": {
    prompt: 'Translate: "A little golden angel watches over the quiet square."',
    correct: "Mali zlatni anđeo tiho bdije nad starim trgom.",
    distractors: [
      "Mali zlatni anđeo je spavao na starom prozoru.",
      "Mali zlatni anđeo će krasiti novi zid grada.",
      "Veliki sat na tornju otkucava točno podne.",
    ],
    grammarTags: ["instrumental"],
  },
  "53:4:3": {
    prompt: 'Translate: "We stayed in the old town while the bells rang."',
    correct: "Ostali smo u starom gradu dok su zvona zvonila.",
    distractors: [
      "Ostajemo u starom gradu dok zvona zvone.",
      "Ostali smo u stari grad dok je padala kiša.",
      "Ostat ćemo u starom gradu do večeri.",
    ],
    grammarTags: ["perfekt", "locative", "subordinate_dok"],
  },
  "54:2:1": {
    prompt: 'Translate: "I would like to watch the white swan on the Drava."',
    correct: "Volio bih promatrati bijelog labuda na rijeci Dravi.",
    distractors: [
      "Promatrao sam bijelog labuda na rijeci Dravi.",
      "Promatrat ću bijelog labuda sutra ujutro.",
      "Volio bih prijeći rijeku Muru drvenom splavi.",
    ],
    grammarTags: ["conditional", "locative"],
  },
  "55:2:1": {
    prompt: 'Translate: "Next autumn we will pick sweet grapes in the green vineyard."',
    correct: "Iduće jeseni brat ćemo slatko grožđe u zelenom vinogradu.",
    distractors: [
      "Prošle jeseni brali smo slatko grožđe u zelenom vinogradu.",
      "Iduće jeseni brat ćemo slatko grožđe u zeleni vinograd.",
      "Danas beremo zrelo grožđe na sunčanim bregima.",
    ],
    grammarTags: ["futur_1", "genitive", "locative"],
  },
  "55:4:3": {
    prompt: 'Translate: "We would gladly visit the vineyards of Međimurje."',
    correct: "Rado bismo posjetili vinograde u Međimurju.",
    distractors: [
      "Jučer smo posjetili vinograde u Međimurju.",
      "Sutra ćemo posjetiti vinograde u Međimurju.",
      "Rado bismo slušali tradicionalnu međimursku popevku.",
    ],
    grammarTags: ["conditional", "locative"],
  },

  // === WORLD 12 (Velebit, Paklenica & Gacka — Capstone Early B1) ===
  "56:2:1": {
    prompt: 'Translate: "We reached the high peak where the Adriatic shines."',
    correct: "Stigli smo na visoki vrh odakle se vidi Jadran.",
    distractors: [
      "Stižemo na visoki vrh odakle se vidi Jadran.",
      "Stigli smo na visokom vrhu prije zalaska sunca.",
      "Stići ćemo na visoki vrh ako hodamo polako.",
    ],
    grammarTags: ["perfekt", "accusative_motion", "subordinate_koji"],
  },
  "56:4:3": {
    prompt: 'Translate: "Next summer we will hike along Velebit."',
    correct: "Sljedećeg ljeta planinarit ćemo po Velebitu.",
    distractors: [
      "Prošlog ljeta planinarili smo po Velebitu.",
      "Sljedećeg ljeta planinarit ćemo u gradu.",
      "Danas planinarimo prema visokom vrhu.",
    ],
    grammarTags: ["futur_1", "genitive", "locative"],
  },
  "57:2:1": {
    prompt: 'Translate: "The brave climber checked his rope before ascending."',
    correct: "Hrabri penjač je provjerio čvrsto uže prije uspona.",
    distractors: [
      "Hrabri penjač provjerava čvrsto uže prije uspona.",
      "Hrabri penjač će se popeti uz strmu liticu.",
      "Hrabri penjač je istražio hladnu špilju u kanjonu.",
    ],
    grammarTags: ["perfekt", "genitive"],
  },
  "58:2:1": {
    prompt: 'Translate: "We would love to see the little bear cub in Kuterevo."',
    correct: "Rado bismo vidjeli malog medvjedića u utočištu Kuterevo.",
    distractors: [
      "Vidjeli smo malog medvjedića u utočištu Kuterevo.",
      "Vidjet ćemo malog medvjedića kada dođemo u Liku.",
      "Rado bismo šetali tihom bukovom šumom na Velebitu.",
    ],
    grammarTags: ["conditional", "locative"],
  },
  "58:4:3": {
    prompt: 'Translate: "We walked quietly because we protected the peace of the forest."',
    correct: "Hodali smo tiho jer smo čuvali mir šume.",
    distractors: [
      "Hodamo tiho jer čuvamo mir šume.",
      "Hodat ćemo tiho kroz gustu bukovu šumu.",
      "Stajali smo mirno dok je sova letjela.",
    ],
    grammarTags: ["perfekt", "subordinate_jer"],
  },
  "59:2:1": {
    prompt: 'Translate: "Cold water flows from the clear spring that feeds Gacka."',
    correct: "Hladna voda izvire iz bistrog vrila koje hrani Gacku.",
    distractors: [
      "Hladna voda je izvirala iz dubokog kamenog bunara.",
      "Hladna voda će teći ispod starog drvenog mostića.",
      "Brza pastrva pliva u bistroj i mirnoj rijeci.",
    ],
    grammarTags: ["genitive", "subordinate_koji"],
  },
  "59:4:3": {
    prompt: 'Translate: "I would like to see the clear spring of the Gacka River."',
    correct: "Volio bih vidjeti bistro vrilo rijeke Gacke.",
    distractors: [
      "Vidio sam bistro vrilo rijeke Gacke.",
      "Vidjet ću bistro vrilo rijeke Gacke.",
      "Volio bih prijeći mali drveni mostić.",
    ],
    grammarTags: ["conditional", "genitive"],
  },
  "60:2:1": {
    prompt: 'Translate: "We will rest in a warm wooden cabin while snow falls."',
    correct: "Odmarat ćemo se u toploj drvenoj kolibi dok pada snijeg.",
    distractors: [
      "Odmarali smo se u toploj drvenoj kolibi dok je padao snijeg.",
      "Odmaramo se u toploj drvenoj kolibi pod visokim jelama.",
      "Rado bismo kušali pečeni lički krumpir i svježi sir.",
    ],
    grammarTags: ["futur_1", "reflexive", "locative", "subordinate_dok"],
  },
};

/**
 * Generates authentic Croatian morphological minimal-pair distractors for a given
 * Croatian sentence so learners must attend to case endings, prepositions, or verb tense
 * rather than spotting 1 isolated noun.
 */
function buildMorphologicalMinimalPairs(sentence: string): string[] {
  const variants: string[] = [];
  const clean = sentence.trim();
  const hasPeriod = clean.endsWith(".");
  const hasQuestion = clean.endsWith("?");
  const punct = hasQuestion ? "?" : hasPeriod ? "." : "";
  const body = clean.replace(/[.?!]+$/, "");

  const pushUnique = (candidate: string) => {
    const trimmed = candidate.trim();
    if (
      trimmed &&
      trimmed.toLowerCase() !== clean.toLowerCase() &&
      !variants.some((v) => v.toLowerCase() === trimmed.toLowerCase())
    ) {
      variants.push(trimmed);
    }
  };

  // 1. Prepositional / case minimal-pair contrast
  const caseSwaps: [RegExp, string][] = [
    [/\bu luku\b/i, "u luci"],
    [/\bu luci\b/i, "u luku"],
    [/\bna more\b/i, "na moru"],
    [/\bna moru\b/i, "na more"],
    [/\bu dvorac\b/i, "u dvorcu"],
    [/\bu dvorcu\b/i, "u dvorac"],
    [/\bna otoku\b/i, "na otok"],
    [/\bna otok\b/i, "na otoku"],
    [/\bu gradu\b/i, "u grad"],
    [/\bu grad\b/i, "u gradu"],
    [/\bu šumi\b/i, "u šumu"],
    [/\bu šumu\b/i, "u šumi"],
    [/\bna stolu\b/i, "ispod stola"],
    [/\bispod stola\b/i, "na stolu"],
    [/\bu rijeci\b/i, "iznad rijeke"],
    [/\bna obali\b/i, "prema obali"],
    [/\bna brdu\b/i, "ispod brda"],
    [/\bna nebu\b/i, "ispod neba"],
    [/\bu parku\b/i, "kroz park"],
    [/\bu sobi\b/i, "iz sobe"],
    [/\bu školi\b/i, "ispred škole"],
    [/\bna plaži\b/i, "prema plaži"],
    [/\bu selu\b/i, "iz sela"],
    [/\bna stazi\b/i, "pored staze"],
    [/\bu jesen\b/i, "u proljeće"],
    [/\bu zimu\b/i, "u ljeto"],
    [/\bujutro\b/i, "navečer"],
    [/\bnavečer\b/i, "ujutro"],
    [/\bnoću\b/i, "danju"],
  ];

  for (const [re, replacement] of caseSwaps) {
    if (re.test(body)) {
      pushUnique(body.replace(re, replacement) + punct);
      if (variants.length >= 2) break;
    }
  }

  // 2. Verb person / tense / polarity minimal-pair contrast
  const verbSwaps: [RegExp, string][] = [
    [/\bje\b/, "nije"],
    [/\bsu\b/, "nisu"],
    [/\bsmo\b/, "su"],
    [/\bćemo\b/, "će"],
    [/\bvolim\b/i, "ne volim"],
    [/\bvidim\b/i, "ne vidim"],
    [/\bvidimo\b/i, "vidjeli smo"],
    [/\bgledamo\b/i, "gledali smo"],
    [/\bplovimo\b/i, "plovili smo"],
    [/\bšetamo\b/i, "šetali smo"],
    [/\bslušamo\b/i, "slušali smo"],
    [/\bučimo\b/i, "učili smo"],
    [/\bberemo\b/i, "brali smo"],
    [/\bprelazimo\b/i, "prešli smo"],
    [/\bčuvamo\b/i, "čuvali smo"],
    [/\bpenjemo se\b/i, "popeli smo se"],
    [/\bodmaramo se\b/i, "odmarali smo se"],
    [/\bplešemo\b/i, "plesali smo"],
    [/\bima\b/, "nema"],
    [/\bnosi\b/, "ne nosi"],
    [/\brastu\b/, "ne rastu"],
    [/\bteče\b/, "ne teče"],
    [/\bpuše\b/, "ne puše"],
    [/\bsvijetli\b/, "ne svijetli"],
    [/\bpliva\b/, "ne pliva"],
    [/\bhoda\b/, "ne hoda"],
    [/\bstoji\b/, "ne stoji"],
    [/\bsjedi\b/, "ne sjedi"],
    [/\bpjeva\b/, "ne pjeva"],
    [/\bsvira\b/, "ne svira"],
    [/\bgleda\b/, "ne gleda"],
    [/\bčuva\b/, "ne čuva"],
    [/\bdrži\b/, "ne drži"],
    [/(?<!\b(?:u|o|po)\s)\bvodi\b/, "ne vodi"],
    [/\bgrije\b/, "ne grije"],
    [/\bkrasi\b/, "ne krasi"],
    [/\bštiti\b/, "ne štiti"],
    [/\bokružuju\b/, "ne okružuju"],
    [/\bispunjava\b/, "ne ispunjava"],
  ];

  for (const [re, replacement] of verbSwaps) {
    if (re.test(body)) {
      pushUnique(body.replace(re, replacement) + punct);
      if (variants.length >= 3) break;
    }
  }

  // 3. Adjective contrast fallback (preserves 75-80% shared sentence frame = true minimal pair!)
  const adjSwaps: [RegExp, string][] = [
    [/\bvelik([aoue]|i|og|om|im)\b/i, "mal$1"],
    [/\bmal([aoue]|i|og|om|im)\b/i, "velik$1"],
    [/\bstar([aoue]|i|og|om|im)\b/i, "nov$1"],
    [/\bnov([aoue]|i|og|om|im)\b/i, "star$1"],
    [/\bvisok([aoue]|i|og|om|im)\b/i, "nisk$1"],
    [/\btopl([aoue]|i|og|om|im)\b/i, "hladn$1"],
    [/\bhladn([aoue]|i|og|om|im)\b/i, "topl$1"],
    [/\bbijel([aoue]|i|og|om|im)\b/i, "crn$1"],
    [/\bzelen([aoue]|i|og|om|im)\b/i, "plav$1"],
    [/\bplav([aoue]|i|og|om|im)\b/i, "zelen$1"],
    [/\bglasn([aoue]|i|og|om|im)\b/i, "tih$1"],
    [/\btih([aoue]|i|og|om|im)\b/i, "glasn$1"],
    [/\bdug([aoue]|i|og|om|im)\b/i, "kratk$1"],
    [/\bbrz([aoue]|i|og|om|im)\b/i, "spor$1"],
    [/\bčist([aoue]|i|og|om|im)\b/i, "mutn$1"],
    [/\bslatk([aoue]|i|og|om|im)\b/i, "kisel$1"],
  ];

  for (const [re, replacement] of adjSwaps) {
    if (re.test(body)) {
      pushUnique(body.replace(re, replacement) + punct);
      if (variants.length >= 3) break;
    }
  }

  // 4. General grammatical frame contrast (polarity / temporal modifier) for any 3+ word sentence
  const words = body.split(/\s+/);
  if (variants.length < 2 && words.length >= 3) {
    pushUnique(`Jučer ${body.charAt(0).toLowerCase()}${body.slice(1)}${punct}`);
    pushUnique(`Sutra ${body.charAt(0).toLowerCase()}${body.slice(1)}${punct}`);
  }

  return variants.slice(0, 3);
}

/**
 * Deterministic shuffle + 1-2 morphological distractor words for BUILD_SENTENCE word banks.
 */
function buildWordBank(targetSentence: string, seedNum: number): string[] {
  const words = targetSentence
    .replace(/[.?!,;:]+/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // Pick 1-2 Croatian grammatical distractors relevant to the sentence
  const distractors: string[] = [];
  const lowerWords = new Set(words.map((w) => w.toLowerCase()));
  const candidates = [
    ["u", "na"],
    ["na", "ispod"],
    ["smo", "ćemo"],
    ["ćemo", "smo"],
    ["je", "su"],
    ["su", "je"],
    ["luku", "luci"],
    ["moru", "more"],
    ["gradu", "grad"],
    ["dvorcu", "dvorac"],
    ["šumi", "šumu"],
    ["stolu", "stol"],
    ["kuli", "kulu"],
    ["rijeci", "rijeku"],
    ["otoku", "otok"],
    ["nebu", "nebo"],
  ];

  for (const [trigger, distractor] of candidates) {
    if (lowerWords.has(trigger) && !lowerWords.has(distractor)) {
      distractors.push(distractor);
      if (distractors.length >= 2) break;
    }
  }
  if (distractors.length === 0) {
    const fallbackPool = ["nije", "ovdje", "tamo", "uvijek", "sutra"];
    for (const fb of fallbackPool) {
      if (!lowerWords.has(fb)) {
        distractors.push(fb);
        break;
      }
    }
  }

  const combined = [...words, ...distractors];
  // Deterministic Fisher-Yates shuffle
  let s = seedNum * 9301 + 49297;
  for (let i = combined.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

function elevateCurriculum() {
  console.log("=== 🚀 CROLINGO v2 PHASE 3: ELEVATING WORLDS 1–12 YAML ===\n");

  const worldsDir = path.join(process.cwd(), "curriculum", "worlds");
  const audioDir = path.join(process.cwd(), "public", "audio", "hr");
  const files = fs
    .readdirSync(worldsDir)
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  const missingAudio: Record<string, string> = {};
  const ensureAudio = (text: string, existingAudioSrc?: string | null): string => {
    if (existingAudioSrc) {
      const fullExisting = path.join(process.cwd(), "public", existingAudioSrc.replace(/^\//, ""));
      if (fs.existsSync(fullExisting) && fs.statSync(fullExisting).size > 0) {
        return existingAudioSrc;
      }
    }
    const slug = toAudioSlug(text);
    const rel = `/audio/hr/${slug}.mp3`;
    const full = path.join(audioDir, `${slug}.mp3`);
    if (!fs.existsSync(full) || fs.statSync(full).size === 0) {
      missingAudio[slug] = text;
    }
    return rel;
  };

  let upgradedSentences = 0;
  let upgradedMinPairs = 0;
  let upgradedListen = 0;
  let upgradedBuild = 0;

  for (const file of files) {
    const filePath = path.join(worldsDir, file);
    const world = WorldYamlSchema.parse(
      YAML.parse(fs.readFileSync(filePath, "utf-8"))
    );

    for (const unit of world.units) {
      for (const lesson of unit.lessons) {
        let listenConvertedInLesson = 0;
        let buildConvertedInLesson = 0;

        lesson.challenges = lesson.challenges.map((ch) => {
          const coordKey = `${unit.order}:${lesson.order}:${ch.order}`;

          // 1. CR-095: Unit 13 Spatial Prepositions Visual Diagrams
          if (unit.order === 13 && lesson.order === 2 && (ch.type === "SELECT" || ch.type === "ASSIST")) {
            const spatialSvgMap: Record<string, string> = {
              u: "/spatial_u.svg",
              na: "/spatial_na.svg",
              ispod: "/spatial_ispod.svg",
              blizu: "/spatial_blizu.svg",
            };
            const updatedOpts = ch.options.map((o) => {
              const key = o.text.trim().toLowerCase();
              return {
                ...o,
                imageSrc: spatialSvgMap[key] || o.imageSrc,
                audioSrc: ensureAudio(o.text, o.audioSrc),
              };
            });
            return {
              ...ch,
              type: "SELECT" as const,
              options: updatedOpts,
            };
          }

          // 2. CR-096: Curated Croatian Sentence Elevations (W7-W8 dip + W9-W12 tenses/conditionals/clauses)
          const curated = CURATED_SENTENCE_UPGRADES[coordKey];
          if (curated && (ch.type === "ASSIST" || ch.type === "SELECT")) {
            upgradedSentences++;
            const newOpts = [
              {
                text: curated.correct,
                correct: true,
                audioSrc: ensureAudio(curated.correct),
              },
              ...curated.distractors.map((d) => ({
                text: d,
                correct: false,
                audioSrc: ensureAudio(d),
              })),
            ];
            return {
              ...ch,
              type: "ASSIST" as const,
              prompt: curated.prompt,
              grammarTags: curated.grammarTags,
              options: newOpts,
            };
          }

          // 3. CR-098a: Inject Tier 3 LISTEN into Lesson 2 (Worlds 2–12, up to 2 per unit)
          if (
            world.worldOrder >= 2 &&
            lesson.order === 2 &&
            listenConvertedInLesson < 2 &&
            (ch.type === "ASSIST" || ch.type === "SELECT")
          ) {
            const correctOpt = ch.options.find((o) => o.correct);
            if (correctOpt) {
              listenConvertedInLesson++;
              upgradedListen++;
              const audioSrc = ensureAudio(correctOpt.text, correctOpt.audioSrc);
              return {
                order: ch.order,
                legacyId: ch.legacyId,
                type: "LISTEN" as const,
                prompt: "Tap what you hear",
                audioSrc,
                grammarTags: ch.grammarTags,
                options: ch.options.map((o) => ({
                  text: o.text,
                  correct: o.correct,
                  audioSrc: ensureAudio(o.text, o.audioSrc),
                })),
              };
            }
          }

          // 4. CR-098b: Inject Tier 5 BUILD_SENTENCE into L3 & L4 (Worlds 4–12, 1 per L3 and 1 per L4)
          if (
            world.worldOrder >= 4 &&
            (lesson.order === 3 || lesson.order === 4) &&
            buildConvertedInLesson < 1 &&
            ch.type === "ASSIST"
          ) {
            const correctOpt = ch.options.find((o) => o.correct);
            const wordCount = correctOpt ? correctOpt.text.trim().split(/\s+/).length : 0;
            if (correctOpt && wordCount >= 3 && !correctOpt.text.includes("Čestitamo")) {
              buildConvertedInLesson++;
              upgradedBuild++;
              const audioSrc = ensureAudio(correctOpt.text, correctOpt.audioSrc);
              return {
                order: ch.order,
                legacyId: ch.legacyId,
                type: "BUILD_SENTENCE" as const,
                prompt: ch.prompt,
                targetSentence: correctOpt.text,
                acceptedAnswers: [correctOpt.text.replace(/[.?!]+$/, "")],
                wordBank: buildWordBank(correctOpt.text, unit.order * 100 + lesson.order * 10 + ch.order),
                audioSrc,
                grammarTags: ch.grammarTags,
              };
            }
          }

          // 5. CR-097: Upgrade remaining L3-L4 ASSIST challenges in Worlds 5–12 to Morphological Minimal Pairs
          if (
            world.worldOrder >= 5 &&
            (lesson.order === 3 || lesson.order === 4) &&
            ch.type === "ASSIST"
          ) {
            const correctOpt = ch.options.find((o) => o.correct);
            if (correctOpt && !correctOpt.text.includes("Čestitamo")) {
              const mpDistractors = buildMorphologicalMinimalPairs(correctOpt.text);
              if (mpDistractors.length >= 2) {
                upgradedMinPairs++;
                // Keep 2 authentic minimal pairs + 1 original distractor for 4 balanced options
                const origOther = ch.options.find(
                  (o) =>
                    !o.correct &&
                    !mpDistractors.some((d) => d.toLowerCase() === o.text.toLowerCase())
                );
                const finalDistractors = origOther
                  ? [...mpDistractors.slice(0, 2), origOther.text]
                  : mpDistractors.slice(0, 3);

                const newOpts = [
                  {
                    text: correctOpt.text,
                    correct: true,
                    audioSrc: ensureAudio(correctOpt.text, correctOpt.audioSrc),
                  },
                  ...finalDistractors.map((d) => {
                    const existing = ch.options.find((o) => o.text === d);
                    return {
                      text: d,
                      correct: false,
                      audioSrc: ensureAudio(d, existing?.audioSrc),
                    };
                  }),
                ];
                return {
                  ...ch,
                  options: newOpts,
                };
              }
            }
          }

          return ch;
        });
      }
    }

    // Validate with Zod before saving back to YAML
    WorldYamlSchema.parse(world);
    fs.writeFileSync(filePath, YAML.stringify(world, { lineWidth: 120 }), "utf-8");
    console.log(`  ✓ Elevated ${file}`);
  }

  const manifestPath = path.join(process.cwd(), "scripts", "v2", "v2-missing-audio.json");
  fs.writeFileSync(manifestPath, JSON.stringify(missingAudio, null, 2), "utf-8");

  console.log(`\nSummary of v2 Elevations:`);
  console.log(`  - Curated W7-W12 sentences elevated: ${upgradedSentences}`);
  console.log(`  - Morphological minimal-pair ASSIST upgrades (W5-W12): ${upgradedMinPairs}`);
  console.log(`  - Tier 3 LISTEN challenges added (W2-W12): ${upgradedListen}`);
  console.log(`  - Tier 5 BUILD_SENTENCE challenges added (W4-W12): ${upgradedBuild}`);
  console.log(`  - New Croatian neural .mp3 clips queued: ${Object.keys(missingAudio).length}`);
}

elevateCurriculum();
