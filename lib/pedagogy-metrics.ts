import { ALL_STAGES, getStageThemeForUnit } from "./theme-registry";

export interface AuditUnitRow {
  id: number;
  order: number;
  title: string;
  description: string;
}

export interface AuditLessonRow {
  id: number;
  unitId: number;
  order: number;
  title: string;
}

export interface AuditChallengeRow {
  id: number;
  lessonId: number;
  unitOrder: number;
  lessonOrder: number;
  order: number;
  type: string;
  question: string;
}

export interface AuditOptionRow {
  id: number;
  challengeId: number;
  text: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

export interface AuditProgressAggRow {
  challengeId: number;
  completions: number;
  uniqueUsers: number;
}

export interface AuditMistakeAggRow {
  challengeId: number;
  mistakeCount: number;
  uniqueUsers: number;
}

export interface AuditUnitReachRow {
  unitOrder: number;
  uniqueUsers: number;
}

export interface AuditFunnelRow {
  maxUnitOrder: number;
  learnerCount: number;
}

export interface AuditTelemetryOverview {
  totalLearners: number;
  activeLearnersWithProgress: number;
  activeLearnersWithMistakes: number;
  totalCompletedChallenges: number;
  totalMistakes: number;
  unitReach: AuditUnitReachRow[];
  funnelByMaxUnit: AuditFunnelRow[];
}

export interface GrammarFeatureFlags {
  presentSingular: boolean;
  presentPlural: boolean;
  reflexiveSe: boolean;
  pastPerfekt: boolean;
  futureFuturI: boolean;
  imperative: boolean;
  conditional: boolean;
  caseAccusative: boolean;
  caseLocative: boolean;
  caseGenitive: boolean;
  caseInstrumental: boolean;
  caseDative: boolean;
  caseVocative: boolean;
  prepositionalPhrase: boolean;
  subordinateOrCompound: boolean;
  syntaxTier: 1 | 2 | 3 | 4 | 5;
}

export interface ChallengeMetrics {
  challengeId: number;
  unitOrder: number;
  worldStage: number;
  lessonOrder: number;
  challengeOrder: number;
  type: string;
  question: string;
  correctText: string;
  distractorTexts: string[];
  hasImages: boolean;
  wordCount: number;
  contentTokens: string[];
  contentStems: string[];
  priorWorldStemHits: number;
  priorUnitStemHits: number;
  priorUnitInWorldStemHits: number;
  avgTokenOverlap: number;
  avgCharSimilarity: number;
  wordCountParity: number;
  isMinimalPair: boolean;
  distractorHardness: number;
  grammar: GrammarFeatureFlags;
  completions: number;
  mistakes: number;
  mistakeRatePct: number | null;
}

export interface GrammarCounts {
  presentSingular: number;
  presentPlural: number;
  reflexiveSe: number;
  pastPerfekt: number;
  futureFuturI: number;
  imperative: number;
  conditional: number;
  caseAccusative: number;
  caseLocative: number;
  caseGenitive: number;
  caseInstrumental: number;
  caseDative: number;
  caseVocative: number;
  prepositionalPhrase: number;
  subordinateOrCompound: number;
  avgSyntaxTier: number;
}

export interface UnitMetrics {
  unitOrder: number;
  worldStage: number;
  worldName: string;
  title: string;
  description: string;
  challengeCount: number;
  selectCount: number;
  assistCount: number;
  selectPct: number;
  assistPct: number;
  avgWordsAll: number;
  avgWordsL1: number;
  avgWordsL2: number;
  avgWordsL3: number;
  avgWordsL4: number;
  avgWordsL3L4: number;
  maxWords: number;
  uniqueContentTokens: number;
  uniqueContentStems: number;
  netNewStems: number;
  abstractVocabRatio: number;
  backwardWorldSpiralPct: number | null;
  backwardUnitSpiralPct: number | null;
  sentenceRecyclingRatePct: number | null;
  avgDistractorHardness: number;
  minimalPairPct: number;
  wordCountParityPct: number;
  grammar: GrammarCounts;
  actualDifficultyIndex: number;
  idealDifficultyIndex: number;
  difficultyDelta: number;
  completions: number;
  mistakes: number;
  mistakeRatePct: number | null;
  uniqueLearnersReached: number;
}

export interface WorldRubricScores {
  sentenceScaling: number;
  grammarProgression: number;
  spiralReinforcement: number;
  distractorRigor: number;
  mechanicDiversity: number;
  compositeScore: number;
}

export interface WorldMetrics {
  stage: number;
  id: string;
  name: string;
  badgeLabel: string;
  unitRange: [number, number];
  level: 1 | 2 | 3;
  challengeCount: number;
  selectCount: number;
  assistCount: number;
  selectPct: number;
  assistPct: number;
  avgWordsAll: number;
  avgWordsL1: number;
  avgWordsL2: number;
  avgWordsL3: number;
  avgWordsL4: number;
  avgWordsL3L4: number;
  maxWords: number;
  uniqueContentStems: number;
  introducedStemsCount: number;
  forwardRetentionPct: number | null;
  backwardSpiralTokenPct: number | null;
  backwardSpiralChallengePct: number | null;
  withinWorldCrossUnitSpiralPct: number;
  siloedUnitCount: number;
  abstractVocabRatio: number;
  avgDistractorHardness: number;
  minimalPairPct: number;
  wordCountParityPct: number;
  grammar: GrammarCounts;
  estimatedCefr: string;
  targetCefr: string;
  actualDifficultyIndex: number;
  idealDifficultyIndex: number;
  difficultyDelta: number;
  rubric: WorldRubricScores;
  completions: number;
  mistakes: number;
  mistakeRatePct: number | null;
  maxLearnersReachedInWorld: number;
}

export interface MechanicLadderRow {
  tier: number;
  mechanic: string;
  code: string;
  cognitiveLevel: string;
  implemented: boolean;
  challengeCount: number;
  sharePct: number;
}

export interface HardestChallengeSummary {
  challengeId: number;
  unitOrder: number;
  worldStage: number;
  lessonOrder: number;
  challengeOrder: number;
  type: string;
  question: string;
  correctText: string;
  completions: number;
  mistakes: number;
  mistakeRatePct: number;
}

export interface PedagogyAuditReport {
  generatedAt: string;
  totals: {
    worlds: number;
    units: number;
    lessons: number;
    challenges: number;
    options: number;
    selectChallenges: number;
    assistChallenges: number;
    totalUniqueStems: number;
    overallAvgWords: number;
    overallAvgWordsL3L4: number;
    overallForwardRetentionPct: number;
    overallBackwardSpiralChallengePct: number;
    overallDistractorHardness: number;
    overallMinimalPairPct: number;
    overallCompositeRubric: number;
  };
  worlds: WorldMetrics[];
  units: UnitMetrics[];
  mechanicLadder: MechanicLadderRow[];
  telemetry: {
    overview: AuditTelemetryOverview;
    worldReachFunnel: { stage: number; name: string; learnersReached: number }[];
    hardestChallenges: HardestChallengeSummary[];
    easiestLateChallengesCount: number;
    earlyDifficultySpikes: HardestChallengeSummary[];
  };
  flags: {
    complexityDips: { stage: number; name: string; avgWordsAll: number; prevAvgWordsAll: number; delta: number }[];
    siloedWorlds: { stage: number; name: string; backwardSpiralChallengePct: number }[];
    lowMinimalPairWorlds: { stage: number; name: string; minimalPairPct: number }[];
    missingGrammarMilestones: { stage: number; name: string; missing: string[] }[];
  };
}

// ============================================================================
// Croatian Lexical & Linguistic Utilities
// ============================================================================

export const CROATIAN_STOPWORDS = new Set([
  "i", "u", "na", "je", "su", "se", "s", "sa", "od", "do", "za", "po", "iz", "o",
  "a", "ali", "da", "ne", "li", "te", "to", "ta", "taj", "ovo", "ovaj", "ova", "ove",
  "ja", "ti", "on", "ona", "ono", "mi", "vi", "oni", "one", "sam", "si", "smo", "ste",
  "ću", "ćeš", "će", "ćemo", "ćete", "bi", "bih", "bismo", "biste", "kao", "kod",
  "kroz", "uz", "niz", "pred", "pod", "nad", "oko", "duž", "kraj", "pokraj", "pored",
  "prema", "pri", "bez", "ili", "jer", "dok", "kad", "kada", "ako", "koji", "koja",
  "koje", "kojeg", "kojoj", "kojima", "što", "tko", "gdje", "kako", "kamo", "kuda",
  "puno", "malo", "vrlo", "jako", "već", "još", "sve", "svi", "svoj", "svoja", "svoje",
  "moj", "moja", "moje", "tvoj", "tvoja", "tvoje", "naš", "naša", "naše", "vaš", "vaša",
  "njegov", "njezin", "njihov", "ovdje", "tamo", "sada", "uvijek", "nikad", "često",
  "nisam", "nisi", "nije", "nismo", "niste", "nisu", "neću", "neće", "nećemo",
  "ovog", "ovom", "toga", "tom", "k", "ka", "pa", "ni", "niti", "nego",
]);

const ABSTRACT_CONCEPT_CUES = new Set([
  // Croatian stems / words representing abstract, temporal, emotional, cultural, scientific concepts
  "dan", "tjedan", "vikend", "ponedjelj", "utor", "srijed", "četvrt", "petak", "petk", "subot", "nedjelj",
  "vrijem", "jutr", "večer", "noć", "jučer", "danas", "sutra", "budućn", "prošl", "povijest",
  "legend", "prič", "tajna", "tajn", "snag", "moć", "energij", "struj", "svjetl", "izum",
  "znanj", "idej", "mis", "snov", "želj", "ljubav", "sreć", "radost", "veselj",
  "strah", "mir", "tišin", "buka", "glazb", "melodij", "ritam", "pjesm", "ples",
  "tradicij", "baštin", "kultur", "slobod", "pobjed", "natjecan", "pravil", "izazov",
  "pustolov", "avantur", "putovan", "smjer", "lijev", "desn", "ravn", "blizu", "dalek",
  "hrabr", "mudr", "pamet",
  "sret", "tuž", "umorn", "glad", "žed",
  "zdravlj", "prijatelj", "obitelj", "rođend", "proslav", "čestit", "hval", "molim",
  "oprost", "pozdrav", "dobrodoš", "svemir", "galaksij", "planet", "orbit", "gravitacij",
  "prirod", "zaštit", "tiš", "karneval", "svečan", "barok", "umjetn", "kazališt",
  "predstav", "ulog", "publik", "aplaud", "uspjeh", "čudo", "čarolij", "magij",
]);

const ABSTRACT_ENGLISH_CUES = [
  /\b(future|past|history|legend|invention|electricity|power|energy|light|spark|idea|knowledge|dream|peace|silence|music|melody|tradition|heritage|victory|adventure|journey|direction|left|right|straight|week|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|evening|night|today|tomorrow|yesterday|happy|sad|brave|fast|slow|celebration|birthday|holiday|carnival|concert|theater|stage|nature|freedom|memory|magic|wonder|science|time|hour|minute|season|summer|winter|spring|autumn)\b/i,
];

export function stripPunctuation(text: string): string {
  return text
    .replace(/[.,!?;:"'„“”()\[\]–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeCroatian(text: string): string[] {
  const cleaned = stripPunctuation(text).toLowerCase();
  if (!cleaned) return [];
  return cleaned.split(" ").filter((t) => t.length > 0);
}

/**
 * Conservative Croatian inflectional stemmer for spiral-repetition matching.
 * Strips common noun/adjective/verb case & conjugation suffixes while preserving
 * at least a 3-character root so unrelated short words are never conflated.
 */
export function croatianStem(token: string): string {
  const w = token.toLowerCase().trim();
  if (w.length <= 3) return w;

  // Common irregular/high-frequency mappings
  const irregulars: Record<string, string> = {
    dvorca: "dvorac",
    dvorcu: "dvorac",
    dvorcem: "dvorac",
    dvorci: "dvorac",
    dvoraca: "dvorac",
    pas: "pas",
    psa: "pas",
    psu: "pas",
    psom: "pas",
    psi: "pas",
    ptice: "ptic",
    ptica: "ptic",
    pticu: "ptic",
    ptici: "ptic",
    vode: "vod",
    voda: "vod",
    vodu: "vod",
    vodi: "vod",
    vodom: "vod",
    mora: "mor",
    more: "mor",
    moru: "mor",
    morem: "mor",
    kruha: "kruh",
    kruhu: "kruh",
    kruhom: "kruh",
    sunca: "sunc",
    sunce: "sunc",
    suncu: "sunc",
    konja: "konj",
    konju: "konj",
    konjem: "konj",
    konji: "konj",
    viteza: "vitez",
    vitezu: "vitez",
    vitezovi: "vitez",
    vitezova: "vitez",
    dječaka: "dječak",
    dječaci: "dječak",
    djevojčice: "djevojčic",
    djevojčica: "djevojčic",
    učenici: "učenik",
    učenika: "učenik",
    prijatelji: "prijatelj",
    prijatelja: "prijatelj",
    prijateljima: "prijatelj",
    zvijezde: "zvijezd",
    zvijezda: "zvijezd",
    zvijezdu: "zvijezd",
    planine: "planin",
    planina: "planin",
    planini: "planin",
    planinu: "planin",
    rijeke: "rijek",
    rijeka: "rijek",
    rijeci: "rijek",
    rijeku: "rijek",
    luke: "luk",
    luka: "luk",
    luci: "luk",
    luku: "luk",
    stijene: "stijen",
    stijena: "stijen",
    stijenama: "stijen",
    šume: "šum",
    šuma: "šum",
    šumi: "šum",
    šumu: "šum",
    kuće: "kuć",
    kuća: "kuć",
    kući: "kuć",
    kuću: "kuć",
    škole: "škol",
    škola: "škol",
    školi: "škol",
    školu: "škol",
    staze: "staz",
    staza: "staz",
    stazi: "staz",
    stazu: "staz",
    stazom: "staz",
    išao: "id",
    išla: "id",
    išli: "id",
    idem: "id",
    ideš: "id",
    ide: "id",
    idemo: "id",
    idu: "id",
    bio: "bi",
    bila: "bi",
    bilo: "bi",
    bili: "bi",
    bile: "bi",
    // Common Croatian palatalization / fleeting-a / suppletive alternations
    otok: "otok",
    otoka: "otok",
    otoku: "otok",
    otoci: "otok",
    otocima: "otok",
    knjiga: "knjig",
    knjige: "knjig",
    knjigu: "knjig",
    knjizi: "knjig",
    ruka: "ruk",
    ruke: "ruk",
    ruku: "ruk",
    ruci: "ruk",
    rukom: "ruk",
    noga: "nog",
    noge: "nog",
    nogu: "nog",
    nozi: "nog",
    nogom: "nog",
    slika: "slik",
    slike: "slik",
    sliku: "slik",
    slici: "slik",
    vuk: "vuk",
    vuka: "vuk",
    vuci: "vuk",
    vukovi: "vuk",
    oblak: "oblak",
    oblaka: "oblak",
    oblaci: "oblak",
    oblacima: "oblak",
    putnik: "putnik",
    putnika: "putnik",
    putnici: "putnik",
    putnicima: "putnik",
    junak: "junak",
    junaka: "junak",
    junaci: "junak",
    praznik: "praznik",
    praznici: "praznik",
    pjesnik: "pjesnik",
    pjesnici: "pjesnik",
    korak: "korak",
    koraci: "korak",
    san: "san",
    sna: "san",
    snovi: "san",
    snova: "san",
    snovima: "san",
    drvo: "drv",
    drva: "drv",
    drveće: "drv",
    cvijet: "cvijet",
    cvijeta: "cvijet",
    cvijeće: "cvijet",
    dijete: "dijet",
    djeteta: "dijet",
    djeca: "dijet",
    djeci: "dijet",
    djece: "dijet",
  };
  if (irregulars[w]) return irregulars[w];

  const suffixes = [
    "ovima", "evima", "ijama", "inama", "anjima",
    "ima", "ama", "ovi", "evi", "ova", "eva", "aju", "uju", "imo", "emo", "amo",
    "ite", "ete", "ate", "ati", "iti", "eti", "jem", "ješ", "je",
    "om", "em", "og", "eg", "oj", "ih", "im", "an", "en", "in", "la", "lo", "li", "le", "ao",
    "a", "e", "i", "o", "u",
  ];

  for (const suf of suffixes) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      return w.slice(0, w.length - suf.length);
    }
  }
  return w;
}

export function extractContentTokens(text: string): string[] {
  return tokenizeCroatian(text).filter((t) => !CROATIAN_STOPWORDS.has(t) && t.length > 1);
}

export function extractContentStems(text: string): string[] {
  return extractContentTokens(text).map(croatianStem);
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function normalizedCharSimilarity(a: string, b: string): number {
  const na = stripPunctuation(a).toLowerCase();
  const nb = stripPunctuation(b).toLowerCase();
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(na, nb) / maxLen;
}

export function tokenJaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenizeCroatian(a));
  const setB = new Set(tokenizeCroatian(b));
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const t of Array.from(setA)) {
    if (setB.has(t)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function isAbstractConcept(croatianText: string, englishQuestion: string): boolean {
  const tokens = tokenizeCroatian(croatianText);
  for (const t of tokens) {
    const stem = croatianStem(t);
    for (const cue of Array.from(ABSTRACT_CONCEPT_CUES)) {
      if (t.startsWith(cue) || stem.startsWith(cue)) {
        return true;
      }
    }
  }
  for (const re of ABSTRACT_ENGLISH_CUES) {
    if (re.test(englishQuestion)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// Pillar 2: Croatian Grammar & Syntax Classifier (Unicode Diacritic-Safe)
// ============================================================================

const HR_CHAR = "a-zA-ZčćšžđČĆŠŽĐ";
const WB_START = `(?:^|[^${HR_CHAR}])`;
const WB_END = `(?=$|[^${HR_CHAR}])`;

function hrRe(pattern: string): RegExp {
  return new RegExp(`${WB_START}(?:${pattern})${WB_END}`, "i");
}

// Directional feminine singular nouns after u/na take ACCUSATIVE of motion, not Locative
const ACC_DIRECTION_FEM_NOUNS =
  "školu|plažu|luku|dvoranu|šumu|sobu|kuću|sridu|metu|alku|rijeku|planinu|crkvu|tržnicu|pekaru|kuhinju|katedralu|ulicu|dolinu|stazu|obalu|galeriju|arenu|tvrđavu|utvrdu|spilju|kolibu|šetnicu";
const ACC_MOTION_PREP_RE = hrRe(
  `(?:u|na)\\s+(?:[${HR_CHAR}]+\\s+)?(?:${ACC_DIRECTION_FEM_NOUNS})|(?:idem|ideš|ide|idemo|idu|išao|išla|išli|ulazi|ulaze|skačem|skače|usmjerava|putovat|putujemo|pogodak)\\s+(?:[${HR_CHAR}]+\\s+){0,2}(?:u|na)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+`
);
const ACC_ALWAYS_PREP_RE = hrRe(`(?:kroz|za)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+`);

const LOCATIVE_PREP_STATIC_RE = hrRe(
  `(?:u|na|o|po|pri)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+(?:i|u|oj|em|om|ima|ama)`
);
const GENITIVE_PREP_RE = hrRe(
  `(?:od|do|iz|bez|kod|kraj|pokraj|pored|duž|oko|blizu|ispred|iza|ispod|iznad|usred|nakon|puno|malo|čaša|čašu|kuglica|kuglicu|komad|šalica|šalicu|boca|bocu|tanjur)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+|(?:je|su)\\s+(?:pun|puna|puno)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+`
);
const INSTRUMENTAL_PREP_RE = hrRe(
  `(?:s|sa|pod|nad|pred|među)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+(?:om|em|ima|ama)`
);
const INSTRUMENTAL_BARE_RE = hrRe(
  `[${HR_CHAR}]*(?:stazom|brodom|vlakom|autom|čamcem|morem|rijekom|šumom|ulicom|cestom|mostom|zrakom|nebom|snijegom|vodom|vatrom|rukom|nogom|očima|srcem|pjesmom|glazbom|osmijehom|ponosom|radošću|ljubavlju|snagom|poljem|ključem|kvarnerom|korzom|kazalištem|parkom|crijepom|baštinom|dunavom|dravom|murom|cetinom|gackom|tradicijom|ljepotom|tamburom|violinom|klavirom|kopljem|mačem|štitom|užetom)`
);
const INSTRUMENTAL_BARE_PLURAL_RE = hrRe(
  `poljima|planinama|dolinama|stijenama|valovima`
);
const LOCATIVE_BEFORE_PLURAL_RE = hrRe(
  `(?:u|na|o|po|pri)\\s+(?:[${HR_CHAR}]+\\s+)?(?:poljima|planinama|dolinama|stijenama|valovima)`
);
const DATIVE_PREP_RE = hrRe(`(?:prema|k|ka)\\s+(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+`);
const DATIVE_VERB_RE = hrRe(
  `(?:raduje|radujem|radujemo|divi|divim|divimo|pomaže|pomažem|pomažemo|plješće|plješću)\\s+(?:se\\s+)?(?!(?:u|na|o|po|pri)\\s)(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+(?:u|i|ima|ama)`
);
const DATIVE_BARE_NOUN_RE = hrRe(
  `mami|tati|baki|djedu|didi|prijatelju|prijateljima|bratu|sestri|učiteljici|konju|psu|vitezu|kralju|djeci|ljudima|maskama|gostima|putnicima|plesu|vikendu|slapu|medvjedima`
);
const NON_DATIVE_PREP_BEFORE_NOUN_RE = hrRe(
  `(?:u|na|o|po|pri|s|sa|pod|nad|pred|među)\\s+(?:[${HR_CHAR}]+\\s+)?(?:mami|tati|baki|djedu|didi|prijatelju|prijateljima|bratu|sestri|učiteljici|konju|psu|vitezu|kralju|djeci|ljudima|maskama|gostima|putnicima|plesu|vikendu|slapu|medvjedima)`
);
const VOCATIVE_RE = hrRe(
  `viteže|bako|djede|dide|brate|sestro|sine|kćeri|majko|oče|učiteljice|bože|zagrebe|dubrovniče`
);
const VOCATIVE_AMBIGUOUS_RE = hrRe(`prijatelju|kralju`);
const PREPOSITION_RE = hrRe(
  `(?:u|na|s|sa|od|do|iz|za|po|o|kod|kroz|uz|niz|pred|pod|nad|oko|duž|kraj|pokraj|pored|prema|pri|bez|ispred|iza|ispod|iznad|među|nakon)\\s+[${HR_CHAR}]+`
);
const SUBORDINATE_CONJ_RE = hrRe(
  `jer|dok|kad|kada|ako|koji|koja|koje|kojeg|kojoj|kojima|ali|zato|iako|čim|prije nego|nakon što`
);

const PERFEKT_AUX_RE = hrRe(`sam|si|je|smo|ste|su|nisam|nisi|nije|nismo|niste|nisu`);
const NON_PARTICIPLE_L_WORDS = new Set([
  "cipele", "toplo", "topla", "topli", "tople", "vrlo", "nikola", "tesla",
  "škola", "škole", "mala", "malo", "mali", "male", "bijela", "bijelo", "bijeli", "bijele",
  "svijetla", "svijetlo", "svijetli", "svijetle", "selo", "tijelo", "veselo", "vesela", "veseli", "vesele",
  "stola", "pčela", "pčele", "kapele", "kapela", "ali", "posao", "svjetlo", "krilo", "staklo",
  "jelo", "pravilo", "kolo", "obala", "obale", "uvala", "uvale", "kula", "kule", "vrilo",
  "katedrala", "katedrale", "cijela", "cijelo", "cijeli", "cijele", "naočale", "sandale",
  "fritule", "zrcalo", "odijelo", "vozilo", "čelo", "djelo", "sedlo", "veslo", "svjetlo",
  "ogledalo", "palača", "čokolada", "tlo", "grlo", "maslo", "stablo", "krilo", "bilo",
]);
const L_PARTICIPLE_TOKEN_RE = new RegExp(
  `^(?:[${HR_CHAR}]{2,}(?:ao|la|lo|li|le|io|ila|ilo|ili|ile)|bio|bila|bili|bile|išao|išla|išli|došao|došla|došli|našao|našla|rekao|rekla|mogao|mogla|htio|htjela|htjeli)$`,
  "i"
);

function isCroatianLParticipleToken(token: string, hasAux: boolean): boolean {
  const lower = token.toLowerCase();
  if (lower === "bilo") return hasAux;
  if (NON_PARTICIPLE_L_WORDS.has(lower)) return false;
  return L_PARTICIPLE_TOKEN_RE.test(lower);
}

const FUTUR_I_RE = hrRe(`ću|ćeš|će|ćemo|ćete|neću|nećeš|neće|nećemo|nećete`);
const CONDITIONAL_RE = hrRe(`bih|bi|bismo|biste`);
const REFLEXIVE_SE_RE = hrRe(`se`);

const NON_VERB_PLURAL_LIKE = new Set([
  "tamo", "kamo", "samo", "dijete", "vrijeme", "ime", "rame", "sjeme", "vreme", "ovamo", "onamo",
]);

const PRESENT_PLURAL_VERB_RE = hrRe(
  `[${HR_CHAR}]{2,}(?:amo|emo|imo|ate|ete|ite|aju|uju|eju)|smo|ste|su|idemo|idu|jedemo|jedu|pijemo|piju|volimo|vole|vidimo|vide|učimo|uče|gledamo|gledaju|sviramo|sviraju|pjevamo|pjevaju|plivamo|plivaju|trčimo|trče|hodamo|hodaju|čitamo|čitaju|pišemo|pišu|kupujemo|kupuju|beremo|beru|slavimo|slave|putujemo|putuju|penjemo|penju|čuvamo|čuvaju|gradimo|grade|otvaramo|otvaraju|igramo|igraju|tražimo|traže|radimo|rade|živimo|žive|spavamo|spavaju|jedrimo|jedre|plovimo|plove|stojimo|stoje|sjedimo|sjede|griju|pletu|teku|nose|vode|daju|plješću|tjeraju|padaju|okupljaju|spajaju|čekaju|dolaze|prolaze|spuštaju|plešemo|plešu|ponosimo`
);
const PRESENT_SINGULAR_VERB_RE = hrRe(
  `sam|si|je|imam|imaš|ima|idem|ideš|ide|volim|voliš|voli|jedem|jedeš|jede|pijem|piješ|pije|vidim|vidiš|vidi|gledam|gledaš|gleda|učim|učiš|uči|trčim|trčiš|trči|plivam|plivaš|pliva|spavam|spavaš|spava|čitam|čitaš|čita|pišem|pišeš|piše|sviram|sviraš|svira|pjevam|pjevaš|pjeva|plešem|plešeš|pleše|hvatam|hvataš|hvata|kupujem|kupuješ|kupuje|vozim|voziš|vozi|kuham|kuhaš|kuha|hodam|hodaš|hoda|skačem|skače|letim|leti|raste|puše|sja|sjaji|svijetli|teče|miriše|stoji|sjedi|nosi|drži|čuva|traži|otvaram|otvara|zatvara|priprema|kreće|natječe|divi|grije|raduje|penje|vesla|jedri|plovi|slavi|gradi|bere|šeta|igra|crta|pomaže|zove|živi|radim|radi|misli|zna|može|želi|treba|hoće|sanja|sluša|govori|priča|pita|odgovara|smije|plače|pada|grmi|bljeska|zvoni|kuca|donosi|odjekuje|daje|okuplja|spaja|plješće|tjera|štiti|vodi|prati|pokazuje|ulazi|izlazi|prolazi|dolazi|zalazi|spušta|lebdi|kruži|izvire|okreće|zagrijava|usmjerava|visi|darujem|daruje|želim|peče`
);

// Unambiguous Croatian imperative forms (never 3rd-sg present indicative)
const IMPERATIVE_UNAMBIGUOUS_HR_RE = hrRe(
  `otvori|zatvori|dođi|pogledaj|poslušaj|skreni|kreni|stani|uzmi|daj|reci|idi|hodaj|plivaj|čitaj|piši|pjevaj|pleši|pomozi|čuvaj|probaj|kupi|gledaj|čekaj`
);
// Ambiguous forms (e.g. trči/skoči/idemo) that are imperative only when sentence-initial or exclamatory
const IMPERATIVE_AMBIGUOUS_HR_RE = hrRe(`skoči|trči|pazi|idemo`);

function extractQuotedEnglish(englishQuestion: string): string {
  const m = englishQuestion.match(/"([^"]+)"/);
  return (m ? m[1] : englishQuestion).trim();
}

// Match English imperative only at the START of the translated target phrase (not "I look", "We open", "Near / Close")
const IMPERATIVE_ENGLISH_START_RE =
  /^(?:jump!?|run(?:\s+fast)?!?|turn left|turn right|go straight|listen\b|look(?:\s+up|\s+at|\s+out)?!?|open\s+|close\s+|come\s+|stop!?|let's\s+|watch out|be careful)/i;

const ACCUSATIVE_OBJECT_RE = hrRe(
  `(?:vidim|vidi|vidimo|gledam|gleda|gledamo|volim|voli|volimo|kupujem|kupuje|kupujemo|jedem|jede|jedemo|pijem|pije|pijemo|čitam|čita|čitamo|pišem|piše|pišemo|imam|ima|imamo|nosim|nosi|drži|čuva|čuvaju|čuvamo|tražim|traži|tražimo|otvaram|otvara|svira|sviram|pjeva|pjevam|bere|beremo|gradi|gradimo|slavi|slavimo|kuha|kuham|vozi|vozim|crtam|crta|posjećujemo|istražujemo|upoznajemo|donosi|daje|okuplja|spaja|tjeraju|pletu|griju|hvatam|hvata|darujem|daruje|peče|žanjemo|ulovili|radim|sluša|slušamo|usmjerava)\\s+(?!(?:u|na|o|po|pri|se|s|sa|od|do|iz|za|kroz|pod|nad|pred|među|prema|kod|kraj|pokraj|pored|ispod|iznad|iza|ispred|oko|duž|bez|nakon|k|ka)(?:$|[^${HR_CHAR}]))(?:[${HR_CHAR}]+\\s+)?[${HR_CHAR}]+`
);

export function analyzeCroatianGrammar(croatianText: string, englishQuestion: string): GrammarFeatureFlags {
  const tokens = tokenizeCroatian(croatianText);
  const wordCount = tokens.length;
  const trimmed = croatianText.trim();

  const hasPerfektAux = PERFEKT_AUX_RE.test(croatianText);
  const hasConditionalAux = CONDITIONAL_RE.test(croatianText);
  const lParticipleTokens = tokens.filter((t) =>
    isCroatianLParticipleToken(t, hasPerfektAux || hasConditionalAux)
  );
  const hasLParticiple = lParticipleTokens.length > 0;
  const pastPerfekt = hasPerfektAux && hasLParticiple;

  const futureFuturI = FUTUR_I_RE.test(croatianText);
  const conditional = hasConditionalAux && hasLParticiple;
  const reflexiveSe = REFLEXIVE_SE_RE.test(croatianText);

  const quotedEnglish = extractQuotedEnglish(englishQuestion);
  const isAmbiguousImpLeading =
    wordCount > 0 &&
    (IMPERATIVE_AMBIGUOUS_HR_RE.test(tokens[0]) ||
      (wordCount === 2 && IMPERATIVE_AMBIGUOUS_HR_RE.test(tokens[1]) && /^(?:brzo|polako|tiho|sad|sada)$/i.test(tokens[0])));

  const imperative =
    IMPERATIVE_UNAMBIGUOUS_HR_RE.test(croatianText) ||
    (isAmbiguousImpLeading && (trimmed.endsWith("!") || IMPERATIVE_ENGLISH_START_RE.test(quotedEnglish))) ||
    IMPERATIVE_ENGLISH_START_RE.test(quotedEnglish);

  const hasPresentPluralToken = tokens.some(
    (t) => !NON_VERB_PLURAL_LIKE.has(t) && PRESENT_PLURAL_VERB_RE.test(t)
  );
  const presentPlural =
    !pastPerfekt &&
    !futureFuturI &&
    !conditional &&
    wordCount >= 2 &&
    (hasPresentPluralToken || hrRe(`mi|vi|oni`).test(croatianText));

  const presentSingular =
    !pastPerfekt &&
    !futureFuturI &&
    !conditional &&
    !presentPlural &&
    (PRESENT_SINGULAR_VERB_RE.test(croatianText) || (wordCount >= 3 && hrRe(`je|ima|ide`).test(croatianText)));

  const prepositionalPhrase = wordCount >= 2 && PREPOSITION_RE.test(croatianText);

  // Count distinct finite verbs to detect true coordinated clauses (e.g. "Plešemo i pjevamo")
  // rather than simple noun/adjective coordination ("snagu i gostoljubivost", "toplo i plavo")
  const verbLikeMatches = tokens.filter(
    (t) =>
      PRESENT_SINGULAR_VERB_RE.test(t) ||
      (!NON_VERB_PLURAL_LIKE.has(t) && PRESENT_PLURAL_VERB_RE.test(t)) ||
      (pastPerfekt && isCroatianLParticipleToken(t, true))
  );
  const hasTwoVerbsCoordinated = verbLikeMatches.length >= 2 && (tokens.includes("i") || croatianText.includes(","));

  const subordinateOrCompound =
    wordCount >= 4 &&
    (SUBORDINATE_CONJ_RE.test(croatianText) || hasTwoVerbsCoordinated);

  const hasAccMotionPrep = ACC_MOTION_PREP_RE.test(croatianText);
  // Static Locative only when u/na/o/po/pri phrase is NOT purely an accusative motion phrase
  const strippedMotionPrep = hasAccMotionPrep
    ? croatianText.replace(new RegExp(`(?:u|na)\\s+(?:[${HR_CHAR}]+\\s+)?(?:${ACC_DIRECTION_FEM_NOUNS})`, "gi"), "")
    : croatianText;
  const caseLocative = LOCATIVE_PREP_STATIC_RE.test(strippedMotionPrep);

  const caseGenitive = GENITIVE_PREP_RE.test(croatianText);
  const caseInstrumental =
    INSTRUMENTAL_PREP_RE.test(croatianText) ||
    INSTRUMENTAL_BARE_RE.test(croatianText) ||
    (INSTRUMENTAL_BARE_PLURAL_RE.test(croatianText) && !LOCATIVE_BEFORE_PLURAL_RE.test(croatianText));

  const hasBareDativeNoun =
    DATIVE_BARE_NOUN_RE.test(croatianText) && !NON_DATIVE_PREP_BEFORE_NOUN_RE.test(croatianText);
  const caseDative =
    DATIVE_PREP_RE.test(croatianText) ||
    DATIVE_VERB_RE.test(croatianText) ||
    hasBareDativeNoun;

  const caseVocative =
    VOCATIVE_RE.test(croatianText) ||
    (VOCATIVE_AMBIGUOUS_RE.test(croatianText) &&
      !hrRe(`(?:u|na|o|po|pri|prema|k|ka|s|sa)\\s+(?:[${HR_CHAR}]+\\s+)?(?:prijatelju|kralju)`).test(croatianText) &&
      (trimmed.endsWith("!") || croatianText.includes(",")));

  const caseAccusative =
    ACCUSATIVE_OBJECT_RE.test(croatianText) ||
    ACC_ALWAYS_PREP_RE.test(croatianText) ||
    hasAccMotionPrep;

  const hasVerb =
    presentSingular || presentPlural || pastPerfekt || futureFuturI || imperative || conditional;

  let syntaxTier: 1 | 2 | 3 | 4 | 5 = 1;
  if (wordCount <= 1) {
    syntaxTier = 1;
  } else if (subordinateOrCompound) {
    syntaxTier = 5;
  } else if (hasVerb && prepositionalPhrase && wordCount >= 4) {
    syntaxTier = 4;
  } else if (hasVerb && wordCount >= 3) {
    syntaxTier = 3;
  } else if (wordCount === 2 && !hasVerb) {
    syntaxTier = 2;
  } else if (wordCount >= 3) {
    syntaxTier = hasVerb ? 3 : 2;
  } else {
    syntaxTier = 2;
  }

  return {
    presentSingular,
    presentPlural,
    reflexiveSe,
    pastPerfekt,
    futureFuturI,
    imperative,
    conditional,
    caseAccusative,
    caseLocative,
    caseGenitive,
    caseInstrumental,
    caseDative,
    caseVocative,
    prepositionalPhrase,
    subordinateOrCompound,
    syntaxTier,
  };
}

// ============================================================================
// Ideal Duolingo CEFR Difficulty Curve & Rubric Model (Units 1–60 / Worlds 1–12)
// ============================================================================

/**
 * Ideal Duolingo-standard Difficulty Index (0–100) across Units 1..60:
 * Smoothly climbs from 12 (Unit 1, Pre-A1 visual single-word discovery)
 * to 88 (Unit 60, Early B1 multi-clause active recall & case mastery),
 * with slight gentle "breather" resets at the start of each 5-unit World.
 */
export function getIdealDifficultyForUnit(unitOrder: number): number {
  const clamped = Math.max(1, Math.min(60, unitOrder));
  const worldIndex = Math.floor((clamped - 1) / 5); // 0..11
  const unitInWorld = (clamped - 1) % 5; // 0..4
  const baseCurve = 12 + ((clamped - 1) / 59) * 76; // 12 -> 88
  // Gentle sawtooth: world intro is -2, world capstone (5th unit) is +2.5
  const waveOffset = (unitInWorld - 2) * 1.1 + (worldIndex >= 4 ? 0.5 : 0);
  return round1(Math.max(10, Math.min(92, baseCurve + waveOffset)));
}

export function getTargetCefrForWorld(stage: number): string {
  if (stage <= 2) return "A1.1 (Breakthrough)";
  if (stage <= 4) return "A1.2 (Foundational A1)";
  if (stage <= 6) return "A1+ / Early A2.1";
  if (stage <= 8) return "A2.1 (Waystage Core)";
  if (stage <= 10) return "A2.2 (Waystage Extended)";
  return "A2+ / Early B1 (Threshold)";
}

export function getIdealWordLengthForWorld(stage: number): { all: number; l3l4: number } {
  // Ideal monotonic progression across Worlds 1..12:
  // W1: 1.4 all / 1.8 L3-L4  -->  W6: 3.0 all / 4.4 L3-L4  -->  W12: 4.8 all / 6.5 L3-L4
  const t = (Math.max(1, Math.min(12, stage)) - 1) / 11;
  return {
    all: round2(1.4 + t * 3.4),
    l3l4: round2(1.8 + t * 4.7),
  };
}

export function computeActualDifficultyIndex(params: {
  avgWordsAll: number;
  avgWordsL3L4: number;
  avgSyntaxTier: number;
  avgDistractorHardness: number;
  grammarBreadthRatio: number; // 0..1
  spiralReuseRatio: number; // 0..1
  activeProductionRatio: number; // 0..1 (currently 0 for SELECT/ASSIST only)
}): number {
  const wordScore = Math.min(100, (params.avgWordsAll / 5.5) * 100);
  const l3l4Score = Math.min(100, (params.avgWordsL3L4 / 7.5) * 100);
  const syntaxScore = Math.min(100, ((params.avgSyntaxTier - 1) / 4) * 100);
  const hardnessScore = Math.min(100, params.avgDistractorHardness);
  const grammarScore = Math.min(100, params.grammarBreadthRatio * 100);
  const spiralScore = Math.min(100, params.spiralReuseRatio * 100);
  const mechanicScore = Math.min(100, params.activeProductionRatio * 100);

  // Weighted composite (0–100) reflecting Duolingo's multi-dimensional difficulty model
  const score =
    wordScore * 0.20 +
    l3l4Score * 0.15 +
    syntaxScore * 0.20 +
    hardnessScore * 0.15 +
    grammarScore * 0.15 +
    spiralScore * 0.05 +
    mechanicScore * 0.10;

  return round1(Math.max(0, Math.min(100, score)));
}

export function estimateActualCefr(w: {
  avgWordsAll: number;
  avgWordsL3L4: number;
  grammar: GrammarCounts;
  challengeCount: number;
  minimalPairPct: number;
}): string {
  const n = Math.max(1, w.challengeCount);
  const hasPast = w.grammar.pastPerfekt / n >= 0.05;
  const hasFuture = w.grammar.futureFuturI / n >= 0.05;
  const hasReflexive = w.grammar.reflexiveSe / n >= 0.05;
  const hasSubordinate = w.grammar.subordinateOrCompound / n >= 0.05;
  const obliqueCasesCount = [
    w.grammar.caseAccusative > 0,
    w.grammar.caseLocative > 0,
    w.grammar.caseGenitive > 0,
    w.grammar.caseInstrumental > 0,
    w.grammar.caseDative > 0,
  ].filter(Boolean).length;

  if (w.avgWordsAll < 1.7 && w.grammar.avgSyntaxTier < 1.8) {
    return "Pre-A1 / A1.1";
  }
  if (w.avgWordsAll < 2.4 && !hasPast && !hasFuture) {
    return "A1.1–A1.2";
  }
  if (w.avgWordsAll < 2.9 && !hasSubordinate) {
    return hasPast || hasFuture ? "A1.2–A2.1 (Short)" : "A1.2";
  }
  if (w.avgWordsL3L4 >= 4.5 && (hasPast || hasFuture || hasReflexive) && obliqueCasesCount >= 3) {
    if (hasSubordinate && w.minimalPairPct >= 25) {
      return "A2.2–Early B1";
    }
    return "A2.1 (Recognition-Only)";
  }
  if (w.avgWordsL3L4 >= 4.0 && obliqueCasesCount >= 2) {
    return "A1+ / Early A2.1";
  }
  return "A1.2";
}

function clampScore(v: number): number {
  return round1(Math.max(1.0, Math.min(5.0, v)));
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function sumGrammar(items: ChallengeMetrics[]): GrammarCounts {
  const n = Math.max(1, items.length);
  const counts: GrammarCounts = {
    presentSingular: 0,
    presentPlural: 0,
    reflexiveSe: 0,
    pastPerfekt: 0,
    futureFuturI: 0,
    imperative: 0,
    conditional: 0,
    caseAccusative: 0,
    caseLocative: 0,
    caseGenitive: 0,
    caseInstrumental: 0,
    caseDative: 0,
    caseVocative: 0,
    prepositionalPhrase: 0,
    subordinateOrCompound: 0,
    avgSyntaxTier: 0,
  };
  let tierSum = 0;
  for (const c of items) {
    if (c.grammar.presentSingular) counts.presentSingular++;
    if (c.grammar.presentPlural) counts.presentPlural++;
    if (c.grammar.reflexiveSe) counts.reflexiveSe++;
    if (c.grammar.pastPerfekt) counts.pastPerfekt++;
    if (c.grammar.futureFuturI) counts.futureFuturI++;
    if (c.grammar.imperative) counts.imperative++;
    if (c.grammar.conditional) counts.conditional++;
    if (c.grammar.caseAccusative) counts.caseAccusative++;
    if (c.grammar.caseLocative) counts.caseLocative++;
    if (c.grammar.caseGenitive) counts.caseGenitive++;
    if (c.grammar.caseInstrumental) counts.caseInstrumental++;
    if (c.grammar.caseDative) counts.caseDative++;
    if (c.grammar.caseVocative) counts.caseVocative++;
    if (c.grammar.prepositionalPhrase) counts.prepositionalPhrase++;
    if (c.grammar.subordinateOrCompound) counts.subordinateOrCompound++;
    tierSum += c.grammar.syntaxTier;
  }
  counts.avgSyntaxTier = round2(tierSum / n);
  return counts;
}

function computeGrammarBreadthRatio(g: GrammarCounts, challengeCount: number): number {
  const n = Math.max(1, challengeCount);
  const features = [
    g.presentSingular / n >= 0.04,
    g.presentPlural / n >= 0.04,
    g.reflexiveSe / n >= 0.03,
    g.pastPerfekt / n >= 0.03,
    g.futureFuturI / n >= 0.03,
    g.imperative / n >= 0.02,
    g.conditional / n >= 0.02,
    g.caseAccusative / n >= 0.05,
    g.caseLocative / n >= 0.05,
    g.caseGenitive / n >= 0.04,
    g.caseInstrumental / n >= 0.03,
    g.caseDative / n >= 0.02,
    g.prepositionalPhrase / n >= 0.08,
    g.subordinateOrCompound / n >= 0.03,
  ];
  return features.filter(Boolean).length / features.length;
}

function checkExpectedWorldMilestones(stage: number, g: GrammarCounts, challengeCount: number): string[] {
  const n = Math.max(1, challengeCount);
  const missing: string[] = [];

  if (stage >= 2 && g.presentSingular / n < 0.04) {
    missing.push("Present singular verbs");
  }
  if (stage >= 3 && g.caseAccusative / n < 0.04 && g.caseLocative / n < 0.04) {
    missing.push("Accusative/Locative case phrases");
  }
  if (stage >= 4 && g.presentPlural / n < 0.04) {
    missing.push("Present plural verbs");
  }
  if (stage >= 5 && g.prepositionalPhrase / n < 0.08) {
    missing.push("Prepositional phrases");
  }
  if (stage >= 6 && g.caseGenitive / n < 0.03 && g.caseInstrumental / n < 0.03) {
    missing.push("Genitive/Instrumental cases");
  }
  if (stage >= 7 && g.pastPerfekt / n < 0.04) {
    missing.push("Past tense (Perfekt)");
  }
  if (stage >= 8 && g.futureFuturI / n < 0.04) {
    missing.push("Future tense (Futur I)");
  }
  if (stage >= 9 && g.reflexiveSe / n < 0.04) {
    missing.push("Reflexive verbs (se)");
  }
  if (stage >= 10 && g.subordinateOrCompound / n < 0.05) {
    missing.push("Compound/subordinate clauses (jer/dok/kada/koji)");
  }
  if (stage >= 11 && g.conditional / n < 0.02) {
    missing.push("Conditional mood (bih/bi/bismo)");
  }
  return missing;
}

// ============================================================================
// Main Aggregation Engine
// ============================================================================

export function computePedagogyAuditReport(input: {
  units: AuditUnitRow[];
  lessons: AuditLessonRow[];
  challenges: AuditChallengeRow[];
  options: AuditOptionRow[];
  progressAgg: AuditProgressAggRow[];
  mistakeAgg: AuditMistakeAggRow[];
  telemetryOverview: AuditTelemetryOverview;
}): PedagogyAuditReport {
  const sortedUnits = [...input.units].sort((a, b) => a.order - b.order);
  const sortedChallenges = [...input.challenges].sort((a, b) =>
    a.unitOrder !== b.unitOrder
      ? a.unitOrder - b.unitOrder
      : a.lessonOrder !== b.lessonOrder
        ? a.lessonOrder - b.lessonOrder
        : a.order - b.order
  );

  // Index options by challengeId
  const optionsByChallenge = new Map<number, AuditOptionRow[]>();
  for (const opt of input.options) {
    const list = optionsByChallenge.get(opt.challengeId) ?? [];
    list.push(opt);
    optionsByChallenge.set(opt.challengeId, list);
  }

  // Index telemetry aggregates by challengeId
  const progressByChallenge = new Map<number, AuditProgressAggRow>();
  for (const p of input.progressAgg) {
    progressByChallenge.set(p.challengeId, p);
  }
  const mistakesByChallenge = new Map<number, AuditMistakeAggRow>();
  for (const m of input.mistakeAgg) {
    mistakesByChallenge.set(m.challengeId, m);
  }
  const reachByUnit = new Map<number, number>();
  for (const r of input.telemetryOverview.unitReach) {
    reachByUnit.set(r.unitOrder, r.uniqueUsers);
  }

  // Track cumulative stems seen in earlier worlds and earlier units
  const seenStemsBeforeWorld = new Map<number, Set<string>>();
  const introducedStemsByWorld = new Map<number, Set<string>>();
  const allTargetStemsByWorld = new Map<number, Set<string>>();

  // Pass 1: Determine stems introduced per world & per unit in chronological order
  const cumulativeWorldStems = new Set<string>();
  const cumulativeUnitStems = new Set<string>();
  const seenStemsBeforeUnit = new Map<number, Set<string>>();
  const seenStemsBeforeUnitInWorld = new Map<number, Set<string>>();

  const challengesByUnit = new Map<number, AuditChallengeRow[]>();
  for (const ch of sortedChallenges) {
    const list = challengesByUnit.get(ch.unitOrder) ?? [];
    list.push(ch);
    challengesByUnit.set(ch.unitOrder, list);
  }

  const worldStages = ALL_STAGES.map((s) => s.stage);
  for (const stage of worldStages) {
    seenStemsBeforeWorld.set(stage, new Set(cumulativeWorldStems));
    const introducedHere = new Set<string>();
    const allInWorld = new Set<string>();
    const cumulativeWithinWorld = new Set<string>();

    const stageTheme = ALL_STAGES.find((s) => s.stage === stage)!;
    for (let uOrder = stageTheme.unitRange[0]; uOrder <= stageTheme.unitRange[1]; uOrder++) {
      seenStemsBeforeUnit.set(uOrder, new Set(cumulativeUnitStems));
      seenStemsBeforeUnitInWorld.set(uOrder, new Set(cumulativeWithinWorld));
      const unitChs = challengesByUnit.get(uOrder) ?? [];
      for (const ch of unitChs) {
        const opts = optionsByChallenge.get(ch.id) ?? [];
        const correctOpt = opts.find((o) => o.correct);
        if (!correctOpt) continue;
        const stems = extractContentStems(correctOpt.text);
        for (const st of stems) {
          allInWorld.add(st);
          if (!seenStemsBeforeWorld.get(stage)!.has(st)) {
            introducedHere.add(st);
          }
          cumulativeUnitStems.add(st);
          cumulativeWithinWorld.add(st);
          cumulativeWorldStems.add(st);
        }
      }
    }
    introducedStemsByWorld.set(stage, introducedHere);
    allTargetStemsByWorld.set(stage, allInWorld);
  }

  // Pass 2: Compute per-challenge metrics
  const challengeMetricsList: ChallengeMetrics[] = [];
  for (const ch of sortedChallenges) {
    const opts = optionsByChallenge.get(ch.id) ?? [];
    const correctOpt = opts.find((o) => o.correct);
    const distractors = opts.filter((o) => !o.correct);
    const correctText = correctOpt?.text?.trim() ?? "";
    const distractorTexts = distractors.map((d) => d.text.trim());
    const hasImages = opts.some((o) => Boolean(o.imageSrc));

    const tokens = tokenizeCroatian(correctText);
    const wordCount = tokens.length;
    const contentTokens = extractContentTokens(correctText);
    const contentStems = contentTokens.map(croatianStem);

    const worldStage = getStageThemeForUnit(ch.unitOrder).stage;
    const priorWorldSet = seenStemsBeforeWorld.get(worldStage) ?? new Set<string>();
    const priorUnitSet = seenStemsBeforeUnit.get(ch.unitOrder) ?? new Set<string>();
    const priorUnitInWorldSet = seenStemsBeforeUnitInWorld.get(ch.unitOrder) ?? new Set<string>();

    const priorWorldStemHits = contentStems.filter((s) => priorWorldSet.has(s)).length;
    const priorUnitStemHits = contentStems.filter((s) => priorUnitSet.has(s)).length;
    const priorUnitInWorldStemHits = contentStems.filter((s) => priorUnitInWorldSet.has(s)).length;

    const tokenOverlaps = distractorTexts.map((d) => tokenJaccardSimilarity(correctText, d));
    const charSims = distractorTexts.map((d) => normalizedCharSimilarity(correctText, d));
    const sameWordCountFlags = distractorTexts.map(
      (d) => (tokenizeCroatian(d).length === wordCount ? 1 : 0)
    );

    const avgTokenOverlap = round2(avg(tokenOverlaps));
    const avgCharSimilarity = round2(avg(charSims));
    const wordCountParity = round2(avg(sameWordCountFlags));

    const isMinimalPair = distractorTexts.some((d, idx) => {
      return tokenOverlaps[idx] >= 0.4 || charSims[idx] >= 0.65;
    });

    const distractorHardness = round1(
      (avgTokenOverlap * 0.45 + avgCharSimilarity * 0.35 + wordCountParity * 0.20) * 100
    );

    const grammar = analyzeCroatianGrammar(correctText, ch.question);

    const completions = progressByChallenge.get(ch.id)?.completions ?? 0;
    const mistakes = mistakesByChallenge.get(ch.id)?.mistakeCount ?? 0;
    const totalAttempts = completions + mistakes;
    const mistakeRatePct = totalAttempts > 0 ? round1((mistakes / totalAttempts) * 100) : null;

    challengeMetricsList.push({
      challengeId: ch.id,
      unitOrder: ch.unitOrder,
      worldStage,
      lessonOrder: ch.lessonOrder,
      challengeOrder: ch.order,
      type: ch.type,
      question: ch.question,
      correctText,
      distractorTexts,
      hasImages,
      wordCount,
      contentTokens,
      contentStems,
      priorWorldStemHits,
      priorUnitStemHits,
      priorUnitInWorldStemHits,
      avgTokenOverlap,
      avgCharSimilarity,
      wordCountParity,
      isMinimalPair,
      distractorHardness,
      grammar,
      completions,
      mistakes,
      mistakeRatePct,
    });
  }

  // Pass 3: Aggregate per-Unit metrics
  const unitMetricsList: UnitMetrics[] = sortedUnits.map((u) => {
    const uChs = challengeMetricsList.filter((c) => c.unitOrder === u.order);
    const theme = getStageThemeForUnit(u.order);
    const n = uChs.length;
    const selectCount = uChs.filter((c) => c.type === "SELECT").length;
    const assistCount = uChs.filter((c) => c.type === "ASSIST").length;

    const l1 = uChs.filter((c) => c.lessonOrder === 1);
    const l2 = uChs.filter((c) => c.lessonOrder === 2);
    const l3 = uChs.filter((c) => c.lessonOrder === 3);
    const l4 = uChs.filter((c) => c.lessonOrder === 4);
    const l3l4 = uChs.filter((c) => c.lessonOrder >= 3);

    const avgWordsAll = round2(avg(uChs.map((c) => c.wordCount)));
    const avgWordsL1 = round2(avg(l1.map((c) => c.wordCount)));
    const avgWordsL2 = round2(avg(l2.map((c) => c.wordCount)));
    const avgWordsL3 = round2(avg(l3.map((c) => c.wordCount)));
    const avgWordsL4 = round2(avg(l4.map((c) => c.wordCount)));
    const avgWordsL3L4 = round2(avg(l3l4.map((c) => c.wordCount)));
    const maxWords = uChs.reduce((mx, c) => Math.max(mx, c.wordCount), 0);

    const uniqueTokensSet = new Set<string>();
    const uniqueStemsSet = new Set<string>();
    let totalStemOccurrences = 0;
    let priorWorldStemOccurrences = 0;
    let priorUnitStemOccurrences = 0;
    let abstractCount = 0;

    const priorUnitSet = seenStemsBeforeUnit.get(u.order) ?? new Set<string>();
    for (const c of uChs) {
      for (const tok of c.contentTokens) uniqueTokensSet.add(tok);
      for (const st of c.contentStems) uniqueStemsSet.add(st);
      totalStemOccurrences += c.contentStems.length;
      priorWorldStemOccurrences += c.priorWorldStemHits;
      priorUnitStemOccurrences += c.priorUnitStemHits;
      if (isAbstractConcept(c.correctText, c.question)) {
        abstractCount++;
      }
    }

    const netNewStems = Array.from(uniqueStemsSet).filter((s) => !priorUnitSet.has(s)).length;
    const abstractVocabRatio = n > 0 ? round1((abstractCount / n) * 100) : 0;

    const backwardWorldSpiralPct =
      theme.stage === 1 || totalStemOccurrences === 0
        ? null
        : round1((priorWorldStemOccurrences / totalStemOccurrences) * 100);

    const backwardUnitSpiralPct =
      u.order === 1 || totalStemOccurrences === 0
        ? null
        : round1((priorUnitStemOccurrences / totalStemOccurrences) * 100);

    const multiWordL2L4 = uChs.filter((c) => c.lessonOrder >= 2 && c.wordCount >= 2);
    const sentenceRecyclingRatePct =
      theme.stage === 1 || multiWordL2L4.length === 0
        ? null
        : round1(
            (multiWordL2L4.filter((c) => c.priorWorldStemHits > 0).length / multiWordL2L4.length) *
              100
          );

    const avgDistractorHardness = round1(avg(uChs.map((c) => c.distractorHardness)));
    const minimalPairPct = n > 0 ? round1((uChs.filter((c) => c.isMinimalPair).length / n) * 100) : 0;
    const wordCountParityPct = round1(avg(uChs.map((c) => c.wordCountParity)) * 100);
    const grammar = sumGrammar(uChs);

    const actualDifficultyIndex = computeActualDifficultyIndex({
      avgWordsAll,
      avgWordsL3L4,
      avgSyntaxTier: grammar.avgSyntaxTier,
      avgDistractorHardness,
      grammarBreadthRatio: computeGrammarBreadthRatio(grammar, n),
      spiralReuseRatio: (backwardUnitSpiralPct ?? 0) / 100,
      activeProductionRatio: 0, // SELECT & ASSIST are both passive multiple-choice recognition
    });
    const idealDifficultyIndex = getIdealDifficultyForUnit(u.order);
    const difficultyDelta = round1(actualDifficultyIndex - idealDifficultyIndex);

    const completions = uChs.reduce((acc, c) => acc + c.completions, 0);
    const mistakes = uChs.reduce((acc, c) => acc + c.mistakes, 0);
    const totalAttempts = completions + mistakes;
    const mistakeRatePct = totalAttempts > 0 ? round1((mistakes / totalAttempts) * 100) : null;

    return {
      unitOrder: u.order,
      worldStage: theme.stage,
      worldName: theme.stageName,
      title: u.title,
      description: u.description,
      challengeCount: n,
      selectCount,
      assistCount,
      selectPct: n > 0 ? round1((selectCount / n) * 100) : 0,
      assistPct: n > 0 ? round1((assistCount / n) * 100) : 0,
      avgWordsAll,
      avgWordsL1,
      avgWordsL2,
      avgWordsL3,
      avgWordsL4,
      avgWordsL3L4,
      maxWords,
      uniqueContentTokens: uniqueTokensSet.size,
      uniqueContentStems: uniqueStemsSet.size,
      netNewStems,
      abstractVocabRatio,
      backwardWorldSpiralPct,
      backwardUnitSpiralPct,
      sentenceRecyclingRatePct,
      avgDistractorHardness,
      minimalPairPct,
      wordCountParityPct,
      grammar,
      actualDifficultyIndex,
      idealDifficultyIndex,
      difficultyDelta,
      completions,
      mistakes,
      mistakeRatePct,
      uniqueLearnersReached: reachByUnit.get(u.order) ?? 0,
    };
  });

  // Pass 4: Aggregate per-World metrics & Duolingo Rubric
  const worldMetricsList: WorldMetrics[] = ALL_STAGES.map((stageTheme) => {
    const wUnits = unitMetricsList.filter((u) => u.worldStage === stageTheme.stage);
    const wChs = challengeMetricsList.filter((c) => c.worldStage === stageTheme.stage);
    const n = wChs.length;

    const selectCount = wChs.filter((c) => c.type === "SELECT").length;
    const assistCount = wChs.filter((c) => c.type === "ASSIST").length;

    const l1 = wChs.filter((c) => c.lessonOrder === 1);
    const l2 = wChs.filter((c) => c.lessonOrder === 2);
    const l3 = wChs.filter((c) => c.lessonOrder === 3);
    const l4 = wChs.filter((c) => c.lessonOrder === 4);
    const l3l4 = wChs.filter((c) => c.lessonOrder >= 3);

    const avgWordsAll = round2(avg(wChs.map((c) => c.wordCount)));
    const avgWordsL1 = round2(avg(l1.map((c) => c.wordCount)));
    const avgWordsL2 = round2(avg(l2.map((c) => c.wordCount)));
    const avgWordsL3 = round2(avg(l3.map((c) => c.wordCount)));
    const avgWordsL4 = round2(avg(l4.map((c) => c.wordCount)));
    const avgWordsL3L4 = round2(avg(l3l4.map((c) => c.wordCount)));
    const maxWords = wChs.reduce((mx, c) => Math.max(mx, c.wordCount), 0);

    const uniqueStems = allTargetStemsByWorld.get(stageTheme.stage) ?? new Set<string>();
    const introducedStems = introducedStemsByWorld.get(stageTheme.stage) ?? new Set<string>();

    // Forward retention: how many stems introduced in World W reappear in Worlds > W
    let forwardRetentionPct: number | null = null;
    if (stageTheme.stage < 12 && introducedStems.size > 0) {
      const futureStems = new Set<string>();
      for (let futureStage = stageTheme.stage + 1; futureStage <= 12; futureStage++) {
        const s = allTargetStemsByWorld.get(futureStage);
        if (s) {
          for (const st of Array.from(s)) futureStems.add(st);
        }
      }
      let retained = 0;
      for (const st of Array.from(introducedStems)) {
        if (futureStems.has(st)) retained++;
      }
      forwardRetentionPct = round1((retained / introducedStems.size) * 100);
    }

    // Backward spiral: how much World W recycles stems from Worlds < W
    let totalStemOcc = 0;
    let priorWorldOcc = 0;
    let priorUnitWithinWorldOcc = 0;
    let totalWithinWorldOcc = 0;
    let abstractCount = 0;

    for (const c of wChs) {
      totalStemOcc += c.contentStems.length;
      priorWorldOcc += c.priorWorldStemHits;
      if (c.unitOrder > stageTheme.unitRange[0]) {
        totalWithinWorldOcc += c.contentStems.length;
        priorUnitWithinWorldOcc += c.priorUnitInWorldStemHits;
      }
      if (isAbstractConcept(c.correctText, c.question)) {
        abstractCount++;
      }
    }

    const backwardSpiralTokenPct =
      stageTheme.stage === 1 || totalStemOcc === 0
        ? null
        : round1((priorWorldOcc / totalStemOcc) * 100);

    const l2l4Chs = wChs.filter((c) => c.lessonOrder >= 2);
    const backwardSpiralChallengePct =
      stageTheme.stage === 1 || l2l4Chs.length === 0
        ? null
        : round1(
            (l2l4Chs.filter((c) => c.priorWorldStemHits > 0).length / l2l4Chs.length) * 100
          );

    const withinWorldCrossUnitSpiralPct =
      totalWithinWorldOcc === 0 ? 0 : round1((priorUnitWithinWorldOcc / totalWithinWorldOcc) * 100);

    const siloedUnitCount =
      stageTheme.stage === 1
        ? 0
        : wUnits.filter((u) => (u.backwardWorldSpiralPct ?? 0) < 15).length;

    const abstractVocabRatio = n > 0 ? round1((abstractCount / n) * 100) : 0;
    const avgDistractorHardness = round1(avg(wChs.map((c) => c.distractorHardness)));
    const minimalPairPct = n > 0 ? round1((wChs.filter((c) => c.isMinimalPair).length / n) * 100) : 0;
    const wordCountParityPct = round1(avg(wChs.map((c) => c.wordCountParity)) * 100);

    const grammar = sumGrammar(wChs);
    const estimatedCefr = estimateActualCefr({
      avgWordsAll,
      avgWordsL3L4,
      grammar,
      challengeCount: n,
      minimalPairPct,
    });
    const targetCefr = getTargetCefrForWorld(stageTheme.stage);

    const actualDifficultyIndex = round1(avg(wUnits.map((u) => u.actualDifficultyIndex)));
    const idealDifficultyIndex = round1(avg(wUnits.map((u) => u.idealDifficultyIndex)));
    const difficultyDelta = round1(actualDifficultyIndex - idealDifficultyIndex);

    // Compute 1–5 Duolingo Alignment Rubric
    const idealWords = getIdealWordLengthForWorld(stageTheme.stage);
    const wordRatioAll = idealWords.all > 0 ? avgWordsAll / idealWords.all : 1;
    const wordRatioL3L4 = idealWords.l3l4 > 0 ? avgWordsL3L4 / idealWords.l3l4 : 1;
    const combinedRatio = wordRatioAll * 0.5 + wordRatioL3L4 * 0.5;
    // Penalize falling short more heavily than exceeding slightly
    const sentenceScaling = clampScore(
      combinedRatio >= 0.95 && combinedRatio <= 1.25
        ? 5.0 - Math.abs(combinedRatio - 1.05) * 2
        : combinedRatio < 0.95
          ? 1.0 + Math.max(0, combinedRatio / 0.95) * 3.6
          : 5.0 - (combinedRatio - 1.25) * 2.5
    );

    const missingMilestones = checkExpectedWorldMilestones(stageTheme.stage, grammar, n);
    const grammarBreadth = computeGrammarBreadthRatio(grammar, n);
    const grammarProgression = clampScore(
      stageTheme.stage <= 2
        ? 3.8 + Math.min(1.2, grammarBreadth * 4) - missingMilestones.length * 0.5
        : 4.5 - missingMilestones.length * 0.75 + (grammarBreadth - 0.35) * 1.5
    );

    // Spiral reinforcement rubric (Duolingo Half-Life Regression benchmark: >= 35% cross-world token spiral, >= 45% forward retention)
    let spiralReinforcement: number;
    if (stageTheme.stage === 1) {
      const fwd = forwardRetentionPct ?? 0;
      spiralReinforcement = clampScore(1.5 + (fwd / 65) * 3.5);
    } else if (stageTheme.stage === 12) {
      const bwd = backwardSpiralChallengePct ?? 0;
      spiralReinforcement = clampScore(1.2 + (bwd / 70) * 3.8);
    } else {
      const fwd = forwardRetentionPct ?? 0;
      const bwd = backwardSpiralChallengePct ?? 0;
      spiralReinforcement = clampScore(1.0 + ((fwd / 60) * 2.0 + (bwd / 70) * 2.0));
    }

    // Distractor Rigor rubric: early worlds (1–3) expect deductive elimination (lower overlap is OK/desired);
    // mid/late worlds (4–12) should ramp minimal-pair & morphological hardness!
    let distractorRigor: number;
    if (stageTheme.stage <= 3) {
      // Deductive elimination + parity is appropriate in early A1
      distractorRigor = clampScore(2.8 + (wordCountParityPct / 100) * 1.4 + (minimalPairPct / 100) * 1.2);
    } else {
      const targetHardness = 22 + stageTheme.stage * 3.2; // W4: 35 -> W12: 60
      const targetMinimalPair = 15 + (stageTheme.stage - 3) * 4; // W4: 19% -> W12: 51%
      const hardnessRatio = Math.min(1.1, avgDistractorHardness / targetHardness);
      const mpRatio = Math.min(1.1, minimalPairPct / targetMinimalPair);
      distractorRigor = clampScore(1.0 + hardnessRatio * 2.0 + mpRatio * 2.0);
    }

    // Mechanic Diversity rubric:
    // Scores dynamically when Tier 3-6 active mechanics (LISTEN, MATCH_PAIRS, BUILD_SENTENCE, CLOZE)
    // are present, while preserving the exact baseline penalty when only SELECT/ASSIST exist.
    const wListenCount = wChs.filter((c) => c.type === "LISTEN").length;
    const wBuildCount = wChs.filter((c) => c.type === "BUILD_SENTENCE").length;
    const wMatchCount = wChs.filter((c) => c.type === "MATCH_PAIRS").length;
    const wClozeCount = wChs.filter((c) => c.type === "CLOZE").length;
    const wActiveCount = wListenCount + wBuildCount + wMatchCount + wClozeCount;

    let mechanicDiversity: number;
    if (wActiveCount === 0) {
      mechanicDiversity =
        stageTheme.stage <= 2
          ? 3.5
          : stageTheme.stage <= 4
            ? 2.8
            : stageTheme.stage <= 6
              ? 2.3
              : stageTheme.stage <= 8
                ? 1.9
                : 1.5;
    } else {
      const distinctActiveTypes =
        (wListenCount > 0 ? 1 : 0) +
        (wBuildCount > 0 ? 1 : 0) +
        (wMatchCount > 0 ? 1 : 0) +
        (wClozeCount > 0 ? 1 : 0);
      const activeShare = wChs.length > 0 ? wActiveCount / wChs.length : 0;
      const base = stageTheme.stage <= 2 ? 3.5 : 2.2;
      mechanicDiversity = clampScore(base + distinctActiveTypes * 0.9 + Math.min(1.0, activeShare * 2.5));
    }

    const compositeScore = round1(
      sentenceScaling * 0.25 +
        grammarProgression * 0.25 +
        spiralReinforcement * 0.20 +
        distractorRigor * 0.15 +
        mechanicDiversity * 0.15
    );

    const completions = wChs.reduce((acc, c) => acc + c.completions, 0);
    const mistakes = wChs.reduce((acc, c) => acc + c.mistakes, 0);
    const totalAttempts = completions + mistakes;
    const mistakeRatePct = totalAttempts > 0 ? round1((mistakes / totalAttempts) * 100) : null;
    const maxLearnersReachedInWorld = wUnits.reduce(
      (mx, u) => Math.max(mx, u.uniqueLearnersReached),
      0
    );

    const level: 1 | 2 | 3 = stageTheme.stage <= 4 ? 1 : stageTheme.stage <= 8 ? 2 : 3;

    return {
      stage: stageTheme.stage,
      id: stageTheme.id,
      name: stageTheme.stageName,
      badgeLabel: stageTheme.stageBadgeLabel,
      unitRange: stageTheme.unitRange,
      level,
      challengeCount: n,
      selectCount,
      assistCount,
      selectPct: n > 0 ? round1((selectCount / n) * 100) : 0,
      assistPct: n > 0 ? round1((assistCount / n) * 100) : 0,
      avgWordsAll,
      avgWordsL1,
      avgWordsL2,
      avgWordsL3,
      avgWordsL4,
      avgWordsL3L4,
      maxWords,
      uniqueContentStems: uniqueStems.size,
      introducedStemsCount: introducedStems.size,
      forwardRetentionPct,
      backwardSpiralTokenPct,
      backwardSpiralChallengePct,
      withinWorldCrossUnitSpiralPct,
      siloedUnitCount,
      abstractVocabRatio,
      avgDistractorHardness,
      minimalPairPct,
      wordCountParityPct,
      grammar,
      estimatedCefr,
      targetCefr,
      actualDifficultyIndex,
      idealDifficultyIndex,
      difficultyDelta,
      rubric: {
        sentenceScaling,
        grammarProgression,
        spiralReinforcement,
        distractorRigor,
        mechanicDiversity,
        compositeScore,
      },
      completions,
      mistakes,
      mistakeRatePct,
      maxLearnersReachedInWorld,
    };
  });

  // Pillar 3: Duolingo Cognitive Ladder
  const totalCh = challengeMetricsList.length;
  const selectTotal = challengeMetricsList.filter((c) => c.type === "SELECT").length;
  const assistTotal = challengeMetricsList.filter((c) => c.type === "ASSIST").length;
  const listenTotal = challengeMetricsList.filter((c) => c.type === "LISTEN").length;
  const matchTotal = challengeMetricsList.filter((c) => c.type === "MATCH_PAIRS").length;
  const buildTotal = challengeMetricsList.filter((c) => c.type === "BUILD_SENTENCE").length;
  const clozeTotal = challengeMetricsList.filter((c) => c.type === "CLOZE").length;

  const mechanicLadder: MechanicLadderRow[] = [
    {
      tier: 1,
      mechanic: "Visual Scaffold Recognition",
      code: "SELECT",
      cognitiveLevel: "Passive Recognition (A1 Entry)",
      implemented: selectTotal > 0,
      challengeCount: selectTotal,
      sharePct: totalCh > 0 ? round1((selectTotal / totalCh) * 100) : 0,
    },
    {
      tier: 2,
      mechanic: "Translation Recognition (4-Option MC)",
      code: "ASSIST",
      cognitiveLevel: "Passive Recognition (Text-Only)",
      implemented: assistTotal > 0,
      challengeCount: assistTotal,
      sharePct: totalCh > 0 ? round1((assistTotal / totalCh) * 100) : 0,
    },
    {
      tier: 3,
      mechanic: "Audio-Only Listening Comprehension",
      code: "LISTEN",
      cognitiveLevel: "Auditory Decoding (No English Cue)",
      implemented: listenTotal > 0,
      challengeCount: listenTotal,
      sharePct: totalCh > 0 ? round1((listenTotal / totalCh) * 100) : 0,
    },
    {
      tier: 4,
      mechanic: "Rapid Vocabulary Pair Matching",
      code: "MATCH_PAIRS",
      cognitiveLevel: "Speed Lexical Retrieval",
      implemented: matchTotal > 0,
      challengeCount: matchTotal,
      sharePct: totalCh > 0 ? round1((matchTotal / totalCh) * 100) : 0,
    },
    {
      tier: 5,
      mechanic: "Word-Bank Sentence Assembly",
      code: "BUILD_SENTENCE",
      cognitiveLevel: "Active Production & Word Order",
      implemented: buildTotal > 0,
      challengeCount: buildTotal,
      sharePct: totalCh > 0 ? round1((buildTotal / totalCh) * 100) : 0,
    },
    {
      tier: 6,
      mechanic: "Cloze / Case & Verb Ending Drill",
      code: "CLOZE",
      cognitiveLevel: "Morphological Production (A2–B1)",
      implemented: clozeTotal > 0,
      challengeCount: clozeTotal,
      sharePct: totalCh > 0 ? round1((clozeTotal / totalCh) * 100) : 0,
    },
  ];

  // Pillar 4: Telemetry Highlights
  const attemptedChallenges = challengeMetricsList.filter(
    (c) => c.completions + c.mistakes >= 3 && c.mistakeRatePct !== null
  );
  const hardestChallenges: HardestChallengeSummary[] = [...attemptedChallenges]
    .sort((a, b) =>
      (b.mistakeRatePct ?? 0) !== (a.mistakeRatePct ?? 0)
        ? (b.mistakeRatePct ?? 0) - (a.mistakeRatePct ?? 0)
        : b.mistakes - a.mistakes
    )
    .slice(0, 15)
    .map((c) => ({
      challengeId: c.challengeId,
      unitOrder: c.unitOrder,
      worldStage: c.worldStage,
      lessonOrder: c.lessonOrder,
      challengeOrder: c.challengeOrder,
      type: c.type,
      question: c.question,
      correctText: c.correctText,
      completions: c.completions,
      mistakes: c.mistakes,
      mistakeRatePct: c.mistakeRatePct ?? 0,
    }));

  const earlyDifficultySpikes: HardestChallengeSummary[] = attemptedChallenges
    .filter((c) => c.worldStage <= 2 && (c.mistakeRatePct ?? 0) >= 25)
    .sort((a, b) => (b.mistakeRatePct ?? 0) - (a.mistakeRatePct ?? 0))
    .slice(0, 10)
    .map((c) => ({
      challengeId: c.challengeId,
      unitOrder: c.unitOrder,
      worldStage: c.worldStage,
      lessonOrder: c.lessonOrder,
      challengeOrder: c.challengeOrder,
      type: c.type,
      question: c.question,
      correctText: c.correctText,
      completions: c.completions,
      mistakes: c.mistakes,
      mistakeRatePct: c.mistakeRatePct ?? 0,
    }));

  const easiestLateChallengesCount = challengeMetricsList.filter(
    (c) => c.worldStage >= 5 && c.completions >= 1 && c.mistakes === 0
  ).length;

  const worldReachFunnel = worldMetricsList.map((w) => ({
    stage: w.stage,
    name: w.name,
    learnersReached: w.maxLearnersReachedInWorld,
  }));

  // Diagnostic Flags (only evaluate worlds that actually contain challenges)
  const complexityDips: PedagogyAuditReport["flags"]["complexityDips"] = [];
  for (let i = 1; i < worldMetricsList.length; i++) {
    const prev = worldMetricsList[i - 1];
    const curr = worldMetricsList[i];
    if (prev.challengeCount > 0 && curr.challengeCount > 0 && curr.avgWordsAll < prev.avgWordsAll - 0.15) {
      complexityDips.push({
        stage: curr.stage,
        name: curr.name,
        avgWordsAll: curr.avgWordsAll,
        prevAvgWordsAll: prev.avgWordsAll,
        delta: round2(curr.avgWordsAll - prev.avgWordsAll),
      });
    }
  }

  const siloedWorlds = worldMetricsList
    .filter((w) => w.challengeCount > 0 && w.stage > 1 && (w.backwardSpiralChallengePct ?? 0) < 35)
    .map((w) => ({
      stage: w.stage,
      name: w.name,
      backwardSpiralChallengePct: w.backwardSpiralChallengePct ?? 0,
    }));

  const lowMinimalPairWorlds = worldMetricsList
    .filter((w) => w.challengeCount > 0 && w.stage >= 5 && w.minimalPairPct < 20)
    .map((w) => ({
      stage: w.stage,
      name: w.name,
      minimalPairPct: w.minimalPairPct,
    }));

  const missingGrammarMilestones = worldMetricsList
    .filter((w) => w.challengeCount > 0)
    .map((w) => ({
      stage: w.stage,
      name: w.name,
      missing: checkExpectedWorldMilestones(w.stage, w.grammar, w.challengeCount),
    }))
    .filter((x) => x.missing.length > 0);

  const validFwd = worldMetricsList
    .map((w) => w.forwardRetentionPct)
    .filter((v): v is number => v !== null);
  const validBwd = worldMetricsList
    .map((w) => w.backwardSpiralChallengePct)
    .filter((v): v is number => v !== null);
  const populatedWorlds = worldMetricsList.filter((w) => w.challengeCount > 0);

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      worlds: worldMetricsList.length,
      units: unitMetricsList.length,
      lessons: input.lessons.length,
      challenges: totalCh,
      options: input.options.length,
      selectChallenges: selectTotal,
      assistChallenges: assistTotal,
      totalUniqueStems: cumulativeWorldStems.size,
      overallAvgWords: round2(avg(challengeMetricsList.map((c) => c.wordCount))),
      overallAvgWordsL3L4: round2(
        avg(challengeMetricsList.filter((c) => c.lessonOrder >= 3).map((c) => c.wordCount))
      ),
      overallForwardRetentionPct: round1(avg(validFwd)),
      overallBackwardSpiralChallengePct: round1(avg(validBwd)),
      overallDistractorHardness: round1(avg(challengeMetricsList.map((c) => c.distractorHardness))),
      overallMinimalPairPct:
        totalCh > 0
          ? round1((challengeMetricsList.filter((c) => c.isMinimalPair).length / totalCh) * 100)
          : 0,
      overallCompositeRubric:
        populatedWorlds.length > 0
          ? round1(avg(populatedWorlds.map((w) => w.rubric.compositeScore)))
          : 0,
    },
    worlds: worldMetricsList,
    units: unitMetricsList,
    mechanicLadder,
    telemetry: {
      overview: input.telemetryOverview,
      worldReachFunnel,
      hardestChallenges,
      easiestLateChallengesCount,
      earlyDifficultySpikes,
    },
    flags: {
      complexityDips,
      siloedWorlds,
      lowMinimalPairWorlds,
      missingGrammarMilestones,
    },
  };
}

// ============================================================================
// Formatters (Markdown & CSV)
// ============================================================================

export function formatReportAsMarkdown(report: PedagogyAuditReport): string {
  const lines: string[] = [];
  lines.push("# CroLingo Pedagogical Telemetry Audit (CR-094)");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Executive Totals");
  lines.push(
    `- **Curriculum Scale:** ${report.totals.worlds} Worlds | ${report.totals.units} Units | ${report.totals.lessons} Lessons | ${report.totals.challenges} Challenges | ${report.totals.options} Options`
  );
  lines.push(
    `- **Mechanics:** SELECT ${report.totals.selectChallenges} (${round1((report.totals.selectChallenges / Math.max(1, report.totals.challenges)) * 100)}%) | ASSIST ${report.totals.assistChallenges} (${round1((report.totals.assistChallenges / Math.max(1, report.totals.challenges)) * 100)}%) | Active Production: 0%`
  );
  lines.push(
    `- **Lexical & Sentence Averages:** ${report.totals.totalUniqueStems} unique Croatian stems | Avg Words (All): ${report.totals.overallAvgWords} | Avg Words (L3–L4): ${report.totals.overallAvgWordsL3L4}`
  );
  lines.push(
    `- **Spiral & Distractor Averages:** Forward Retention: ${report.totals.overallForwardRetentionPct}% | Backward Challenge Spiral: ${report.totals.overallBackwardSpiralChallengePct}% | Distractor Hardness: ${report.totals.overallDistractorHardness}/100 | Minimal-Pair Rate: ${report.totals.overallMinimalPairPct}%`
  );
  lines.push(
    `- **Overall Duolingo Alignment Score:** **${report.totals.overallCompositeRubric} / 5.0**`
  );
  lines.push("");

  lines.push("## World-by-World Quantitative Metrics (Worlds 1–12)");
  lines.push(
    "| World | Name | Ch | SEL/AST | AvgW (All) | AvgW (L3-4) | MaxW | Stems (New) | Fwd Ret% | Bwd Spiral% | Hardness | MinPair% | Actual/Ideal Diff | Mistake% | Rubric |"
  );
  lines.push(
    "| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |"
  );
  for (const w of report.worlds) {
    lines.push(
      `| W${w.stage} | ${w.name} | ${w.challengeCount} | ${w.selectPct}%/${w.assistPct}% | ${w.avgWordsAll} | ${w.avgWordsL3L4} | ${w.maxWords} | ${w.uniqueContentStems} (${w.introducedStemsCount}) | ${w.forwardRetentionPct === null ? "N/A" : `${w.forwardRetentionPct}%`} | ${w.backwardSpiralChallengePct === null ? "N/A" : `${w.backwardSpiralChallengePct}%`} | ${w.avgDistractorHardness} | ${w.minimalPairPct}% | ${w.actualDifficultyIndex}/${w.idealDifficultyIndex} | ${w.mistakeRatePct === null ? "N/A" : `${w.mistakeRatePct}%`} | **${w.rubric.compositeScore}/5** |`
    );
  }
  lines.push("");

  lines.push("## World-by-World Croatian Grammar & CEFR Matrix");
  lines.push(
    "| World | Target CEFR | Estimated CEFR | PresSg | PresPl | Refl(se) | Past | FuturI | Imp | Cond | Acc | Loc | Gen | Inst | Dat | Voc | Prep | Sub/Comp | AvgSyntax |"
  );
  lines.push(
    "| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |"
  );
  for (const w of report.worlds) {
    const g = w.grammar;
    lines.push(
      `| W${w.stage} | ${w.targetCefr} | ${w.estimatedCefr} | ${g.presentSingular} | ${g.presentPlural} | ${g.reflexiveSe} | ${g.pastPerfekt} | ${g.futureFuturI} | ${g.imperative} | ${g.conditional} | ${g.caseAccusative} | ${g.caseLocative} | ${g.caseGenitive} | ${g.caseInstrumental} | ${g.caseDative} | ${g.caseVocative} | ${g.prepositionalPhrase} | ${g.subordinateOrCompound} | ${g.avgSyntaxTier} |`
    );
  }
  lines.push("");

  lines.push("## Unit-by-Unit Metrics (Units 1–60)");
  lines.push(
    "| Unit | World | Description | Ch | AvgW | L1 | L2 | L3 | L4 | MaxW | Stems (New) | BwdSpiral% | Hardness | MinPair% | Actual | Ideal | Delta | Reached | Mistake% |"
  );
  lines.push(
    "| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |"
  );
  for (const u of report.units) {
    lines.push(
      `| U${String(u.unitOrder).padStart(2, "0")} | W${u.worldStage} | ${u.description.replace(/\|/g, "/")} | ${u.challengeCount} | ${u.avgWordsAll} | ${u.avgWordsL1} | ${u.avgWordsL2} | ${u.avgWordsL3} | ${u.avgWordsL4} | ${u.maxWords} | ${u.uniqueContentStems} (${u.netNewStems}) | ${u.backwardWorldSpiralPct === null ? "N/A" : `${u.backwardWorldSpiralPct}%`} | ${u.avgDistractorHardness} | ${u.minimalPairPct}% | ${u.actualDifficultyIndex} | ${u.idealDifficultyIndex} | ${u.difficultyDelta >= 0 ? `+${u.difficultyDelta}` : u.difficultyDelta} | ${u.uniqueLearnersReached} | ${u.mistakeRatePct === null ? "N/A" : `${u.mistakeRatePct}%`} |`
    );
  }
  lines.push("");

  return lines.join("\n");
}

function csvEscape(val: string | number | null): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function formatUnitsAsCsv(report: PedagogyAuditReport): string {
  const headers = [
    "unit_order",
    "world_stage",
    "world_name",
    "description",
    "challenges",
    "select_pct",
    "assist_pct",
    "avg_words_all",
    "avg_words_l1",
    "avg_words_l2",
    "avg_words_l3",
    "avg_words_l4",
    "avg_words_l3l4",
    "max_words",
    "unique_stems",
    "net_new_stems",
    "abstract_vocab_pct",
    "backward_world_spiral_pct",
    "backward_unit_spiral_pct",
    "sentence_recycling_pct",
    "distractor_hardness",
    "minimal_pair_pct",
    "word_count_parity_pct",
    "avg_syntax_tier",
    "actual_difficulty",
    "ideal_difficulty",
    "difficulty_delta",
    "completions",
    "mistakes",
    "mistake_rate_pct",
    "unique_learners_reached",
  ];
  const rows = [headers.join(",")];
  for (const u of report.units) {
    rows.push(
      [
        u.unitOrder,
        u.worldStage,
        u.worldName,
        u.description,
        u.challengeCount,
        u.selectPct,
        u.assistPct,
        u.avgWordsAll,
        u.avgWordsL1,
        u.avgWordsL2,
        u.avgWordsL3,
        u.avgWordsL4,
        u.avgWordsL3L4,
        u.maxWords,
        u.uniqueContentStems,
        u.netNewStems,
        u.abstractVocabRatio,
        u.backwardWorldSpiralPct,
        u.backwardUnitSpiralPct,
        u.sentenceRecyclingRatePct,
        u.avgDistractorHardness,
        u.minimalPairPct,
        u.wordCountParityPct,
        u.grammar.avgSyntaxTier,
        u.actualDifficultyIndex,
        u.idealDifficultyIndex,
        u.difficultyDelta,
        u.completions,
        u.mistakes,
        u.mistakeRatePct,
        u.uniqueLearnersReached,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return rows.join("\n");
}

export function formatWorldsAsCsv(report: PedagogyAuditReport): string {
  const headers = [
    "world_stage",
    "world_name",
    "level",
    "unit_start",
    "unit_end",
    "challenges",
    "select_pct",
    "assist_pct",
    "avg_words_all",
    "avg_words_l3l4",
    "max_words",
    "unique_stems",
    "introduced_stems",
    "forward_retention_pct",
    "backward_spiral_token_pct",
    "backward_spiral_challenge_pct",
    "within_world_spiral_pct",
    "siloed_units",
    "abstract_vocab_pct",
    "distractor_hardness",
    "minimal_pair_pct",
    "target_cefr",
    "estimated_cefr",
    "actual_difficulty",
    "ideal_difficulty",
    "difficulty_delta",
    "rubric_sentence",
    "rubric_grammar",
    "rubric_spiral",
    "rubric_distractor",
    "rubric_mechanic",
    "rubric_composite",
    "completions",
    "mistakes",
    "mistake_rate_pct",
    "max_learners_reached",
  ];
  const rows = [headers.join(",")];
  for (const w of report.worlds) {
    rows.push(
      [
        w.stage,
        w.name,
        w.level,
        w.unitRange[0],
        w.unitRange[1],
        w.challengeCount,
        w.selectPct,
        w.assistPct,
        w.avgWordsAll,
        w.avgWordsL3L4,
        w.maxWords,
        w.uniqueContentStems,
        w.introducedStemsCount,
        w.forwardRetentionPct,
        w.backwardSpiralTokenPct,
        w.backwardSpiralChallengePct,
        w.withinWorldCrossUnitSpiralPct,
        w.siloedUnitCount,
        w.abstractVocabRatio,
        w.avgDistractorHardness,
        w.minimalPairPct,
        w.targetCefr,
        w.estimatedCefr,
        w.actualDifficultyIndex,
        w.idealDifficultyIndex,
        w.difficultyDelta,
        w.rubric.sentenceScaling,
        w.rubric.grammarProgression,
        w.rubric.spiralReinforcement,
        w.rubric.distractorRigor,
        w.rubric.mechanicDiversity,
        w.rubric.compositeScore,
        w.completions,
        w.mistakes,
        w.mistakeRatePct,
        w.maxLearnersReachedInWorld,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return rows.join("\n");
}
