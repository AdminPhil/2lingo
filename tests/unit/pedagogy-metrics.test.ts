import { describe, it, expect } from "vitest";
import {
  analyzeCroatianGrammar,
  computePedagogyAuditReport,
  croatianStem,
  extractContentStems,
  formatReportAsMarkdown,
  formatUnitsAsCsv,
  formatWorldsAsCsv,
  getIdealDifficultyForUnit,
  isAbstractConcept,
  levenshteinDistance,
  normalizedCharSimilarity,
  tokenJaccardSimilarity,
  tokenizeCroatian,
} from "@/lib/pedagogy-metrics";

describe("Pedagogy Metrics Engine (CR-094)", () => {
  describe("Croatian Tokenization & Stemming", () => {
    it("preserves Croatian diacritics and strips punctuation", () => {
      expect(tokenizeCroatian("Čestitamo, završili ste dvanaesti svijet!")).toEqual([
        "čestitamo",
        "završili",
        "ste",
        "dvanaesti",
        "svijet",
      ]);
      expect(tokenizeCroatian("")).toEqual([]);
      expect(tokenizeCroatian("   ... !? ")).toEqual([]);
    });

    it("stems inflected Croatian nouns to common roots for spiral tracking", () => {
      expect(croatianStem("dvorac")).toBe("dvorac");
      expect(croatianStem("dvorca")).toBe("dvorac");
      expect(croatianStem("dvorcu")).toBe("dvorac");
      expect(croatianStem("voda")).toBe("vod");
      expect(croatianStem("vodu")).toBe("vod");
      expect(croatianStem("stijenama")).toBe("stijen");
      expect(croatianStem("stijena")).toBe("stijen");
      // Short words are preserved intact
      expect(croatianStem("pas")).toBe("pas");
      expect(croatianStem("vrh")).toBe("vrh");
      // Croatian palatalization & fleeting-a alternations
      expect(croatianStem("otok")).toBe("otok");
      expect(croatianStem("otoci")).toBe("otok");
      expect(croatianStem("knjiga")).toBe("knjig");
      expect(croatianStem("knjizi")).toBe("knjig");
      expect(croatianStem("oblak")).toBe("oblak");
      expect(croatianStem("oblaci")).toBe("oblak");
      expect(croatianStem("san")).toBe("san");
      expect(croatianStem("snovi")).toBe("san");
    });

    it("does not misclassify concrete A1 words/numbers as abstract concepts", () => {
      expect(isAbstractConcept("Pet", 'Which one of these is "Five (5)"?')).toBe(false);
      expect(isAbstractConcept("Veliki pas", 'Which one means "Big dog"?')).toBe(false);
      expect(isAbstractConcept("Mala mačka", '"Little cat"')).toBe(false);
      expect(isAbstractConcept("Svijetla svjetlost", 'How do you say "Bright light"?')).toBe(true);
      expect(isAbstractConcept("Petak", '"Friday"')).toBe(true);
    });

    it("excludes Croatian stopwords from content stems", () => {
      const stems = extractContentStems("Mi idemo u veliku šumu i gledamo more.");
      expect(stems).not.toContain("mi");
      expect(stems).not.toContain("u");
      expect(stems).not.toContain("i");
      expect(stems).toContain("šum");
      expect(stems).toContain("mor");
    });
  });

  describe("Distractor Similarity & Minimal-Pair Metrics", () => {
    it("computes Levenshtein distance and normalized similarity accurately", () => {
      expect(levenshteinDistance("luku", "luci")).toBe(2);
      expect(levenshteinDistance("", "")).toBe(0);
      expect(levenshteinDistance("abc", "")).toBe(3);
      expect(normalizedCharSimilarity("U luku", "U luci")).toBeGreaterThan(0.6);
      expect(normalizedCharSimilarity("", "")).toBe(1);
    });

    it("distinguishes minimal-pair distractors from disjoint sentences via Jaccard overlap", () => {
      const minimalPair = tokenJaccardSimilarity("Idemo u luku.", "Idemo u luci.");
      const sharedAux = tokenJaccardSimilarity("Učit ćemo o svemiru.", "Putovat ćemo u svemir.");
      const disjoint = tokenJaccardSimilarity(
        "Velebit čuva rijetko bilje.",
        "Hladna bura puše s planine."
      );
      expect(minimalPair).toBeCloseTo(0.5, 2);
      expect(sharedAux).toBeCloseTo(1 / 7, 3);
      expect(disjoint).toBe(0);
    });
  });

  describe("Croatian Grammar & Syntax Classifier (Unicode Diacritic-Safe)", () => {
    it("detects Futur I with Croatian diacritic ć without false positives on kreće", () => {
      const futur = analyzeCroatianGrammar("Učit ćemo o svemiru.", 'How do you say "We will learn about the universe."?');
      expect(futur.futureFuturI).toBe(true);
      expect(futur.presentPlural).toBe(false);
      expect(futur.caseLocative).toBe(true);

      // Regression guard: "kreće" ends with "će" and MUST NOT trigger Futur I!
      const reflexive = analyzeCroatianGrammar("Konj se kreće brzo.", 'Select: "The horse moves fast."');
      expect(reflexive.futureFuturI).toBe(false);
      expect(reflexive.reflexiveSe).toBe(true);
      expect(reflexive.presentSingular).toBe(true);
    });

    it("detects Perfekt (past tense) and Conditional mood accurately", () => {
      const past = analyzeCroatianGrammar(
        "Čestitamo, završili ste dvanaesti svijet!",
        'Select: "Congratulations, you have completed the twelfth world!"'
      );
      expect(past.pastPerfekt).toBe(true);
      expect(past.conditional).toBe(false);

      const cond = analyzeCroatianGrammar("Htio bih čašu vode.", 'Select: "I would like a glass of water."');
      expect(cond.conditional).toBe(true);
      expect(cond.caseGenitive).toBe(true);

      // Regression guards against non-participle -la/-lo/-le false positives
      expect(analyzeCroatianGrammar("Gdje su mi cipele", '"Where are my shoes?"').pastPerfekt).toBe(false);
      expect(analyzeCroatianGrammar("More je toplo i plavo danas.", '"The sea is warm and blue today."').pastPerfekt).toBe(false);
      expect(analyzeCroatianGrammar("Nikola Tesla je slavni izumitelj.", '"Nikola Tesla is a famous inventor."').pastPerfekt).toBe(false);
      expect(analyzeCroatianGrammar("Zidine su vrlo visoke.", '"The fortress walls are very high."').pastPerfekt).toBe(false);
    });

    it("distinguishes true imperatives from declarative verbs/adjectives", () => {
      expect(analyzeCroatianGrammar("Otvori prozor", '"Open the window"').imperative).toBe(true);
      expect(analyzeCroatianGrammar("Skreni lijevo.", 'Translate to Croatian: "Turn left."').imperative).toBe(true);
      expect(analyzeCroatianGrammar("Skoči", '"Jump!"').imperative).toBe(true);
      // Regression guards: declarative sentences & adjectives MUST NOT trigger imperative
      expect(analyzeCroatianGrammar("Gledam", 'Which one of these is "I watch / look"?').imperative).toBe(false);
      expect(analyzeCroatianGrammar("Blizu", '"Near / Close"').imperative).toBe(false);
      expect(analyzeCroatianGrammar("Otvaram teška vrata ključem.", '"I open the heavy door with a key."').imperative).toBe(false);
      expect(analyzeCroatianGrammar("Slušamo valove na šetnici.", '"We listen to the waves on the promenade."').imperative).toBe(false);
    });

    it("separates Locative vs Accusative, Dative, Vocative, Genitive, and Instrumental accurately", () => {
      // Static u/na + masc/neut -u is Locative ONLY, not Accusative
      const loc = analyzeCroatianGrammar("Bili smo u dvorcu.", '"We were in the castle."');
      expect(loc.caseLocative).toBe(true);
      expect(loc.caseAccusative).toBe(false);

      // Motion u/na + fem -u is Accusative ONLY, not Locative
      const accMotion = analyzeCroatianGrammar("Brod ulazi u luku.", '"The ship enters the port."');
      expect(accMotion.caseAccusative).toBe(true);
      expect(accMotion.caseLocative).toBe(false);

      // o vitezu / na konju are Locative, NOT Dative
      expect(analyzeCroatianGrammar("Slušamo staru legendu o vitezu.", '"We listen to a legend about a knight."').caseDative).toBe(false);
      expect(analyzeCroatianGrammar("Pobjednik se raduje na konju.", '"The winner rejoices on the horse."').caseDative).toBe(false);
      // Genuine Dative
      expect(analyzeCroatianGrammar("Radujemo se vikendu.", '"We look forward to the weekend."').caseDative).toBe(true);
      expect(analyzeCroatianGrammar("Utočište pomaže mladim medvjedima.", '"The sanctuary helps young bears."').caseDative).toBe(true);

      // Vocative vs Nominative adjective "Hrvatska"
      expect(analyzeCroatianGrammar("Hrvatska zastava", '"Croatian flag"').caseVocative).toBe(false);
      expect(analyzeCroatianGrammar("Dobra večer bako.", '"Good evening grandma."').caseVocative).toBe(true);

      // Genitive vs Nominative "Puna baterija"
      expect(analyzeCroatianGrammar("Puna baterija", '"Full battery"').caseGenitive).toBe(false);
      expect(analyzeCroatianGrammar("Nakon škole radim zadaću.", '"After school I do my homework."').caseGenitive).toBe(true);
      expect(analyzeCroatianGrammar("Kuhinja je puna topline.", '"The kitchen is full of warmth."').caseGenitive).toBe(true);

      // Instrumental (with intervening adjective & bare nouns) vs Locative plural "na stijenama"
      expect(analyzeCroatianGrammar("Sunce sja nad zlatnim poljem.", '"The sun shines over the golden field."').caseInstrumental).toBe(true);
      expect(analyzeCroatianGrammar("Otvaram teška vrata ključem.", '"I open the heavy door with a key."').caseInstrumental).toBe(true);
      expect(analyzeCroatianGrammar("Žuta degenija raste na stijenama.", '"Yellow degenia grows on the rocks."').caseInstrumental).toBe(false);
    });

    it("distinguishes true coordinated/subordinate clauses from simple noun or adjective coordination", () => {
      const nounCoord = analyzeCroatianGrammar(
        "Gorštaci čuvaju snagu i gostoljubivost.",
        'Select: "Highlanders preserve strength and hospitality."'
      );
      expect(nounCoord.subordinateOrCompound).toBe(false);
      expect(nounCoord.syntaxTier).toBe(3);

      const adjCoord = analyzeCroatianGrammar(
        "More je toplo i plavo danas.",
        '"The sea is warm and blue today."'
      );
      expect(adjCoord.subordinateOrCompound).toBe(false);

      const twoVerbs = analyzeCroatianGrammar(
        "Plešemo i pjevamo na karnevalu.",
        'Select: "We dance and sing at the carnival."'
      );
      expect(twoVerbs.subordinateOrCompound).toBe(true);
      expect(twoVerbs.syntaxTier).toBe(5);
      expect(twoVerbs.caseLocative).toBe(true);

      const twoSgVerbs = analyzeCroatianGrammar(
        "Skačem u more i hvatam val.",
        '"I jump into the sea and catch the wave."'
      );
      expect(twoSgVerbs.subordinateOrCompound).toBe(true);

      const subord = analyzeCroatianGrammar(
        "Idemo u šumu jer volimo prirodu.",
        'Select: "We go to the forest because we love nature."'
      );
      expect(subord.subordinateOrCompound).toBe(true);
      expect(subord.syntaxTier).toBe(5);
    });

    it("detects Instrumental, Genitive, Dative, and single-word Tier 1 syntax", () => {
      const single = analyzeCroatianGrammar("Vrh", 'Which one of these is "Summit"?');
      expect(single.syntaxTier).toBe(1);

      const instr = analyzeCroatianGrammar(
        "Pjesma odjekuje ličkim poljima.",
        'Select: "Song echoes through the fields of Lika."'
      );
      expect(instr.caseInstrumental).toBe(true);

      const dat = analyzeCroatianGrammar(
        "Publika plješće veselim maskama.",
        'Select: "The audience applauds the cheerful masks."'
      );
      expect(dat.caseDative).toBe(true);
    });
  });

  describe("Ideal Difficulty Curve & Full Report Aggregation", () => {
    it("scales ideal difficulty monotonically across World boundaries from Unit 1 to Unit 60", () => {
      const u1 = getIdealDifficultyForUnit(1);
      const u30 = getIdealDifficultyForUnit(30);
      const u60 = getIdealDifficultyForUnit(60);
      expect(u1).toBeGreaterThanOrEqual(10);
      expect(u1).toBeLessThan(20);
      expect(u30).toBeGreaterThan(40);
      expect(u60).toBeGreaterThan(85);
      expect(u60).toBeLessThanOrEqual(92);
    });

    it("computes end-to-end metrics, detects complexity dips, and formats Markdown & CSV safely", () => {
      const units = [
        { id: 1, order: 1, title: "Unit 1", description: 'Intro, "Basics"' },
        { id: 2, order: 6, title: "Unit 6", description: "Coast" },
        { id: 3, order: 11, title: "Unit 11", description: "Dip World" },
      ];
      const lessons = [
        { id: 1, unitId: 1, order: 1, title: "L1" },
        { id: 2, unitId: 1, order: 3, title: "L3" },
        { id: 3, unitId: 2, order: 3, title: "L3" },
        { id: 4, unitId: 3, order: 3, title: "L3" },
      ];
      const challenges = [
        { id: 10, lessonId: 1, unitOrder: 1, lessonOrder: 1, order: 1, type: "SELECT", question: '"Water"' },
        { id: 11, lessonId: 2, unitOrder: 1, lessonOrder: 3, order: 1, type: "ASSIST", question: '"I drink water"' },
        { id: 20, lessonId: 3, unitOrder: 6, lessonOrder: 3, order: 1, type: "ASSIST", question: '"We watch the blue sea and water"' },
        { id: 30, lessonId: 4, unitOrder: 11, lessonOrder: 3, order: 1, type: "ASSIST", question: '"Tree"' },
      ];
      const options = [
        // Ch 10
        { id: 1, challengeId: 10, text: "Voda", correct: true, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
        { id: 2, challengeId: 10, text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
        { id: 3, challengeId: 10, text: "Pas", correct: false, imageSrc: "/dog.svg", audioSrc: "/audio/hr/pas.mp3" },
        { id: 4, challengeId: 10, text: "Mačka", correct: false, imageSrc: "/cat.svg", audioSrc: "/audio/hr/macka.mp3" },
        // Ch 11 (minimal pair with distractor "Pijem mlijeko")
        { id: 5, challengeId: 11, text: "Pijem vodu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/pijem_vodu.mp3" },
        { id: 6, challengeId: 11, text: "Pijem mlijeko.", correct: false, imageSrc: null, audioSrc: "/audio/hr/pijem_mlijeko.mp3" },
        { id: 7, challengeId: 11, text: "Jedem kruh.", correct: false, imageSrc: null, audioSrc: "/audio/hr/jedem_kruh.mp3" },
        { id: 8, challengeId: 11, text: "Vidim psa.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_psa.mp3" },
        // Ch 20 (World 2 - longer sentence recycling "voda")
        { id: 9, challengeId: 20, text: "Gledamo plavo more i vodu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/a.mp3" },
        { id: 10, challengeId: 20, text: "Slušamo ptice u šumi.", correct: false, imageSrc: null, audioSrc: "/audio/hr/b.mp3" },
        { id: 11, challengeId: 20, text: "Čitamo knjigu kod kuće.", correct: false, imageSrc: null, audioSrc: "/audio/hr/c.mp3" },
        { id: 12, challengeId: 20, text: "Igramo loptu na plaži.", correct: false, imageSrc: null, audioSrc: "/audio/hr/d.mp3" },
        // Ch 30 (World 3 - intentional word-length dip back to 1 word)
        { id: 13, challengeId: 30, text: "Drvo", correct: true, imageSrc: null, audioSrc: "/audio/hr/drvo.mp3" },
        { id: 14, challengeId: 30, text: "Kuća", correct: false, imageSrc: null, audioSrc: "/audio/hr/kuca.mp3" },
        { id: 15, challengeId: 30, text: "Auto", correct: false, imageSrc: null, audioSrc: "/audio/hr/auto.mp3" },
        { id: 16, challengeId: 30, text: "Kapa", correct: false, imageSrc: null, audioSrc: "/audio/hr/kapa.mp3" },
      ];

      const report = computePedagogyAuditReport({
        units,
        lessons,
        challenges,
        options,
        progressAgg: [
          { challengeId: 10, completions: 4, uniqueUsers: 4 },
          { challengeId: 11, completions: 2, uniqueUsers: 2 },
        ],
        mistakeAgg: [
          { challengeId: 10, mistakeCount: 1, uniqueUsers: 1 },
          { challengeId: 11, mistakeCount: 2, uniqueUsers: 2 },
        ],
        telemetryOverview: {
          totalLearners: 5,
          activeLearnersWithProgress: 4,
          activeLearnersWithMistakes: 2,
          totalCompletedChallenges: 6,
          totalMistakes: 3,
          unitReach: [{ unitOrder: 1, uniqueUsers: 4 }],
          funnelByMaxUnit: [{ maxUnitOrder: 1, learnerCount: 4 }],
        },
      });

      expect(report.totals.challenges).toBe(4);
      expect(report.totals.selectChallenges).toBe(1);
      expect(report.totals.assistChallenges).toBe(3);
      // World 2 recycled stem "vod" from World 1
      const w2 = report.worlds.find((w) => w.stage === 2)!;
      expect(w2.backwardSpiralChallengePct).toBe(100);
      // World 3 dipped from 5 words (W2) down to 1 word (W3)
      expect(report.flags.complexityDips.some((d) => d.stage === 3)).toBe(true);
      // Ch 11 has 2 mistakes / 4 attempts = 50% mistake rate -> early difficulty spike
      expect(report.telemetry.earlyDifficultySpikes.some((c) => c.challengeId === 11 && c.mistakeRatePct === 50)).toBe(true);

      // Verify formatters handle commas and quotes properly and include Vocative column
      const md = formatReportAsMarkdown(report);
      expect(md).toContain("# CroLingo Pedagogical Telemetry Audit (CR-094)");
      expect(md).toContain("| Voc |");
      // Empty worlds (W4..W12) MUST NOT trigger phantom complexity dips
      expect(report.flags.complexityDips.some((d) => d.stage >= 4)).toBe(false);
      const unitsCsv = formatUnitsAsCsv(report);
      expect(unitsCsv).toContain('"Intro, ""Basics"""');
      const worldsCsv = formatWorldsAsCsv(report);
      expect(worldsCsv.split("\n").length).toBe(13); // header + 12 worlds
    });

    it("measures withinWorldCrossUnitSpiralPct strictly within the same world (excluding prior worlds) and handles empty DB cleanly", () => {
      // World 1 U1 introduces "voda"; World 2 U6 introduces "planina"; World 2 U7 uses ONLY "voda" (from W1, NOT U6)
      const report = computePedagogyAuditReport({
        units: [
          { id: 1, order: 1, title: "U1", description: "W1 U1" },
          { id: 2, order: 6, title: "U6", description: "W2 U6" },
          { id: 3, order: 7, title: "U7", description: "W2 U7" },
        ],
        lessons: [
          { id: 1, unitId: 1, order: 1, title: "L1" },
          { id: 2, unitId: 2, order: 1, title: "L1" },
          { id: 3, unitId: 3, order: 2, title: "L2" },
        ],
        challenges: [
          { id: 1, lessonId: 1, unitOrder: 1, lessonOrder: 1, order: 1, type: "SELECT", question: '"Water"' },
          { id: 2, lessonId: 2, unitOrder: 6, lessonOrder: 1, order: 1, type: "SELECT", question: '"Mountain"' },
          { id: 3, lessonId: 3, unitOrder: 7, lessonOrder: 2, order: 1, type: "ASSIST", question: '"Water"' },
        ],
        options: [
          { id: 1, challengeId: 1, text: "Voda", correct: true, imageSrc: "/voda.svg", audioSrc: "/a.mp3" },
          { id: 2, challengeId: 2, text: "Planina", correct: true, imageSrc: "/p.svg", audioSrc: "/b.mp3" },
          { id: 3, challengeId: 3, text: "Voda", correct: true, imageSrc: null, audioSrc: "/a.mp3" },
        ],
        progressAgg: [],
        mistakeAgg: [],
        telemetryOverview: {
          totalLearners: 0,
          activeLearnersWithProgress: 0,
          activeLearnersWithMistakes: 0,
          totalCompletedChallenges: 0,
          totalMistakes: 0,
          unitReach: [],
          funnelByMaxUnit: [],
        },
      });
      const w2 = report.worlds.find((w) => w.stage === 2)!;
      // "Voda" came from W1, NOT earlier units of W2 -> within-world spiral MUST be 0%!
      expect(w2.withinWorldCrossUnitSpiralPct).toBe(0);
      expect(w2.backwardSpiralChallengePct).toBe(100);

      // Empty DB input must produce zero NaNs and zero phantom flags
      const empty = computePedagogyAuditReport({
        units: [],
        lessons: [],
        challenges: [],
        options: [],
        progressAgg: [],
        mistakeAgg: [],
        telemetryOverview: {
          totalLearners: 0,
          activeLearnersWithProgress: 0,
          activeLearnersWithMistakes: 0,
          totalCompletedChallenges: 0,
          totalMistakes: 0,
          unitReach: [],
          funnelByMaxUnit: [],
        },
      });
      expect(empty.totals.challenges).toBe(0);
      expect(empty.totals.overallCompositeRubric).toBe(0);
      expect(Number.isNaN(empty.totals.overallAvgWords)).toBe(false);
      expect(empty.flags.complexityDips).toEqual([]);
      expect(empty.flags.siloedWorlds).toEqual([]);
      expect(empty.flags.missingGrammarMilestones).toEqual([]);
    });
  });
});
