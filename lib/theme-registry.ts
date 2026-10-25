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
  // World 4 (CR-026/CR-030/CR-031): Crown Citadel (Units 16–20)
  {
    id: "dubrovnik-heritage",
    stage: 4,
    stageName: "Crown Citadel",
    stageBadgeLabel: "World 4: Crown Citadel • Ancient Dubrovnik (Capstone)",
    stageCroatianName: "World 4: Crown Citadel • Ancient Dubrovnik (Capstone)",
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

export const getStageThemeForUnit = (unitOrder: number): RegionTheme => {
  return (
    LEVEL_1_STAGES.find(
      (s) => unitOrder >= s.unitRange[0] && unitOrder <= s.unitRange[1]
    ) || LEVEL_1_STAGES[0]
  );
};
