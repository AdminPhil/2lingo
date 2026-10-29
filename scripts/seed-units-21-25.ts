import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

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
  // UNIT 21: DANI U TJEDNU I KALENDAR
  // ==========================================
  {
    order: 21,
    title: "Unit 21",
    description: "Dani u tjednu i kalendar (Days of the Week & Calendar)",
    lessons: [
      {
        order: 1,
        title: "Tjedan i dani",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Week"?',
            options: [
              { text: "Tjedan", correct: true, imageSrc: "/week.svg", audioSrc: "/audio/hr/tjedan.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Weekend"?',
            options: [
              { text: "Vikend", correct: true, imageSrc: "/weekend.svg", audioSrc: "/audio/hr/vikend.mp3" },
              { text: "Park", correct: false, imageSrc: "/park.svg", audioSrc: "/audio/hr/park.mp3" },
              { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
              { text: "Škola", correct: false, imageSrc: "/school.svg", audioSrc: "/audio/hr/skola.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Morning"?',
            options: [
              { text: "Jutro", correct: true, imageSrc: "/morning.svg", audioSrc: "/audio/hr/jutro.mp3" },
              { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
              { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Cvijet", correct: false, imageSrc: "/grass.svg", audioSrc: "/audio/hr/cvijet.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Evening"',
            options: [
              { text: "Večer", correct: true, imageSrc: "/evening.svg", audioSrc: "/audio/hr/vecer.mp3" },
              { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
              { text: "Rijeka", correct: false, imageSrc: "/rijeka.svg", audioSrc: "/audio/hr/rijeka.mp3" },
              { text: "Planina", correct: false, imageSrc: "/planina.svg", audioSrc: "/audio/hr/planina.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Danas i sutra",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "Today"?',
            options: [
              { text: "Danas", correct: true, audioSrc: "/audio/hr/danas.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "Tomorrow"?',
            options: [
              { text: "Sutra", correct: true, audioSrc: "/audio/hr/sutra.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Mačka", correct: false, audioSrc: "/audio/hr/macka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Monday"',
            options: [
              { text: "Ponedjeljak", correct: true, audioSrc: "/audio/hr/ponedjeljak.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Sunday"?',
            options: [
              { text: "Nedjelja", correct: true, audioSrc: "/audio/hr/nedjelja.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Dani u rečenici",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Today is Monday."',
            options: [
              { text: "Danas je ponedjeljak.", correct: true, audioSrc: "/audio/hr/danas_je_ponedjeljak.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Tomorrow is a new day."',
            options: [
              { text: "Sutra je novi dan.", correct: true, audioSrc: "/audio/hr/sutra_je_novi_dan.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"The weekend starts tomorrow."',
            options: [
              { text: "Vikend počinje sutra.", correct: true, audioSrc: "/audio/hr/vikend_pocinje_sutra.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"A beautiful and warm morning."',
            options: [
              { text: "Lijepo i toplo jutro.", correct: true, audioSrc: "/audio/hr/lijepo_i_toplo_jutro.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Gospodar Vremena",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Good morning to everyone."',
            options: [
              { text: "Dobro jutro svima.", correct: true, audioSrc: "/audio/hr/dobro_jutro_svima.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Good evening grandma."',
            options: [
              { text: "Dobra večer bako.", correct: true, audioSrc: "/audio/hr/dobra_vecer_bako.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"We look forward to the weekend."',
            options: [
              { text: "Radujemo se vikendu.", correct: true, audioSrc: "/audio/hr/radujemo_se_vikendu.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Today we learn Croatian."',
            options: [
              { text: "Danas učimo hrvatski.", correct: true, audioSrc: "/audio/hr/danas_ucimo_hrvatski.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"A week has seven days."',
            options: [
              { text: "Tjedan ima sedam dana.", correct: true, audioSrc: "/audio/hr/tjedan_ima_sedam_dana.mp3" },
              { text: "Deda čita knjigu.", correct: false, audioSrc: "/audio/hr/deda_cita_knjigu.mp3" },
              { text: "Djeca se igraju u parku.", correct: false, audioSrc: "/audio/hr/djeca_se_igraju_u_parku.mp3" },
              { text: "Mala mačka spava na travi.", correct: false, audioSrc: "/audio/hr/mala_macka_spava_na_travi.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 22: U SLASTIČARNICI
  // ==========================================
  {
    order: 22,
    title: "Unit 22",
    description: "U slastičarnici (At the Ice Cream & Pastry Shop)",
    lessons: [
      {
        order: 1,
        title: "Sladoled i okusi",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Ice cream"?',
            options: [
              { text: "Sladoled", correct: true, imageSrc: "/icecream.svg", audioSrc: "/audio/hr/sladoled.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Jabuka", correct: false, imageSrc: "/apple.svg", audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Mlijeko", correct: false, imageSrc: "/milk.svg", audioSrc: "/audio/hr/mlijeko.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Scoop"?',
            options: [
              { text: "Kuglica", correct: true, imageSrc: "/scoop.svg", audioSrc: "/audio/hr/kuglica.mp3" },
              { text: "Sir", correct: false, imageSrc: "/cheese.svg", audioSrc: "/audio/hr/sir.mp3" },
              { text: "Kroasan", correct: false, imageSrc: "/croissant.svg", audioSrc: "/audio/hr/kroasan.mp3" },
              { text: "Rajčica", correct: false, imageSrc: "/tomato.svg", audioSrc: "/audio/hr/rajcica.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Chocolate"?',
            options: [
              { text: "Čokolada", correct: true, imageSrc: "/chocolate.svg", audioSrc: "/audio/hr/cokolada.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Sok", correct: false, imageSrc: "/juice.svg", audioSrc: "/audio/hr/sok.mp3" },
              { text: "Juha", correct: false, imageSrc: "/juha.svg", audioSrc: "/audio/hr/juha.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Strawberry"',
            options: [
              { text: "Jagoda", correct: true, imageSrc: "/strawberry.svg", audioSrc: "/audio/hr/jagoda.mp3" },
              { text: "Banana", correct: false, imageSrc: "/banana.svg", audioSrc: "/audio/hr/banana.mp3" },
              { text: "Naranča", correct: false, imageSrc: "/orange.svg", audioSrc: "/audio/hr/naranca.mp3" },
              { text: "Burek", correct: false, imageSrc: "/burek.svg", audioSrc: "/audio/hr/burek.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Naručujemo slasticu",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "I want"?',
            options: [
              { text: "Želim", correct: true, audioSrc: "/audio/hr/zelim.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "To order"?',
            options: [
              { text: "Naručiti", correct: true, audioSrc: "/audio/hr/naruciti.mp3" },
              { text: "Spavati", correct: false, audioSrc: "/audio/hr/spavati.mp3" },
              { text: "Trčati", correct: false, audioSrc: "/audio/hr/trcati.mp3" },
              { text: "Plivati", correct: false, audioSrc: "/audio/hr/plivati.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"I buy"',
            options: [
              { text: "Kupujem", correct: true, audioSrc: "/audio/hr/kupujem.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Sweet"?',
            options: [
              { text: "Sladak", correct: true, audioSrc: "/audio/hr/sladak.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "U slastičarnici",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"I want chocolate ice cream."',
            options: [
              { text: "Želim sladoled od čokolade.", correct: true, audioSrc: "/audio/hr/zelim_sladoled_od_cokolade.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"One scoop of strawberry, please."',
            options: [
              { text: "Molim jednu kuglicu jagode.", correct: true, audioSrc: "/audio/hr/molim_jednu_kuglicu_jagode.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"This pastry is very sweet."',
            options: [
              { text: "Ovaj kolač je jako sladak.", correct: true, audioSrc: "/audio/hr/ovaj_kolac_je_jako_sladak.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"I buy cold ice cream at the beach."',
            options: [
              { text: "Kupujem hladni sladoled na plaži.", correct: true, audioSrc: "/audio/hr/kupujem_hladni_sladoled_na_plazi.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Majstor Sladoleda",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"Two scoops in a cone."',
            options: [
              { text: "Dvije kuglice u kornetu.", correct: true, audioSrc: "/audio/hr/dvije_kuglice_u_kornetu.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"I love chocolate and strawberry."',
            options: [
              { text: "Volim čokoladu i jagodu.", correct: true, audioSrc: "/audio/hr/volim_cokoladu_i_jagodu.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Thank you very much for the ice cream."',
            options: [
              { text: "Hvala lijepa na sladoledu.", correct: true, audioSrc: "/audio/hr/hvala_lijepa_na_sladoledu.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"How much does this ice cream cost?"',
            options: [
              { text: "Koliko košta ovaj sladoled?", correct: true, audioSrc: "/audio/hr/koliko_kosta_ovaj_sladoled.mp3" },
              { text: "Gdje je moj crveni auto?", correct: false, audioSrc: "/audio/hr/gdje_je_moj_crveni_auto.mp3" },
              { text: "Kada polazi brzi vlak?", correct: false, audioSrc: "/audio/hr/kada_polazi_brzi_vlak.mp3" },
              { text: "Tko pjeva na visokom stablu?", correct: false, audioSrc: "/audio/hr/tko_pjeva_na_visokom_stablu.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Pasko eats yummy ice cream."',
            options: [
              { text: "Paško jede fini sladoled.", correct: true, audioSrc: "/audio/hr/pasko_jede_fini_sladoled.mp3" },
              { text: "Tata vozi auto.", correct: false, audioSrc: "/audio/hr/tata_vozi_auto.mp3" },
              { text: "Vlak putuje na kolodvor.", correct: false, audioSrc: "/audio/hr/vlak_putuje_na_kolodvor.mp3" },
              { text: "Ptica pjeva na stablu.", correct: false, audioSrc: "/audio/hr/ptica_pjeva_na_stablu.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 23: RIMSKA ARENA I LEGENDE
  // ==========================================
  {
    order: 23,
    title: "Unit 23",
    description: "Rimska arena i legende (The Roman Arena & Ancient Legends)",
    lessons: [
      {
        order: 1,
        title: "Arena i vitez",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Arena"?',
            options: [
              { text: "Arena", correct: true, imageSrc: "/arena.svg", audioSrc: "/audio/hr/arena.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Škola", correct: false, imageSrc: "/school.svg", audioSrc: "/audio/hr/skola.mp3" },
              { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Stone"?',
            options: [
              { text: "Kamen", correct: true, imageSrc: "/kamen.svg", audioSrc: "/audio/hr/kamen.mp3" },
              { text: "Voda", correct: false, imageSrc: "/water.svg", audioSrc: "/audio/hr/voda.mp3" },
              { text: "Drvo", correct: false, imageSrc: "/tree.svg", audioSrc: "/audio/hr/drvo.mp3" },
              { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Knight"?',
            options: [
              { text: "Vitez", correct: true, imageSrc: "/knight.svg", audioSrc: "/audio/hr/vitez.mp3" },
              { text: "Dječak", correct: false, imageSrc: "/boy.svg", audioSrc: "/audio/hr/djecak.mp3" },
              { text: "Djevojčica", correct: false, imageSrc: "/girl.svg", audioSrc: "/audio/hr/djevojcica.mp3" },
              { text: "Baka", correct: false, imageSrc: "/grandma.svg", audioSrc: "/audio/hr/baka.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Shield"',
            options: [
              { text: "Štit", correct: true, imageSrc: "/shield.svg", audioSrc: "/audio/hr/stit.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
              { text: "Cipele", correct: false, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Istražujemo povijest",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "We explore"?',
            options: [
              { text: "Istražujemo", correct: true, audioSrc: "/audio/hr/istrazujemo.mp3" },
              { text: "Pijemo", correct: false, audioSrc: "/audio/hr/pijemo.mp3" },
              { text: "Spavamo", correct: false, audioSrc: "/audio/hr/spavamo.mp3" },
              { text: "Jedemo", correct: false, audioSrc: "/audio/hr/jedemo.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "Brave"?',
            options: [
              { text: "Hrabar", correct: true, audioSrc: "/audio/hr/hrabar.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"We watch"',
            options: [
              { text: "Gledamo", correct: true, audioSrc: "/audio/hr/gledamo.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "Ancient / Old"?',
            options: [
              { text: "Stari", correct: true, audioSrc: "/audio/hr/stari.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Legende i zidine",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"We explore the large Roman arena."',
            options: [
              { text: "Istražujemo veliku rimsku arenu.", correct: true, audioSrc: "/audio/hr/istrazujemo_veliku_rimsku_arenu.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"The brave knight carries a shiny shield."',
            options: [
              { text: "Hrabri vitez nosi sjajni štit.", correct: true, audioSrc: "/audio/hr/hrabri_vitez_nosi_sjajni_stit.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Old stone walls are tall."',
            options: [
              { text: "Stari kameni zidovi su visoki.", correct: true, audioSrc: "/audio/hr/stari_kameni_zidovi_su_visoki.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"We look at the ancient castle on the hill."',
            options: [
              { text: "Gledamo drevni dvorac na brdu.", correct: true, audioSrc: "/audio/hr/gledamo_drevni_dvorac_na_brdu.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Mladi Arheolog",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The Pula arena has many arches."',
            options: [
              { text: "Pulska arena ima mnogo lukova.", correct: true, audioSrc: "/audio/hr/pulska_arena_ima_mnogo_lukova.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"The proud knight guards the old tower."',
            options: [
              { text: "Ponosni vitez čuva staru kulu.", correct: true, audioSrc: "/audio/hr/ponosni_vitez_cuva_staru_kulu.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"Stone tells a story from the past."',
            options: [
              { text: "Kamen priča priču iz prošlosti.", correct: true, audioSrc: "/audio/hr/kamen_prica_pricu_iz_proslosti.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Brave heroes lived here."',
            options: [
              { text: "Ovdje su živjeli hrabri junaci.", correct: true, audioSrc: "/audio/hr/ovdje_su_zivjeli_hrabri_junaci.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Pasko proudly wears a golden crown."',
            options: [
              { text: "Paško ponosno nosi zlatnu krunu.", correct: true, audioSrc: "/audio/hr/pasko_ponosno_nosi_zlatnu_krunu.mp3" },
              { text: "Riba pliva u plavom moru.", correct: false, audioSrc: "/audio/hr/riba_pliva_u_plavom_moru.mp3" },
              { text: "Dječak piše olovkom.", correct: false, audioSrc: "/audio/hr/djecak_pise_olovkom.mp3" },
              { text: "Auto stoji ispred kuće.", correct: false, audioSrc: "/audio/hr/auto_stoji_ispred_kuce.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 24: MOJ DAN I SAT
  // ==========================================
  {
    order: 24,
    title: "Unit 24",
    description: "Moj dan i sat (My Daily Routine & Telling Time)",
    lessons: [
      {
        order: 1,
        title: "Dnevni raspored",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Clock"?',
            options: [
              { text: "Sat", correct: true, imageSrc: "/clock.svg", audioSrc: "/audio/hr/sat.mp3" },
              { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
              { text: "Vrata", correct: false, imageSrc: "/door.svg", audioSrc: "/audio/hr/vrata.mp3" },
              { text: "Prozor", correct: false, imageSrc: "/window.svg", audioSrc: "/audio/hr/prozor.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Breakfast"?',
            options: [
              { text: "Doručak", correct: true, imageSrc: "/dorucak.svg", audioSrc: "/audio/hr/dorucak.mp3" },
              { text: "Ručak", correct: false, imageSrc: "/rucak.svg", audioSrc: "/audio/hr/rucak.mp3" },
              { text: "Juha", correct: false, imageSrc: "/juha.svg", audioSrc: "/audio/hr/juha.mp3" },
              { text: "Kruh", correct: false, imageSrc: "/bread.svg", audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Toothbrush"?',
            options: [
              { text: "Četkica", correct: true, imageSrc: "/toothbrush.svg", audioSrc: "/audio/hr/cetkica.mp3" },
              { text: "Olovka", correct: false, imageSrc: "/pencil.svg", audioSrc: "/audio/hr/olovka.mp3" },
              { text: "Knjiga", correct: false, imageSrc: "/book.svg", audioSrc: "/audio/hr/knjiga.mp3" },
              { text: "Torba", correct: false, imageSrc: "/backpack.svg", audioSrc: "/audio/hr/torba.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Bed"',
            options: [
              { text: "Krevet", correct: true, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
              { text: "Soba", correct: false, imageSrc: "/room.svg", audioSrc: "/audio/hr/soba.mp3" },
              { text: "Kuća", correct: false, imageSrc: "/house.svg", audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Park", correct: false, imageSrc: "/park.svg", audioSrc: "/audio/hr/park.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Moje navike",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "I wake up"?',
            options: [
              { text: "Budim se", correct: true, audioSrc: "/audio/hr/budim_se.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "I wash"?',
            options: [
              { text: "Perem", correct: true, audioSrc: "/audio/hr/perem.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"In the morning"',
            options: [
              { text: "Ujutro", correct: true, audioSrc: "/audio/hr/ujutro.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "In the evening"?',
            options: [
              { text: "Navečer", correct: true, audioSrc: "/audio/hr/navecer.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Moj dan u rečenici",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"I wake up early at seven o\'clock."',
            options: [
              { text: "Budim se rano u sedam sati.", correct: true, audioSrc: "/audio/hr/budim_se_rano_u_sedam_sati.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"I brush my teeth with my toothbrush."',
            options: [
              { text: "Perem zube sa svojom četkicom.", correct: true, audioSrc: "/audio/hr/perem_zube_sa_svojom_cetkicom.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"In the morning I eat a warm breakfast."',
            options: [
              { text: "Ujutro jedem fini topli doručak.", correct: true, audioSrc: "/audio/hr/ujutro_jedem_fini_topli_dorucak.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"In the evening I go to my cozy bed."',
            options: [
              { text: "Navečer idem u topli krevet.", correct: true, audioSrc: "/audio/hr/navecer_idem_u_topli_krevet.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Gospodar Dana",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"What time is it right now?"',
            options: [
              { text: "Koliko je sada točno sati?", correct: true, audioSrc: "/audio/hr/koliko_je_sada_tocno_sati.mp3" },
              { text: "Zašto sunce sja na nebu?", correct: false, audioSrc: "/audio/hr/zasto_sunce_sja_na_nebu.mp3" },
              { text: "Gdje se skriva mali zeko?", correct: false, audioSrc: "/audio/hr/gdje_se_skriva_mali_zeko.mp3" },
              { text: "Kada plovi bijeli trajekt?", correct: false, audioSrc: "/audio/hr/kada_plovi_bijeli_trajekt.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Now it is exactly eight o\'clock."',
            options: [
              { text: "Sada je točno osam sati.", correct: true, audioSrc: "/audio/hr/sada_je_tocno_osam_sati.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"After school I do my homework."',
            options: [
              { text: "Nakon škole radim zadaću.", correct: true, audioSrc: "/audio/hr/nakon_skole_radim_zadacu.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Good night and sweet dreams."',
            options: [
              { text: "Laku noć i slatke snove.", correct: true, audioSrc: "/audio/hr/laku_noc_i_slatke_snove.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"I am ready for the new day."',
            options: [
              { text: "Spreman sam za novi dan.", correct: true, audioSrc: "/audio/hr/spreman_sam_za_novi_dan.mp3" },
              { text: "More šumi ispod sunčanog neba.", correct: false, audioSrc: "/audio/hr/more_sumi_ispod_suncanog_neba.mp3" },
              { text: "Mali zeko trči po travi.", correct: false, audioSrc: "/audio/hr/mali_zeko_trci_po_travi.mp3" },
              { text: "Trajekt plovi prema otoku.", correct: false, audioSrc: "/audio/hr/trajekt_plovi_prema_otoku.mp3" },
            ],
          },
        ],
      },
    ],
  },

  // ==========================================
  // UNIT 25: LJETNE MORSKE RADOSTI
  // ==========================================
  {
    order: 25,
    title: "Unit 25",
    description: "Ljetne morske radosti (Summer Sea Adventures & Diving)",
    lessons: [
      {
        order: 1,
        title: "Oprema za plažu",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one of these is "Mask"?',
            options: [
              { text: "Maska", correct: true, imageSrc: "/goggles.svg", audioSrc: "/audio/hr/maska.mp3" },
              { text: "Kapa", correct: false, imageSrc: "/hat.svg", audioSrc: "/audio/hr/kapa.mp3" },
              { text: "Majica", correct: false, imageSrc: "/tshirt.svg", audioSrc: "/audio/hr/majica.mp3" },
              { text: "Cipele", correct: false, imageSrc: "/shoes.svg", audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one of these is "Towel"?',
            options: [
              { text: "Ručnik", correct: true, imageSrc: "/towel.svg", audioSrc: "/audio/hr/rucnik.mp3" },
              { text: "Torba", correct: false, imageSrc: "/backpack.svg", audioSrc: "/audio/hr/torba.mp3" },
              { text: "Krevet", correct: false, imageSrc: "/bed.svg", audioSrc: "/audio/hr/krevet.mp3" },
              { text: "Stol", correct: false, imageSrc: "/table.svg", audioSrc: "/audio/hr/stol.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 3,
            question: 'Which one of these is "Wave"?',
            options: [
              { text: "Val", correct: true, imageSrc: "/wave.svg", audioSrc: "/audio/hr/val.mp3" },
              { text: "More", correct: false, imageSrc: "/sea.svg", audioSrc: "/audio/hr/more.mp3" },
              { text: "Sunce", correct: false, imageSrc: "/sun.svg", audioSrc: "/audio/hr/sunce.mp3" },
              { text: "Oblak", correct: false, imageSrc: "/cloud.svg", audioSrc: "/audio/hr/oblak.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Seashell"',
            options: [
              { text: "Školjka", correct: true, imageSrc: "/shell.svg", audioSrc: "/audio/hr/skoljka.mp3" },
              { text: "Riba", correct: false, imageSrc: "/fish.svg", audioSrc: "/audio/hr/riba.mp3" },
              { text: "Brod", correct: false, imageSrc: "/boat.svg", audioSrc: "/audio/hr/brod.mp3" },
              { text: "Kamen", correct: false, imageSrc: "/kamen.svg", audioSrc: "/audio/hr/kamen.mp3" },
            ],
          },
        ],
      },
      {
        order: 2,
        title: "Morske avanture",
        challenges: [
          {
            type: "SELECT",
            order: 1,
            question: 'Which one means "I dive"?',
            options: [
              { text: "Ronim", correct: true, audioSrc: "/audio/hr/ronim.mp3" },
              { text: "Jabuka", correct: false, audioSrc: "/audio/hr/jabuka.mp3" },
              { text: "Kuća", correct: false, audioSrc: "/audio/hr/kuca.mp3" },
              { text: "Voda", correct: false, audioSrc: "/audio/hr/voda.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 2,
            question: 'Which one means "I jump"?',
            options: [
              { text: "Skačem", correct: true, audioSrc: "/audio/hr/skacem.mp3" },
              { text: "Pas", correct: false, audioSrc: "/audio/hr/pas.mp3" },
              { text: "Kruh", correct: false, audioSrc: "/audio/hr/kruh.mp3" },
              { text: "More", correct: false, audioSrc: "/audio/hr/more.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"I swim"',
            options: [
              { text: "Plivam", correct: true, audioSrc: "/audio/hr/plivam.mp3" },
              { text: "Auto", correct: false, audioSrc: "/audio/hr/auto.mp3" },
              { text: "Lopta", correct: false, audioSrc: "/audio/hr/lopta.mp3" },
              { text: "Knjiga", correct: false, audioSrc: "/audio/hr/knjiga.mp3" },
            ],
          },
          {
            type: "SELECT",
            order: 4,
            question: 'Which one means "I enjoy"?',
            options: [
              { text: "Uživam", correct: true, audioSrc: "/audio/hr/uzivam.mp3" },
              { text: "Prozor", correct: false, audioSrc: "/audio/hr/prozor.mp3" },
              { text: "Stol", correct: false, audioSrc: "/audio/hr/stol.mp3" },
              { text: "Cipela", correct: false, audioSrc: "/audio/hr/cipele.mp3" },
            ],
          },
        ],
      },
      {
        order: 3,
        title: "Na plaži i u moru",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"I jump into the sea and catch the wave."',
            options: [
              { text: "Skačem u more i hvatam val.", correct: true, audioSrc: "/audio/hr/skacem_u_more_i_hvatam_val.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"I snorkel with a mask and watch the fish."',
            options: [
              { text: "Ronim s maskom i gledam ribe.", correct: true, audioSrc: "/audio/hr/ronim_s_maskom_i_gledam_ribe.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"I found a shiny white seashell."',
            options: [
              { text: "Našao sam sjajnu bijelu školjku.", correct: true, audioSrc: "/audio/hr/nasao_sam_sjajnu_bijelu_skoljku.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"My soft towel lies on the beach."',
            options: [
              { text: "Moj mekani ručnik leži na plaži.", correct: true, audioSrc: "/audio/hr/moj_mekani_rucnik_lezi_na_plazi.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Danas je lijep i sunčan dan.", correct: false, audioSrc: "/audio/hr/danas_je_lijep_i_suncan_dan.mp3" },
            ],
          },
        ],
      },
      {
        order: 4,
        title: "👑 Super Izazov: Morski Ronilac",
        challenges: [
          {
            type: "ASSIST",
            order: 1,
            question: '"The sea is warm and blue today."',
            options: [
              { text: "More je toplo i plavo danas.", correct: true, audioSrc: "/audio/hr/more_je_toplo_i_plavo_danas.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Sutra učimo nove riječi.", correct: false, audioSrc: "/audio/hr/sutra_ucimo_nove_rijeci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 2,
            question: '"Pasko jumps from the pier into the sea."',
            options: [
              { text: "Paško skače s mola u more.", correct: true, audioSrc: "/audio/hr/pasko_skace_s_mola_u_more.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Sutra učimo nove riječi.", correct: false, audioSrc: "/audio/hr/sutra_ucimo_nove_rijeci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 3,
            question: '"I love diving in the clean Adriatic."',
            options: [
              { text: "Volim roniti u čistom Jadranu.", correct: true, audioSrc: "/audio/hr/volim_roniti_u_cistom_jadranu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Sutra učimo nove riječi.", correct: false, audioSrc: "/audio/hr/sutra_ucimo_nove_rijeci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 4,
            question: '"Thank you for a wonderful summer."',
            options: [
              { text: "Hvala ti na predivnom ljetu.", correct: true, audioSrc: "/audio/hr/hvala_ti_na_predivnom_ljetu.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Sutra učimo nove riječi.", correct: false, audioSrc: "/audio/hr/sutra_ucimo_nove_rijeci.mp3" },
            ],
          },
          {
            type: "ASSIST",
            order: 5,
            question: '"Congratulations, you have finished the fifth world."',
            options: [
              { text: "Čestitamo završili ste peti svijet.", correct: true, audioSrc: "/audio/hr/cestitamo_zavrsili_ste_peti_svijet.mp3" },
              { text: "Kupujem kruh i sir.", correct: false, audioSrc: "/audio/hr/kupujem_kruh_i_sir.mp3" },
              { text: "Vitez nosi krunu u areni.", correct: false, audioSrc: "/audio/hr/vitez_nosi_krunu_u_areni.mp3" },
              { text: "Sutra učimo nove riječi.", correct: false, audioSrc: "/audio/hr/sutra_ucimo_nove_rijeci.mp3" },
            ],
          },
        ],
      },
    ],
  },
];

async function seedUnits21To25() {
  console.log("=== 🇭🇷 SEEDING UNITS 21 TO 25 (WORLD 5: ISTRA I KVARNER) ===");

  // 1. Verify all audio files on disk first
  let missingAudio = 0;
  for (const u of unitsData) {
    for (const l of u.lessons) {
      for (const ch of l.challenges) {
        for (const opt of ch.options) {
          const filePath = path.join(__dirname, "..", "public", opt.audioSrc.replace(/^\//, ""));
          if (!fs.existsSync(filePath)) {
            console.error(`[ERROR] Missing audio file on disk: ${opt.audioSrc} for option "${opt.text}"`);
            missingAudio++;
          }
        }
      }
    }
  }

  if (missingAudio > 0) {
    throw new Error(`Aborting: ${missingAudio} audio files missing.`);
  }
  console.log("All audio files verified on disk!");

  // 2. Clean up existing Units 21-25 if they already exist
  const existingUnits = await sql`SELECT id, "order" FROM units WHERE "order" BETWEEN 21 AND 25`;
  for (const eu of existingUnits) {
    console.log(`Cleaning existing Unit ${eu.order}...`);
    const lessons = await sql`SELECT id FROM lessons WHERE unit_id = ${eu.id}`;
    for (const ls of lessons) {
      const chs = await sql`SELECT id FROM challenges WHERE lesson_id = ${ls.id}`;
      for (const c of chs) {
        await sql`DELETE FROM challenge_options WHERE challenge_id = ${c.id}`;
        await sql`DELETE FROM challenge_progress WHERE challenge_id = ${c.id}`;
      }
      await sql`DELETE FROM challenges WHERE lesson_id = ${ls.id}`;
    }
    await sql`DELETE FROM lessons WHERE unit_id = ${eu.id}`;
    await sql`DELETE FROM units WHERE id = ${eu.id}`;
  }

  // Sync Postgres sequences so auto-increment IDs do not clash
  await sql`SELECT setval('units_id_seq', (SELECT COALESCE(MAX(id), 1) FROM units))`;
  await sql`SELECT setval('lessons_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lessons))`;
  await sql`SELECT setval('challenges_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenges))`;
  await sql`SELECT setval('challenge_options_id_seq', (SELECT COALESCE(MAX(id), 1) FROM challenge_options))`;

  // 3. Insert Units 21 to 25
  for (const u of unitsData) {
    console.log(`Inserting Unit ${u.order}: ${u.description}...`);
    const [insertedUnit] = await sql`
      INSERT INTO units (course_id, title, description, "order")
      VALUES (1, ${u.title}, ${u.description}, ${u.order})
      RETURNING id
    `;
    const unitId = insertedUnit.id;

    for (const l of u.lessons) {
      const [insertedLesson] = await sql`
        INSERT INTO lessons (unit_id, title, "order")
        VALUES (${unitId}, ${l.title}, ${l.order})
        RETURNING id
      `;
      const lessonId = insertedLesson.id;

      for (const ch of l.challenges) {
        const [insertedChallenge] = await sql`
          INSERT INTO challenges (lesson_id, type, question, "order")
          VALUES (${lessonId}, ${ch.type}, ${ch.question}, ${ch.order})
          RETURNING id
        `;
        const challengeId = insertedChallenge.id;

        for (const opt of ch.options) {
          await sql`
            INSERT INTO challenge_options (challenge_id, text, correct, image_src, audio_src)
            VALUES (${challengeId}, ${opt.text}, ${opt.correct}, ${opt.imageSrc || null}, ${opt.audioSrc})
          `;
        }
      }
    }
  }

  console.log("Units 21 to 25 successfully seeded!");
}

seedUnits21To25()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Units 21-25:", err);
    process.exit(1);
  });
