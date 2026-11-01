import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

interface OptionDef {
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc: string;
}

interface ChallengeDef {
  type: "SELECT" | "ASSIST";
  order: number;
  question: string;
  options: OptionDef[];
}

interface LessonDef {
  title: string;
  order: number;
  challenges: ChallengeDef[];
}

interface UnitDef {
  order: number;
  title: string;
  description: string;
  lessons: LessonDef[];
}

const unitsData: UnitDef[] = [
  // ==========================================
  // UNIT 31: VRATA DVORCA (The Castle Gates)
  // ==========================================
  {
    order: 31,
    title: "Unit 31",
    description: "Vrata dvorca (The Castle Gates)",
    lessons: [
      {
        order: 1,
        title: "Dvorac i kula",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Castle"?',
            options: [
              { text: "Dvorac", correct: true, imageSrc: "/dvorac.svg", audioSrc: "/audio/hr/dvorac.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Tower"?',
            options: [
              { text: "Kula", correct: true, imageSrc: "/kula.svg", audioSrc: "/audio/hr/kula.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Mlijeko", correct: false, imageSrc: "/milk.svg", audioSrc: "/audio/hr/mlijeko.mp3" },
              { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Key"?',
            options: [
              { text: "Ključ", correct: true, imageSrc: "/kljuc.svg", audioSrc: "/audio/hr/kljuc.mp3" },
              { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Bridge"?',
            options: [
              { text: "Most", correct: true, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
              { text: "Dvorac", correct: false, imageSrc: "/dvorac.svg", audioSrc: "/audio/hr/dvorac.mp3" },
              { text: "Kula", correct: false, imageSrc: "/kula.svg", audioSrc: "/audio/hr/kula.mp3" },
              { text: "Ključ", correct: false, imageSrc: "/kljuc.svg", audioSrc: "/audio/hr/kljuc.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Otvaranje vrata",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Castle"',
            options: [
              { text: "Dvorac", correct: true, imageSrc: null, audioSrc: "/audio/hr/dvorac.mp3" },
              { text: "Kula", correct: false, imageSrc: null, audioSrc: "/audio/hr/kula.mp3" },
              { text: "Ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/kljuc.mp3" },
              { text: "Most", correct: false, imageSrc: null, audioSrc: "/audio/hr/most.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Golden key"',
            options: [
              { text: "Zlatni ključ", correct: true, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
              { text: "Veliki dvorac", correct: false, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
              { text: "Stara kula", correct: false, imageSrc: null, audioSrc: "/audio/hr/stara_kula.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "Old tower"',
            options: [
              { text: "Stara kula", correct: true, imageSrc: null, audioSrc: "/audio/hr/stara_kula.mp3" },
              { text: "Veliki dvorac", correct: false, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
              { text: "Zlatni ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "I am opening the door."',
            options: [
              { text: "Otvaram vrata.", correct: true, imageSrc: null, audioSrc: "/audio/hr/otvaram_vrata.mp3" },
              { text: "Ulazimo u dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ulazimo_u_dvorac.mp3" },
              { text: "Prelazimo preko mosta.", correct: false, imageSrc: null, audioSrc: "/audio/hr/prelazimo_preko_mosta.mp3" },
              { text: "Vidim visoku kulu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Ulazak u dvorac",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Big castle"',
            options: [
              { text: "Veliki dvorac", correct: true, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
              { text: "Stara kula", correct: false, imageSrc: null, audioSrc: "/audio/hr/stara_kula.mp3" },
              { text: "Zlatni ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Where is the castle?"',
            options: [
              { text: "Gdje je dvorac?", correct: true, imageSrc: null, audioSrc: "/audio/hr/gdje_je_dvorac.mp3" },
              { text: "Gdje je kula?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_kula.mp3" },
              { text: "Gdje je soba?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_soba.mp3" },
              { text: "Gdje je knjiga?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_knjiga.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "We are entering the castle."',
            options: [
              { text: "Ulazimo u dvorac.", correct: true, imageSrc: null, audioSrc: "/audio/hr/ulazimo_u_dvorac.mp3" },
              { text: "Otvaram vrata.", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvaram_vrata.mp3" },
              { text: "Prelazimo preko mosta.", correct: false, imageSrc: null, audioSrc: "/audio/hr/prelazimo_preko_mosta.mp3" },
              { text: "Vidim visoku kulu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We are crossing over the bridge."',
            options: [
              { text: "Prelazimo preko mosta.", correct: true, imageSrc: null, audioSrc: "/audio/hr/prelazimo_preko_mosta.mp3" },
              { text: "Ulazimo u dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ulazimo_u_dvorac.mp3" },
              { text: "Otvaram vrata.", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvaram_vrata.mp3" },
              { text: "Vidim visoku kulu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Tajna Trakošćana",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "I open the heavy door with a key."',
            options: [
              { text: "Otvaram teška vrata ključem.", correct: true, imageSrc: null, audioSrc: "/audio/hr/otvaram_teska_vrata_kljucem.mp3" },
              { text: "Dvorac Trakošćan je prekrasan.", correct: false, imageSrc: null, audioSrc: "/audio/hr/dvorac_trakoscan_je_prekrasan.mp3" },
              { text: "Prelazimo preko mosta.", correct: false, imageSrc: null, audioSrc: "/audio/hr/prelazimo_preko_mosta.mp3" },
              { text: "Vidim visoku kulu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Trakošćan castle is gorgeous."',
            options: [
              { text: "Dvorac Trakošćan je prekrasan.", correct: true, imageSrc: null, audioSrc: "/audio/hr/dvorac_trakoscan_je_prekrasan.mp3" },
              { text: "Otvaram teška vrata ključem.", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvaram_teska_vrata_kljucem.mp3" },
              { text: "Velika gozba je na stolu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/velika_gozba_je_na_stolu.mp3" },
              { text: "Zastava se vijori na kuli.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zastava_se_vijori_na_kuli.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "I see a tall tower."',
            options: [
              { text: "Vidim visoku kulu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
              { text: "Ulazimo u dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ulazimo_u_dvorac.mp3" },
              { text: "Otvaram teška vrata ključem.", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvaram_teska_vrata_kljucem.mp3" },
              { text: "Prelazimo preko mosta.", correct: false, imageSrc: null, audioSrc: "/audio/hr/prelazimo_preko_mosta.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "The castle is near."',
            options: [
              { text: "Dvorac je blizu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/dvorac_je_blizu.mp3" },
              { text: "Kula je daleko.", correct: false, imageSrc: null, audioSrc: "/audio/hr/kula_je_daleko.mp3" },
              { text: "Vidim visoku kulu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidim_visoku_kulu.mp3" },
              { text: "Dvorac Trakošćan je prekrasan.", correct: false, imageSrc: null, audioSrc: "/audio/hr/dvorac_trakoscan_je_prekrasan.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 32: VITEZOVI I LEGENDE (Knights & Legends)
  // ==========================================
  {
    order: 32,
    title: "Unit 32",
    description: "Vitezovi i legende (Knights & Legends)",
    lessons: [
      {
        order: 1,
        title: "Viteški oklop",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Knight"?',
            options: [
              { text: "Vitez", correct: true, imageSrc: "/vitez.svg", audioSrc: "/audio/hr/vitez.mp3" },
              { text: "Dvorac", correct: false, imageSrc: "/dvorac.svg", audioSrc: "/audio/hr/dvorac.mp3" },
              { text: "Kula", correct: false, imageSrc: "/kula.svg", audioSrc: "/audio/hr/kula.mp3" },
              { text: "Most", correct: false, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Shield"?',
            options: [
              { text: "Štit", correct: true, imageSrc: "/stit.svg", audioSrc: "/audio/hr/stit.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Sword"?',
            options: [
              { text: "Mač", correct: true, imageSrc: "/mac.svg", audioSrc: "/audio/hr/mac.mp3" },
              { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Flag"?',
            options: [
              { text: "Zastava", correct: true, imageSrc: "/zastava.svg", audioSrc: "/audio/hr/zastava.mp3" },
              { text: "Vitez", correct: false, imageSrc: "/vitez.svg", audioSrc: "/audio/hr/vitez.mp3" },
              { text: "Štit", correct: false, imageSrc: "/stit.svg", audioSrc: "/audio/hr/stit.mp3" },
              { text: "Mač", correct: false, imageSrc: "/mac.svg", audioSrc: "/audio/hr/mac.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Obrane i dvorac",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Brave knight"',
            options: [
              { text: "Hrabri vitez", correct: true, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
              { text: "Sjajni mač", correct: false, imageSrc: null, audioSrc: "/audio/hr/sjajni_mac.mp3" },
              { text: "Hrvatska zastava", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrvatska_zastava.mp3" },
              { text: "Zlatni ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Shining sword"',
            options: [
              { text: "Sjajni mač", correct: true, imageSrc: null, audioSrc: "/audio/hr/sjajni_mac.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
              { text: "Hrvatska zastava", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrvatska_zastava.mp3" },
              { text: "Veliki dvorac", correct: false, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "Croatian flag"',
            options: [
              { text: "Hrvatska zastava", correct: true, imageSrc: null, audioSrc: "/audio/hr/hrvatska_zastava.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
              { text: "Sjajni mač", correct: false, imageSrc: null, audioSrc: "/audio/hr/sjajni_mac.mp3" },
              { text: "Stara kula", correct: false, imageSrc: null, audioSrc: "/audio/hr/stara_kula.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "The knight guards the castle."',
            options: [
              { text: "Vitez čuva dvorac.", correct: true, imageSrc: null, audioSrc: "/audio/hr/vitez_cuva_dvorac.mp3" },
              { text: "Hrabri vitez nosi štit.", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez_nosi_stit.mp3" },
              { text: "Zastava se vijori na kuli.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zastava_se_vijori_na_kuli.mp3" },
              { text: "Slušamo staru legendu o vitezu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/slusamo_staru_legendu_o_vitezu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Viteški štit",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Shield"',
            options: [
              { text: "Štit", correct: true, imageSrc: null, audioSrc: "/audio/hr/stit.mp3" },
              { text: "Mač", correct: false, imageSrc: null, audioSrc: "/audio/hr/mac.mp3" },
              { text: "Vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez.mp3" },
              { text: "Zastava", correct: false, imageSrc: null, audioSrc: "/audio/hr/zastava.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Flag"',
            options: [
              { text: "Zastava", correct: true, imageSrc: null, audioSrc: "/audio/hr/zastava.mp3" },
              { text: "Štit", correct: false, imageSrc: null, audioSrc: "/audio/hr/stit.mp3" },
              { text: "Mač", correct: false, imageSrc: null, audioSrc: "/audio/hr/mac.mp3" },
              { text: "Vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "The brave knight carries a shield."',
            options: [
              { text: "Hrabri vitez nosi štit.", correct: true, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez_nosi_stit.mp3" },
              { text: "Vitez čuva dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez_cuva_dvorac.mp3" },
              { text: "Zastava se vijori na kuli.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zastava_se_vijori_na_kuli.mp3" },
              { text: "Slušamo staru legendu o vitezu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/slusamo_staru_legendu_o_vitezu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "The flag flutters on the tower."',
            options: [
              { text: "Zastava se vijori na kuli.", correct: true, imageSrc: null, audioSrc: "/audio/hr/zastava_se_vijori_na_kuli.mp3" },
              { text: "Vitez čuva dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez_cuva_dvorac.mp3" },
              { text: "Hrabri vitez nosi štit.", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez_nosi_stit.mp3" },
              { text: "Slušamo staru legendu o vitezu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/slusamo_staru_legendu_o_vitezu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Legende Velikog Tabora",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "We are listening to an old legend about a knight."',
            options: [
              { text: "Slušamo staru legendu o vitezu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/slusamo_staru_legendu_o_vitezu.mp3" },
              { text: "Vitez čuva dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez_cuva_dvorac.mp3" },
              { text: "Hrabri vitez nosi štit.", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez_nosi_stit.mp3" },
              { text: "Zastava se vijori na kuli.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zastava_se_vijori_na_kuli.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "To guard"',
            options: [
              { text: "Čuvati", correct: true, imageSrc: null, audioSrc: "/audio/hr/cuvati.mp3" },
              { text: "Braniti", correct: false, imageSrc: null, audioSrc: "/audio/hr/braniti.mp3" },
              { text: "Otvoriti", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvoriti.mp3" },
              { text: "Ući", correct: false, imageSrc: null, audioSrc: "/audio/hr/uci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "To defend"',
            options: [
              { text: "Braniti", correct: true, imageSrc: null, audioSrc: "/audio/hr/braniti.mp3" },
              { text: "Čuvati", correct: false, imageSrc: null, audioSrc: "/audio/hr/cuvati.mp3" },
              { text: "Otvoriti", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvoriti.mp3" },
              { text: "Ući", correct: false, imageSrc: null, audioSrc: "/audio/hr/uci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We saw a brave knight."',
            options: [
              { text: "Vidjeli smo hrabrog viteza.", correct: true, imageSrc: null, audioSrc: "/audio/hr/vidjeli_smo_hrabrog_viteza.mp3" },
              { text: "Slušamo staru legendu o vitezu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/slusamo_staru_legendu_o_vitezu.mp3" },
              { text: "Vitez čuva dvorac.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vitez_cuva_dvorac.mp3" },
              { text: "Hrabri vitez nosi štit.", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez_nosi_stit.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 33: KROZ DVORAC: LIJEVO I DESNO (Directions & Castle Halls)
  // ==========================================
  {
    order: 33,
    title: "Unit 33",
    description: "Kroz dvorac: Lijevo i desno (Directions & Castle Halls)",
    lessons: [
      {
        order: 1,
        title: "Dvorane i sobe",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Room"?',
            options: [
              { text: "Soba", correct: true, imageSrc: "/soba.svg", audioSrc: "/audio/hr/soba.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Most", correct: false, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
              { text: "Kula", correct: false, imageSrc: "/kula.svg", audioSrc: "/audio/hr/kula.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Window"?',
            options: [
              { text: "Prozor", correct: true, imageSrc: "/prozor.svg", audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Zid", correct: false, imageSrc: "/zid.svg", audioSrc: "/audio/hr/zid.mp3" },
              { text: "Vrata", correct: false, imageSrc: "/vrata.svg", audioSrc: "/audio/hr/vrata.mp3" },
              { text: "Dvorac", correct: false, imageSrc: "/dvorac.svg", audioSrc: "/audio/hr/dvorac.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Wall"?',
            options: [
              { text: "Zid", correct: true, imageSrc: "/zid.svg", audioSrc: "/audio/hr/zid.mp3" },
              { text: "Prozor", correct: false, imageSrc: "/prozor.svg", audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Vrata", correct: false, imageSrc: "/vrata.svg", audioSrc: "/audio/hr/vrata.mp3" },
              { text: "Soba", correct: false, imageSrc: "/soba.svg", audioSrc: "/audio/hr/soba.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Door"?',
            options: [
              { text: "Vrata", correct: true, imageSrc: "/vrata.svg", audioSrc: "/audio/hr/vrata.mp3" },
              { text: "Zid", correct: false, imageSrc: "/zid.svg", audioSrc: "/audio/hr/zid.mp3" },
              { text: "Prozor", correct: false, imageSrc: "/prozor.svg", audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Soba", correct: false, imageSrc: "/soba.svg", audioSrc: "/audio/hr/soba.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Lijevo i desno",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Left"',
            options: [
              { text: "Lijevo", correct: true, imageSrc: null, audioSrc: "/audio/hr/lijevo.mp3" },
              { text: "Desno", correct: false, imageSrc: null, audioSrc: "/audio/hr/desno.mp3" },
              { text: "Ravno", correct: false, imageSrc: null, audioSrc: "/audio/hr/ravno.mp3" },
              { text: "Gore", correct: false, imageSrc: null, audioSrc: "/audio/hr/gore.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Right"',
            options: [
              { text: "Desno", correct: true, imageSrc: null, audioSrc: "/audio/hr/desno.mp3" },
              { text: "Lijevo", correct: false, imageSrc: null, audioSrc: "/audio/hr/lijevo.mp3" },
              { text: "Ravno", correct: false, imageSrc: null, audioSrc: "/audio/hr/ravno.mp3" },
              { text: "Gore", correct: false, imageSrc: null, audioSrc: "/audio/hr/gore.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "Straight"',
            options: [
              { text: "Ravno", correct: true, imageSrc: null, audioSrc: "/audio/hr/ravno.mp3" },
              { text: "Lijevo", correct: false, imageSrc: null, audioSrc: "/audio/hr/lijevo.mp3" },
              { text: "Desno", correct: false, imageSrc: null, audioSrc: "/audio/hr/desno.mp3" },
              { text: "Gore", correct: false, imageSrc: null, audioSrc: "/audio/hr/gore.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "Turn left."',
            options: [
              { text: "Skreni lijevo.", correct: true, imageSrc: null, audioSrc: "/audio/hr/skreni_lijevo.mp3" },
              { text: "Skreni desno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/skreni_desno.mp3" },
              { text: "Idi ravno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/idi_ravno.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Kroz prolaze dvorca",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Turn right."',
            options: [
              { text: "Skreni desno.", correct: true, imageSrc: null, audioSrc: "/audio/hr/skreni_desno.mp3" },
              { text: "Skreni lijevo.", correct: false, imageSrc: null, audioSrc: "/audio/hr/skreni_lijevo.mp3" },
              { text: "Idi ravno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/idi_ravno.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Go straight."',
            options: [
              { text: "Idi ravno.", correct: true, imageSrc: null, audioSrc: "/audio/hr/idi_ravno.mp3" },
              { text: "Skreni lijevo.", correct: false, imageSrc: null, audioSrc: "/audio/hr/skreni_lijevo.mp3" },
              { text: "Skreni desno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/skreni_desno.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "We are going straight then right."',
            options: [
              { text: "Idemo ravno pa desno.", correct: true, imageSrc: null, audioSrc: "/audio/hr/idemo_ravno_pa_desno.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
              { text: "Tražimo tajni prolaz.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trazimo_tajni_prolaz.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We are climbing up."',
            options: [
              { text: "Penjemo se gore.", correct: true, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
              { text: "Idemo ravno pa desno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/idemo_ravno_pa_desno.mp3" },
              { text: "Tražimo tajni prolaz.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trazimo_tajni_prolaz.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Tajni prolaz",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "We are searching for the secret passage."',
            options: [
              { text: "Tražimo tajni prolaz.", correct: true, imageSrc: null, audioSrc: "/audio/hr/trazimo_tajni_prolaz.mp3" },
              { text: "Idemo ravno pa desno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/idemo_ravno_pa_desno.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
              { text: "Otvaram teška vrata ključem.", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvaram_teska_vrata_kljucem.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "To turn"',
            options: [
              { text: "Skrenuti", correct: true, imageSrc: null, audioSrc: "/audio/hr/skrenuti.mp3" },
              { text: "Tražiti", correct: false, imageSrc: null, audioSrc: "/audio/hr/traziti.mp3" },
              { text: "Otvoriti", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvoriti.mp3" },
              { text: "Ući", correct: false, imageSrc: null, audioSrc: "/audio/hr/uci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "To search"',
            options: [
              { text: "Tražiti", correct: true, imageSrc: null, audioSrc: "/audio/hr/traziti.mp3" },
              { text: "Skrenuti", correct: false, imageSrc: null, audioSrc: "/audio/hr/skrenuti.mp3" },
              { text: "Otvoriti", correct: false, imageSrc: null, audioSrc: "/audio/hr/otvoriti.mp3" },
              { text: "Ući", correct: false, imageSrc: null, audioSrc: "/audio/hr/uci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We went into the great hall."',
            options: [
              { text: "Išli smo u veliku dvoranu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
              { text: "Tražimo tajni prolaz.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trazimo_tajni_prolaz.mp3" },
              { text: "Penjemo se gore.", correct: false, imageSrc: null, audioSrc: "/audio/hr/penjemo_se_gore.mp3" },
              { text: "Idemo ravno pa desno.", correct: false, imageSrc: null, audioSrc: "/audio/hr/idemo_ravno_pa_desno.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 34: DRVENE IGRAČKE I LICITARI (UNESCO Folk Crafts)
  // ==========================================
  {
    order: 34,
    title: "Unit 34",
    description: "Drvene igračke i licitari (UNESCO Folk Crafts)",
    lessons: [
      {
        order: 1,
        title: "Zagorski obrt",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Toy"?',
            options: [
              { text: "Igračka", correct: true, imageSrc: "/igracka.svg", audioSrc: "/audio/hr/igracka.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Most", correct: false, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Little wooden horse"?',
            options: [
              { text: "Konjić", correct: true, imageSrc: "/konjic.svg", audioSrc: "/audio/hr/konjic.mp3" },
              { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Tree / Wood"?',
            options: [
              { text: "Drvo", correct: true, imageSrc: "/drvo.svg", audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Heart"?',
            options: [
              { text: "Srce", correct: true, imageSrc: "/srce.svg", audioSrc: "/audio/hr/srce.mp3" },
              { text: "Igračka", correct: false, imageSrc: "/igracka.svg", audioSrc: "/audio/hr/igracka.mp3" },
              { text: "Konjić", correct: false, imageSrc: "/konjic.svg", audioSrc: "/audio/hr/konjic.mp3" },
              { text: "Drvo", correct: false, imageSrc: "/drvo.svg", audioSrc: "/audio/hr/drvo.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Boje i drvo",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Wooden toy"',
            options: [
              { text: "Drvena igračka", correct: true, imageSrc: null, audioSrc: "/audio/hr/drvena_igracka.mp3" },
              { text: "Drveni konjić", correct: false, imageSrc: null, audioSrc: "/audio/hr/drveni_konjic.mp3" },
              { text: "Crveno srce", correct: false, imageSrc: null, audioSrc: "/audio/hr/crveno_srce.mp3" },
              { text: "Zlatni ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Wooden horse"',
            options: [
              { text: "Drveni konjić", correct: true, imageSrc: null, audioSrc: "/audio/hr/drveni_konjic.mp3" },
              { text: "Drvena igračka", correct: false, imageSrc: null, audioSrc: "/audio/hr/drvena_igracka.mp3" },
              { text: "Crveno srce", correct: false, imageSrc: null, audioSrc: "/audio/hr/crveno_srce.mp3" },
              { text: "Veliki dvorac", correct: false, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "Red heart"',
            options: [
              { text: "Crveno srce", correct: true, imageSrc: null, audioSrc: "/audio/hr/crveno_srce.mp3" },
              { text: "Drvena igračka", correct: false, imageSrc: null, audioSrc: "/audio/hr/drvena_igracka.mp3" },
              { text: "Drveni konjić", correct: false, imageSrc: null, audioSrc: "/audio/hr/drveni_konjic.mp3" },
              { text: "Zlatna kruna", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatna_kruna.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We paint the wooden horse."',
            options: [
              { text: "Bojamo drvenog konjića.", correct: true, imageSrc: null, audioSrc: "/audio/hr/bojamo_drvenog_konjica.mp3" },
              { text: "Darujem slatko licitarsko srce.", correct: false, imageSrc: null, audioSrc: "/audio/hr/darujem_slatko_licitarsko_srce.mp3" },
              { text: "Majstor izrađuje drvene igračke.", correct: false, imageSrc: null, audioSrc: "/audio/hr/majstor_izraduje_drvene_igracke.mp3" },
              { text: "Tržnica je puna šarenih igračaka.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trznica_je_puna_sarenih_igracaka.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Licitarsko srce",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "I gift a sweet licitar heart."',
            options: [
              { text: "Darujem slatko licitarsko srce.", correct: true, imageSrc: null, audioSrc: "/audio/hr/darujem_slatko_licitarsko_srce.mp3" },
              { text: "Bojamo drvenog konjića.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bojamo_drvenog_konjica.mp3" },
              { text: "Majstor izrađuje drvene igračke.", correct: false, imageSrc: null, audioSrc: "/audio/hr/majstor_izraduje_drvene_igracke.mp3" },
              { text: "Tržnica je puna šarenih igračaka.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trznica_je_puna_sarenih_igracaka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "To paint"',
            options: [
              { text: "Bojati", correct: true, imageSrc: null, audioSrc: "/audio/hr/bojati.mp3" },
              { text: "Darovati", correct: false, imageSrc: null, audioSrc: "/audio/hr/darovati.mp3" },
              { text: "Čuvati", correct: false, imageSrc: null, audioSrc: "/audio/hr/cuvati.mp3" },
              { text: "Braniti", correct: false, imageSrc: null, audioSrc: "/audio/hr/braniti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "To gift"',
            options: [
              { text: "Darovati", correct: true, imageSrc: null, audioSrc: "/audio/hr/darovati.mp3" },
              { text: "Bojati", correct: false, imageSrc: null, audioSrc: "/audio/hr/bojati.mp3" },
              { text: "Čuvati", correct: false, imageSrc: null, audioSrc: "/audio/hr/cuvati.mp3" },
              { text: "Braniti", correct: false, imageSrc: null, audioSrc: "/audio/hr/braniti.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "Where is the toy?"',
            options: [
              { text: "Gdje je igračka?", correct: true, imageSrc: null, audioSrc: "/audio/hr/gdje_je_igracka.mp3" },
              { text: "Gdje je dvorac?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_dvorac.mp3" },
              { text: "Gdje je kula?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_kula.mp3" },
              { text: "Gdje je knjiga?", correct: false, imageSrc: null, audioSrc: "/audio/hr/gdje_je_knjiga.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Marija Bistrica",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "The craftsman crafts wooden toys."',
            options: [
              { text: "Majstor izrađuje drvene igračke.", correct: true, imageSrc: null, audioSrc: "/audio/hr/majstor_izraduje_drvene_igracke.mp3" },
              { text: "Tržnica je puna šarenih igračaka.", correct: false, imageSrc: null, audioSrc: "/audio/hr/trznica_je_puna_sarenih_igracaka.mp3" },
              { text: "Bojamo drvenog konjića.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bojamo_drvenog_konjica.mp3" },
              { text: "Darujem slatko licitarsko srce.", correct: false, imageSrc: null, audioSrc: "/audio/hr/darujem_slatko_licitarsko_srce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "The market is full of colorful toys."',
            options: [
              { text: "Tržnica je puna šarenih igračaka.", correct: true, imageSrc: null, audioSrc: "/audio/hr/trznica_je_puna_sarenih_igracaka.mp3" },
              { text: "Majstor izrađuje drvene igračke.", correct: false, imageSrc: null, audioSrc: "/audio/hr/majstor_izraduje_drvene_igracke.mp3" },
              { text: "Bojamo drvenog konjića.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bojamo_drvenog_konjica.mp3" },
              { text: "Darujem slatko licitarsko srce.", correct: false, imageSrc: null, audioSrc: "/audio/hr/darujem_slatko_licitarsko_srce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "Toy"',
            options: [
              { text: "Igračka", correct: true, imageSrc: null, audioSrc: "/audio/hr/igracka.mp3" },
              { text: "Konjić", correct: false, imageSrc: null, audioSrc: "/audio/hr/konjic.mp3" },
              { text: "Drvo", correct: false, imageSrc: null, audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Srce", correct: false, imageSrc: null, audioSrc: "/audio/hr/srce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "We visited the castles of Zagorje."',
            options: [
              { text: "Posjetili smo dvorce Zagorja.", correct: true, imageSrc: null, audioSrc: "/audio/hr/posjetili_smo_dvorce_zagorja.mp3" },
              { text: "Naučili smo važne hrvatske riječi.", correct: false, imageSrc: null, audioSrc: "/audio/hr/naucili_smo_vazne_hrvatske_rijeci.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
              { text: "Ponosno nastavljamo naše putovanje.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ponosno_nastavljamo_nase_putovanje.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 35: KRALJEVSKA GOZBA (Past Tense Capstone & Banquet)
  // ==========================================
  {
    order: 35,
    title: "Unit 35",
    description: "Kraljevska gozba (Past Tense Capstone & Banquet)",
    lessons: [
      {
        order: 1,
        title: "Dvorana za gozbu",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Feast / Banquet"?',
            options: [
              { text: "Gozba", correct: true, imageSrc: "/gozba.svg", audioSrc: "/audio/hr/gozba.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Crown"?',
            options: [
              { text: "Kruna", correct: true, imageSrc: "/kruna.svg", audioSrc: "/audio/hr/kruna.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Lopta", correct: false, imageSrc: "/ball.svg", audioSrc: "/audio/hr/lopta.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Table"?',
            options: [
              { text: "Stol", correct: true, imageSrc: "/stol.svg", audioSrc: "/audio/hr/stol.mp3" },
              { text: "Dvorac", correct: false, imageSrc: "/dvorac.svg", audioSrc: "/audio/hr/dvorac.mp3" },
              { text: "Kula", correct: false, imageSrc: "/kula.svg", audioSrc: "/audio/hr/kula.mp3" },
              { text: "Most", correct: false, imageSrc: "/most.svg", audioSrc: "/audio/hr/most.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Song"?',
            options: [
              { text: "Pjesma", correct: true, imageSrc: "/pjesma.svg", audioSrc: "/audio/hr/pjesma.mp3" },
              { text: "Gozba", correct: false, imageSrc: "/gozba.svg", audioSrc: "/audio/hr/gozba.mp3" },
              { text: "Kruna", correct: false, imageSrc: "/kruna.svg", audioSrc: "/audio/hr/kruna.mp3" },
              { text: "Stol", correct: false, imageSrc: "/stol.svg", audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Kraljevski stol",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "Royal feast"',
            options: [
              { text: "Kraljevska gozba", correct: true, imageSrc: null, audioSrc: "/audio/hr/kraljevska_gozba.mp3" },
              { text: "Zlatna kruna", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatna_kruna.mp3" },
              { text: "Veliki dvorac", correct: false, imageSrc: null, audioSrc: "/audio/hr/veliki_dvorac.mp3" },
              { text: "Hrabri vitez", correct: false, imageSrc: null, audioSrc: "/audio/hr/hrabri_vitez.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "Golden crown"',
            options: [
              { text: "Zlatna kruna", correct: true, imageSrc: null, audioSrc: "/audio/hr/zlatna_kruna.mp3" },
              { text: "Kraljevska gozba", correct: false, imageSrc: null, audioSrc: "/audio/hr/kraljevska_gozba.mp3" },
              { text: "Zlatni ključ", correct: false, imageSrc: null, audioSrc: "/audio/hr/zlatni_kljuc.mp3" },
              { text: "Sjajni mač", correct: false, imageSrc: null, audioSrc: "/audio/hr/sjajni_mac.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "The king wears a shining crown."',
            options: [
              { text: "Kralj nosi sjajnu krunu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/kralj_nosi_sjajnu_krunu.mp3" },
              { text: "Velika gozba je na stolu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/velika_gozba_je_na_stolu.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "The great feast is on the table."',
            options: [
              { text: "Velika gozba je na stolu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/velika_gozba_je_na_stolu.mp3" },
              { text: "Kralj nosi sjajnu krunu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/kralj_nosi_sjajnu_krunu.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Prošlost i sjećanja",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "We were in the castle."',
            options: [
              { text: "Bili smo u dvorcu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
              { text: "Vidjeli smo hrabrog viteza.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidjeli_smo_hrabrog_viteza.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "We saw a brave knight."',
            options: [
              { text: "Vidjeli smo hrabrog viteza.", correct: true, imageSrc: null, audioSrc: "/audio/hr/vidjeli_smo_hrabrog_viteza.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "We went to the big hall."',
            options: [
              { text: "Išli smo u veliku dvoranu.", correct: true, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
              { text: "Vidjeli smo hrabrog viteza.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidjeli_smo_hrabrog_viteza.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "Together we sang songs."',
            options: [
              { text: "Zajedno smo pjevali pjesme.", correct: true, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
              { text: "Vidjeli smo hrabrog viteza.", correct: false, imageSrc: null, audioSrc: "/audio/hr/vidjeli_smo_hrabrog_viteza.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Sedmi svijet",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Translate to Croatian: "We visited the castles of Zagorje."',
            options: [
              { text: "Posjetili smo dvorce Zagorja.", correct: true, imageSrc: null, audioSrc: "/audio/hr/posjetili_smo_dvorce_zagorja.mp3" },
              { text: "Naučili smo važne hrvatske riječi.", correct: false, imageSrc: null, audioSrc: "/audio/hr/naucili_smo_vazne_hrvatske_rijeci.mp3" },
              { text: "Ponosno nastavljamo naše putovanje.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ponosno_nastavljamo_nase_putovanje.mp3" },
              { text: "Bili smo u dvorcu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/bili_smo_u_dvorcu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Translate to Croatian: "We learned important Croatian words."',
            options: [
              { text: "Naučili smo važne hrvatske riječi.", correct: true, imageSrc: null, audioSrc: "/audio/hr/naucili_smo_vazne_hrvatske_rijeci.mp3" },
              { text: "Posjetili smo dvorce Zagorja.", correct: false, imageSrc: null, audioSrc: "/audio/hr/posjetili_smo_dvorce_zagorja.mp3" },
              { text: "Ponosno nastavljamo naše putovanje.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ponosno_nastavljamo_nase_putovanje.mp3" },
              { text: "Zajedno smo pjevali pjesme.", correct: false, imageSrc: null, audioSrc: "/audio/hr/zajedno_smo_pjevali_pjesme.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Translate to Croatian: "We proudly continue our journey."',
            options: [
              { text: "Ponosno nastavljamo naše putovanje.", correct: true, imageSrc: null, audioSrc: "/audio/hr/ponosno_nastavljamo_nase_putovanje.mp3" },
              { text: "Posjetili smo dvorce Zagorja.", correct: false, imageSrc: null, audioSrc: "/audio/hr/posjetili_smo_dvorce_zagorja.mp3" },
              { text: "Naučili smo važne hrvatske riječi.", correct: false, imageSrc: null, audioSrc: "/audio/hr/naucili_smo_vazne_hrvatske_rijeci.mp3" },
              { text: "Išli smo u veliku dvoranu.", correct: false, imageSrc: null, audioSrc: "/audio/hr/isli_smo_u_veliku_dvoranu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Translate to Croatian: "Congratulations, you have finished the seventh world!"',
            options: [
              { text: "Čestitamo, završili ste sedmi svijet.", correct: true, imageSrc: null, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_sedmi_svijet.mp3" },
              { text: "Posjetili smo dvorce Zagorja.", correct: false, imageSrc: null, audioSrc: "/audio/hr/posjetili_smo_dvorce_zagorja.mp3" },
              { text: "Naučili smo važne hrvatske riječi.", correct: false, imageSrc: null, audioSrc: "/audio/hr/naucili_smo_vazne_hrvatske_rijeci.mp3" },
              { text: "Ponosno nastavljamo naše putovanje.", correct: false, imageSrc: null, audioSrc: "/audio/hr/ponosno_nastavljamo_nase_putovanje.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld7() {
  console.log("=== 🏰 SEEDING WORLD 7: UNITS 31–35 (ZAGORJE CASTLES) ===");

  const courses = await sql`SELECT id FROM courses WHERE id = 1 LIMIT 1;`;
  if (courses.length === 0) {
    throw new Error("Course ID 1 not found!");
  }
  const courseId = courses[0].id;

  for (const unit of unitsData) {
    console.log(`\nProcessing Unit ${unit.order}: "${unit.description}"...`);

    const existingUnit = await sql`
      SELECT id FROM units WHERE course_id = ${courseId} AND "order" = ${unit.order};
    `;

    let unitId: number;
    if (existingUnit.length > 0) {
      unitId = existingUnit[0].id;
      await sql`
        UPDATE units 
        SET title = ${unit.title}, description = ${unit.description}
        WHERE id = ${unitId};
      `;
      console.log(`  Updated existing Unit record ID: ${unitId}`);
    } else {
      const inserted = await sql`
        INSERT INTO units (title, description, course_id, "order")
        VALUES (${unit.title}, ${unit.description}, ${courseId}, ${unit.order})
        RETURNING id;
      `;
      unitId = inserted[0].id;
      console.log(`  Created Unit record ID: ${unitId}`);
    }

    for (const lesson of unit.lessons) {
      console.log(`  Processing Lesson ${lesson.order}: "${lesson.title}"...`);
      const existingLesson = await sql`
        SELECT id FROM lessons WHERE unit_id = ${unitId} AND "order" = ${lesson.order};
      `;
      let lessonId: number;
      if (existingLesson.length > 0) {
        lessonId = existingLesson[0].id;
        await sql`
          UPDATE lessons SET title = ${lesson.title} WHERE id = ${lessonId};
        `;
      } else {
        const inserted = await sql`
          INSERT INTO lessons (title, unit_id, "order")
          VALUES (${lesson.title}, ${unitId}, ${lesson.order})
          RETURNING id;
        `;
        lessonId = inserted[0].id;
      }

      for (const challenge of lesson.challenges) {
        const existingChallenge = await sql`
          SELECT id FROM challenges WHERE lesson_id = ${lessonId} AND "order" = ${challenge.order};
        `;
        let challengeId: number;
        if (existingChallenge.length > 0) {
          challengeId = existingChallenge[0].id;
          await sql`
            UPDATE challenges 
            SET type = ${challenge.type}, question = ${challenge.question}
            WHERE id = ${challengeId};
          `;
          await sql`DELETE FROM challenge_options WHERE challenge_id = ${challengeId};`;
        } else {
          const inserted = await sql`
            INSERT INTO challenges (lesson_id, type, question, "order")
            VALUES (${lessonId}, ${challenge.type}, ${challenge.question}, ${challenge.order})
            RETURNING id;
          `;
          challengeId = inserted[0].id;
        }

        // Insert options
        for (const opt of challenge.options) {
          await sql`
            INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
            VALUES (${challengeId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc});
          `;
        }
      }
    }
  }

  console.log("\n✅ WORLD 7 SEEDED SUCCESSFULLY!");
}

seedWorld7().then(() => process.exit(0)).catch(e => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
