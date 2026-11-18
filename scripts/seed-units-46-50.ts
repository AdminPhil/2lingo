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
  // UNIT 46: LUKA RIJEKA I BRODOVI (Rijeka Port & Ships)
  // ==========================================
  {
    order: 46,
    title: "Unit 46",
    description: "Luka Rijeka i brodovi (Rijeka Port & Ships)",
    lessons: [
      {
        order: 1,
        title: "Pomorski pojmovi u luci",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Port"?',
            options: [
              { text: "Luka", correct: true, imageSrc: "/luka.svg", audioSrc: "/audio/hr/luka.mp3" },
              { text: "Katamaran", correct: false, imageSrc: "/katamaran.svg", audioSrc: "/audio/hr/katamaran.mp3" },
              { text: "Sidro", correct: false, imageSrc: "/sidro.svg", audioSrc: "/audio/hr/sidro.mp3" },
              { text: "Svjetionik", correct: false, imageSrc: "/svjetionik.svg", audioSrc: "/audio/hr/svjetionik.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Catamaran"?',
            options: [
              { text: "Katamaran", correct: true, imageSrc: "/katamaran.svg", audioSrc: "/audio/hr/katamaran.mp3" },
              { text: "Luka", correct: false, imageSrc: "/luka.svg", audioSrc: "/audio/hr/luka.mp3" },
              { text: "Sidro", correct: false, imageSrc: "/sidro.svg", audioSrc: "/audio/hr/sidro.mp3" },
              { text: "Svjetionik", correct: false, imageSrc: "/svjetionik.svg", audioSrc: "/audio/hr/svjetionik.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Anchor"?',
            options: [
              { text: "Sidro", correct: true, imageSrc: "/sidro.svg", audioSrc: "/audio/hr/sidro.mp3" },
              { text: "Luka", correct: false, imageSrc: "/luka.svg", audioSrc: "/audio/hr/luka.mp3" },
              { text: "Katamaran", correct: false, imageSrc: "/katamaran.svg", audioSrc: "/audio/hr/katamaran.mp3" },
              { text: "Svjetionik", correct: false, imageSrc: "/svjetionik.svg", audioSrc: "/audio/hr/svjetionik.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Lighthouse"?',
            options: [
              { text: "Svjetionik", correct: true, imageSrc: "/svjetionik.svg", audioSrc: "/audio/hr/svjetionik.mp3" },
              { text: "Sidro", correct: false, imageSrc: "/sidro.svg", audioSrc: "/audio/hr/sidro.mp3" },
              { text: "Katamaran", correct: false, imageSrc: "/katamaran.svg", audioSrc: "/audio/hr/katamaran.mp3" },
              { text: "Luka", correct: false, imageSrc: "/luka.svg", audioSrc: "/audio/hr/luka.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Dolazak broda u luku",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The big port"',
            options: [
              { text: "Velika luka", correct: true, audioSrc: "/audio/hr/velika_luka.mp3" },
              { text: "Bijeli brod", correct: false, audioSrc: "/audio/hr/bijeli_brod.mp3" },
              { text: "Teško sidro", correct: false, audioSrc: "/audio/hr/tesko_sidro.mp3" },
              { text: "Visoki svjetionik", correct: false, audioSrc: "/audio/hr/visoki_svjetionik.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The ship enters the port."',
            options: [
              { text: "Brod ulazi u luku.", correct: true, audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3" },
              { text: "Kapetan spušta sidro.", correct: false, audioSrc: "/audio/hr/kapetan_spusta_sidro.mp3" },
              { text: "Svjetionik svijetli noću.", correct: false, audioSrc: "/audio/hr/svjetionik_svijetli_nocu.mp3" },
              { text: "Valovi udaraju o obalu.", correct: false, audioSrc: "/audio/hr/valovi_udaraju_o_obalu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The captain drops the anchor."',
            options: [
              { text: "Kapetan spušta sidro.", correct: true, audioSrc: "/audio/hr/kapetan_spusta_sidro.mp3" },
              { text: "Brod ulazi u luku.", correct: false, audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3" },
              { text: "Svjetionik svijetli noću.", correct: false, audioSrc: "/audio/hr/svjetionik_svijetli_nocu.mp3" },
              { text: "Valovi udaraju o obalu.", correct: false, audioSrc: "/audio/hr/valovi_udaraju_o_obalu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The lighthouse shines at night."',
            options: [
              { text: "Svjetionik svijetli noću.", correct: true, audioSrc: "/audio/hr/svjetionik_svijetli_nocu.mp3" },
              { text: "Brod ulazi u luku.", correct: false, audioSrc: "/audio/hr/brod_ulazi_u_luku.mp3" },
              { text: "Kapetan spušta sidro.", correct: false, audioSrc: "/audio/hr/kapetan_spusta_sidro.mp3" },
              { text: "Valovi udaraju o obalu.", correct: false, audioSrc: "/audio/hr/valovi_udaraju_o_obalu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Plovidba Kvarnerom",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The white ship"',
            options: [
              { text: "Bijeli brod", correct: true, audioSrc: "/audio/hr/bijeli_brod.mp3" },
              { text: "Velika luka", correct: false, audioSrc: "/audio/hr/velika_luka.mp3" },
              { text: "Teško sidro", correct: false, audioSrc: "/audio/hr/tesko_sidro.mp3" },
              { text: "Visoki svjetionik", correct: false, audioSrc: "/audio/hr/visoki_svjetionik.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The sailors are waiting on the ship."',
            options: [
              { text: "Mornari čekaju na brodu.", correct: true, audioSrc: "/audio/hr/mornari_cekaju_na_brodu.mp3" },
              { text: "Teretni brod plovi Kvarnerom.", correct: false, audioSrc: "/audio/hr/teretni_brod_plovi_kvarnerom.mp3" },
              { text: "Rijeka ima veliku luku.", correct: false, audioSrc: "/audio/hr/rijeka_ima_veliku_luku.mp3" },
              { text: "Jako svjetlo vodi brodove.", correct: false, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "A cargo ship sails through Kvarner."',
            options: [
              { text: "Teretni brod plovi Kvarnerom.", correct: true, audioSrc: "/audio/hr/teretni_brod_plovi_kvarnerom.mp3" },
              { text: "Mornari čekaju na brodu.", correct: false, audioSrc: "/audio/hr/mornari_cekaju_na_brodu.mp3" },
              { text: "Rijeka ima veliku luku.", correct: false, audioSrc: "/audio/hr/rijeka_ima_veliku_luku.mp3" },
              { text: "Jako svjetlo vodi brodove.", correct: false, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Rijeka has a large port."',
            options: [
              { text: "Rijeka ima veliku luku.", correct: true, audioSrc: "/audio/hr/rijeka_ima_veliku_luku.mp3" },
              { text: "Mornari čekaju na brodu.", correct: false, audioSrc: "/audio/hr/mornari_cekaju_na_brodu.mp3" },
              { text: "Teretni brod plovi Kvarnerom.", correct: false, audioSrc: "/audio/hr/teretni_brod_plovi_kvarnerom.mp3" },
              { text: "Jako svjetlo vodi brodove.", correct: false, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Riječka luka",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The strong light guides the ships."',
            options: [
              { text: "Jako svjetlo vodi brodove.", correct: true, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
              { text: "Putnici izlaze na kopno.", correct: false, audioSrc: "/audio/hr/putnici_izlaze_na_kopno.mp3" },
              { text: "Sidro drži brod mirno.", correct: false, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
              { text: "Vjetar puše s Jadrana.", correct: false, audioSrc: "/audio/hr/vjetar_puse_s_jadrana.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The passengers step onto the mainland."',
            options: [
              { text: "Putnici izlaze na kopno.", correct: true, audioSrc: "/audio/hr/putnici_izlaze_na_kopno.mp3" },
              { text: "Jako svjetlo vodi brodove.", correct: false, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
              { text: "Sidro drži brod mirno.", correct: false, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
              { text: "Vjetar puše s Jadrana.", correct: false, audioSrc: "/audio/hr/vjetar_puse_s_jadrana.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The anchor holds the ship steady."',
            options: [
              { text: "Sidro drži brod mirno.", correct: true, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
              { text: "Putnici izlaze na kopno.", correct: false, audioSrc: "/audio/hr/putnici_izlaze_na_kopno.mp3" },
              { text: "Jako svjetlo vodi brodove.", correct: false, audioSrc: "/audio/hr/jako_svjetlo_vodi_brodove.mp3" },
              { text: "Vjetar puše s Jadrana.", correct: false, audioSrc: "/audio/hr/vjetar_puse_s_jadrana.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We are sailing toward the island in the morning."',
            options: [
              { text: "Plovimo prema otoku ujutro.", correct: true, audioSrc: "/audio/hr/plovimo_prema_otoku_ujutro.mp3" },
              { text: "Putnici izlaze na kopno.", correct: false, audioSrc: "/audio/hr/putnici_izlaze_na_kopno.mp3" },
              { text: "Sidro drži brod mirno.", correct: false, audioSrc: "/audio/hr/sidro_drzi_brod_mirno.mp3" },
              { text: "Vjetar puše s Jadrana.", correct: false, audioSrc: "/audio/hr/vjetar_puse_s_jadrana.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 47: TRSATSKA GRADINA I STUBE (Trsat Castle & Historic Staircase)
  // ==========================================
  {
    order: 47,
    title: "Unit 47",
    description: "Trsatska gradina i stube (Trsat Castle & Historic Staircase)",
    lessons: [
      {
        order: 1,
        title: "Simboli Trsata",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Fortress"?',
            options: [
              { text: "Gradina", correct: true, imageSrc: "/gradina.svg", audioSrc: "/audio/hr/gradina.mp3" },
              { text: "Stube", correct: false, imageSrc: "/stube.svg", audioSrc: "/audio/hr/stube.mp3" },
              { text: "Vidikovac", correct: false, imageSrc: "/vidikovac.svg", audioSrc: "/audio/hr/vidikovac.mp3" },
              { text: "Zmaj", correct: false, imageSrc: "/zmaj.svg", audioSrc: "/audio/hr/zmaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Stairs"?',
            options: [
              { text: "Stube", correct: true, imageSrc: "/stube.svg", audioSrc: "/audio/hr/stube.mp3" },
              { text: "Gradina", correct: false, imageSrc: "/gradina.svg", audioSrc: "/audio/hr/gradina.mp3" },
              { text: "Vidikovac", correct: false, imageSrc: "/vidikovac.svg", audioSrc: "/audio/hr/vidikovac.mp3" },
              { text: "Zmaj", correct: false, imageSrc: "/zmaj.svg", audioSrc: "/audio/hr/zmaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Viewpoint"?',
            options: [
              { text: "Vidikovac", correct: true, imageSrc: "/vidikovac.svg", audioSrc: "/audio/hr/vidikovac.mp3" },
              { text: "Gradina", correct: false, imageSrc: "/gradina.svg", audioSrc: "/audio/hr/gradina.mp3" },
              { text: "Stube", correct: false, imageSrc: "/stube.svg", audioSrc: "/audio/hr/stube.mp3" },
              { text: "Zmaj", correct: false, imageSrc: "/zmaj.svg", audioSrc: "/audio/hr/zmaj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Dragon"?',
            options: [
              { text: "Zmaj", correct: true, imageSrc: "/zmaj.svg", audioSrc: "/audio/hr/zmaj.mp3" },
              { text: "Vidikovac", correct: false, imageSrc: "/vidikovac.svg", audioSrc: "/audio/hr/vidikovac.mp3" },
              { text: "Stube", correct: false, imageSrc: "/stube.svg", audioSrc: "/audio/hr/stube.mp3" },
              { text: "Gradina", correct: false, imageSrc: "/gradina.svg", audioSrc: "/audio/hr/gradina.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Uspon na Trsat",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The old fortress"',
            options: [
              { text: "Stara gradina", correct: true, audioSrc: "/audio/hr/stara_gradina.mp3" },
              { text: "Kamene stube", correct: false, audioSrc: "/audio/hr/kamene_stube.mp3" },
              { text: "Lijepi vidikovac", correct: false, audioSrc: "/audio/hr/lijepi_vidikovac.mp3" },
              { text: "Brončani zmaj", correct: false, audioSrc: "/audio/hr/broncani_zmaj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "We are climbing up the stairs."',
            options: [
              { text: "Penjemo se uz stube.", correct: true, audioSrc: "/audio/hr/penjemo_se_uz_stube.mp3" },
              { text: "Trsatska gradina gleda na more.", correct: false, audioSrc: "/audio/hr/trsatska_gradina_gleda_na_more.mp3" },
              { text: "Vidimo cijeli Kvarnerski zaljev.", correct: false, audioSrc: "/audio/hr/vidimo_cijeli_kvarnerski_zaljev.mp3" },
              { text: "Zmaj čuva staru tvrđavu.", correct: false, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Trsat Castle overlooks the sea."',
            options: [
              { text: "Trsatska gradina gleda na more.", correct: true, audioSrc: "/audio/hr/trsatska_gradina_gleda_na_more.mp3" },
              { text: "Penjemo se uz stube.", correct: false, audioSrc: "/audio/hr/penjemo_se_uz_stube.mp3" },
              { text: "Vidimo cijeli Kvarnerski zaljev.", correct: false, audioSrc: "/audio/hr/vidimo_cijeli_kvarnerski_zaljev.mp3" },
              { text: "Zmaj čuva staru tvrđavu.", correct: false, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We see the whole Kvarner Bay."',
            options: [
              { text: "Vidimo cijeli Kvarnerski zaljev.", correct: true, audioSrc: "/audio/hr/vidimo_cijeli_kvarnerski_zaljev.mp3" },
              { text: "Penjemo se uz stube.", correct: false, audioSrc: "/audio/hr/penjemo_se_uz_stube.mp3" },
              { text: "Trsatska gradina gleda na more.", correct: false, audioSrc: "/audio/hr/trsatska_gradina_gleda_na_more.mp3" },
              { text: "Zmaj čuva staru tvrđavu.", correct: false, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Kamene zidine i zmaj",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The dragon guards the old fortress."',
            options: [
              { text: "Zmaj čuva staru tvrđavu.", correct: true, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
              { text: "Put do vrha je dug.", correct: false, audioSrc: "/audio/hr/put_do_vrha_je_dug.mp3" },
              { text: "Zidine su vrlo visoke.", correct: false, audioSrc: "/audio/hr/zidine_su_vrlo_visoke.mp3" },
              { text: "Stube vode prema gradini.", correct: false, audioSrc: "/audio/hr/stube_vode_prema_gradini.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The way to the top is long."',
            options: [
              { text: "Put do vrha je dug.", correct: true, audioSrc: "/audio/hr/put_do_vrha_je_dug.mp3" },
              { text: "Zmaj čuva staru tvrđavu.", correct: false, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
              { text: "Zidine su vrlo visoke.", correct: false, audioSrc: "/audio/hr/zidine_su_vrlo_visoke.mp3" },
              { text: "Stube vode prema gradini.", correct: false, audioSrc: "/audio/hr/stube_vode_prema_gradini.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The fortress walls are very high."',
            options: [
              { text: "Zidine su vrlo visoke.", correct: true, audioSrc: "/audio/hr/zidine_su_vrlo_visoke.mp3" },
              { text: "Put do vrha je dug.", correct: false, audioSrc: "/audio/hr/put_do_vrha_je_dug.mp3" },
              { text: "Zmaj čuva staru tvrđavu.", correct: false, audioSrc: "/audio/hr/zmaj_cuva_staru_tvrdavu.mp3" },
              { text: "Stube vode prema gradini.", correct: false, audioSrc: "/audio/hr/stube_vode_prema_gradini.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We are standing on the stone viewpoint."',
            options: [
              { text: "Stojimo na kamenom vidikovcu.", correct: true, audioSrc: "/audio/hr/stojimo_na_kamenom_vidikovcu.mp3" },
              { text: "Put do vrha je dug.", correct: false, audioSrc: "/audio/hr/put_do_vrha_je_dug.mp3" },
              { text: "Zidine su vrlo visoke.", correct: false, audioSrc: "/audio/hr/zidine_su_vrlo_visoke.mp3" },
              { text: "Stube vode prema gradini.", correct: false, audioSrc: "/audio/hr/stube_vode_prema_gradini.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Pogled s Trsata",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "From the towers you can see the city."',
            options: [
              { text: "S kula se vidi grad.", correct: true, audioSrc: "/audio/hr/s_kula_se_vidi_grad.mp3" },
              { text: "Legenda govori o zmaju.", correct: false, audioSrc: "/audio/hr/legenda_govori_o_zmaju.mp3" },
              { text: "Odmaramo se na vrhu brda.", correct: false, audioSrc: "/audio/hr/odmaramo_se_na_vrhu_brda.mp3" },
              { text: "Gledamo zalazak sunca nad Rijekom.", correct: false, audioSrc: "/audio/hr/gledamo_zalazak_sunca_nad_rijekom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The legend speaks of a dragon."',
            options: [
              { text: "Legenda govori o zmaju.", correct: true, audioSrc: "/audio/hr/legenda_govori_o_zmaju.mp3" },
              { text: "S kula se vidi grad.", correct: false, audioSrc: "/audio/hr/s_kula_se_vidi_grad.mp3" },
              { text: "Odmaramo se na vrhu brda.", correct: false, audioSrc: "/audio/hr/odmaramo_se_na_vrhu_brda.mp3" },
              { text: "Gledamo zalazak sunca nad Rijekom.", correct: false, audioSrc: "/audio/hr/gledamo_zalazak_sunca_nad_rijekom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We are resting at the top of the hill."',
            options: [
              { text: "Odmaramo se na vrhu brda.", correct: true, audioSrc: "/audio/hr/odmaramo_se_na_vrhu_brda.mp3" },
              { text: "S kula se vidi grad.", correct: false, audioSrc: "/audio/hr/s_kula_se_vidi_grad.mp3" },
              { text: "Legenda govori o zmaju.", correct: false, audioSrc: "/audio/hr/legenda_govori_o_zmaju.mp3" },
              { text: "Gledamo zalazak sunca nad Rijekom.", correct: false, audioSrc: "/audio/hr/gledamo_zalazak_sunca_nad_rijekom.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We are watching the sunset over Rijeka."',
            options: [
              { text: "Gledamo zalazak sunca nad Rijekom.", correct: true, audioSrc: "/audio/hr/gledamo_zalazak_sunca_nad_rijekom.mp3" },
              { text: "S kula se vidi grad.", correct: false, audioSrc: "/audio/hr/s_kula_se_vidi_grad.mp3" },
              { text: "Legenda govori o zmaju.", correct: false, audioSrc: "/audio/hr/legenda_govori_o_zmaju.mp3" },
              { text: "Odmaramo se na vrhu brda.", correct: false, audioSrc: "/audio/hr/odmaramo_se_na_vrhu_brda.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 48: OPATIJSKA RIVIJERA I KAMELIJE (Opatija Riviera & Camellias)
  // ==========================================
  {
    order: 48,
    title: "Unit 48",
    description: "Opatijska rivijera i kamelije (Opatija Riviera & Camellias)",
    lessons: [
      {
        order: 1,
        title: "Šetnja Opatijom",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Promenade"?',
            options: [
              { text: "Šetnica", correct: true, imageSrc: "/setnica.svg", audioSrc: "/audio/hr/setnica.mp3" },
              { text: "Kamelija", correct: false, imageSrc: "/kamelija.svg", audioSrc: "/audio/hr/kamelija.mp3" },
              { text: "Vila", correct: false, imageSrc: "/vila.svg", audioSrc: "/audio/hr/vila.mp3" },
              { text: "Fontana", correct: false, imageSrc: "/fontana.svg", audioSrc: "/audio/hr/fontana.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Camellia"?',
            options: [
              { text: "Kamelija", correct: true, imageSrc: "/kamelija.svg", audioSrc: "/audio/hr/kamelija.mp3" },
              { text: "Šetnica", correct: false, imageSrc: "/setnica.svg", audioSrc: "/audio/hr/setnica.mp3" },
              { text: "Vila", correct: false, imageSrc: "/vila.svg", audioSrc: "/audio/hr/vila.mp3" },
              { text: "Fontana", correct: false, imageSrc: "/fontana.svg", audioSrc: "/audio/hr/fontana.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Villa"?',
            options: [
              { text: "Vila", correct: true, imageSrc: "/vila.svg", audioSrc: "/audio/hr/vila.mp3" },
              { text: "Šetnica", correct: false, imageSrc: "/setnica.svg", audioSrc: "/audio/hr/setnica.mp3" },
              { text: "Kamelija", correct: false, imageSrc: "/kamelija.svg", audioSrc: "/audio/hr/kamelija.mp3" },
              { text: "Fontana", correct: false, imageSrc: "/fontana.svg", audioSrc: "/audio/hr/fontana.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Fountain"?',
            options: [
              { text: "Fontana", correct: true, imageSrc: "/fontana.svg", audioSrc: "/audio/hr/fontana.mp3" },
              { text: "Vila", correct: false, imageSrc: "/vila.svg", audioSrc: "/audio/hr/vila.mp3" },
              { text: "Kamelija", correct: false, imageSrc: "/kamelija.svg", audioSrc: "/audio/hr/kamelija.mp3" },
              { text: "Šetnica", correct: false, imageSrc: "/setnica.svg", audioSrc: "/audio/hr/setnica.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Lungomare i parkovi",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The long promenade"',
            options: [
              { text: "Duga šetnica", correct: true, audioSrc: "/audio/hr/duga_setnica.mp3" },
              { text: "Ružičasta kamelija", correct: false, audioSrc: "/audio/hr/ruzicasta_kamelija.mp3" },
              { text: "Stara vila", correct: false, audioSrc: "/audio/hr/stara_vila.mp3" },
              { text: "Kamena fontana", correct: false, audioSrc: "/audio/hr/kamena_fontana.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "We walk by the sea in the evening."',
            options: [
              { text: "Šetamo uz more navečer.", correct: true, audioSrc: "/audio/hr/setamo_uz_more_navecer.mp3" },
              { text: "Kamelija cvjeta u parku.", correct: false, audioSrc: "/audio/hr/kamelija_cvjeta_u_parku.mp3" },
              { text: "Opatija je poznata po vilama.", correct: false, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
              { text: "Voda teče iz fontane.", correct: false, audioSrc: "/audio/hr/voda_tece_iz_fontane.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The camellia blooms in the park."',
            options: [
              { text: "Kamelija cvjeta u parku.", correct: true, audioSrc: "/audio/hr/kamelija_cvjeta_u_parku.mp3" },
              { text: "Šetamo uz more navečer.", correct: false, audioSrc: "/audio/hr/setamo_uz_more_navecer.mp3" },
              { text: "Opatija je poznata po vilama.", correct: false, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
              { text: "Voda teče iz fontane.", correct: false, audioSrc: "/audio/hr/voda_tece_iz_fontane.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Water flows from the fountain."',
            options: [
              { text: "Voda teče iz fontane.", correct: true, audioSrc: "/audio/hr/voda_tece_iz_fontane.mp3" },
              { text: "Šetamo uz more navečer.", correct: false, audioSrc: "/audio/hr/setamo_uz_more_navecer.mp3" },
              { text: "Kamelija cvjeta u parku.", correct: false, audioSrc: "/audio/hr/kamelija_cvjeta_u_parku.mp3" },
              { text: "Opatija je poznata po vilama.", correct: false, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Stare vile i palme",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Opatija is famous for its villas."',
            options: [
              { text: "Opatija je poznata po vilama.", correct: true, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
              { text: "Palme rastu uz obalu.", correct: false, audioSrc: "/audio/hr/palme_rastu_uz_obalu.mp3" },
              { text: "Miris mora osvježava zrak.", correct: false, audioSrc: "/audio/hr/miris_mora_osvjezava_zrak.mp3" },
              { text: "Park je pun cvijeća.", correct: false, audioSrc: "/audio/hr/park_je_pun_cvijeca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Palm trees grow along the coast."',
            options: [
              { text: "Palme rastu uz obalu.", correct: true, audioSrc: "/audio/hr/palme_rastu_uz_obalu.mp3" },
              { text: "Opatija je poznata po vilama.", correct: false, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
              { text: "Miris mora osvježava zrak.", correct: false, audioSrc: "/audio/hr/miris_mora_osvjezava_zrak.mp3" },
              { text: "Park je pun cvijeća.", correct: false, audioSrc: "/audio/hr/park_je_pun_cvijeca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The scent of the sea refreshes the air."',
            options: [
              { text: "Miris mora osvježava zrak.", correct: true, audioSrc: "/audio/hr/miris_mora_osvjezava_zrak.mp3" },
              { text: "Palme rastu uz obalu.", correct: false, audioSrc: "/audio/hr/palme_rastu_uz_obalu.mp3" },
              { text: "Park je pun cvijeća.", correct: false, audioSrc: "/audio/hr/park_je_pun_cvijeca.mp3" },
              { text: "Opatija je poznata po vilama.", correct: false, audioSrc: "/audio/hr/opatija_je_poznata_po_vilama.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We listen to the waves on the promenade."',
            options: [
              { text: "Slušamo valove na šetnici.", correct: true, audioSrc: "/audio/hr/slusamo_valove_na_setnici.mp3" },
              { text: "Palme rastu uz obalu.", correct: false, audioSrc: "/audio/hr/palme_rastu_uz_obalu.mp3" },
              { text: "Miris mora osvježava zrak.", correct: false, audioSrc: "/audio/hr/miris_mora_osvjezava_zrak.mp3" },
              { text: "Park je pun cvijeća.", correct: false, audioSrc: "/audio/hr/park_je_pun_cvijeca.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Biser Jadrana",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "People drink coffee on the terrace."',
            options: [
              { text: "Ljudi piju kavu na terasi.", correct: true, audioSrc: "/audio/hr/ljudi_piju_kavu_na_terasi.mp3" },
              { text: "Sunce grije opatijsku rivijeru.", correct: false, audioSrc: "/audio/hr/sunce_grije_opatijsku_rivijeru.mp3" },
              { text: "Stare lampe svijetle uz put.", correct: false, audioSrc: "/audio/hr/stare_lampe_svijetle_uz_put.mp3" },
              { text: "Cvijet kamelije simbol je grada.", correct: false, audioSrc: "/audio/hr/cvijet_kamelije_simbol_je_grada.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The sun warms the Opatija Riviera."',
            options: [
              { text: "Sunce grije opatijsku rivijeru.", correct: true, audioSrc: "/audio/hr/sunce_grije_opatijsku_rivijeru.mp3" },
              { text: "Ljudi piju kavu na terasi.", correct: false, audioSrc: "/audio/hr/ljudi_piju_kavu_na_terasi.mp3" },
              { text: "Stare lampe svijetle uz put.", correct: false, audioSrc: "/audio/hr/stare_lampe_svijetle_uz_put.mp3" },
              { text: "Cvijet kamelije simbol je grada.", correct: false, audioSrc: "/audio/hr/cvijet_kamelije_simbol_je_grada.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Old lamps shine along the path."',
            options: [
              { text: "Stare lampe svijetle uz put.", correct: true, audioSrc: "/audio/hr/stare_lampe_svijetle_uz_put.mp3" },
              { text: "Ljudi piju kavu na terasi.", correct: false, audioSrc: "/audio/hr/ljudi_piju_kavu_na_terasi.mp3" },
              { text: "Sunce grije opatijsku rivijeru.", correct: false, audioSrc: "/audio/hr/sunce_grije_opatijsku_rivijeru.mp3" },
              { text: "Cvijet kamelije simbol je grada.", correct: false, audioSrc: "/audio/hr/cvijet_kamelije_simbol_je_grada.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The camellia flower is the symbol of the city."',
            options: [
              { text: "Cvijet kamelije simbol je grada.", correct: true, audioSrc: "/audio/hr/cvijet_kamelije_simbol_je_grada.mp3" },
              { text: "Ljudi piju kavu na terasi.", correct: false, audioSrc: "/audio/hr/ljudi_piju_kavu_na_terasi.mp3" },
              { text: "Sunce grije opatijsku rivijeru.", correct: false, audioSrc: "/audio/hr/sunce_grije_opatijsku_rivijeru.mp3" },
              { text: "Stare lampe svijetle uz put.", correct: false, audioSrc: "/audio/hr/stare_lampe_svijetle_uz_put.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 49: OTOK KRK I GLAGOLJICA (Krk Island & Glagolitic Script)
  // ==========================================
  {
    order: 49,
    title: "Unit 49",
    description: "Otok Krk i glagoljica (Krk Island & Glagolitic Script)",
    lessons: [
      {
        order: 1,
        title: "Baština otoka Krka",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Stone tablet"?',
            options: [
              { text: "Ploča", correct: true, imageSrc: "/ploca.svg", audioSrc: "/audio/hr/ploca.mp3" },
              { text: "Slovo", correct: false, imageSrc: "/slovo.svg", audioSrc: "/audio/hr/slovo.mp3" },
              { text: "Maslina", correct: false, imageSrc: "/maslina.svg", audioSrc: "/audio/hr/maslina.mp3" },
              { text: "Ovca", correct: false, imageSrc: "/ovca.svg", audioSrc: "/audio/hr/ovca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Letter"?',
            options: [
              { text: "Slovo", correct: true, imageSrc: "/slovo.svg", audioSrc: "/audio/hr/slovo.mp3" },
              { text: "Ploča", correct: false, imageSrc: "/ploca.svg", audioSrc: "/audio/hr/ploca.mp3" },
              { text: "Maslina", correct: false, imageSrc: "/maslina.svg", audioSrc: "/audio/hr/maslina.mp3" },
              { text: "Ovca", correct: false, imageSrc: "/ovca.svg", audioSrc: "/audio/hr/ovca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Olive"?',
            options: [
              { text: "Maslina", correct: true, imageSrc: "/maslina.svg", audioSrc: "/audio/hr/maslina.mp3" },
              { text: "Ploča", correct: false, imageSrc: "/ploca.svg", audioSrc: "/audio/hr/ploca.mp3" },
              { text: "Slovo", correct: false, imageSrc: "/slovo.svg", audioSrc: "/audio/hr/slovo.mp3" },
              { text: "Ovca", correct: false, imageSrc: "/ovca.svg", audioSrc: "/audio/hr/ovca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Sheep"?',
            options: [
              { text: "Ovca", correct: true, imageSrc: "/ovca.svg", audioSrc: "/audio/hr/ovca.mp3" },
              { text: "Maslina", correct: false, imageSrc: "/maslina.svg", audioSrc: "/audio/hr/maslina.mp3" },
              { text: "Slovo", correct: false, imageSrc: "/slovo.svg", audioSrc: "/audio/hr/slovo.mp3" },
              { text: "Ploča", correct: false, imageSrc: "/ploca.svg", audioSrc: "/audio/hr/ploca.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Bašćanska ploča i glagoljica",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The stone tablet"',
            options: [
              { text: "Kamena ploča", correct: true, audioSrc: "/audio/hr/kamena_ploca.mp3" },
              { text: "Staro slovo", correct: false, audioSrc: "/audio/hr/staro_slovo.mp3" },
              { text: "Zelena maslina", correct: false, audioSrc: "/audio/hr/zelena_maslina.mp3" },
              { text: "Bijela ovca", correct: false, audioSrc: "/audio/hr/bijela_ovca.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The Baška Tablet preserves history."',
            options: [
              { text: "Bašćanska ploča čuva povijest.", correct: true, audioSrc: "/audio/hr/bascanska_ploca_cuva_povijest.mp3" },
              { text: "Učimo stara glagoljska slova.", correct: false, audioSrc: "/audio/hr/ucimo_stara_glagoljska_slova.mp3" },
              { text: "Masline rastu na otoku Krku.", correct: false, audioSrc: "/audio/hr/masline_rastu_na_otoku_krku.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We are learning old Glagolitic letters."',
            options: [
              { text: "Učimo stara glagoljska slova.", correct: true, audioSrc: "/audio/hr/ucimo_stara_glagoljska_slova.mp3" },
              { text: "Bašćanska ploča čuva povijest.", correct: false, audioSrc: "/audio/hr/bascanska_ploca_cuva_povijest.mp3" },
              { text: "Masline rastu na otoku Krku.", correct: false, audioSrc: "/audio/hr/masline_rastu_na_otoku_krku.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Olives grow on the island of Krk."',
            options: [
              { text: "Masline rastu na otoku Krku.", correct: true, audioSrc: "/audio/hr/masline_rastu_na_otoku_krku.mp3" },
              { text: "Bašćanska ploča čuva povijest.", correct: false, audioSrc: "/audio/hr/bascanska_ploca_cuva_povijest.mp3" },
              { text: "Učimo stara glagoljska slova.", correct: false, audioSrc: "/audio/hr/ucimo_stara_glagoljska_slova.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Krčki most i maslinici",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Sheep graze on the rocky pasture."',
            options: [
              { text: "Ovce pasu na kamenjaru.", correct: true, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
              { text: "Prelazimo veliki Krčki most.", correct: false, audioSrc: "/audio/hr/prelazimo_veliki_krcki_most.mp3" },
              { text: "Klesari su pisali u kamenu.", correct: false, audioSrc: "/audio/hr/klesari_su_pisali_u_kamenu.mp3" },
              { text: "Beremo masline u jesen.", correct: false, audioSrc: "/audio/hr/beremo_masline_u_jesen.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "We are crossing the great Krk Bridge."',
            options: [
              { text: "Prelazimo veliki Krčki most.", correct: true, audioSrc: "/audio/hr/prelazimo_veliki_krcki_most.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
              { text: "Klesari su pisali u kamenu.", correct: false, audioSrc: "/audio/hr/klesari_su_pisali_u_kamenu.mp3" },
              { text: "Beremo masline u jesen.", correct: false, audioSrc: "/audio/hr/beremo_masline_u_jesen.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Stonemasons wrote in stone."',
            options: [
              { text: "Klesari su pisali u kamenu.", correct: true, audioSrc: "/audio/hr/klesari_su_pisali_u_kamenu.mp3" },
              { text: "Prelazimo veliki Krčki most.", correct: false, audioSrc: "/audio/hr/prelazimo_veliki_krcki_most.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
              { text: "Beremo masline u jesen.", correct: false, audioSrc: "/audio/hr/beremo_masline_u_jesen.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We harvest olives in autumn."',
            options: [
              { text: "Beremo masline u jesen.", correct: true, audioSrc: "/audio/hr/beremo_masline_u_jesen.mp3" },
              { text: "Prelazimo veliki Krčki most.", correct: false, audioSrc: "/audio/hr/prelazimo_veliki_krcki_most.mp3" },
              { text: "Klesari su pisali u kamenu.", correct: false, audioSrc: "/audio/hr/klesari_su_pisali_u_kamenu.mp3" },
              { text: "Ovce pasu na kamenjaru.", correct: false, audioSrc: "/audio/hr/ovce_pasu_na_kamenjaru.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Zlatni otok",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Olive oil is golden."',
            options: [
              { text: "Maslinovo ulje je zlatno.", correct: true, audioSrc: "/audio/hr/maslinovo_ulje_je_zlatno.mp3" },
              { text: "Otok Krk ima bogatu baštinu.", correct: false, audioSrc: "/audio/hr/otok_krk_ima_bogatu_bastinu.mp3" },
              { text: "Stari zapisi su vrlo vrijedni.", correct: false, audioSrc: "/audio/hr/stari_zapisi_su_vrlo_vrijedni.mp3" },
              { text: "Čuvamo našu pisanu riječ.", correct: false, audioSrc: "/audio/hr/cuvamo_nasu_pisanu_rijec.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The island of Krk has a rich heritage."',
            options: [
              { text: "Otok Krk ima bogatu baštinu.", correct: true, audioSrc: "/audio/hr/otok_krk_ima_bogatu_bastinu.mp3" },
              { text: "Maslinovo ulje je zlatno.", correct: false, audioSrc: "/audio/hr/maslinovo_ulje_je_zlatno.mp3" },
              { text: "Stari zapisi su vrlo vrijedni.", correct: false, audioSrc: "/audio/hr/stari_zapisi_su_vrlo_vrijedni.mp3" },
              { text: "Čuvamo našu pisanu riječ.", correct: false, audioSrc: "/audio/hr/cuvamo_nasu_pisanu_rijec.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The village of Baška lies by the beach."',
            options: [
              { text: "Selo Baška leži uz plažu.", correct: true, audioSrc: "/audio/hr/selo_baska_lezi_uz_plazu.mp3" },
              { text: "Otok Krk ima bogatu baštinu.", correct: false, audioSrc: "/audio/hr/otok_krk_ima_bogatu_bastinu.mp3" },
              { text: "Stari zapisi su vrlo vrijedni.", correct: false, audioSrc: "/audio/hr/stari_zapisi_su_vrlo_vrijedni.mp3" },
              { text: "Čuvamo našu pisanu riječ.", correct: false, audioSrc: "/audio/hr/cuvamo_nasu_pisanu_rijec.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "We preserve our written word."',
            options: [
              { text: "Čuvamo našu pisanu riječ.", correct: true, audioSrc: "/audio/hr/cuvamo_nasu_pisanu_rijec.mp3" },
              { text: "Maslinovo ulje je zlatno.", correct: false, audioSrc: "/audio/hr/maslinovo_ulje_je_zlatno.mp3" },
              { text: "Otok Krk ima bogatu baštinu.", correct: false, audioSrc: "/audio/hr/otok_krk_ima_bogatu_bastinu.mp3" },
              { text: "Stari zapisi su vrlo vrijedni.", correct: false, audioSrc: "/audio/hr/stari_zapisi_su_vrlo_vrijedni.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 50: RIJEČKI KARNEVAL I KORZO (Rijeka Carnival & Korzo Capstone)
  // ==========================================
  {
    order: 50,
    title: "Unit 50",
    description: "Riječki karneval i Korzo (Rijeka Carnival & Korzo Capstone)",
    lessons: [
      {
        order: 1,
        title: "Karnevalska oprema",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Costume"?',
            options: [
              { text: "Kostim", correct: true, imageSrc: "/kostim.svg", audioSrc: "/audio/hr/kostim.mp3" },
              { text: "Povorka", correct: false, imageSrc: "/povorka.svg", audioSrc: "/audio/hr/povorka.mp3" },
              { text: "Zvono", correct: false, imageSrc: "/zvono.svg", audioSrc: "/audio/hr/zvono.mp3" },
              { text: "Bubanj", correct: false, imageSrc: "/bubanj.svg", audioSrc: "/audio/hr/bubanj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Parade"?',
            options: [
              { text: "Povorka", correct: true, imageSrc: "/povorka.svg", audioSrc: "/audio/hr/povorka.mp3" },
              { text: "Kostim", correct: false, imageSrc: "/kostim.svg", audioSrc: "/audio/hr/kostim.mp3" },
              { text: "Zvono", correct: false, imageSrc: "/zvono.svg", audioSrc: "/audio/hr/zvono.mp3" },
              { text: "Bubanj", correct: false, imageSrc: "/bubanj.svg", audioSrc: "/audio/hr/bubanj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Bell"?',
            options: [
              { text: "Zvono", correct: true, imageSrc: "/zvono.svg", audioSrc: "/audio/hr/zvono.mp3" },
              { text: "Kostim", correct: false, imageSrc: "/kostim.svg", audioSrc: "/audio/hr/kostim.mp3" },
              { text: "Povorka", correct: false, imageSrc: "/povorka.svg", audioSrc: "/audio/hr/povorka.mp3" },
              { text: "Bubanj", correct: false, imageSrc: "/bubanj.svg", audioSrc: "/audio/hr/bubanj.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one of these is "Drum"?',
            options: [
              { text: "Bubanj", correct: true, imageSrc: "/bubanj.svg", audioSrc: "/audio/hr/bubanj.mp3" },
              { text: "Zvono", correct: false, imageSrc: "/zvono.svg", audioSrc: "/audio/hr/zvono.mp3" },
              { text: "Povorka", correct: false, imageSrc: "/povorka.svg", audioSrc: "/audio/hr/povorka.mp3" },
              { text: "Kostim", correct: false, imageSrc: "/kostim.svg", audioSrc: "/audio/hr/kostim.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Povorka na Korzu",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The colorful mask"',
            options: [
              { text: "Šarena maska", correct: true, audioSrc: "/audio/hr/sarena_maska.mp3" },
              { text: "Velika povorka", correct: false, audioSrc: "/audio/hr/velika_povorka.mp3" },
              { text: "Glasno zvono", correct: false, audioSrc: "/audio/hr/glasno_zvono.mp3" },
              { text: "Veliki bubanj", correct: false, audioSrc: "/audio/hr/veliki_bubanj.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The carnival parade passes through Korzo."',
            options: [
              { text: "Karnevalska povorka prolazi Korzom.", correct: true, audioSrc: "/audio/hr/karnevalska_povorka_prolazi_korzom.mp3" },
              { text: "Svi nose šarene maske.", correct: false, audioSrc: "/audio/hr/svi_nose_sarene_maske.mp3" },
              { text: "Zvončari glasno zvone zvonima.", correct: false, audioSrc: "/audio/hr/zvoncari_glasno_zvone_zvonima.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "Everyone wears colorful masks."',
            options: [
              { text: "Svi nose šarene maske.", correct: true, audioSrc: "/audio/hr/svi_nose_sarene_maske.mp3" },
              { text: "Karnevalska povorka prolazi Korzom.", correct: false, audioSrc: "/audio/hr/karnevalska_povorka_prolazi_korzom.mp3" },
              { text: "Zvončari glasno zvone zvonima.", correct: false, audioSrc: "/audio/hr/zvoncari_glasno_zvone_zvonima.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "The bellringers ring their bells loudly."',
            options: [
              { text: "Zvončari glasno zvone zvonima.", correct: true, audioSrc: "/audio/hr/zvoncari_glasno_zvone_zvonima.mp3" },
              { text: "Karnevalska povorka prolazi Korzom.", correct: false, audioSrc: "/audio/hr/karnevalska_povorka_prolazi_korzom.mp3" },
              { text: "Svi nose šarene maske.", correct: false, audioSrc: "/audio/hr/svi_nose_sarene_maske.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Glazba i radost",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "The drums give rhythm to the dance."',
            options: [
              { text: "Bubnjevi daju ritam plesu.", correct: true, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
              { text: "Grad slavi uz glazbu.", correct: false, audioSrc: "/audio/hr/grad_slavi_uz_glazbu.mp3" },
              { text: "Publika plješće veselim maskama.", correct: false, audioSrc: "/audio/hr/publika_pljesce_veselim_maskama.mp3" },
              { text: "Konfeti padaju po ulici.", correct: false, audioSrc: "/audio/hr/konfeti_padaju_po_ulici.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "The city celebrates with music."',
            options: [
              { text: "Grad slavi uz glazbu.", correct: true, audioSrc: "/audio/hr/grad_slavi_uz_glazbu.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
              { text: "Publika plješće veselim maskama.", correct: false, audioSrc: "/audio/hr/publika_pljesce_veselim_maskama.mp3" },
              { text: "Konfeti padaju po ulici.", correct: false, audioSrc: "/audio/hr/konfeti_padaju_po_ulici.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "The crowd applauds the cheerful masks."',
            options: [
              { text: "Publika plješće veselim maskama.", correct: true, audioSrc: "/audio/hr/publika_pljesce_veselim_maskama.mp3" },
              { text: "Grad slavi uz glazbu.", correct: false, audioSrc: "/audio/hr/grad_slavi_uz_glazbu.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
              { text: "Konfeti padaju po ulici.", correct: false, audioSrc: "/audio/hr/konfeti_padaju_po_ulici.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Confetti falls along the street."',
            options: [
              { text: "Konfeti padaju po ulici.", correct: true, audioSrc: "/audio/hr/konfeti_padaju_po_ulici.mp3" },
              { text: "Grad slavi uz glazbu.", correct: false, audioSrc: "/audio/hr/grad_slavi_uz_glazbu.mp3" },
              { text: "Publika plješće veselim maskama.", correct: false, audioSrc: "/audio/hr/publika_pljesce_veselim_maskama.mp3" },
              { text: "Bubnjevi daju ritam plesu.", correct: false, audioSrc: "/audio/hr/bubnjevi_daju_ritam_plesu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "Super Izazov: Završno slavlje Kvarnera",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: 'Select the correct translation: "Korzo is full of joy."',
            options: [
              { text: "Korzo je pun radosti.", correct: true, audioSrc: "/audio/hr/korzo_je_pun_radosti.mp3" },
              { text: "Tradicionalni zvončari tjeraju zimu.", correct: false, audioSrc: "/audio/hr/tradicionalni_zvoncari_tjeraju_zimu.mp3" },
              { text: "Plešemo i pjevamo na karnevalu.", correct: false, audioSrc: "/audio/hr/plesemo_i_pjevamo_na_karnevalu.mp3" },
              { text: "Rijeka slavi svoju tradiciju.", correct: false, audioSrc: "/audio/hr/rijeka_slavi_svoju_tradiciju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: 'Select the correct translation: "Traditional bellringers chase away winter."',
            options: [
              { text: "Tradicionalni zvončari tjeraju zimu.", correct: true, audioSrc: "/audio/hr/tradicionalni_zvoncari_tjeraju_zimu.mp3" },
              { text: "Korzo je pun radosti.", correct: false, audioSrc: "/audio/hr/korzo_je_pun_radosti.mp3" },
              { text: "Plešemo i pjevamo na karnevalu.", correct: false, audioSrc: "/audio/hr/plesemo_i_pjevamo_na_karnevalu.mp3" },
              { text: "Rijeka slavi svoju tradiciju.", correct: false, audioSrc: "/audio/hr/rijeka_slavi_svoju_tradiciju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: 'Select the correct translation: "We dance and sing at the carnival."',
            options: [
              { text: "Plešemo i pjevamo na karnevalu.", correct: true, audioSrc: "/audio/hr/plesemo_i_pjevamo_na_karnevalu.mp3" },
              { text: "Korzo je pun radosti.", correct: false, audioSrc: "/audio/hr/korzo_je_pun_radosti.mp3" },
              { text: "Tradicionalni zvončari tjeraju zimu.", correct: false, audioSrc: "/audio/hr/tradicionalni_zvoncari_tjeraju_zimu.mp3" },
              { text: "Rijeka slavi svoju tradiciju.", correct: false, audioSrc: "/audio/hr/rijeka_slavi_svoju_tradiciju.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: 'Select the correct translation: "Congratulations, you have completed the tenth world!"',
            options: [
              { text: "Čestitamo, završili ste deseti svijet!", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_deseti_svijet.mp3" },
              { text: "Korzo je pun radosti!", correct: false, audioSrc: "/audio/hr/korzo_je_pun_radosti.mp3" },
              { text: "Plešemo i pjevamo na karnevalu!", correct: false, audioSrc: "/audio/hr/plesemo_i_pjevamo_na_karnevalu.mp3" },
              { text: "Rijeka slavi svoju tradiciju!", correct: false, audioSrc: "/audio/hr/rijeka_slavi_svoju_tradiciju.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedWorld10() {
  console.log("🚀 Starting World 10 (Units 46–50: Kvarner & Rijeka) Seed...");

  const courseResult = await sql`SELECT id FROM courses WHERE title = 'Croatian' LIMIT 1;`;
  if (courseResult.length === 0) {
    throw new Error("Croatian course not found in database!");
  }
  const courseId = courseResult[0].id;
  console.log(`Target Course ID: ${courseId}`);

  for (const unit of unitsData) {
    console.log(`\nProcessing Unit ${unit.order}: "${unit.title} - ${unit.description}"...`);

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
      console.log(`  Updated Unit record ID: ${unitId}`);
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

  console.log("\n✅ WORLD 10 SEEDED SUCCESSFULLY!");
}

seedWorld10().then(() => process.exit(0)).catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
