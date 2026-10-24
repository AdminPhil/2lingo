export const POINTS_TO_REFILL = 10;

export type Quest = {
  title: string;
  stageCroatian: string;
  stageEnglish: string;
  value: number;
};

export const quests: Quest[] = [
  {
    title: "Earn 50 XP (Mali Početnik • Little Beginner)",
    stageCroatian: "Mali Početnik",
    stageEnglish: "Little Beginner",
    value: 50,
  },
  {
    title: "Earn 100 XP (Mali Istraživač • Little Explorer)",
    stageCroatian: "Mali Istraživač",
    stageEnglish: "Little Explorer",
    value: 100,
  },
  {
    title: "Earn 250 XP (Prijatelj Riječi • Friend of Words)",
    stageCroatian: "Prijatelj Riječi",
    stageEnglish: "Friend of Words",
    value: 250,
  },
  {
    title: "Earn 500 XP (Jadranski Mornar • Adriatic Sailor)",
    stageCroatian: "Jadranski Mornar",
    stageEnglish: "Adriatic Sailor",
    value: 500,
  },
  {
    title: "Earn 1,000 XP (Vitez Znanja • Knight of Knowledge)",
    stageCroatian: "Vitez Znanja",
    stageEnglish: "Knight of Knowledge",
    value: 1000,
  },
  {
    title: "Earn 2,500 XP (Sokol Velebita • Falcon of Velebit)",
    stageCroatian: "Sokol Velebita",
    stageEnglish: "Falcon of Velebit",
    value: 2500,
  },
  {
    title: "Earn 5,000 XP (Majstor Jezika • Language Master)",
    stageCroatian: "Majstor Jezika",
    stageEnglish: "Language Master",
    value: 5000,
  },
  {
    title: "Earn 10,000 XP (Hrvatska Legenda • Croatian Legend)",
    stageCroatian: "Hrvatska Legenda",
    stageEnglish: "Croatian Legend",
    value: 10000,
  },
];

export const KID_REWARDS = [
  {
    id: "screen_time",
    title: "30 Min Screen Time 🎮",
    cost: 50,
    description: "Extra tablet, video game, or cartoon time!",
  },
  {
    id: "sweet_treat",
    title: "Ice Cream or Treat 🍦",
    cost: 100,
    description: "A yummy snack or dessert of your choice!",
  },
  {
    id: "movie_night",
    title: "Pick Movie Night 🎬",
    cost: 150,
    description: "You get to choose what movie the family watches!",
  },
  {
    id: "pizza_choice",
    title: "Pick Dinner / Pizza Night 🍕",
    cost: 200,
    description: "Choose dinner or your favorite pizza toppings!",
  },
  {
    id: "fun_outing",
    title: "Park / Fun Day Out 🎡",
    cost: 300,
    description: "Trip to the playground, zoo, or special adventure!",
  },
];
