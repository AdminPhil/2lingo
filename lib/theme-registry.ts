export type RegionTheme = {
  id: string;
  stage: number;
  stageName: string;
  stageBadgeLabel: string;
  stageCroatianName: string; // Backward compatibility alias
  unitRange: [number, number];
  solidBg: string;
  gradient: string;
  badgeBg: string;
  accentEmoji: string;
  buttonClass: string;
  accentBorder: string;
  // Node button styling for learning path:
  nodeActiveBg: string;
  nodeBorderColor: string;
  nodeStrokeColor: string;
  nodeBadgeClasses: string;
  nodeArrowBorder: string;
};

export const LEVEL_1_STAGES: RegionTheme[] = [
  // World 1 (CR-023/CR-030/CR-031): Capital Adventure (Units 1–5)
  {
    id: "zagreb-central",
    stage: 1,
    stageName: "Capital Adventure",
    stageBadgeLabel: "World 1: Capital Adventure • Zagreb & Castles",
    stageCroatianName: "World 1: Capital Adventure • Zagreb & Castles",
    unitRange: [1, 5],
    solidBg: "bg-red-600",
    gradient: "from-red-600 via-rose-600 to-amber-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🏰",
    buttonClass: "bg-white text-rose-950 hover:bg-rose-50 border-rose-300",
    accentBorder: "border-red-400/50",
    nodeActiveBg: "bg-red-500 hover:bg-red-500/90 border-red-600 active:border-b-0 text-white",
    nodeBorderColor: "border-red-600",
    nodeStrokeColor: "#ef4444",
    nodeBadgeClasses: "bg-white text-red-600 border-red-400",
    nodeArrowBorder: "border-t-red-400",
  },
  // World 2 (CR-024/CR-030/CR-031): Coastal Explorer (Units 6–10)
  {
    id: "dalmatia-coast",
    stage: 2,
    stageName: "Coastal Explorer",
    stageBadgeLabel: "World 2: Coastal Explorer • Adriatic Sea & Islands",
    stageCroatianName: "World 2: Coastal Explorer • Adriatic Sea & Islands",
    unitRange: [6, 10],
    solidBg: "bg-sky-600",
    gradient: "from-sky-500 via-blue-600 to-cyan-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🌊",
    buttonClass: "bg-white text-blue-950 hover:bg-sky-50 border-sky-300",
    accentBorder: "border-sky-300/50",
    nodeActiveBg: "bg-sky-500 hover:bg-sky-500/90 border-sky-600 active:border-b-0 text-white",
    nodeBorderColor: "border-sky-600",
    nodeStrokeColor: "#0284c7",
    nodeBadgeClasses: "bg-white text-sky-600 border-sky-400",
    nodeArrowBorder: "border-t-sky-400",
  },
  // World 3 (CR-025/CR-030/CR-031): Nature Quest (Units 11–15)
  {
    id: "plitvice-slavonia",
    stage: 3,
    stageName: "Nature Quest",
    stageBadgeLabel: "World 3: Nature Quest • Plitvice Lakes & Golden Fields",
    stageCroatianName: "World 3: Nature Quest • Plitvice Lakes & Golden Fields",
    unitRange: [11, 15],
    solidBg: "bg-emerald-600",
    gradient: "from-emerald-600 via-teal-600 to-amber-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🌲",
    buttonClass: "bg-white text-emerald-950 hover:bg-emerald-50 border-emerald-300",
    accentBorder: "border-emerald-300/50",
    nodeActiveBg: "bg-emerald-500 hover:bg-emerald-500/90 border-emerald-600 active:border-b-0 text-white",
    nodeBorderColor: "border-emerald-600",
    nodeStrokeColor: "#10b981",
    nodeBadgeClasses: "bg-white text-emerald-600 border-emerald-400",
    nodeArrowBorder: "border-t-emerald-400",
  },
  // World 4 (CR-026/CR-030/CR-031/CR-032): King's Landing (Units 16–20)
  {
    id: "dubrovnik-heritage",
    stage: 4,
    stageName: "King's Landing",
    stageBadgeLabel: "World 4: King's Landing • Ancient Dubrovnik",
    stageCroatianName: "World 4: King's Landing • Ancient Dubrovnik",
    unitRange: [16, 20],
    solidBg: "bg-blue-900",
    gradient: "from-blue-900 via-indigo-900 to-amber-700",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "👑",
    buttonClass: "bg-amber-400 text-amber-950 hover:bg-amber-300 border-amber-500",
    accentBorder: "border-amber-400/50",
    nodeActiveBg: "bg-blue-800 hover:bg-blue-800/90 border-blue-950 active:border-b-0 text-white",
    nodeBorderColor: "border-blue-950",
    nodeStrokeColor: "#1e3a8a",
    nodeBadgeClasses: "bg-white text-blue-900 border-blue-700",
    nodeArrowBorder: "border-t-blue-700",
  },
];

export const LEVEL_2_STAGES: RegionTheme[] = [
  // World 5 (CR-076): Istrian Explorer (Units 21–25)
  {
    id: "istria-kvarner",
    stage: 5,
    stageName: "Istrian Explorer",
    stageBadgeLabel: "World 5: Istrian Explorer • Ancient Arena & Hilltop Towns",
    stageCroatianName: "World 5: Istrian Explorer • Ancient Arena & Hilltop Towns",
    unitRange: [21, 25],
    solidBg: "bg-amber-600",
    gradient: "from-amber-600 via-orange-600 to-teal-700",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🏛️",
    buttonClass: "bg-white text-amber-950 hover:bg-amber-50 border-amber-300",
    accentBorder: "border-amber-400/50",
    nodeActiveBg: "bg-amber-500 hover:bg-amber-500/90 border-amber-600 active:border-b-0 text-white",
    nodeBorderColor: "border-amber-600",
    nodeStrokeColor: "#d97706",
    nodeBadgeClasses: "bg-white text-amber-600 border-amber-400",
    nodeArrowBorder: "border-t-amber-400",
  },
  // World 6 (CR-079): Slavonian Hearth & River Castles (Units 26–30)
  {
    id: "slavonia-danube",
    stage: 6,
    stageName: "Slavonian Hearth",
    stageBadgeLabel: "World 6: Slavonian Hearth • Golden Plains & River Castles",
    stageCroatianName: "World 6: Slavonian Hearth • Golden Plains & River Castles",
    unitRange: [26, 30],
    solidBg: "bg-emerald-700",
    gradient: "from-amber-600 via-emerald-700 to-blue-900",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🌾",
    buttonClass: "bg-white text-emerald-950 hover:bg-emerald-50 border-emerald-300",
    accentBorder: "border-amber-400/50",
    nodeActiveBg: "bg-emerald-600 hover:bg-emerald-600/90 border-emerald-800 active:border-b-0 text-white",
    nodeBorderColor: "border-emerald-800",
    nodeStrokeColor: "#059669",
    nodeBadgeClasses: "bg-white text-emerald-700 border-emerald-500",
    nodeArrowBorder: "border-t-emerald-500",
  },
  // World 7 (CR-080): Zagorje Castles & Fairy Tale Hills (Units 31–35)
  {
    id: "zagorje-castles",
    stage: 7,
    stageName: "Zagorje Castles",
    stageBadgeLabel: "World 7: Zagorje Castles • Fairy Tale Hills & Legends",
    stageCroatianName: "World 7: Zagorje Castles • Fairy Tale Hills & Legends",
    unitRange: [31, 35],
    solidBg: "bg-purple-800",
    gradient: "from-purple-900 via-fuchsia-800 to-emerald-800",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🏰",
    buttonClass: "bg-white text-purple-950 hover:bg-purple-50 border-purple-300",
    accentBorder: "border-purple-400/50",
    nodeActiveBg: "bg-purple-600 hover:bg-purple-600/90 border-purple-800 active:border-b-0 text-white",
    nodeBorderColor: "border-purple-800",
    nodeStrokeColor: "#9333ea",
    nodeBadgeClasses: "bg-white text-purple-700 border-purple-500",
    nodeArrowBorder: "border-t-purple-500",
  },
  // World 8 (CR-082): Nikola Tesla & The Starry Night Sky (Units 36–40)
  {
    id: "tesla-astronomy",
    stage: 8,
    stageName: "Tesla & Astronomy",
    stageBadgeLabel: "World 8: Tesla & Astronomy • The Spark of Invention & Starry Sky",
    stageCroatianName: "World 8: Tesla & Astronomy • Zemlja izuma i zvjezdano nebo",
    unitRange: [36, 40],
    solidBg: "bg-slate-950",
    gradient: "from-slate-950 via-indigo-950 to-cyan-950",
    badgeBg: "bg-black/40 text-cyan-200 border-cyan-500/40",
    accentEmoji: "⚡",
    buttonClass: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 border-cyan-400",
    accentBorder: "border-cyan-400/50",
    nodeActiveBg: "bg-cyan-600 hover:bg-cyan-600/90 border-cyan-800 active:border-b-0 text-white",
    nodeBorderColor: "border-cyan-800",
    nodeStrokeColor: "#0891b2",
    nodeBadgeClasses: "bg-slate-900 text-cyan-400 border-cyan-500",
    nodeArrowBorder: "border-t-cyan-500",
  },
];

export const LEVEL_3_STAGES: RegionTheme[] = [
  // World 9 (CR-083): Sinjska Alka & Cetina Canyon (Units 41–45)
  {
    id: "sinjska-alka-cetina",
    stage: 9,
    stageName: "Sinjska Alka & Cetina",
    stageBadgeLabel: "World 9: Sinjska Alka • Knights of Sinj & Cetina Canyon",
    stageCroatianName: "World 9: Sinjska Alka • Sinjski vitezovi i kanjon Cetine",
    unitRange: [41, 45],
    solidBg: "bg-rose-900",
    gradient: "from-rose-950 via-red-900 to-teal-900",
    badgeBg: "bg-black/35 text-amber-200 border-amber-500/40",
    accentEmoji: "🏇",
    buttonClass: "bg-amber-500 text-stone-950 hover:bg-amber-400 border-amber-600",
    accentBorder: "border-amber-500/50",
    nodeActiveBg: "bg-red-700 hover:bg-red-700/90 border-red-900 active:border-b-0 text-white",
    nodeBorderColor: "border-red-900",
    nodeStrokeColor: "#b91c1c",
    nodeBadgeClasses: "bg-white text-red-800 border-red-600",
    nodeArrowBorder: "border-t-red-600",
  },
];

export const ALL_STAGES: RegionTheme[] = [...LEVEL_1_STAGES, ...LEVEL_2_STAGES, ...LEVEL_3_STAGES];

export const getStageThemeForUnit = (unitOrder: number): RegionTheme => {
  return (
    ALL_STAGES.find(
      (s) => unitOrder >= s.unitRange[0] && unitOrder <= s.unitRange[1]
    ) || LEVEL_1_STAGES[0]
  );
};

export type UnitSceneryItem = {
  imageSrc: string;
  subImageSrc?: string;
  alt: string;
  title: string;
  badgeEmoji?: string;
  topOffsetClass: string;
};

export type UnitSceneryConfig = {
  left?: UnitSceneryItem;
  right?: UnitSceneryItem;
};

export const getUnitScenery = (unitOrder: number): UnitSceneryConfig | null => {
  switch (unitOrder) {
    case 1:
      return {
        left: {
          imageSrc: "/mascot.png",
          alt: "Paško navija",
          title: "Zagreb Početak",
          badgeEmoji: "👋",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/heart.svg",
          alt: "Licitarsko srce",
          title: "Dobrodošli",
          badgeEmoji: "❤️",
          topOffsetClass: "top-44",
        },
      };
    case 6:
      return {
        left: {
          imageSrc: "/dolphin.svg",
          subImageSrc: "/sea.svg",
          alt: "Dupin u Jadranu",
          title: "Plavi Jadran",
          badgeEmoji: "🐬",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/boat.svg",
          subImageSrc: "/island.svg",
          alt: "Jedrilica",
          title: "Obalna Pustolovina",
          badgeEmoji: "⛵",
          topOffsetClass: "top-44",
        },
      };
    case 11:
      return {
        left: {
          imageSrc: "/tree.svg",
          subImageSrc: "/park.svg",
          alt: "Gorske šume",
          title: "Plitvička Jezera",
          badgeEmoji: "🌲",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/sun.svg",
          subImageSrc: "/grass.svg",
          alt: "Zlatna polja",
          title: "Slavonija",
          badgeEmoji: "🌾",
          topOffsetClass: "top-44",
        },
      };
    case 16:
      return {
        left: {
          imageSrc: "/book.svg",
          alt: "Knjiga i učenje",
          title: "Učionica",
          badgeEmoji: "📚",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/pencil.svg",
          alt: "Olovka za pisanje",
          title: "Znanje",
          badgeEmoji: "✏️",
          topOffsetClass: "top-44",
        },
      };
    case 17:
      return {
        left: {
          imageSrc: "/medvjed.svg",
          subImageSrc: "/planina.svg",
          alt: "Medvjed u planini",
          title: "Divlje životinje",
          badgeEmoji: "🐻",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/jelen.svg",
          subImageSrc: "/suma.svg",
          alt: "Jelen u šumi",
          title: "Gorska priroda",
          badgeEmoji: "🦌",
          topOffsetClass: "top-44",
        },
      };
    case 18:
      return {
        left: {
          imageSrc: "/vlak.svg",
          alt: "Brzi vlak",
          title: "Putovanje",
          badgeEmoji: "🚆",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/avion.svg",
          subImageSrc: "/trajekt.svg",
          alt: "Avion i trajekt",
          title: "Prijevoz",
          badgeEmoji: "✈️",
          topOffsetClass: "top-44",
        },
      };
    case 19:
      return {
        left: {
          imageSrc: "/kuhinja.svg",
          alt: "Topla kuhinja",
          title: "Kuhanje",
          badgeEmoji: "🍲",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/tanjur.svg",
          subImageSrc: "/juha.svg",
          alt: "Ukusna juha",
          title: "Obiteljski stol",
          badgeEmoji: "🍽️",
          topOffsetClass: "top-44",
        },
      };
    case 20:
      return {
        left: {
          imageSrc: "/torta.svg",
          subImageSrc: "/svjecice.svg",
          alt: "Slavljenička torta",
          title: "Rođendan",
          badgeEmoji: "🎂",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/poklon.svg",
          subImageSrc: "/balon.svg",
          alt: "Rođendanski poklon",
          title: "Čestitamo!",
          badgeEmoji: "🎁",
          topOffsetClass: "top-44",
        },
      };
    case 21:
      return {
        left: {
          imageSrc: "/week.svg",
          alt: "Tjedan i kalendar",
          title: "Dani u tjednu",
          badgeEmoji: "📅",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/weekend.svg",
          alt: "Vikend odmor",
          title: "Vikend",
          badgeEmoji: "☀️",
          topOffsetClass: "top-44",
        },
      };
    case 22:
      return {
        left: {
          imageSrc: "/icecream.svg",
          alt: "Fini sladoled",
          title: "Slastičarnica",
          badgeEmoji: "🍨",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/strawberry.svg",
          alt: "Svježa jagoda",
          title: "Kuglica sladoleda",
          badgeEmoji: "🍓",
          topOffsetClass: "top-44",
        },
      };
    case 23:
      return {
        left: {
          imageSrc: "/arena.svg",
          alt: "Pulska arena",
          title: "Rimska arena",
          badgeEmoji: "🏛️",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/shield.svg",
          alt: "Štit viteza",
          title: "Povijest i legende",
          badgeEmoji: "🛡️",
          topOffsetClass: "top-44",
        },
      };
    case 24:
      return {
        left: {
          imageSrc: "/clock.svg",
          alt: "Zidni sat",
          title: "Moj dan",
          badgeEmoji: "⏰",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/bed.svg",
          alt: "Topli krevet",
          title: "Vrijeme za spavanje",
          badgeEmoji: "🛏️",
          topOffsetClass: "top-44",
        },
      };
    case 25:
      return {
        left: {
          imageSrc: "/goggles.svg",
          alt: "Maska za ronjenje",
          title: "Morske radosti",
          badgeEmoji: "🤿",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/wave.svg",
          alt: "Jadranski valovi",
          title: "Skok u more",
          badgeEmoji: "🌊",
          topOffsetClass: "top-44",
        },
      };
    case 26:
      return {
        left: {
          imageSrc: "/kukuruz.svg",
          alt: "Zlatni kukuruz",
          title: "Slavonska polja",
          badgeEmoji: "🌽",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/med.svg",
          alt: "Domaći med",
          title: "Slatki med",
          badgeEmoji: "🍯",
          topOffsetClass: "top-44",
        },
      };
    case 27:
      return {
        left: {
          imageSrc: "/orao.svg",
          alt: "Orao štekavac",
          title: "Kopački rit",
          badgeEmoji: "🦅",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/jelen.svg",
          alt: "Slavonski jelen",
          title: "Šumski kralj",
          badgeEmoji: "🦌",
          topOffsetClass: "top-44",
        },
      };
    case 28:
      return {
        left: {
          imageSrc: "/kolac.svg",
          alt: "Bakin kolač",
          title: "Bakina kuhinja",
          badgeEmoji: "🍰",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/lonac.svg",
          alt: "Tradicionalni lonac",
          title: "Topla juha",
          badgeEmoji: "🍲",
          topOffsetClass: "top-44",
        },
      };
    case 29:
      return {
        left: {
          imageSrc: "/most.svg",
          alt: "Most na Dravi",
          title: "Riječni most",
          badgeEmoji: "🌉",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/camac.svg",
          alt: "Riječni čamac",
          title: "Dunavska plovidba",
          badgeEmoji: "🛶",
          topOffsetClass: "top-44",
        },
      };
    case 30:
      return {
        left: {
          imageSrc: "/glazba.svg",
          alt: "Tamburaška glazba",
          title: "Seoska proslava",
          badgeEmoji: "🎶",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/ples.svg",
          alt: "Slavonsko kolo",
          title: "Zlatna nošnja",
          badgeEmoji: "💃",
          topOffsetClass: "top-44",
        },
      };
    case 31:
      return {
        left: {
          imageSrc: "/dvorac.svg",
          alt: "Dvorac Trakošćan",
          title: "Dvorac Trakošćan",
          badgeEmoji: "🏰",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/kula.svg",
          alt: "Stara kamena kula",
          title: "Kamena kula",
          badgeEmoji: "🗼",
          topOffsetClass: "top-44",
        },
      };
    case 32:
      return {
        left: {
          imageSrc: "/vitez.svg",
          alt: "Hrabri vitez",
          title: "Hrabri vitez",
          badgeEmoji: "⚔️",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/stit.svg",
          alt: "Hrvatski štit",
          title: "Viteški štit",
          badgeEmoji: "🛡️",
          topOffsetClass: "top-44",
        },
      };
    case 33:
      return {
        left: {
          imageSrc: "/lijevo.svg",
          alt: "Skreni lijevo",
          title: "Lijevo",
          badgeEmoji: "⬅️",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/desno.svg",
          alt: "Skreni desno",
          title: "Desno",
          badgeEmoji: "➡️",
          topOffsetClass: "top-44",
        },
      };
    case 34:
      return {
        left: {
          imageSrc: "/konjic.svg",
          alt: "Drveni konjić",
          title: "Zagorski konjić",
          badgeEmoji: "🎠",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/igracka.svg",
          alt: "Tradicionalna igračka",
          title: "Zlatna igračka",
          badgeEmoji: "🪆",
          topOffsetClass: "top-44",
        },
      };
    case 35:
      return {
        left: {
          imageSrc: "/kruna.svg",
          alt: "Kraljevska kruna",
          title: "Zlatna kruna",
          badgeEmoji: "👑",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/gozba.svg",
          alt: "Svečana gozba",
          title: "Kraljevska gozba",
          badgeEmoji: "🍗",
          topOffsetClass: "top-44",
        },
      };
    case 36:
      return {
        left: {
          imageSrc: "/svjetlost.svg",
          alt: "Zraka svjetlosti",
          title: "Svjetlost",
          badgeEmoji: "💡",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/iskra.svg",
          alt: "Teslina iskra",
          title: "Iskra",
          badgeEmoji: "⚡",
          topOffsetClass: "top-44",
        },
      };
    case 37:
      return {
        left: {
          imageSrc: "/zvijezda.svg",
          alt: "Sjajna zvijezda",
          title: "Zvijezda",
          badgeEmoji: "⭐",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/mjesec.svg",
          alt: "Noćni mjesec",
          title: "Mjesec",
          badgeEmoji: "🌙",
          topOffsetClass: "top-44",
        },
      };
    case 38:
      return {
        left: {
          imageSrc: "/teleskop.svg",
          alt: "Veliki teleskop",
          title: "Teleskop",
          badgeEmoji: "🔭",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/kupola.svg",
          alt: "Kupola zvjezdarnice",
          title: "Kupola",
          badgeEmoji: "🪐",
          topOffsetClass: "top-44",
        },
      };
    case 39:
      return {
        left: {
          imageSrc: "/munja.svg",
          alt: "Moćna munja",
          title: "Munja",
          badgeEmoji: "⚡",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/snaga.svg",
          alt: "Snaga prirode",
          title: "Snaga",
          badgeEmoji: "🔋",
          topOffsetClass: "top-44",
        },
      };
    case 40:
      return {
        left: {
          imageSrc: "/robot.svg",
          alt: "Pametni robot",
          title: "Robot",
          badgeEmoji: "🤖",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/buducnost.svg",
          alt: "Svijetla budućnost",
          title: "Budućnost",
          badgeEmoji: "🚀",
          topOffsetClass: "top-44",
        },
      };
    case 41:
      return {
        left: {
          imageSrc: "/konj.svg",
          alt: "Plemeniti konj",
          title: "Konj",
          badgeEmoji: "🏇",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/sedlo.svg",
          alt: "Viteško sedlo",
          title: "Sedlo",
          badgeEmoji: "🛡️",
          topOffsetClass: "top-44",
        },
      };
    case 42:
      return {
        left: {
          imageSrc: "/alka.svg",
          alt: "Željezna alka",
          title: "Alka",
          badgeEmoji: "🎯",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/koplje.svg",
          alt: "Viteško koplje",
          title: "Koplje",
          badgeEmoji: "⚔️",
          topOffsetClass: "top-44",
        },
      };
    case 43:
      return {
        left: {
          imageSrc: "/kanjon.svg",
          alt: "Kanjon Cetine",
          title: "Kanjon",
          badgeEmoji: "🏞️",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/slap.svg",
          alt: "Smaragdni slap",
          title: "Slap",
          badgeEmoji: "🌊",
          topOffsetClass: "top-44",
        },
      };
    case 44:
      return {
        left: {
          imageSrc: "/mlin.svg",
          alt: "Mlinski kotač",
          title: "Mlin",
          badgeEmoji: "⚙️",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/peka.svg",
          alt: "Kruh ispod peke",
          title: "Peka",
          badgeEmoji: "🥖",
          topOffsetClass: "top-44",
        },
      };
    case 45:
      return {
        left: {
          imageSrc: "/pobjeda.svg",
          alt: "Slavlje slavodobitnika",
          title: "Pobjeda",
          badgeEmoji: "🏆",
          topOffsetClass: "top-10",
        },
        right: {
          imageSrc: "/medalja.svg",
          alt: "Zlatna medalja",
          title: "Medalja",
          badgeEmoji: "🥇",
          topOffsetClass: "top-44",
        },
      };
    default:
      return null;
  }
};
