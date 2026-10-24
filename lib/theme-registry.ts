export type RegionTheme = {
  id: string;
  stage: number;
  stageName: string;
  stageCroatianName: string;
  unitRange: [number, number];
  solidBg: string;
  gradient: string;
  badgeBg: string;
  accentEmoji: string;
  buttonClass: string;
  accentBorder: string;
};

export const LEVEL_1_STAGES: RegionTheme[] = [
  // Stage 1 (CR-023): Zagreb & Central Croatia (Units 1–5)
  {
    id: "zagreb-central",
    stage: 1,
    stageName: "Zagreb & Central Croatia",
    stageCroatianName: "1. Faza • Zagreb i Središnja Hrvatska",
    unitRange: [1, 5],
    solidBg: "bg-red-600",
    gradient: "from-red-600 via-rose-600 to-amber-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🏰",
    buttonClass: "bg-white text-rose-950 hover:bg-rose-50 border-rose-300",
    accentBorder: "border-red-400/50",
  },
  // Stage 2 (CR-024): Kvarner & Dalmatian Coast (Units 6–10)
  {
    id: "dalmatia-coast",
    stage: 2,
    stageName: "Kvarner & Dalmatian Coast",
    stageCroatianName: "2. Faza • Kvarner i Dalmatinska Obala",
    unitRange: [6, 10],
    solidBg: "bg-sky-600",
    gradient: "from-sky-500 via-blue-600 to-cyan-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🌊",
    buttonClass: "bg-white text-blue-950 hover:bg-sky-50 border-sky-300",
    accentBorder: "border-sky-300/50",
  },
  // Stage 3 (CR-025): Plitvice Lakes & Slavonia (Units 11–15)
  {
    id: "plitvice-slavonia",
    stage: 3,
    stageName: "Plitvice Lakes & Slavonia",
    stageCroatianName: "3. Faza • Plitvička Jezera i Slavonija",
    unitRange: [11, 15],
    solidBg: "bg-emerald-600",
    gradient: "from-emerald-600 via-teal-600 to-amber-600",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "🌲",
    buttonClass: "bg-white text-emerald-950 hover:bg-emerald-50 border-emerald-300",
    accentBorder: "border-emerald-300/50",
  },
  // Stage 4 (CR-026): Dubrovnik & Island Heritage (Units 16–20)
  {
    id: "dubrovnik-heritage",
    stage: 4,
    stageName: "Dubrovnik & Island Heritage",
    stageCroatianName: "4. Faza • Dubrovnik i Otoci (Level 1 Capstone)",
    unitRange: [16, 20],
    solidBg: "bg-blue-900",
    gradient: "from-blue-900 via-indigo-900 to-amber-700",
    badgeBg: "bg-black/25 text-white border-white/40",
    accentEmoji: "👑",
    buttonClass: "bg-amber-400 text-amber-950 hover:bg-amber-300 border-amber-500",
    accentBorder: "border-amber-400/50",
  },
];

export const getStageThemeForUnit = (unitOrder: number): RegionTheme => {
  return (
    LEVEL_1_STAGES.find(
      (s) => unitOrder >= s.unitRange[0] && unitOrder <= s.unitRange[1]
    ) || LEVEL_1_STAGES[0]
  );
};
